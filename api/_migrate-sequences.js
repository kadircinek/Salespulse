// Tek seferlik migration runner — sequence tablolarını oluşturur
// Çalıştır: node api/migrate-sequences.js
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

// .env.local'i manuel oku (dotenv bağımlılığı olmadan)
function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
      if (m) {
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        if (!process.env[m[1]]) process.env[m[1]] = val;
      }
    }
  } catch (e) { /* yoksa geç */ }
}

(async () => {
  loadEnv();
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL bulunamadı (.env.local kontrol et)');
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);
  const ddl = fs.readFileSync(path.join(__dirname, 'schema-sequences.sql'), 'utf8');

  // İfadeleri ; ile böl, yorum satırlarını temizle
  const statements = ddl
    .split(';')
    .map(s => s.split('\n').filter(l => !l.trim().startsWith('--')).join('\n').trim())
    .filter(Boolean);

  // neon 0.9.5 yalnızca tagged-template olarak çalışır → ham string'i template gibi geçir
  const raw = (str) => { const a = [str]; a.raw = [str]; return a; };

  console.log(`⏳ ${statements.length} ifade çalıştırılıyor...`);
  for (const stmt of statements) {
    const label = stmt.slice(0, 60).replace(/\s+/g, ' ');
    try {
      await sql(raw(stmt));
      console.log(`  ✅ ${label}...`);
    } catch (e) {
      console.error(`  ❌ ${label}... → ${e.message}`);
    }
  }
  console.log('🎉 Migration tamamlandı.');
  process.exit(0);
})();
