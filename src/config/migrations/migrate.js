const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../index');

const MIGRATIONS_DIR = __dirname;

async function runMigrations() {
  if (!config.supabase.directUrl) {
    console.error(
      'Error: SUPABASE_DIRECT_URL not set in .env.\n' +
      'Get it from: Supabase Dashboard → Project Settings → Database → Connection string\n' +
      'Format: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres'
    );
    process.exit(1);
  }

  const pool = new Pool({ connectionString: config.supabase.directUrl });

  try {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql') && !f.startsWith('rollback'))
      .sort();

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
      console.log(`  ✓ ${file} applied`);
    }

    console.log('\nAll migrations applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
