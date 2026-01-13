-- Migration 005: Ingest system tables and pgvector
-- Adds tables for content ingestion pipeline and vector embeddings

-- Enable pgvector extension for embedding storage and similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Ingest jobs table: tracks batch ingestion operations
CREATE TABLE IF NOT EXISTS ingest_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  mode VARCHAR(20) DEFAULT 'manual' CHECK (mode IN ('manual', 'scheduled', 'api')),
  total_items INTEGER DEFAULT 0,
  processed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Ingest items table: individual items within a job
CREATE TABLE IF NOT EXISTS ingest_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES ingest_jobs(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('url', 'text', 'file', 'api')),
  source_url TEXT,
  source_content TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'extracting', 'routing', 'integrating', 'completed', 'failed', 'skipped')),
  -- Extraction results (populated after AI extraction)
  extracted_title TEXT,
  extracted_summary TEXT,
  extracted_content TEXT,
  extracted_topics TEXT[],
  extracted_entities JSONB,
  extraction_confidence REAL,
  -- Routing decision (populated after AI routing)
  routing_decision VARCHAR(20) CHECK (routing_decision IN ('new_page', 'update_page', 'append_section', 'merge', 'skip')),
  target_page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  target_section TEXT,
  routing_reasoning TEXT,
  routing_confidence REAL,
  -- Timestamps and errors
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Page embeddings table: vector embeddings for semantic search
CREATE TABLE IF NOT EXISTS page_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES page_revisions(id) ON DELETE CASCADE,
  -- OpenAI text-embedding-3-small produces 1536-dimensional vectors
  embedding vector(1536) NOT NULL,
  -- Metadata for the embedding
  chunk_index INTEGER DEFAULT 0, -- For pages split into chunks
  chunk_text TEXT, -- The text that was embedded
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ingest_jobs queries
CREATE INDEX IF NOT EXISTS idx_ingest_jobs_status ON ingest_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ingest_jobs_created_at ON ingest_jobs(created_at DESC);

-- Indexes for ingest_items queries
CREATE INDEX IF NOT EXISTS idx_ingest_items_job_id ON ingest_items(job_id);
CREATE INDEX IF NOT EXISTS idx_ingest_items_status ON ingest_items(status);
CREATE INDEX IF NOT EXISTS idx_ingest_items_source_type ON ingest_items(source_type);
CREATE INDEX IF NOT EXISTS idx_ingest_items_target_page ON ingest_items(target_page_id);

-- Indexes for page_embeddings queries
CREATE INDEX IF NOT EXISTS idx_page_embeddings_page_id ON page_embeddings(page_id);
CREATE INDEX IF NOT EXISTS idx_page_embeddings_revision_id ON page_embeddings(revision_id);

-- Unique constraint for upsert operations (page + revision + chunk)
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_embeddings_unique
  ON page_embeddings(page_id, revision_id, chunk_index);

-- HNSW index for fast approximate nearest neighbor search on embeddings
-- HNSW provides excellent query performance for similarity search
CREATE INDEX IF NOT EXISTS idx_page_embeddings_hnsw ON page_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Function to auto-update processed_items count on ingest_jobs
CREATE OR REPLACE FUNCTION update_ingest_job_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    -- Update counts when item status changes to completed or failed
    IF NEW.status = 'completed' THEN
      UPDATE ingest_jobs
      SET processed_items = processed_items + 1
      WHERE id = NEW.job_id;
    ELSIF NEW.status = 'failed' THEN
      UPDATE ingest_jobs
      SET processed_items = processed_items + 1,
          failed_items = failed_items + 1
      WHERE id = NEW.job_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update job counts
DROP TRIGGER IF EXISTS trigger_update_ingest_job_counts ON ingest_items;
CREATE TRIGGER trigger_update_ingest_job_counts
  AFTER UPDATE ON ingest_items
  FOR EACH ROW
  EXECUTE FUNCTION update_ingest_job_counts();

-- Record this migration
INSERT INTO _migrations (name) VALUES ('005_ingest_system')
ON CONFLICT (name) DO NOTHING;
