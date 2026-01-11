---
title: Context
description: Context management and window optimization for AI assistants
---

# Context

Documentation for managing context windows and optimizing information flow in AI-assisted development.

## Topics

### Context Engineering

- [Context Engineering](/context/context-engineering) - Managing token composition during inference
- [CLAUDE.md Patterns](/context/claude-md-patterns) - Best practices for writing effective CLAUDE.md files
- [AGENTS.md Specification](/context/agents-md-spec) - Vendor-neutral format for guiding AI agents

### Multi-Agent Architecture

- [Google ADK Architecture](/context/google-adk) - Core concepts from Google's Agent Development Kit
- [Parallel Worktree Management](/context/parallel-agents) - Par CLI for concurrent development workflows

## Key Concepts

### Context Rot

LLMs experience performance degradation as context length increases. The more tokens in the context window, the harder it becomes for the model to accurately recall and utilize information.

### Context Compaction

Summarizing conversations nearing capacity limits to preserve critical decisions while discarding redundant outputs.

### Progressive Disclosure

Loading files and information only when needed, rather than front-loading everything into context. This maintains agent performance over long sessions.

### Handle Pattern

Using indirect references to large artifacts instead of embedding them directly in prompts. Agents fetch full content on-demand via tool calls.
