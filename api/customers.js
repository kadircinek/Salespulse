// GET  /api/customers          → tüm müşteriler
// POST /api/customers          → yeni müşteri ekle
// PUT  /api/customers?id=uuid  → müşteri güncelle
const { getDb, cors, verifyToken } = require('./_db');
const { autoEnroll } = require('./_enroll');

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
        SELECT c.*,
          u.name as assigned_user_name
        FROM customers c
        LEFT JOIN users u ON u.id = c.assigned_user_id
        ORDER BY
          CASE WHEN c.status = 'new' AND c.last_contacted IS NULL THEN 0
               WHEN c.follow_up_date <= CURRENT_DATE AND c.follow_up_date IS NOT NULL THEN 1
               WHEN c.status = 'to_call' THEN 2
               WHEN c.status = 'call_later' THEN 3
               ELSE 4
          END ASC,
          c.fit_score DESC NULLS LAST,
          c.created_at DESC
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

      const assignedTo = req.body?.assigned_user_id || null;  // varsayılan: atanmamış
      const rows = await sql`
        INSERT INTO customers
          (company_name, contact_name, phone, email, sector, city,
           status, notes, fit_score, linkedin_url, title, confidence, assigned_user_id)
        VALUES
          (${company_name}, ${contact_name||''}, ${phone||''}, ${email||''},
           ${sector||''}, ${city||''}, ${status||'new'}, ${notes||''},
           ${fit_score||null}, ${linkedin_url||''}, ${title||''}, ${confidence||null},
           ${assignedTo})
        RETURNING *
      `;
      // Otomatik sequence kaydı (cold müşteri ise; sold/lost atlanır)
      await autoEnroll(sql, rows[0].id, user.id);
      return res.status(201).json(rows[0]);
    }

    // ── PUT (güncelle) ────────────────────────────────────
    if (req.method === 'PUT') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'id gerekli' });

      const {
        company_name, contact_name, phone, email, sector,
        city, status, notes, fit_score, linkedin_url, title,
        confidence, last_contacted, follow_up_date, assigned_user_id,
      } = req.body || {};

      const rows = await sql`
        UPDATE customers SET
          company_name     = COALESCE(${company_name},     company_name),
          contact_name     = COALESCE(${contact_name},     contact_name),
          phone            = COALESCE(${phone},             phone),
          email            = COALESCE(${email},             email),
          sector           = COALESCE(${sector},            sector),
          city             = COALESCE(${city},              city),
          status           = COALESCE(${status},            status),
          notes            = COALESCE(${notes},             notes),
          fit_score        = COALESCE(${fit_score},         fit_score),
          linkedin_url     = COALESCE(${linkedin_url},      linkedin_url),
          title            = COALESCE(${title},             title),
          confidence       = COALESCE(${confidence},        confidence),
          last_contacted   = COALESCE(${last_contacted},    last_contacted),
          follow_up_date   = COALESCE(${follow_up_date || null},  follow_up_date),
          assigned_user_id = COALESCE(${assigned_user_id || null}, assigned_user_id),
          updated_at       = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows[0]) return res.status(404).json({ error: 'Müşteri bulunamadı' });

      // Akıllı davranış: müşteri satıldı/kaybedildiyse aktif sequence kayıtlarını durdur
      if (status === 'sold' || status === 'lost') {
        try {
          await sql`
            UPDATE sequence_enrollments
            SET status = 'stopped', stop_reason = ${status}, completed_at = NOW()
            WHERE customer_id = ${id} AND status = 'active'
          `;
          await sql`
            UPDATE sequence_tasks t
            SET status = 'skipped'
            FROM sequence_enrollments e
            WHERE t.enrollment_id = e.id
              AND e.customer_id = ${id}
              AND t.status = 'pending'
          `;
        } catch (e) { /* sequence tabloları henüz yoksa sessiz geç */ }
      }

      // Temsilci değiştiyse bekleyen sequence görevlerini yeni temsilciye taşı
      if (assigned_user_id) {
        try {
          await sql`
            UPDATE sequence_tasks t
            SET assigned_user_id = ${assigned_user_id}
            FROM sequence_enrollments e
            WHERE t.enrollment_id = e.id
              AND e.customer_id = ${id}
              AND t.status = 'pending'
          `;
        } catch (e) { /* sessiz geç */ }
      }

      return res.json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('customers error:', err);
    return res.status(500).json({ error: err.message });
  }
};
