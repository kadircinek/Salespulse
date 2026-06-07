// Ürün kataloğu
// GET    /api/products            → liste (?group= , ?q= filtre)
// POST   /api/products            → yeni ürün (admin)
// PUT    /api/products?id=uuid     → güncelle (admin)
// DELETE /api/products?id=uuid     → sil (admin)
const { getDb, cors, verifyToken } = require('./_db');

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
      const rows = await sql`
        SELECT * FROM products
        ORDER BY (stock_qty IS NULL), stock_qty DESC, name ASC
      `;
      return res.json(rows);
    }

    // Yazma işlemleri sadece admin
    if (user.role !== 'admin') return res.status(403).json({ error: 'Bu işlem için admin yetkisi gerekli' });

    // ── POST ──────────────────────────────────────────────
    if (req.method === 'POST') {
      const { product_group, name, stock_qty, cost, unit } = req.body || {};
      if (!name || !name.trim()) return res.status(400).json({ error: 'Ürün adı gerekli' });
      const rows = await sql`
        INSERT INTO products (product_group, name, stock_qty, cost, unit)
        VALUES (${(product_group||'').trim()}, ${name.trim()},
                ${stock_qty ?? null}, ${cost ?? null}, ${unit || 'kg'})
        ON CONFLICT (name) DO UPDATE SET
          product_group = EXCLUDED.product_group,
          stock_qty = EXCLUDED.stock_qty,
          cost = EXCLUDED.cost,
          updated_at = NOW()
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    // ── PUT ───────────────────────────────────────────────
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      const { product_group, name, stock_qty, cost, unit } = req.body || {};
      const rows = await sql`
        UPDATE products SET
          product_group = COALESCE(${product_group}, product_group),
          name          = COALESCE(${name}, name),
          stock_qty     = COALESCE(${stock_qty}, stock_qty),
          cost          = COALESCE(${cost}, cost),
          unit          = COALESCE(${unit}, unit),
          updated_at    = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows[0]) return res.status(404).json({ error: 'Ürün bulunamadı' });
      return res.json(rows[0]);
    }

    // ── DELETE ────────────────────────────────────────────
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('products error:', err);
    return res.status(500).json({ error: err.message });
  }
};
