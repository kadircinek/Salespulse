// Müşteri ürün kullanımı
// GET    /api/customer-products?customer_id=uuid  → müşterinin kullanım listesi
// POST   /api/customer-products                   → satır ekle/güncelle
//        Body: { customer_id, product_id?, product_name, quantity_kg, note }
//        Aynı müşteri+ürün varsa günceller (upsert mantığı)
// DELETE /api/customer-products?id=uuid            → satırı sil
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
      const { customer_id } = req.query || {};
      if (!customer_id) return res.status(400).json({ error: 'customer_id gerekli' });
      const rows = await sql`
        SELECT cp.*, u.name AS updated_by_name, p.product_group, p.stock_qty
        FROM customer_products cp
        LEFT JOIN users u ON u.id = cp.updated_by
        LEFT JOIN products p ON p.id = cp.product_id
        WHERE cp.customer_id = ${customer_id}
        ORDER BY cp.updated_at DESC
      `;
      return res.json(rows);
    }

    // ── POST (ekle/güncelle) ──────────────────────────────
    if (req.method === 'POST') {
      const { customer_id, product_id, product_name, quantity_kg, note } = req.body || {};
      if (!customer_id) return res.status(400).json({ error: 'customer_id gerekli' });
      if (!product_name || !product_name.toString().trim())
        return res.status(400).json({ error: 'product_name gerekli' });

      const qty = (quantity_kg === '' || quantity_kg == null) ? null : parseFloat(quantity_kg);

      // Aynı müşteri + ürün adı varsa güncelle, yoksa ekle
      const existing = await sql`
        SELECT id FROM customer_products
        WHERE customer_id = ${customer_id}
          AND LOWER(TRIM(product_name)) = ${product_name.toString().trim().toLowerCase()}
        LIMIT 1
      `;
      let row;
      if (existing[0]) {
        const r = await sql`
          UPDATE customer_products SET
            product_id   = ${product_id || null},
            quantity_kg  = ${qty},
            note         = ${(note||'').toString().trim()},
            updated_by   = ${user.id},
            updated_at   = NOW()
          WHERE id = ${existing[0].id}
          RETURNING *
        `;
        row = r[0];
      } else {
        const r = await sql`
          INSERT INTO customer_products
            (customer_id, product_id, product_name, quantity_kg, note, updated_by)
          VALUES
            (${customer_id}, ${product_id || null}, ${product_name.toString().trim()},
             ${qty}, ${(note||'').toString().trim()}, ${user.id})
          RETURNING *
        `;
        row = r[0];
      }
      return res.status(201).json(row);
    }

    // ── DELETE ────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'id gerekli' });
      await sql`DELETE FROM customer_products WHERE id = ${id}`;
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('customer-products error:', err);
    return res.status(500).json({ error: err.message });
  }
};
