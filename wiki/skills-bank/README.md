---
title: Skills Bank
description: Reusable AI agent capabilities and skill definitions
---

# Skills Bank

A collection of reusable AI agent capabilities and skill definitions.

## What is Skills Bank?

Skills Bank provides modular, plug-and-play capabilities for AI agents. Each skill is a self-contained unit that can be deployed, tested, and reused across different contexts.

## Documentation

### Claude Code Skills

- [Skills Overview](/skills-bank/overview) - Creating and managing Agent Skills in Claude Code
- [Best Practices](/skills-bank/best-practices) - Writing effective Skills that Claude can discover and use
- [Template Skill](/skills-bank/template-skill) - Starter template for creating new skills

## Key Concepts

### What is a Skill?

A Skill is a markdown file that teaches Claude how to do something specific. Skills are **model-invoked** - Claude automatically applies relevant Skills when your request matches their description.

### Where Skills Live

| Location | Path | Applies to |
|----------|------|------------|
| Personal | `~/.claude/skills/` | You, across all projects |
| Project | `.claude/skills/` | Anyone working in this repository |
| Plugin | Bundled with plugins | Anyone with the plugin installed |

### Skills vs Other Options

- **Skills** - Specialized knowledge, Claude chooses when relevant
- **Slash commands** - Reusable prompts you explicitly invoke
- **CLAUDE.md** - Project-wide instructions, always loaded
- **Subagents** - Separate context with own tools
- **MCP servers** - External tools and data sources

## Structure

Skills are organized by capability type and include:
- Skill templates
- Implementation patterns
- Testing strategies
- Integration guides

## Getting Started

Browse the available skills to find capabilities that match your needs. Each skill includes clear documentation on usage, dependencies, and examples.

## Creating a Skill

Every Skill needs a `SKILL.md` file:

```yaml
---
name: my-skill
description: What it does and when to use it
---

## Instructions
Clear guidance for Claude.

## Examples
Concrete usage examples.
```

Keep `SKILL.md` under 500 lines. Use progressive disclosure for detailed reference material.
