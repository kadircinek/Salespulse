-- Ürünler + Müşteri Ürün Kullanımı — Migration
-- node api/migrate-products.js ile çalıştır

-- Ürün kataloğu (stok)
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_group TEXT DEFAULT '',          -- PA6, PP, ABS, POM, PC/ABS...
  name          TEXT UNIQUE NOT NULL,     -- ürün ismi
  stock_qty     NUMERIC DEFAULT 0,        -- stok (kg)
  cost          NUMERIC,                  -- en son maliyet
  unit          TEXT DEFAULT 'kg',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_group ON products(product_group);

-- Müşteri ürün kullanımı (her görüşmede güncellenir → en güncel kayıt "en son")
CREATE TABLE IF NOT EXISTS customer_products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,             -- anlık kopya (ürün silinse de kalır)
  quantity_kg  NUMERIC,                   -- aylık/dönemsel kullanım (kg)
  note         TEXT DEFAULT '',
  updated_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_custprod_customer ON customer_products(customer_id);
