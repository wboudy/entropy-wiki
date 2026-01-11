---
title: Skill Best Practices
description: How to write effective Skills that Claude can discover and use
---

# Skill Authoring Best Practices

Learn how to write effective Skills that Claude can discover and use successfully.

## Core Principles

### Concise is Key

The context window is a public good. Your Skill shares the context window with:
- The system prompt
- Conversation history
- Other Skills' metadata
- Your actual request

**Default assumption**: Claude is already very smart. Only add context Claude doesn't already have.

Challenge each piece of information:
- "Does Claude really need this explanation?"
- "Can I assume Claude knows this?"
- "Does this paragraph justify its token cost?"

**Good Example (50 tokens)**:
```markdown
## Extract PDF text

Use pdfplumber for text extraction:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
```

**Bad Example (150 tokens)**:
```markdown
## Extract PDF text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing...
```

The concise version assumes Claude knows what PDFs are and how libraries work.

### Set Appropriate Degrees of Freedom

Match specificity to the task's fragility and variability.

**High freedom** (text-based instructions):
- Multiple approaches are valid
- Decisions depend on context
- Heuristics guide the approach

**Medium freedom** (pseudocode with parameters):
- A preferred pattern exists
- Some variation is acceptable
- Configuration affects behavior

**Low freedom** (specific scripts):
- Operations are fragile/error-prone
- Consistency is critical
- A specific sequence must be followed

**Analogy**: Think of Claude as a robot exploring a path:
- **Narrow bridge with cliffs**: Only one safe way forward - provide exact instructions
- **Open field**: Many paths lead to success - give general direction

### Test with All Models

Skills act as additions to models, so effectiveness depends on the underlying model.

- **Claude Haiku** (fast, economical): Does the Skill provide enough guidance?
- **Claude Sonnet** (balanced): Is the Skill clear and efficient?
- **Claude Opus** (powerful reasoning): Does the Skill avoid over-explaining?

What works for Opus might need more detail for Haiku.

## Skill Structure

### YAML Frontmatter Rules

**name**:
- Maximum 64 characters
- Only lowercase letters, numbers, and hyphens
- Cannot contain reserved words: "anthropic", "claude"

**description**:
- Must be non-empty
- Maximum 1024 characters
- Should describe what the Skill does and when to use it

### Progressive Disclosure

Keep `SKILL.md` under 500 lines. Put detailed reference material in separate files that Claude reads only when needed.

```
my-skill/
├── SKILL.md           (required - overview)
├── reference.md       (loaded when needed)
├── examples.md        (loaded when needed)
└── scripts/
    └── helper.py      (executed, not loaded)
```

## Reference

[Claude Code: Skill Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
