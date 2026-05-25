// POST /api/activities  →  sonuç + not kaydet, müşteri durumunu güncelle
// GET  /api/activities?customer_id=uuid  →  müşterinin geçmiş aktiviteleri
const { getDb, cors, verifyToken } = require('./_db');

const RESULT_TO_STATUS = {
  'görüşüldü':         'contacted',
  'mail_atıldı':       'contacted',
  'ziyaret_planlandı': 'contacted',
  'takip_gerekiyor':   'call_later',
  'ulaşılamadı':       'unreachable',
};

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const sql = getDb();

  // ── GET: müşteri geçmişi ──────────────────────────────────────
  if (req.method === 'GET') {
    const { customer_id } = req.query || {};
    if (!customer_id) return res.status(400).json({ error: 'customer_id gerekli' });
    const rows = await sql`
      SELECT a.*, u.name as created_by_name
      FROM activities a
      LEFT JOIN users u ON u.id = a.created_by
      WHERE a.customer_id = ${customer_id}
      ORDER BY a.created_at DESC
      LIMIT 20
    `;
    return res.json(rows);
  }

  // ── POST: yeni aktivite kaydet ────────────────────────────────
  if (req.method === 'POST') {
    const { customer_id, result, note } = req.body || {};
    if (!customer_id) return res.status(400).json({ error: 'customer_id gerekli' });
    if (!result)      return res.status(400).json({ error: 'result gerekli' });

    try {
      // Aktiviteyi kaydet
      const rows = await sql`
        INSERT INTO activities (customer_id, result, note, created_by)
        VALUES (${customer_id}, ${result}, ${note || ''}, ${user.id})
        RETURNING *
      `;

      // Müşteri durumunu ve son görüşme tarihini güncelle
      const newStatus = RESULT_TO_STATUS[result];
      if (newStatus) {
        await sql`
          UPDATE customers SET
            status         = ${newStatus},
            last_contacted = NOW(),
            updated_at     = NOW()
          WHERE id = ${customer_id}
        `;
      }

      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('activities error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
