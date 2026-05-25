// POST /api/auth  →  { email, password }  →  { token, user }
const bcrypt = require('bcryptjs');
const { getDb, cors, signToken } = require('./_db');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email ve password gerekli' });

  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1`;
    const user = rows[0];

    if (!user) return res.status(401).json({ error: 'E-posta veya şifre hatalı' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'E-posta veya şifre hatalı' });

    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error('auth error:', err);
    return res.status(500).json({ error: err.message });
  }
};
