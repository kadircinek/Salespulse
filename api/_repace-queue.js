// Tek seferlik: bekleyen sequence görevlerini 25 müşteri/iş günü dalgalarına yeniden sırala.
// Sıralama: fit_score yüksek önce. Her müşterinin ilk bekleyen adımı dalga gününe,
// sonraki adımları orijinal gün aralıklarıyla onu takip edecek şekilde kayar.
// node api/repace-queue.js [günlük_tempo]
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
      if (m) {
        let v = m[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        if (!process.env[m[1]]) process.env[m[1]] = v;
      }
    }
  } catch (e) {}
}

// n'inci iş günü (0 = bugün veya bugünden sonraki ilk iş günü)
function nthWorkday(n) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--;
  }
  return d.toISOString().slice(0, 10);
}

(async () => {
  loadEnv();
  if (!process.env.DATABASE_URL) { console.error('❌ DATABASE_URL yok'); process.exit(1); }
  const PACE = parseInt(process.argv[2], 10) || 25;
  const sql = neon(process.env.DATABASE_URL);

  // Bekleyen görevi olan aktif kayıtlar — iletişim bilgisi önceliğiyle sıralı:
  // 1) telefon + LinkedIn  2) sadece LinkedIn  3) sadece telefon  4) sadece firma bilgisi
  const enrollments = await sql`
    SELECT e.id, c.fit_score,
      CASE
        WHEN COALESCE(TRIM(c.phone),'') <> '' AND COALESCE(TRIM(c.linkedin_url),'') <> '' THEN 0
        WHEN COALESCE(TRIM(c.linkedin_url),'') <> '' THEN 1
        WHEN COALESCE(TRIM(c.phone),'') <> '' THEN 2
        ELSE 3
      END AS tier
    FROM sequence_enrollments e
    JOIN customers c ON c.id = e.customer_id
    WHERE e.status = 'active'
      AND EXISTS (SELECT 1 FROM sequence_tasks t WHERE t.enrollment_id = e.id AND t.status = 'pending')
    ORDER BY tier ASC, c.fit_score DESC NULLS LAST, c.created_at ASC
  `;
  console.log(`⏳ ${enrollments.length} kayıt, tempo: ${PACE}/iş günü → ${Math.ceil(enrollments.length / PACE)} dalga`);

  for (let w = 0; w * PACE < enrollments.length; w++) {
    const ids = enrollments.slice(w * PACE, (w + 1) * PACE).map(e => e.id);
    const anchor = nthWorkday(w);
    // Adım offset'li görevler: anchor + (day_offset - ilk bekleyen offset)
    await sql`
      WITH f AS (
        SELECT t.enrollment_id, MIN(COALESCE(s.day_offset, 1)) AS first_off
        FROM sequence_tasks t
        LEFT JOIN sequence_steps s ON s.id = t.step_id
        WHERE t.status = 'pending' AND t.enrollment_id = ANY(${ids}::uuid[])
        GROUP BY t.enrollment_id
      )
      UPDATE sequence_tasks t
      SET due_date = ${anchor}::date + GREATEST(COALESCE(s.day_offset, 1) - f.first_off, 0)
      FROM f, sequence_steps s
      WHERE t.enrollment_id = f.enrollment_id
        AND s.id = t.step_id
        AND t.status = 'pending'
    `;
    // step_id'si olmayan (nadir) görevler → doğrudan anchor
    await sql`
      UPDATE sequence_tasks
      SET due_date = ${anchor}::date
      WHERE status = 'pending' AND step_id IS NULL
        AND enrollment_id = ANY(${ids}::uuid[])
    `;
    console.log(`  ✅ Dalga ${w + 1}: ${ids.length} müşteri → ${anchor}`);
  }

  // Dağılımı doğrula
  const dist = await sql`
    SELECT due_date, COUNT(*)::int AS n,
           COUNT(DISTINCT customer_id)::int AS musteriler
    FROM sequence_tasks WHERE status = 'pending'
    GROUP BY due_date ORDER BY due_date LIMIT 15
  `;
  console.log('\n📅 Yeni dağılım (ilk 15 gün):');
  dist.forEach(d => console.log(`  ${String(d.due_date).slice(0, 10)}: ${d.musteriler} müşteri / ${d.n} görev`));
  console.log('🎉 Tamamlandı.');
  process.exit(0);
})();
