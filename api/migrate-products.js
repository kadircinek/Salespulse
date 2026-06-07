// Tek seferlik migration — products + customer_products tablolarını oluşturur
// node api/migrate-products.js
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

(async () => {
  loadEnv();
  if (!process.env.DATABASE_URL) { console.error('❌ DATABASE_URL yok'); process.exit(1); }
  const sql = neon(process.env.DATABASE_URL);
  const raw = (s) => { const a = [s]; a.raw = [s]; return a; };
  const ddl = fs.readFileSync(path.join(__dirname, 'schema-products.sql'), 'utf8');
  const statements = ddl.split(';')
    .map(s => s.split('\n').filter(l => !l.trim().startsWith('--')).join('\n').trim())
    .filter(Boolean);
  console.log(`⏳ ${statements.length} ifade...`);
  for (const stmt of statements) {
    const label = stmt.slice(0, 55).replace(/\s+/g, ' ');
    try { await sql(raw(stmt)); console.log(`  ✅ ${label}...`); }
    catch (e) { console.error(`  ❌ ${label}... → ${e.message}`); }
  }
  console.log('🎉 Tamamlandı.');
  process.exit(0);
})();
