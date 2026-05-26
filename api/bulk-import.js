// POST /api/bulk-import
// Body: { customers: [ { company_name, contact_name, phone, email, sector, city, status, notes, fit_score, linkedin_url, title } ] }
// Returns: { inserted: N, skipped: N, errors: [...] }
// Duplicate detection: company_name + contact_name çifti zaten varsa satırı atlar (case-insensitive)

const { getDb, cors, verifyToken } = require('./_db');

const VALID_STATUSES = new Set([
  'new','to_call','call_later','contacted','interested',
  'offer_sent','negotiating','sold','lost','unreachable',
]);

// Türkçe durum metni → DB değeri
const STATUS_TR_MAP = {
  'yeni':'new','new':'new',
  'aranacak':'to_call','to_call':'to_call','to call':'to_call',
  'sonra ara':'call_later','call_later':'call_later',
  'görüşüldü':'contacted','gorusuldu':'contacted','contacted':'contacted',
  'contact found':'contacted','ulaşıldı':'contacted',
  'ilgili':'interested','interested':'interested',
  'researched':'interested',
  'teklif gönderildi':'offer_sent','offer_sent':'offer_sent','offer sent':'offer_sent',
  'pazarlıkta':'negotiating','negotiating':'negotiating',
  'satış yapıldı':'sold','satildi':'sold','sold':'sold',
  'kaybedildi':'lost','lost':'lost',
  'ulaşılamadı':'unreachable','unreachable':'unreachable',
};

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

  // Mevcut (firma_adı + yetkili_adı) çiftlerini çek → duplicate tespiti için
  const existing = await sql`
    SELECT LOWER(TRIM(company_name)) as cn, LOWER(TRIM(COALESCE(contact_name,''))) as ct
    FROM customers
  `;
  const existingSet = new Set(existing.map(r => `${r.cn}|||${r.ct}`));

  let inserted = 0;
  let skipped  = 0;
  const errors = [];

  for (let i = 0; i < customers.length; i++) {
    const c = customers[i];
    const rowNum = i + 2;

    if (!c.company_name || !c.company_name.toString().trim()) {
      errors.push({ row: rowNum, reason: 'Firma adı boş' });
      continue;
    }

    const companyName  = c.company_name.toString().trim();
    const contactName  = (c.contact_name||'').toString().trim();
    const dupeKey      = `${companyName.toLowerCase()}|||${contactName.toLowerCase()}`;

    // Duplicate kontrolü
    if (existingSet.has(dupeKey)) {
      skipped++;
      continue;
    }

    // Durum normalleştir (Türkçe metin veya kod)
    const rawStatus = (c.status||'').toString().trim().toLowerCase();
    const status    = STATUS_TR_MAP[rawStatus] || (VALID_STATUSES.has(rawStatus) ? rawStatus : 'new');

    const fitScore      = c.fit_score ? parseFloat(c.fit_score) : null;
    const fitScoreFinal = (!isNaN(fitScore) && fitScore >= 0 && fitScore <= 100) ? fitScore : null;

    const confidence      = c.confidence ? parseFloat(c.confidence) : null;
    const confidenceFinal = (!isNaN(confidence) && confidence >= 0 && confidence <= 100) ? confidence : null;

    try {
      await sql`
        INSERT INTO customers
          (company_name, contact_name, phone, email, sector, city,
           status, notes, fit_score, confidence, linkedin_url, title, assigned_user_id)
        VALUES
          (${companyName},
           ${contactName},
           ${(c.phone||'').toString().trim()},
           ${(c.email||'').toString().trim()},
           ${(c.sector||'').toString().trim()},
           ${(c.city||'').toString().trim()},
           ${status},
           ${(c.notes||'').toString().trim()},
           ${fitScoreFinal},
           ${confidenceFinal},
           ${(c.linkedin_url||'').toString().trim()},
           ${(c.title||'').toString().trim()},
           ${user.id})
      `;
      inserted++;
      // Yeni eklenen kaydı duplicate setine ekle (aynı batch içinde tekrar eklenmesin)
      existingSet.add(dupeKey);
    } catch (err) {
      errors.push({ row: rowNum, reason: err.message });
    }
  }

  return res.json({ inserted, skipped, errors });
};
