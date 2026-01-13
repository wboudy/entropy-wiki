#!/usr/bin/env npx tsx
/**
 * Backfill embeddings for all existing published pages
 *
 * Usage: npx tsx scripts/backfill-embeddings.ts
 *
 * Environment variables:
 * - DATABASE_URL: PostgreSQL connection string
 * - OPENAI_API_KEY: OpenAI API key for generating embeddings
 *
 * Rate limiting:
 * - Processes pages sequentially to avoid overwhelming the API
 * - Add delay between pages if needed (uncomment the sleep line)
 */

import 'dotenv/config';
import { backfillEmbeddings } from '../src/services/embeddings.js';
import { closePool } from '../src/db/client.js';

async function main() {
  console.log('Starting embedding backfill...');
  console.log('');

  // Check for required env vars
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  try {
    const stats = await backfillEmbeddings();

    console.log('');
    console.log('=== Backfill Complete ===');
    console.log(`Processed: ${stats.processed}`);
    console.log(`Failed: ${stats.failed}`);

    if (stats.errors.length > 0) {
      console.log('');
      console.log('Errors:');
      for (const error of stats.errors) {
        console.log(`  - Page ${error.pageId}: ${error.error}`);
      }
    }
  } catch (error: any) {
    console.error('Backfill failed:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
