// Sequence şablonları + adımları
// GET    /api/sequences            → tüm sequence'ler (adım & kayıt sayısıyla)
// GET    /api/sequences?id=uuid    → tek sequence + adımları
// POST   /api/sequences            → yeni sequence (steps dizisiyle)
// PUT    /api/sequences?id=uuid     → güncelle (steps verilirse tümü değiştirilir)
// DELETE /api/sequences?id=uuid     → sil (cascade)
const { getDb, cors, verifyToken } = require('./_db');

const VALID_STEP_TYPES = new Set([
  'call', 'email', 'linkedin_connect', 'linkedin_message', 'whatsapp',
]);

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const sql = getDb();
  const id  = req.query?.id;

  try {
    // ── GET ───────────────────────────────────────────────
    if (req.method === 'GET') {
      if (id) {
        const seq = await sql`SELECT * FROM sequences WHERE id = ${id} LIMIT 1`;
        if (!seq[0]) return res.status(404).json({ error: 'Sequence bulunamadı' });
        const steps = await sql`
          SELECT * FROM sequence_steps WHERE sequence_id = ${id} ORDER BY step_order ASC
        `;
        return res.json({ ...seq[0], steps });
      }
      // Liste — adım & kayıt & bekleyen görev sayılarıyla
      const rows = await sql`
        SELECT s.*,
          (SELECT COUNT(*) FROM sequence_steps st WHERE st.sequence_id = s.id)                          AS step_count,
          (SELECT COUNT(*) FROM sequence_enrollments e WHERE e.sequence_id = s.id AND e.status='active') AS active_count,
          (SELECT COUNT(*) FROM sequence_enrollments e WHERE e.sequence_id = s.id)                       AS total_enrolled
        FROM sequences s
        ORDER BY s.created_at DESC
      `;
      return res.json(rows);
    }

    // ── POST (yeni sequence + adımlar) ────────────────────
    if (req.method === 'POST') {
      const { name, description, status, skip_weekends, steps } = req.body || {};
      if (!name || !name.trim()) return res.status(400).json({ error: 'Sequence adı gerekli' });

      const created = await sql`
        INSERT INTO sequences (name, description, status, skip_weekends, created_by)
        VALUES (${name.trim()}, ${description || ''}, ${status || 'active'},
                ${skip_weekends !== false}, ${user.id})
        RETURNING *
      `;
      const seq = created[0];

      if (Array.isArray(steps) && steps.length) {
        await insertSteps(sql, seq.id, steps);
      }
      const seqSteps = await sql`
        SELECT * FROM sequence_steps WHERE sequence_id = ${seq.id} ORDER BY step_order ASC
      `;
      return res.status(201).json({ ...seq, steps: seqSteps });
    }

    // ── PUT (güncelle, steps verilirse değiştir) ──────────
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      const { name, description, status, skip_weekends, steps } = req.body || {};

      const updated = await sql`
        UPDATE sequences SET
          name          = COALESCE(${name}, name),
          description   = COALESCE(${description}, description),
          status        = COALESCE(${status}, status),
          skip_weekends = COALESCE(${typeof skip_weekends === 'boolean' ? skip_weekends : null}, skip_weekends),
          updated_at    = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      if (!updated[0]) return res.status(404).json({ error: 'Sequence bulunamadı' });

      // steps verildiyse: eskileri sil, yenilerini ekle
      if (Array.isArray(steps)) {
        await sql`DELETE FROM sequence_steps WHERE sequence_id = ${id}`;
        if (steps.length) await insertSteps(sql, id, steps);
      }
      const seqSteps = await sql`
        SELECT * FROM sequence_steps WHERE sequence_id = ${id} ORDER BY step_order ASC
      `;
      return res.json({ ...updated[0], steps: seqSteps });
    }

    // ── DELETE ────────────────────────────────────────────
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      await sql`DELETE FROM sequences WHERE id = ${id}`;
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('sequences error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Adımları sırayla ekle (geçersiz tipleri atla)
async function insertSteps(sql, sequenceId, steps) {
  let order = 1;
  for (const s of steps) {
    const type = (s.step_type || '').toString().trim();
    if (!VALID_STEP_TYPES.has(type)) continue;
    const dayOffset = Math.max(1, parseInt(s.day_offset, 10) || 1);
    await sql`
      INSERT INTO sequence_steps (sequence_id, step_order, day_offset, step_type, subject, body)
      VALUES (${sequenceId}, ${order}, ${dayOffset}, ${type},
              ${(s.subject || '').toString()}, ${(s.body || '').toString()})
    `;
    order++;
  }
}
