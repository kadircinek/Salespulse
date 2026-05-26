// POST /api/bulk-import
// Body: { customers: [ { company_name, contact_name, phone, email, sector, city, status, notes, fit_score, linkedin_url, title } ] }
// Returns: { inserted: N, skipped: N, errors: [...] }

const { getDb, cors, verifyToken } = require('./_db');

const VALID_STATUSES = new Set([
  'new','to_call','call_later','contacted','interested',
  'offer_sent','negotiating','sold','lost','unreachable',
]);

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const { customers } = req.body || {};
  if (!Array.isArray(customers) || customers.length === 0)
    return res.status(400).json({ error: 'customers dizisi gerekli' });

  if (customers.length > 500)
    return res.status(400).json({ error: 'Tek seferde en fazla 500 müşteri eklenebilir' });

  const sql = getDb();
  let inserted = 0;
  const errors = [];

  for (let i = 0; i < customers.length; i++) {
    const c = customers[i];
    const rowNum = i + 2; // Excel row number (header = 1)

    if (!c.company_name || !c.company_name.toString().trim()) {
      errors.push({ row: rowNum, reason: 'Firma adı boş' });
      continue;
    }

    const status = VALID_STATUSES.has(c.status) ? c.status : 'new';
    const fitScore = c.fit_score ? parseFloat(c.fit_score) : null;
    const fitScoreFinal = (!isNaN(fitScore) && fitScore >= 0 && fitScore <= 100) ? fitScore : null;

    try {
      await sql`
        INSERT INTO customers
          (company_name, contact_name, phone, email, sector, city,
           status, notes, fit_score, linkedin_url, title, assigned_user_id)
        VALUES
          (${c.company_name.toString().trim()},
           ${(c.contact_name||'').toString().trim()},
           ${(c.phone||'').toString().trim()},
           ${(c.email||'').toString().trim()},
           ${(c.sector||'').toString().trim()},
           ${(c.city||'').toString().trim()},
           ${status},
           ${(c.notes||'').toString().trim()},
           ${fitScoreFinal},
           ${(c.linkedin_url||'').toString().trim()},
           ${(c.title||'').toString().trim()},
           ${user.id})
        ON CONFLICT DO NOTHING
      `;
      inserted++;
    } catch (err) {
      errors.push({ row: rowNum, reason: err.message });
    }
  }

  return res.json({ inserted, skipped: customers.length - inserted - errors.length, errors });
};
