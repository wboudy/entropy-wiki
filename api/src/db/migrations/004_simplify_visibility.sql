-- Migration 004: Simplify visibility model
-- Merge private/unpublished into single concept: status (draft/published)
-- Remove visibility and effective_visibility columns

-- Drop the triggers first (they reference the columns we're removing)
DROP TRIGGER IF EXISTS trigger_pages_effective_visibility_before ON pages;
DROP TRIGGER IF EXISTS trigger_pages_effective_visibility_after ON pages;

-- Drop the trigger functions
DROP FUNCTION IF EXISTS trigger_before_update_effective_visibility();
DROP FUNCTION IF EXISTS trigger_after_cascade_effective_visibility();
DROP FUNCTION IF EXISTS update_effective_visibility_cascade(UUID);
DROP FUNCTION IF EXISTS calculate_effective_visibility(UUID);

-- Drop the indexes on columns we're removing
DROP INDEX IF EXISTS idx_pages_visibility;
DROP INDEX IF EXISTS idx_pages_status_visibility;
DROP INDEX IF EXISTS idx_pages_effective_visibility;

-- Remove the columns
ALTER TABLE pages DROP COLUMN IF EXISTS visibility;
ALTER TABLE pages DROP COLUMN IF EXISTS effective_visibility;

-- Note: We keep parent_id and sort_order for hierarchy/ordering
-- The visibility is now controlled purely by status:
--   published = visible to everyone
--   draft = not visible (work in progress)

-- Record this migration
INSERT INTO _migrations (name) VALUES ('004_simplify_visibility')
ON CONFLICT (name) DO NOTHING;
