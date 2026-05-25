// POST /api/import
// Python cron scripti bu endpoint'e müşteri listesi gönderir
// Header: x-import-key: <IMPORT_SECRET env var>
// Body: { customers: [ { company_name, sector, fit_score, ... } ] }
const { getDb, cors } = require('./_db');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // API key kontrolü
  const importKey = process.env.IMPORT_SECRET;
  const provided  = req.headers['x-import-key'];
  if (!importKey || provided !== importKey) {
    return res.status(401).json({ error: 'Geçersiz import key' });
  }

  const { customers } = req.body || {};
  if (!Array.isArray(customers) || customers.length === 0) {
    return res.status(400).json({ error: 'customers array gerekli' });
  }

  const sql = getDb();
  let upserted = 0;
  let errors   = 0;

  for (const c of customers) {
    if (!c.company_name) continue;
    try {
      await sql`
        INSERT INTO customers
          (company_name, contact_name, phone, email, sector, city,
           fit_score, linkedin_url, title, confidence, status, notes, updated_at)
        VALUES
          (${c.company_name}, ${c.contact_name||''}, ${c.phone||''}, ${c.email||''},
           ${c.sector||''}, ${c.city||''}, ${c.fit_score||null},
           ${c.linkedin_url||''}, ${c.title||''}, ${c.confidence||null},
           'new', ${c.notes||''}, NOW())
        ON CONFLICT (company_name)
        DO UPDATE SET
          contact_name   = EXCLUDED.contact_name,
          phone          = EXCLUDED.phone,
          email          = EXCLUDED.email,
          sector         = EXCLUDED.sector,
          city           = EXCLUDED.city,
          fit_score      = EXCLUDED.fit_score,
          linkedin_url   = EXCLUDED.linkedin_url,
          title          = EXCLUDED.title,
          confidence     = EXCLUDED.confidence,
          notes          = EXCLUDED.notes,
          updated_at     = NOW()
      `;
      upserted++;
    } catch (e) {
      console.error('upsert error for', c.company_name, e.message);
      errors++;
    }
  }

  console.log(`Import tamamlandı: ${upserted} upserted, ${errors} errors`);
  return res.json({
    success: true,
    upserted,
    errors,
    timestamp: new Date().toISOString(),
  });
};
