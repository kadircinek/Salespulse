// GET  /api/customers          → tüm müşteriler
// POST /api/customers          → yeni müşteri ekle
// PUT  /api/customers?id=uuid  → müşteri güncelle
const { getDb, cors, verifyToken } = require('./_db');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth kontrolü (demo token hariç)
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const sql = getDb();

  try {
    // ── GET ──────────────────────────────────────────────
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM customers
        ORDER BY fit_score DESC NULLS LAST, updated_at DESC
      `;
      return res.json(rows);
    }

    // ── POST (yeni müşteri) ───────────────────────────────
    if (req.method === 'POST') {
      const {
        company_name, contact_name, phone, email, sector,
        city, status, notes, fit_score, linkedin_url, title, confidence,
      } = req.body || {};

      if (!company_name) return res.status(400).json({ error: 'company_name gerekli' });

      const rows = await sql`
        INSERT INTO customers
          (company_name, contact_name, phone, email, sector, city,
           status, notes, fit_score, linkedin_url, title, confidence, assigned_user_id)
        VALUES
          (${company_name}, ${contact_name||''}, ${phone||''}, ${email||''},
           ${sector||''}, ${city||''}, ${status||'new'}, ${notes||''},
           ${fit_score||null}, ${linkedin_url||''}, ${title||''}, ${confidence||null},
           ${user.id})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    // ── PUT (güncelle) ────────────────────────────────────
    if (req.method === 'PUT') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'id gerekli' });

      const {
        company_name, contact_name, phone, email, sector,
        city, status, notes, fit_score, linkedin_url, title,
        confidence, last_contacted,
      } = req.body || {};

      const rows = await sql`
        UPDATE customers SET
          company_name   = COALESCE(${company_name},   company_name),
          contact_name   = COALESCE(${contact_name},   contact_name),
          phone          = COALESCE(${phone},           phone),
          email          = COALESCE(${email},           email),
          sector         = COALESCE(${sector},          sector),
          city           = COALESCE(${city},            city),
          status         = COALESCE(${status},          status),
          notes          = COALESCE(${notes},           notes),
          fit_score      = COALESCE(${fit_score},       fit_score),
          linkedin_url   = COALESCE(${linkedin_url},    linkedin_url),
          title          = COALESCE(${title},           title),
          confidence     = COALESCE(${confidence},      confidence),
          last_contacted = COALESCE(${last_contacted},  last_contacted),
          updated_at     = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows[0]) return res.status(404).json({ error: 'Müşteri bulunamadı' });
      return res.json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('customers error:', err);
    return res.status(500).json({ error: err.message });
  }
};
