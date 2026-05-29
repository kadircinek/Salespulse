-- SalesPulse Sequence (Cadence) Sistemi — Migration
-- Neon Query Editor'de veya `node api/migrate-sequences.js` ile çalıştır

-- ── Sequence şablonları ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sequences (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  status      TEXT DEFAULT 'active',   -- active, paused, archived
  skip_weekends BOOLEAN DEFAULT TRUE,  -- hafta sonu görevlerini pazartesiye kaydır
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Sequence adımları ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sequence_steps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  step_order  INT NOT NULL,            -- 1, 2, 3...
  day_offset  INT NOT NULL DEFAULT 1,  -- Gün 1 = kayıt günü, Gün 3 = +2 gün
  step_type   TEXT NOT NULL,           -- call, email, linkedin_connect, linkedin_message, whatsapp
  subject     TEXT DEFAULT '',         -- e-posta konusu (sadece email tipinde)
  body        TEXT DEFAULT '',         -- şablon metni / not
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seq_steps_sequence ON sequence_steps(sequence_id);

-- ── Kayıtlar: müşteri ↔ sequence ─────────────────────────────────
CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id  UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  customer_id  UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status       TEXT DEFAULT 'active',  -- active, completed, paused, stopped
  stop_reason  TEXT DEFAULT '',        -- 'sold', 'lost', 'manual' vb.
  enrolled_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  enrolled_at  TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (sequence_id, customer_id)     -- aynı müşteri aynı sequence'e 2 kez eklenemez
);
CREATE INDEX IF NOT EXISTS idx_seq_enroll_customer ON sequence_enrollments(customer_id);
CREATE INDEX IF NOT EXISTS idx_seq_enroll_sequence ON sequence_enrollments(sequence_id);

-- ── Üretilen görevler ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sequence_tasks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id    UUID NOT NULL REFERENCES sequence_enrollments(id) ON DELETE CASCADE,
  step_id          UUID REFERENCES sequence_steps(id) ON DELETE SET NULL,
  customer_id      UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  step_type        TEXT NOT NULL,
  subject          TEXT DEFAULT '',
  body             TEXT DEFAULT '',
  due_date         DATE NOT NULL,
  status           TEXT DEFAULT 'pending',  -- pending, done, skipped
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seq_tasks_due    ON sequence_tasks(due_date, status);
CREATE INDEX IF NOT EXISTS idx_seq_tasks_user   ON sequence_tasks(assigned_user_id, status);
CREATE INDEX IF NOT EXISTS idx_seq_tasks_enroll ON sequence_tasks(enrollment_id);
