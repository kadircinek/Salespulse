-- SalesPulse Database Schema
-- Vercel Dashboard > Storage > Postgres > Query Editor'de çalıştır

-- Kullanıcılar
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT DEFAULT 'sales_rep',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Müşteriler
CREATE TABLE IF NOT EXISTS customers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name   TEXT UNIQUE NOT NULL,
  contact_name   TEXT DEFAULT '',
  phone          TEXT DEFAULT '',
  email          TEXT DEFAULT '',
  sector         TEXT DEFAULT '',
  city           TEXT DEFAULT '',
  status         TEXT DEFAULT 'new',  -- new, to_call, contacted, interested, offer_sent, negotiating, sold, lost
  notes          TEXT DEFAULT '',
  fit_score      INT,
  confidence     INT,
  linkedin_url   TEXT DEFAULT '',
  title          TEXT DEFAULT '',
  last_contacted TIMESTAMPTZ,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- İlk kullanıcıyı ekle (şifreyi kendin belirle — bcrypt hash)
-- Geçici şifre: salespulse123
-- Aşağıdaki hash'i kendi şifrene göre güncelle:
-- import bcryptjs; bcryptjs.hashSync('SENIN_SIFREN', 10)
INSERT INTO users (email, password_hash, name, role)
VALUES ('kadir.cinek@gmail.com', '$2a$10$placeholder_replace_me', 'Kadir Çinek', 'admin')
ON CONFLICT (email) DO NOTHING;
