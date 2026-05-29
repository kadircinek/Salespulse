// Sequence kayıtları (müşteri ↔ sequence) + görev üretimi
// GET    /api/sequence-enrollments?customer_id=uuid  → müşterinin kayıtları
// GET    /api/sequence-enrollments?sequence_id=uuid  → sequence'teki müşteriler
// POST   /api/sequence-enrollments                   → { sequence_id, customer_ids:[] } kaydet + görev üret
// PUT    /api/sequence-enrollments?id=uuid           → durum güncelle (paused/active/stopped)
// DELETE /api/sequence-enrollments?id=uuid           → kaydı sil (görevler cascade silinir)
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
      const { customer_id, sequence_id } = req.query || {};
      if (customer_id) {
        const rows = await sql`
          SELECT e.*, s.name AS sequence_name, s.status AS sequence_status
          FROM sequence_enrollments e
          JOIN sequences s ON s.id = e.sequence_id
          WHERE e.customer_id = ${customer_id}
          ORDER BY e.enrolled_at DESC
        `;
        return res.json(rows);
      }
      if (sequence_id) {
        const rows = await sql`
          SELECT e.*, c.company_name, c.contact_name, c.email, c.phone
          FROM sequence_enrollments e
          JOIN customers c ON c.id = e.customer_id
          WHERE e.sequence_id = ${sequence_id}
          ORDER BY e.enrolled_at DESC
        `;
        return res.json(rows);
      }
      return res.status(400).json({ error: 'customer_id veya sequence_id gerekli' });
    }

    // ── POST (kayıt + görev üretimi) ──────────────────────
    if (req.method === 'POST') {
      const { sequence_id, customer_ids } = req.body || {};
      if (!sequence_id) return res.status(400).json({ error: 'sequence_id gerekli' });
      const ids = Array.isArray(customer_ids) ? customer_ids : (customer_ids ? [customer_ids] : []);
      if (!ids.length) return res.status(400).json({ error: 'En az bir customer_id gerekli' });

      // Sequence + adımları çek
      const seqRows = await sql`SELECT * FROM sequences WHERE id = ${sequence_id} LIMIT 1`;
      const seq = seqRows[0];
      if (!seq) return res.status(404).json({ error: 'Sequence bulunamadı' });
      const steps = await sql`
        SELECT * FROM sequence_steps WHERE sequence_id = ${sequence_id} ORDER BY step_order ASC
      `;
      if (!steps.length) return res.status(400).json({ error: 'Sequence\'te adım yok, önce adım ekleyin' });

      let enrolled = 0, skipped = 0, tasksCreated = 0;
      const today = new Date();

      for (const customerId of ids) {
        // Zaten kayıtlı mı?
        const existing = await sql`
          SELECT id FROM sequence_enrollments
          WHERE sequence_id = ${sequence_id} AND customer_id = ${customerId} LIMIT 1
        `;
        if (existing[0]) { skipped++; continue; }

        // Müşteri "satıldı/kaybedildi" ise kaydetme
        const cust = await sql`SELECT status, assigned_user_id FROM customers WHERE id = ${customerId} LIMIT 1`;
        if (!cust[0]) { skipped++; continue; }
        if (cust[0].status === 'sold' || cust[0].status === 'lost') { skipped++; continue; }

        const enr = await sql`
          INSERT INTO sequence_enrollments (sequence_id, customer_id, status, enrolled_by)
          VALUES (${sequence_id}, ${customerId}, 'active', ${user.id})
          RETURNING *
        `;
        const enrollment = enr[0];
        enrolled++;

        // Her adım için tarihli görev üret
        const assignTo = cust[0].assigned_user_id || user.id;
        for (const st of steps) {
          const due = computeDueDate(today, st.day_offset, seq.skip_weekends);
          await sql`
            INSERT INTO sequence_tasks
              (enrollment_id, step_id, customer_id, assigned_user_id, step_type, subject, body, due_date, status)
            VALUES
              (${enrollment.id}, ${st.id}, ${customerId}, ${assignTo}, ${st.step_type},
               ${st.subject || ''}, ${st.body || ''}, ${due}, 'pending')
          `;
          tasksCreated++;
        }
      }

      return res.status(201).json({ enrolled, skipped, tasks_created: tasksCreated });
    }

    // ── PUT (durum güncelle) ──────────────────────────────
    if (req.method === 'PUT') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      const { status, stop_reason } = req.body || {};
      if (!status) return res.status(400).json({ error: 'status gerekli' });

      const updated = await sql`
        UPDATE sequence_enrollments SET
          status      = ${status},
          stop_reason = COALESCE(${stop_reason || null}, stop_reason),
          completed_at = ${status === 'completed' || status === 'stopped' ? new Date().toISOString() : null}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!updated[0]) return res.status(404).json({ error: 'Kayıt bulunamadı' });

      // Durduruldu/tamamlandıysa bekleyen görevleri iptal et (skipped)
      if (status === 'stopped' || status === 'paused' || status === 'completed') {
        await sql`
          UPDATE sequence_tasks SET status = 'skipped'
          WHERE enrollment_id = ${id} AND status = 'pending'
        `;
      }
      return res.json(updated[0]);
    }

    // ── DELETE ────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      await sql`DELETE FROM sequence_enrollments WHERE id = ${id}`;
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('sequence-enrollments error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Vade tarihi hesapla: Gün 1 = bugün. Hafta sonu ise pazartesiye kaydır.
function computeDueDate(startDate, dayOffset, skipWeekends) {
  const d = new Date(startDate);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + (Math.max(1, dayOffset) - 1));
  if (skipWeekends) {
    const dow = d.getDay();            // 0 = Pazar, 6 = Cumartesi
    if (dow === 6) d.setDate(d.getDate() + 2);
    else if (dow === 0) d.setDate(d.getDate() + 1);
  }
  return d.toISOString().slice(0, 10);  // YYYY-MM-DD
}
