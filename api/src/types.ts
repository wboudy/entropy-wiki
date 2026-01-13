// Shared types for the Entropy Wiki API

export interface Page {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  current_published_revision_id: string | null;
  current_draft_revision_id: string | null;
  created_at: string;
  updated_at: string;
  // Hierarchy fields
  parent_id: string | null;
  sort_order: number;
}

export interface PageRevision {
  id: string;
  page_id: string;
  content_md: string;
  author_type: 'human' | 'ai';
  created_at: string;
}

export interface PageWithContent extends Page {
  content_md: string;
}

// API request/response types
export interface CreatePageRequest {
  slug: string;
  title: string;
  content_md: string;
  status?: 'draft' | 'published';
}

export interface UpdatePageRequest {
  title?: string;
  content_md?: string;
  status?: 'draft' | 'published';
}

export interface ApiError {
  error: string;
  message: string;
}

// Hierarchy types
export interface PageTreeNode extends Page {
  children: PageTreeNode[];
  depth: number;
  inherited_visibility: boolean; // Deprecated, kept for API compat
}

// ============================================================================
// Ingest System Types
// ============================================================================

// Content types that can be ingested
export type ContentType = 'article' | 'github_repo' | 'github_issue' | 'twitter' | 'raw_text';

// Source types for ingest items
export type SourceType = 'url' | 'text' | 'file' | 'api';

// Job status
export type IngestJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Item status
export type IngestItemStatus = 'pending' | 'extracting' | 'routing' | 'integrating' | 'completed' | 'failed' | 'skipped';

// Job mode
export type IngestJobMode = 'manual' | 'scheduled' | 'api';

// Routing decision types
export type RoutingDecisionType = 'new_page' | 'update_page' | 'append_section' | 'merge' | 'skip';

// Ingest job record
export interface IngestJob {
  id: string;
  status: IngestJobStatus;
  mode: IngestJobMode;
  total_items: number;
  processed_items: number;
  failed_items: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
}

// Extracted content from AI processing
export interface ExtractedContent {
  title: string | null;
  summary: string | null;
  content: string | null;
  topics: string[];
  entities: Record<string, unknown> | null;
  confidence: number | null;
}

// Routing decision from AI processing
export interface RoutingDecision {
  decision: RoutingDecisionType;
  target_page_id: string | null;
  target_section: string | null;
  reasoning: string | null;
  confidence: number | null;
}

// Ingest item record
export interface IngestItem {
  id: string;
  job_id: string;
  source_type: SourceType;
  source_url: string | null;
  source_content: string | null;
  status: IngestItemStatus;
  // Extraction results
  extracted_title: string | null;
  extracted_summary: string | null;
  extracted_content: string | null;
  extracted_topics: string[] | null;
  extracted_entities: Record<string, unknown> | null;
  extraction_confidence: number | null;
  // Routing decision
  routing_decision: RoutingDecisionType | null;
  target_page_id: string | null;
  target_section: string | null;
  routing_reasoning: string | null;
  routing_confidence: number | null;
  // Timestamps and errors
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
}

// Page embedding record
export interface PageEmbedding {
  id: string;
  page_id: string;
  revision_id: string;
  embedding: number[]; // Vector as array
  chunk_index: number;
  chunk_text: string | null;
  created_at: string;
}

// API request types for ingest endpoints
export interface IngestRequest {
  items: IngestItemInput[];
  mode?: IngestJobMode;
  metadata?: Record<string, unknown>;
}

export interface IngestItemInput {
  source_type: SourceType;
  url?: string;
  content?: string;
  content_type?: ContentType;
  metadata?: Record<string, unknown>;
}

// API response types for ingest endpoints
export interface IngestResponse {
  job: IngestJob;
  message: string;
}

export interface IngestJobResponse {
  job: IngestJob;
  items?: IngestItem[];
}

export interface IngestItemResponse {
  item: IngestItem;
}

// Similarity search types
export interface SimilaritySearchRequest {
  query: string;
  limit?: number;
  threshold?: number;
}

export interface SimilaritySearchResult {
  page_id: string;
  page_title: string;
  page_slug: string;
  chunk_text: string | null;
  similarity: number;
}

export interface SimilaritySearchResponse {
  results: SimilaritySearchResult[];
  query: string;
}
