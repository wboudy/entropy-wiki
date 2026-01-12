import 'dotenv/config';
import pg from 'pg';

async function verifySchema() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('Connecting to:', dbUrl?.replace(/:[^:@]+@/, ':****@'));

  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    // Get full column info
    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pages'
      ORDER BY ordinal_position
    `);

    console.log('\n=== pages table schema ===');
    for (const row of result.rows) {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    }

    // Check for visibility column (from 004_simplify_visibility)
    const hasVisibility = result.rows.some(r => r.column_name === 'visibility');
    console.log('\nvisibility column exists:', hasVisibility);

    // Try the query that's failing
    console.log('\n=== Testing problematic query ===');
    try {
      const testResult = await pool.query(`
        SELECT p.id, p.slug, p.title, p.status,
               p.current_published_revision_id, p.current_draft_revision_id,
               p.created_at, p.updated_at,
               p.parent_id, p.sort_order
        FROM pages p
        WHERE p.status = 'published'
        LIMIT 1
      `);
      console.log('Query succeeded! Found', testResult.rows.length, 'rows');
      if (testResult.rows[0]) {
        console.log('Sample row:', JSON.stringify(testResult.rows[0], null, 2));
      }
    } catch (err: any) {
      console.error('Query failed:', err.message);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

verifySchema();
