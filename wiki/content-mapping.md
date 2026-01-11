---
title: Content Mapping
description: Mapping of docs/ files to wiki/ destinations
---

# Content Mapping: docs/ to wiki/

This document maps all files in `/docs/` to their target destinations in `/wiki/`.

## Summary

- **Total files in docs/**: 35
- **Files to migrate**: 35
- **Target sections**: 7 (context, orchestration, plugins, skills-bank, tooling-mcp, beads, gastown)

## Mapping by Source Directory

### /docs/agent-knowledge-base/

| Source | Target | Status |
|--------|--------|--------|
| INDEX.md | wiki/home.md (merged) | Overlap |
| claude-code-essentials.md | wiki/getting-started.md | Novel |

### /docs/agent-knowledge-base/context/

| Source | Target | Status |
|--------|--------|--------|
| agentsmd-spec.md | wiki/context/agents-md-spec.md | Novel |
| anthropic-context-engineering.md | wiki/context/context-engineering.md | Novel |
| github-par.md | wiki/context/parallel-agents.md | Novel |
| google-adk.md | wiki/context/google-adk.md | Novel |
| humanlayer-claude-md.md | wiki/context/claude-md-patterns.md | Novel |

### /docs/agent-knowledge-base/coordination/

| Source | Target | Status |
|--------|--------|--------|
| github-mcp-agent-mail.md | wiki/tooling-mcp/agent-mail.md | Novel |
| github-mcp-inspector.md | wiki/tooling-mcp/mcp-inspector.md | Novel |

### /docs/agent-knowledge-base/loops/

| Source | Target | Status |
|--------|--------|--------|
| anthropic-ralph-plugin.md | wiki/orchestration/ralph-plugin.md | Novel |
| ghuntley-ralph.md | wiki/orchestration/ghuntley-ralph.md | Novel |
| github-ralph-claude.md | wiki/orchestration/ralph-claude.md | Novel |
| github-repomirror.md | wiki/orchestration/repo-mirror.md | Novel |

### /docs/agent-knowledge-base/memory-state/

| Source | Target | Status |
|--------|--------|--------|
| github-beads-viewer.md | wiki/beads/viewer.md | Novel |
| github-beads.md | wiki/beads/ (merge with existing) | Overlap |
| steve-yegge-beads.md | wiki/beads/philosophy.md | Novel |
| steve-yegge-gastown.md | wiki/gastown/philosophy.md | Novel |

### /docs/agent-knowledge-base/mobile/

| Source | Target | Status |
|--------|--------|--------|
| petesena-iphone-setup.md | wiki/lab/mobile-iphone.md | Novel |
| sameerhalai-tailscale.md | wiki/lab/mobile-tailscale.md | Novel |

### /docs/references/ClaudeDocs/

| Source | Target | Status |
|--------|--------|--------|
| Hooks-how-to.md | wiki/plugins/hooks-howto.md | Novel |
| Hooks.md | wiki/plugins/hooks.md | Novel |
| MCP.md | wiki/tooling-mcp/claude-mcp.md | Overlap (enhance) |
| Memory-management.md | wiki/context/memory-management.md | Novel |
| Plugin-reference.md | wiki/plugins/reference.md | Novel |
| Plugin.md | wiki/plugins/overview.md | Overlap (enhance) |
| Settings.md | wiki/plugins/settings.md | Novel |
| Skills-Overview.md | wiki/skills-bank/overview.md | Overlap (enhance) |
| Skills-best-practices.md | wiki/skills-bank/best-practices.md | Novel |
| subagents.md | wiki/orchestration/subagents.md | Novel |

### /docs/references/CodexDocs/

| Source | Target | Status |
|--------|--------|--------|
| MCP.md | wiki/tooling-mcp/codex-mcp.md | Novel |
| Memory-management.md | wiki/context/codex-memory.md | Novel |
| Rules.md | wiki/plugins/codex-rules.md | Novel |
| Skills-Overview.md | wiki/skills-bank/codex-skills.md | Novel |
| Skills-how-to.md | wiki/skills-bank/codex-howto.md | Novel |

### /docs/ (root)

| Source | Target | Status |
|--------|--------|--------|
| DEPLOYMENT-TROUBLESHOOTING.md | wiki/lab/deployment-troubleshooting.md | Novel |

## Content Analysis

### Overlaps (need merging)
- `INDEX.md` + `wiki/home.md` - Merge home content
- `github-beads.md` + `wiki/beads/` - Enhance existing beads docs
- `MCP.md` (ClaudeDocs) + `wiki/tooling-mcp/` - Enhance MCP docs
- `Plugin.md` + `wiki/plugins/` - Enhance plugins overview
- `Skills-Overview.md` + `wiki/skills-bank/` - Enhance skills overview

### Novel Content (new additions)
- 30 files are entirely new content
- Mobile setup guides (iPhone, Tailscale)
- Claude Code settings and hooks documentation
- Codex-specific documentation
- Philosophy articles (Steve Yegge)
- Context engineering patterns

## Migration Priority

1. **P1**: ClaudeDocs reference material (Skills, MCP, Plugins)
2. **P2**: Agent knowledge base context files
3. **P2**: Loops and orchestration content
4. **P3**: Mobile setup guides
5. **P3**: Codex documentation
