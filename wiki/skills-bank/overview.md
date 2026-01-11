---
title: Skills Overview
description: Creating and managing Agent Skills in Claude Code
---

# Agent Skills

Create, manage, and share Skills to extend Claude's capabilities in Claude Code.

## What is a Skill?

A Skill is a markdown file that teaches Claude how to do something specific: reviewing PRs using your team's standards, generating commit messages in your preferred format, or querying your company's database schema. When you ask Claude something that matches a Skill's purpose, Claude automatically applies it.

## How Skills Work

Skills are **model-invoked**: Claude decides which Skills to use based on your request. You don't need to explicitly call a Skill. Claude automatically applies relevant Skills when your request matches their description.

When you send a request, Claude follows these steps:

1. **Discovery**: At startup, Claude loads only the name and description of each available Skill
2. **Activation**: When your request matches a Skill's description, Claude asks to use the Skill
3. **Execution**: Claude follows the Skill's instructions, loading referenced files or running bundled scripts as needed

## Where Skills Live

| Location | Path | Applies to |
|----------|------|------------|
| Enterprise | Managed settings | All users in your organization |
| Personal | `~/.claude/skills/` | You, across all projects |
| Project | `.claude/skills/` | Anyone working in this repository |
| Plugin | Bundled with plugins | Anyone with the plugin installed |

If two Skills have the same name, the higher row wins: managed overrides personal, personal overrides project, and project overrides plugin.

## Skills vs Other Options

| Use this | When you want to... | When it runs |
|----------|---------------------|--------------|
| **Skills** | Give Claude specialized knowledge | Claude chooses when relevant |
| **Slash commands** | Create reusable prompts | You type `/command` |
| **CLAUDE.md** | Set project-wide instructions | Loaded into every conversation |
| **Subagents** | Delegate tasks to separate context | Claude delegates or you invoke |
| **Hooks** | Run scripts on events | Fires on specific tool events |
| **MCP servers** | Connect to external tools/data | Claude calls MCP tools as needed |

## SKILL.md Structure

Every Skill needs a `SKILL.md` file with YAML metadata and Markdown instructions:

```yaml
---
name: your-skill-name
description: Brief description and when to use it
---

# Your Skill Name

## Instructions
Clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

### Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase letters, numbers, hyphens (max 64 chars) |
| `description` | Yes | What the Skill does and when to use it (max 1024 chars) |
| `allowed-tools` | No | Tools Claude can use without asking permission |
| `model` | No | Model to use when Skill is active |
| `context` | No | Set to `fork` for separate sub-agent context |
| `agent` | No | Agent type when `context: fork` is set |
| `hooks` | No | Hooks scoped to this Skill's lifecycle |

## Reference

[Claude Code: Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
