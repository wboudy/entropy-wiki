import 'dotenv/config';
import pg from 'pg';

async function checkColumns() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const result = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'pages' ORDER BY ordinal_position"
    );
    console.log('Columns in pages table:');
    result.rows.forEach(r => console.log('  -', r.column_name));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkColumns();
