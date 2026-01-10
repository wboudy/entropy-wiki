# Staging

Triage area for ingested content that doesn't fit existing wiki sections.

## Purpose

When `/wiki-ingest` processes a URL or text and can't classify it into an existing section (tooling-mcp, orchestration, skills-bank, etc.), it lands here for manual review and organization.

## Workflow

1. **Content arrives here** - Auto-ingested but unclassified
2. **Review** - Determine if it belongs in an existing section or needs a new one
3. **Move or keep** - Relocate to appropriate section or keep as standalone reference

## Frontmatter

Staged entries include metadata for triage:

```yaml
---
title: Entry Title
source: https://original-url.com
ingested: true
date: 2024-01-15
tags: [auto-generated, tags]
needs_review: true
---
```

## When to Create New Sections

If multiple staged entries share a theme not covered by existing sections, consider:

1. Creating a new wiki section
2. Expanding an existing section's scope
3. Keeping as curated external references

## Cleanup

Periodically review staged content:
- Move categorizable entries to proper sections
- Archive or remove stale content
- Identify patterns that suggest new section needs
