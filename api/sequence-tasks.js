// Sequence görevleri
// GET /api/sequence-tasks                    → bekleyen görevler (varsayılan: vadesi bugün/geçmiş)
// GET /api/sequence-tasks?scope=all          → tüm bekleyen görevler (gelecek dahil)
// GET /api/sequence-tasks?customer_id=uuid   → bir müşterinin görevleri
// PUT /api/sequence-tasks?id=uuid            → { status:'done'|'skipped', note } işaretle
const { getDb, cors, verifyToken } = require('./_db');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const sql = getDb();

  try {
    // ── GET ───────────────────────────────────────────────
    if (req.method === 'GET') {
      const { customer_id, scope } = req.query || {};

      // Dashboard istatistikleri — tek sorguda özet sayılar
      if (scope === 'stats') {
        const r = await sql`
          SELECT
            COUNT(*) FILTER (WHERE t.status='pending' AND t.due_date = CURRENT_DATE)              AS today,
            COUNT(*) FILTER (WHERE t.status='pending' AND t.due_date < CURRENT_DATE)              AS overdue,
            COUNT(*) FILTER (WHERE t.status='pending' AND t.due_date > CURRENT_DATE)              AS upcoming,
            COUNT(*) FILTER (WHERE t.status='done'    AND t.completed_at::date = CURRENT_DATE)    AS done_today
          FROM sequence_tasks t
        `;
        const e = await sql`
          SELECT
            COUNT(*) FILTER (WHERE status='active')    AS active_enrollments,
            COUNT(*) FILTER (WHERE status='completed') AS completed_enrollments
          FROM sequence_enrollments
        `;
        // Kanal bazlı bugünkü dağılım
        const byType = await sql`
          SELECT step_type, COUNT(*)::int AS n
          FROM sequence_tasks
          WHERE status='pending' AND due_date <= CURRENT_DATE
          GROUP BY step_type
        `;
        const channels = {};
        byType.forEach(row => { channels[row.step_type] = row.n; });
        return res.json({
          today: +r[0].today, overdue: +r[0].overdue, upcoming: +r[0].upcoming,
          done_today: +r[0].done_today,
          active_enrollments: +e[0].active_enrollments,
          completed_enrollments: +e[0].completed_enrollments,
          channels,
        });
      }

      if (customer_id) {
        const rows = await sql`
          SELECT t.*, c.company_name, c.contact_name, c.email, c.phone,
                 s.name AS sequence_name
          FROM sequence_tasks t
          JOIN customers c ON c.id = t.customer_id
          JOIN sequence_enrollments e ON e.id = t.enrollment_id
          JOIN sequences s ON s.id = e.sequence_id
          WHERE t.customer_id = ${customer_id}
          ORDER BY t.due_date ASC, t.created_at ASC
        `;
        return res.json(rows);
      }

      // Bekleyen görevler — varsayılan: vadesi bugün ve öncesi (yapılacaklar)
      if (scope === 'all') {
        const rows = await sql`
          SELECT t.*, c.company_name, c.contact_name, c.email, c.phone,
                 s.name AS sequence_name
          FROM sequence_tasks t
          JOIN customers c ON c.id = t.customer_id
          JOIN sequence_enrollments e ON e.id = t.enrollment_id
          JOIN sequences s ON s.id = e.sequence_id
          WHERE t.status = 'pending'
          ORDER BY t.due_date ASC, t.created_at ASC
        `;
        return res.json(rows);
      }

      const rows = await sql`
        SELECT t.*, c.company_name, c.contact_name, c.email, c.phone,
               s.name AS sequence_name
        FROM sequence_tasks t
        JOIN customers c ON c.id = t.customer_id
        JOIN sequence_enrollments e ON e.id = t.enrollment_id
        JOIN sequences s ON s.id = e.sequence_id
        WHERE t.status = 'pending' AND t.due_date <= CURRENT_DATE
        ORDER BY t.due_date ASC, t.created_at ASC
      `;
      return res.json(rows);
    }

    // ── PUT (görev tamamla / ertele / yanıt) ──────────────
    if (req.method === 'PUT') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      const { status, result, note, snooze_days } = req.body || {};

      const taskRows = await sql`SELECT * FROM sequence_tasks WHERE id = ${id} LIMIT 1`;
      const task = taskRows[0];
      if (!task) return res.status(404).json({ error: 'Görev bulunamadı' });

      // ── ERTELE (snooze): vade tarihini ileri al, görev pending kalır ──
      if (status === 'snoozed') {
        const days = Math.max(1, parseInt(snooze_days, 10) || 1);
        await sql`
          UPDATE sequence_tasks
          SET due_date = CURRENT_DATE + ${days} * INTERVAL '1 day'
          WHERE id = ${id}
        `;
        if (note) {
          try {
            await sql`INSERT INTO activities (customer_id, result, note, created_by)
                      VALUES (${task.customer_id}, 'takip_gerekiyor', ${note}, ${user.id})`;
          } catch (e) {}
        }
        return res.json({ ok: true, snoozed: true, days });
      }

      if (!['done', 'skipped'].includes(status))
        return res.status(400).json({ error: "status 'done', 'skipped' veya 'snoozed' olmalı" });

      // Görevi işaretle
      await sql`
        UPDATE sequence_tasks SET status = ${status}, completed_at = NOW(), outcome = ${result || null}
        WHERE id = ${id}
      `;

      let custStatusChanged = null;
      let enrollmentPaused  = false;

      if (status === 'done') {
        // Sonuç → aktivite result eşlemesi
        const ACT_RESULT = {
          reached:        'görüşüldü',
          no_answer:      'ulaşılamadı',
          interested:     'görüşüldü',
          not_interested: 'görüşüldü',
          replied:        'görüşüldü',
        };
        const baseMap = { call:'görüşüldü', email:'mail_atıldı', whatsapp:'mail_atıldı',
                          linkedin_connect:'görüşüldü', linkedin_message:'görüşüldü' };
        const actResult = ACT_RESULT[result] || baseMap[task.step_type] || 'görüşüldü';
        const resultLabel = {
          reached:'Ulaşıldı', no_answer:'Ulaşılamadı', interested:'İlgilendi',
          not_interested:'İlgilenmedi', replied:'Yanıt geldi',
        }[result] || '';
        const noteText = note || (resultLabel ? `${stepLabel(task.step_type)} — ${resultLabel}` : `Sequence görevi: ${stepLabel(task.step_type)}`);
        try {
          await sql`INSERT INTO activities (customer_id, result, note, created_by)
                    VALUES (${task.customer_id}, ${actResult}, ${noteText}, ${user.id})`;
          await sql`UPDATE customers SET last_contacted = NOW(), updated_at = NOW() WHERE id = ${task.customer_id}`;
        } catch (e) {}

        // Sonuç yan etkileri
        if (result === 'interested' || result === 'replied') {
          // İlgili/yanıt → sequence'i duraklat, müşteriyi 'interested' yap, bekleyen görevleri iptal
          await sql`UPDATE customers SET status='interested', updated_at=NOW() WHERE id=${task.customer_id} AND status NOT IN ('sold','lost')`;
          await sql`UPDATE sequence_enrollments SET status='paused', stop_reason=${result} WHERE id=${task.enrollment_id} AND status='active'`;
          await sql`UPDATE sequence_tasks SET status='skipped' WHERE enrollment_id=${task.enrollment_id} AND status='pending'`;
          custStatusChanged = 'interested'; enrollmentPaused = true;
        } else if (result === 'not_interested') {
          // İlgilenmedi → müşteriyi 'lost', sequence'i durdur
          await sql`UPDATE customers SET status='lost', updated_at=NOW() WHERE id=${task.customer_id}`;
          await sql`UPDATE sequence_enrollments SET status='stopped', stop_reason='lost', completed_at=NOW() WHERE id=${task.enrollment_id} AND status='active'`;
          await sql`UPDATE sequence_tasks SET status='skipped' WHERE enrollment_id=${task.enrollment_id} AND status='pending'`;
          custStatusChanged = 'lost'; enrollmentPaused = true;
        }
      }

      // Bekleyen görev kalmadıysa kaydı tamamlandı yap
      const remaining = await sql`
        SELECT COUNT(*)::int AS n FROM sequence_tasks
        WHERE enrollment_id = ${task.enrollment_id} AND status = 'pending'
      `;
      if (remaining[0].n === 0 && !enrollmentPaused) {
        await sql`UPDATE sequence_enrollments SET status='completed', completed_at=NOW()
                  WHERE id=${task.enrollment_id} AND status='active'`;
      }

      return res.json({ ok: true, enrollment_completed: remaining[0].n === 0, customer_status: custStatusChanged, enrollment_paused: enrollmentPaused });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('sequence-tasks error:', err);
    return res.status(500).json({ error: err.message });
  }
};

function stepLabel(type) {
  return ({
    call: 'Telefon araması', email: 'E-posta', whatsapp: 'WhatsApp mesajı',
    linkedin_connect: 'LinkedIn bağlantı isteği', linkedin_message: 'LinkedIn mesajı',
  })[type] || type;
}
