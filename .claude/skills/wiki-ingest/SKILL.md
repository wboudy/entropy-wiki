---
name: wiki-ingest
description: Ingests URLs or text to create/enhance wiki entries. Auto-classifies content to appropriate section or stages for triage. Use when you find an interesting article about AI tools, orchestration, MCP, or related topics.
---

# Wiki Ingest

Ingest external content (URLs or text) into the entropy-wiki, automatically classifying and routing to the appropriate section or enhancing existing entries.

## When to Use

Activate when:
- You find an interesting article about AI tools, orchestration, MCP, agents
- You want to capture knowledge from a webpage into the wiki
- You have text content to add to the wiki
- User provides a URL or text and says "add this to the wiki" or similar

## Input Handling

### URL Input
```
/wiki-ingest https://example.com/article-about-mcp
```

1. Detect URL pattern (starts with http:// or https://)
2. Use WebFetch to retrieve and analyze content
3. Extract: title, main content, key concepts, author if available

### Text Input
```
/wiki-ingest "MCP servers allow Claude to connect to external tools via a standardized protocol..."
```

1. Accept text directly as input
2. Analyze for topics and concepts
3. No source URL to attribute

## Workflow

### Step 1: Fetch and Analyze Content

**For URLs:**
```
Use WebFetch with prompt:
"Extract the main content from this page. Identify:
1. Title
2. Main topic/theme
3. Key concepts (3-5)
4. Actionable insights
5. Author and date if available

Return structured summary."
```

**For text:**
Analyze directly to identify topic, concepts, and actionable content.

### Step 2: Classify to Wiki Section

Compare content against section definitions:

| Section | Keywords & Topics |
|---------|------------------|
| `tooling-mcp` | MCP, servers, tools, APIs, integrations, SDKs, protocols |
| `orchestration` | multi-agent, coordination, handoffs, workflows, state management, agent communication |
| `skills-bank` | capabilities, skills, templates, patterns, reusable components |
| `prompt-bank` | prompt engineering, techniques, examples, prompt templates |
| `beads` | issue tracking, git-backed, workflow management, task tracking |
| `gastown` | workspace, GUPP, multi-agent management, session coordination |
| `plugins` | extensions, Claude Code plugins, tool integrations |
| `staging` | **Fallback** - content doesn't fit above categories |

**Classification Logic:**
1. Extract 3-5 key terms from content
2. Match against section keywords
3. If >2 strong matches to a section → classify there
4. If ambiguous or no clear match → classify to `staging`

### Step 3: Search for Similar Entries

Within the target section, search for existing similar content:

```bash
# Search for key terms in target section
Grep pattern="key-term-1" path="wiki/{section}/"
Grep pattern="key-term-2" path="wiki/{section}/"
```

**Similarity Assessment:**
1. Find files mentioning key terms
2. Read top 3 candidates
3. Compare content overlap:
   - **High overlap (>60%)**: Content largely exists → enhance existing
   - **Medium overlap (30-60%)**: Related but distinct → create new, link to related
   - **Low overlap (<30%)**: New topic → create new entry

### Step 4: Decision - Route Content

```
                    ┌─────────────────────────────┐
                    │   Classified to section?    │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┴───────────────────┐
              │ Yes                                   │ No
              ▼                                       ▼
    ┌─────────────────────┐                 ┌─────────────────────┐
    │ Similar entry found?│                 │ Create in staging/  │
    └──────────┬──────────┘                 └─────────────────────┘
               │
    ┌──────────┴──────────┐
    │ Yes                 │ No
    ▼                     ▼
┌───────────────┐   ┌───────────────────────┐
│ Enhance entry │   │ Create new in section │
└───────────────┘   └───────────────────────┘
```

### Step 5: Generate/Transform Content

**Adaptive transformation based on overlap:**

**High overlap (enhancing existing):**
- Extract only genuinely new information
- Add as new subsection or bullet points
- Preserve existing structure
- Add source attribution

**Medium/Low overlap (new entry):**
- Full wiki-style entry
- Dense, operational content
- Follow entropy-wiki standards: short, executable, no fluff

**Content Template:**
```markdown
---
title: {Descriptive title}
description: {One-line summary}
date: {YYYY-MM-DD}
source: {URL if from web}
ingested: true
tags: [{auto-generated, relevant, tags}]
---

# {Title}

{Opening paragraph - what this is and why it matters}

## Key Concepts

{Main content, dense and operational}

## Usage

{How to apply this, code examples if relevant}

## See Also

{Links to related wiki entries}
```

### Step 6: Write to Wiki

**For new entries:**
```bash
Write file to: wiki/{section}/{slug}.md
```

Generate slug from title: lowercase, hyphens, no special chars.

**For enhancements:**
```bash
Edit existing file: wiki/{section}/{existing-file}.md
# Add new content in appropriate location
```

### Step 7: Post-Processing

After writing:
1. Inform user of action taken
2. Remind to run `npm run gen-meta` if new file created
3. Suggest `npm run gen-search` to update search index

## Examples

### Example 1: URL about MCP Servers

**Input:**
```
/wiki-ingest https://simonwillison.net/2024/Dec/19/mcp/
```

**Process:**
1. WebFetch → Extracts content about MCP protocol
2. Classify → `tooling-mcp` (matches: MCP, protocol, tools)
3. Search → Finds `wiki/tooling-mcp/mcp-standard.md`
4. Decision → Medium overlap, create new entry
5. Write → `wiki/tooling-mcp/mcp-overview.md`

**Output:**
```
Created wiki/tooling-mcp/mcp-overview.md
- Classified to: tooling-mcp
- Action: New entry (related to mcp-standard.md)
- Run: npm run gen-meta && npm run gen-search
```

### Example 2: Text about Agent Patterns

**Input:**
```
/wiki-ingest "The supervisor pattern in multi-agent systems involves a central agent that delegates tasks to specialized sub-agents..."
```

**Process:**
1. Analyze → Topics: multi-agent, supervisor, delegation
2. Classify → `orchestration`
3. Search → No similar entries
4. Decision → Create new
5. Write → `wiki/orchestration/supervisor-pattern.md`

### Example 3: Enhancing Existing Entry

**Input:**
```
/wiki-ingest https://blog.example.com/ralph-wiggum-updates
```

**Process:**
1. WebFetch → Content about Ralph Wiggum technique improvements
2. Classify → `plugins` (matches: ralph, loops, iteration)
3. Search → Finds `wiki/plugins/ralph-loop.md` with high overlap
4. Decision → Enhance existing
5. Edit → Add new subsection to ralph-loop.md

**Output:**
```
Enhanced wiki/plugins/ralph-loop.md
- Added section: "Recent Improvements"
- Source: https://blog.example.com/ralph-wiggum-updates
```

## Best Practices

### Content Quality

- **Dense over verbose**: Every line should add value
- **Operational focus**: Can it be used? Can it be copy-pasted?
- **Link related content**: Connect to existing wiki entries
- **Preserve sources**: Always attribute external content

### Classification

- When in doubt, use `staging` - easier to move later than misclassify
- Check existing entries before creating duplicates
- Consider if content expands existing entry vs. warrants new one

### Enhancement vs. New Entry

Enhance when:
- New content directly extends existing topic
- Would be confusing as separate entry
- Adds examples, updates, or clarifications

Create new when:
- Distinct subtopic within same section
- Different perspective or use case
- Enough content for standalone entry

## Anti-Patterns

- Creating duplicate entries for similar topics
- Verbose, fluffy content that doesn't match wiki style
- Missing source attribution for external content
- Classifying to wrong section rather than staging
- Enhancing unrelated entries just because keywords match
- Creating entries without checking existing content first

## Integration

Works with other skills:
- **auto-documentation**: For significant wiki changes
- **reference-context**: Check existing patterns before writing
- **validation-before-close**: Verify wiki builds after changes
