// GET /api/users → tüm kullanıcıları listele (temsilci atama için)
const { getDb, cors, verifyToken } = require('./_db');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const sql = getDb();

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, name, email, role, daily_target
        FROM users
        ORDER BY name ASC
      `;
      return res.json(rows);
    }

    // PUT /api/users/target → günlük hedef güncelle
    if (req.method === 'PUT') {
      const { daily_target } = req.body || {};
      if (!daily_target) return res.status(400).json({ error: 'daily_target gerekli' });
      const rows = await sql`
        UPDATE users SET daily_target = ${daily_target} WHERE id = ${user.id} RETURNING id, name, daily_target
      `;
      return res.json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('users error:', err);
    return res.status(500).json({ error: err.message });
  }
};
