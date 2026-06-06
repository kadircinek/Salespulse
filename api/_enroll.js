// Paylaşılan enroll yardımcısı — hem /api/sequence-enrollments hem otomatik kayıt kullanır
// Müşteriyi sequence'e kaydeder + tüm adımlar için tarihli görev üretir.

// Vade tarihi: Gün 1 = bugün. Hafta sonu ise pazartesiye kaydır.
function computeDueDate(startDate, dayOffset, skipWeekends) {
  const d = new Date(startDate);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + (Math.max(1, dayOffset) - 1));
  if (skipWeekends) {
    const dow = d.getDay();
    if (dow === 6) d.setDate(d.getDate() + 2);
    else if (dow === 0) d.setDate(d.getDate() + 1);
  }
  return d.toISOString().slice(0, 10);
}

// Otomatik kayıt için varsayılan sequence: aktif + adımı olan en eski sequence
async function getDefaultSequenceId(sql) {
  const rows = await sql`
    SELECT s.id
    FROM sequences s
    WHERE s.status = 'active'
      AND EXISTS (SELECT 1 FROM sequence_steps st WHERE st.sequence_id = s.id)
    ORDER BY s.created_at ASC
    LIMIT 1
  `;
  return rows[0]?.id || null;
}

// Bir veya daha fazla müşteriyi sequence'e kaydet + görev üret.
// Zaten kayıtlı / sold / lost olanları atlar. { enrolled, skipped, tasks_created } döner.
async function enrollCustomers(sql, sequenceId, customerIds, userId) {
  const ids = Array.isArray(customerIds) ? customerIds : [customerIds];
  if (!sequenceId || !ids.length) return { enrolled: 0, skipped: 0, tasks_created: 0 };

  const seqRows = await sql`SELECT * FROM sequences WHERE id = ${sequenceId} LIMIT 1`;
  const seq = seqRows[0];
  if (!seq) return { enrolled: 0, skipped: 0, tasks_created: 0, error: 'Sequence bulunamadı' };

  const steps = await sql`
    SELECT * FROM sequence_steps WHERE sequence_id = ${sequenceId} ORDER BY step_order ASC
  `;
  if (!steps.length) return { enrolled: 0, skipped: 0, tasks_created: 0, error: 'Adım yok' };

  let enrolled = 0, skipped = 0, tasksCreated = 0;
  const today = new Date();

  for (const customerId of ids) {
    const existing = await sql`
      SELECT id FROM sequence_enrollments
      WHERE sequence_id = ${sequenceId} AND customer_id = ${customerId} LIMIT 1
    `;
    if (existing[0]) { skipped++; continue; }

    const cust = await sql`SELECT status, assigned_user_id FROM customers WHERE id = ${customerId} LIMIT 1`;
    if (!cust[0]) { skipped++; continue; }
    if (cust[0].status === 'sold' || cust[0].status === 'lost') { skipped++; continue; }

    const enr = await sql`
      INSERT INTO sequence_enrollments (sequence_id, customer_id, status, enrolled_by)
      VALUES (${sequenceId}, ${customerId}, 'active', ${userId})
      RETURNING *
    `;
    const enrollment = enr[0];
    enrolled++;

    const assignTo = cust[0].assigned_user_id || userId;
    for (const st of steps) {
      const due = computeDueDate(today, st.day_offset, seq.skip_weekends);
      await sql`
        INSERT INTO sequence_tasks
          (enrollment_id, step_id, customer_id, assigned_user_id, step_type, subject, body, due_date, status)
        VALUES
          (${enrollment.id}, ${st.id}, ${customerId}, ${assignTo}, ${st.step_type},
           ${st.subject || ''}, ${st.body || ''}, ${due}, 'pending')
      `;
      tasksCreated++;
    }
  }
  return { enrolled, skipped, tasks_created: tasksCreated };
}

// Müşteriyi varsayılan sequence'e otomatik kaydet (cold ise). Hata olsa da müşteri eklemeyi bozmaz.
async function autoEnroll(sql, customerId, userId) {
  try {
    const seqId = await getDefaultSequenceId(sql);
    if (!seqId) return;
    await enrollCustomers(sql, seqId, [customerId], userId);
  } catch (e) { /* sessiz geç — otomatik kayıt müşteri eklemeyi engellemesin */ }
}

module.exports = { enrollCustomers, getDefaultSequenceId, autoEnroll, computeDueDate };
