---
name: reference-context
description: Ensures Claude checks relevant reference documentation before starting work. Use when you need context about Claude Code features, MCP servers, Skills, Hooks, project patterns, or domain knowledge from ClaudeDocs, CodexDocs, or references directories.
---

# Reference Context

Check relevant reference documentation before starting work to ensure you have accurate, up-to-date context.

## When to Use

Activate when you need context about:
- **Claude Code features**: Skills, Hooks, MCP, Subagents, Settings
- **API usage**: Anthropic API, Claude SDK patterns
- **Project patterns**: CodexDocs for project-specific conventions
- **Domain knowledge**: References directory for specialized topics
- **Framework specifics**: Next.js, React, TypeScript patterns
- **Best practices**: Authoring guides, development workflows

## Available Reference Sources

### ClaudeDocs/ - Claude Code Documentation

Official documentation for Claude Code features:
- `Skills-Overview.md` - Skills architecture, creation, usage
- `Skills-best-practices.md` - Authoring effective skills
- `Hooks.md` & `Hooks-how-to.md` - Event-driven automation
- `MCP.md` - Model Context Protocol integration
- `Plugin.md` & `Plugin-reference.md` - Plugin system
- `Settings.md` - Configuration options
- `subagents.md` - Subagent patterns
- `Memory-management.md` - Context and conversation management

### CodexDocs/ - Project-Specific Patterns

Project-specific conventions and patterns:
- Architecture decisions
- Code organization
- Team conventions
- Development workflows

### references/ - Domain Knowledge

Specialized domain knowledge:
- Technical specifications
- API documentation
- Research papers
- Industry standards

## Workflow

### 1. Identify What Context You Need

Before starting work, ask:
- **Am I using a Claude Code feature?** → Check ClaudeDocs/
- **Does this project have conventions?** → Check CodexDocs/
- **Do I need specialized knowledge?** → Check references/
- **Am I implementing an integration?** → Check relevant API docs

### 2. Search for Relevant Documentation

Use progressive disclosure - start broad, then get specific:

**Step 1: Find relevant files**
```bash
# List available references
ls ClaudeDocs/
ls CodexDocs/
ls references/
```

**Step 2: Use Glob to find specific topics**
```bash
# Example: Find Skills documentation
glob "ClaudeDocs/*Skills*"

# Example: Find MCP references
glob "**/*mcp*.md"
```

**Step 3: Read the relevant file**
```bash
# Read the specific documentation
Read ClaudeDocs/Skills-Overview.md
```

### 3. Extract What You Need

Don't read entire files - use progressive disclosure:

**For overview**: Read the first 100 lines
**For specific section**: Search for section heading
**For examples**: Jump to examples section

Use `offset` and `limit` parameters in Read tool for large files.

### 4. Apply Context to Your Work

After reading references:
- Follow patterns shown in documentation
- Use correct API signatures
- Apply best practices
- Avoid deprecated patterns

## Integration with Ralph Wiggum Loops

References should inform each iteration:

1. **Before starting**: Check references for approach
2. **During implementation**: Refer back to examples
3. **During validation**: Verify against best practices
4. **After completion**: Ensure compliance with standards

## Reference Checking Patterns

### Pattern 1: Feature Implementation

When implementing a Claude Code feature:

```markdown
1. Check if feature exists in ClaudeDocs/
2. Read overview to understand architecture
3. Read best practices guide
4. Review examples
5. Implement following patterns shown
```

**Example: Creating a Skill**
```bash
# 1. Read Skills overview
Read ClaudeDocs/Skills-Overview.md

# 2. Read best practices
Read ClaudeDocs/Skills-best-practices.md

# 3. Look at example skill
Read .claude/skills/mcp-builder/SKILL.md

# 4. Implement your skill following patterns
```

### Pattern 2: Project Conventions

When working on project code:

```markdown
1. Check CodexDocs/ for conventions
2. Look at existing code patterns
3. Follow established structure
4. Maintain consistency
```

**Example: Adding a Component**
```bash
# 1. Check for component guidelines
glob "CodexDocs/*component*"

# 2. Look at existing components
glob "src/components/*.tsx"

# 3. Follow existing patterns
```

### Pattern 3: Domain Research

When you need specialized knowledge:

```markdown
1. Check references/ for relevant docs
2. Search for specific topics
3. Extract key information
4. Apply to your implementation
```

**Example: Implementing OAuth**
```bash
# 1. Find OAuth references
glob "references/*oauth*"

# 2. Read specification
Read references/oauth-spec.md

# 3. Implement following spec
```

## Best Practices

### Progressive Disclosure

Don't load entire files upfront:

❌ **Bad**: Read all 1000 lines of documentation
✅ **Good**: Read overview, then specific sections as needed

### Combine References

Cross-reference multiple sources:
- ClaudeDocs for Claude features
- Official docs for frameworks
- CodexDocs for project patterns

### Stay Current

References may update:
- Check file modification dates
- Look for "deprecated" warnings
- Verify examples still work

### Extract, Don't Copy

Use references as guides, not templates:
- Understand the pattern
- Adapt to your use case
- Don't blindly copy code

## Common Reference Scenarios

### Scenario: Creating a Skill

**References needed:**
1. `ClaudeDocs/Skills-Overview.md` - Architecture and structure
2. `ClaudeDocs/Skills-best-practices.md` - Authoring guidelines
3. `.claude/skills/*/SKILL.md` - Example skills

**Process:**
1. Read overview to understand YAML frontmatter requirements
2. Read best practices for description patterns
3. Look at examples for structure
4. Create skill following patterns

### Scenario: Setting Up MCP Server

**References needed:**
1. `ClaudeDocs/MCP.md` - MCP integration guide
2. `.claude/skills/mcp-builder/SKILL.md` - MCP server builder skill
3. Official MCP docs (web search)

**Process:**
1. Read MCP.md for integration patterns
2. Use mcp-builder skill for implementation
3. Reference official docs for specifics

### Scenario: Configuring Hooks

**References needed:**
1. `ClaudeDocs/Hooks.md` - Hook concepts
2. `ClaudeDocs/Hooks-how-to.md` - Implementation guide
3. `.claude/hooks.json` - Existing hooks (if any)

**Process:**
1. Read Hooks.md for event types
2. Read Hooks-how-to.md for configuration
3. Check existing hooks for patterns
4. Configure new hook

## Anti-Patterns

❌ Implementing features without checking documentation
❌ Assuming you know the API without verifying
❌ Loading entire reference files into context
❌ Ignoring project-specific conventions in CodexDocs
❌ Using outdated patterns from memory
❌ Skipping examples in documentation

## Quick Reference Guide

**Before implementing anything:**

```markdown
1. Is it a Claude feature? → ClaudeDocs/
2. Is it project-specific? → CodexDocs/
3. Is it specialized domain? → references/
4. Is it external API? → Web search + official docs
```

**Finding documentation:**

```bash
# List what's available
ls ClaudeDocs/
ls CodexDocs/
ls references/

# Find specific topics
glob "**/*{topic}*.md"

# Read relevant file
Read {path}
```

**Using documentation:**

1. Read overview/intro first
2. Find relevant section
3. Extract key information
4. Apply to your work
5. Verify with examples
