// GET    /api/users            → tüm kullanıcılar (temsilci atama + ekip)
// POST   /api/users            → yeni temsilci oluştur (sadece admin)
// PUT    /api/users            → kendi günlük hedefini güncelle
// PUT    /api/users?id=uuid     → bir kullanıcının hedef/rolünü güncelle (admin)
// DELETE /api/users?id=uuid     → kullanıcı sil (admin)
const bcrypt = require('bcryptjs');
const { getDb, cors, verifyToken } = require('./_db');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const sql = getDb();
  const id = req.query?.id;

  try {
    // ── GET ───────────────────────────────────────────────
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, name, email, role, daily_target
        FROM users
        ORDER BY name ASC
      `;
      return res.json(rows);
    }

    // ── POST (yeni temsilci — sadece admin) ───────────────
    if (req.method === 'POST') {
      if (user.role !== 'admin')
        return res.status(403).json({ error: 'Bu işlem için yönetici yetkisi gerekli' });

      const { name, email, password, role, daily_target } = req.body || {};
      if (!name || !email || !password)
        return res.status(400).json({ error: 'Ad, e-posta ve şifre gerekli' });
      if (password.length < 4)
        return res.status(400).json({ error: 'Şifre en az 4 karakter olmalı' });

      const emailLc = email.toLowerCase().trim();
      const exists = await sql`SELECT id FROM users WHERE email = ${emailLc} LIMIT 1`;
      if (exists[0]) return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı' });

      const hash = await bcrypt.hash(password, 10);
      const rows = await sql`
        INSERT INTO users (name, email, password_hash, role, daily_target)
        VALUES (${name.trim()}, ${emailLc}, ${hash}, ${role || 'sales_rep'}, ${daily_target || 20})
        RETURNING id, name, email, role, daily_target
      `;
      return res.status(201).json(rows[0]);
    }

    // ── PUT ───────────────────────────────────────────────
    if (req.method === 'PUT') {
      // Admin: belirli kullanıcıyı güncelle (hedef/rol)
      if (id) {
        if (user.role !== 'admin')
          return res.status(403).json({ error: 'Yönetici yetkisi gerekli' });
        const { daily_target, role, password } = req.body || {};
        let newHash = null;
        if (password) newHash = await bcrypt.hash(password, 10);
        const rows = await sql`
          UPDATE users SET
            daily_target  = COALESCE(${daily_target || null}, daily_target),
            role          = COALESCE(${role || null}, role),
            password_hash = COALESCE(${newHash}, password_hash)
          WHERE id = ${id}
          RETURNING id, name, email, role, daily_target
        `;
        if (!rows[0]) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        return res.json(rows[0]);
      }
      // Kendi hedefini güncelle
      const { daily_target } = req.body || {};
      if (!daily_target) return res.status(400).json({ error: 'daily_target gerekli' });
      const rows = await sql`
        UPDATE users SET daily_target = ${daily_target} WHERE id = ${user.id}
        RETURNING id, name, daily_target
      `;
      return res.json(rows[0]);
    }

    // ── DELETE (admin) ────────────────────────────────────
    if (req.method === 'DELETE') {
      if (user.role !== 'admin')
        return res.status(403).json({ error: 'Yönetici yetkisi gerekli' });
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      if (id === user.id) return res.status(400).json({ error: 'Kendinizi silemezsiniz' });
      // Müşteri atamalarını boşalt, sonra sil
      await sql`UPDATE customers SET assigned_user_id = NULL WHERE assigned_user_id = ${id}`;
      await sql`DELETE FROM users WHERE id = ${id}`;
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('users error:', err);
    return res.status(500).json({ error: err.message });
  }
};
