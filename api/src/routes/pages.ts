import { Router, Request, Response } from 'express';
import { query } from '../db/client.js';
import { Page, PageWithContent } from '../types.js';

const router = Router();

// Helper to add inherited_visibility to page response
function addInheritedVisibility<T extends Page>(page: T): T & { inherited_visibility: boolean } {
  return {
    ...page,
    inherited_visibility: page.effective_visibility !== page.visibility
  };
}

// GET /pages - List all published public pages (using effective_visibility)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query<Page>(`
      SELECT id, slug, title, status, visibility,
             current_published_revision_id, current_draft_revision_id,
             created_at, updated_at,
             parent_id, sort_order, effective_visibility
      FROM pages
      WHERE status = 'published' AND effective_visibility = 'public'
      ORDER BY title ASC
    `);

    res.json({ pages: result.rows.map(addInheritedVisibility) });
  } catch (err) {
    console.error('Error fetching pages:', err);
    res.status(500).json({ error: 'database_error', message: 'Failed to fetch pages' });
  }
});

// GET /pages/:slug - Get a single published public page with content (using effective_visibility)
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const result = await query<PageWithContent>(`
      SELECT p.id, p.slug, p.title, p.status, p.visibility,
             p.current_published_revision_id, p.current_draft_revision_id,
             p.created_at, p.updated_at,
             p.parent_id, p.sort_order, p.effective_visibility,
             pr.content_md
      FROM pages p
      LEFT JOIN page_revisions pr ON p.current_published_revision_id = pr.id
      WHERE p.slug = $1 AND p.status = 'published' AND p.effective_visibility = 'public'
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'not_found', message: 'Page not found' });
    }

    res.json({ page: addInheritedVisibility(result.rows[0]) });
  } catch (err) {
    console.error('Error fetching page:', err);
    res.status(500).json({ error: 'database_error', message: 'Failed to fetch page' });
  }
});

export { router as pagesRouter };
