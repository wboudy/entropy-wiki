---
title: Tooling and MCP
description: MCP server configurations and custom tool definitions for AI agents
---

# Tooling and MCP

MCP server configurations and custom tool definitions for AI agents.

## What is MCP?

Model Context Protocol (MCP) provides a standardized way to connect AI agents to external tools, data sources, and services. It's an open source standard for AI-tool integrations.

## Documentation

### Claude Code MCP

- [MCP in Claude Code](/tooling-mcp/claude-mcp) - Connecting Claude Code to tools via MCP
- [MCP Standard](/tooling-mcp/mcp-standard) - Protocol reference and standards

## What You Can Do with MCP

With MCP servers connected, you can:

- **Issue Trackers**: Implement features from JIRA, Linear, or GitHub Issues
- **Monitoring**: Analyze data from Sentry, Statsig, or custom dashboards
- **Databases**: Query PostgreSQL, MySQL, or other databases directly
- **Design Tools**: Integrate designs from Figma or other design tools
- **Communication**: Access Slack messages, Gmail drafts, and more
- **Automation**: Chain multiple tools for complex workflows

## Transport Types

| Type | Use Case | Example |
|------|----------|---------|
| HTTP | Remote cloud services | Notion, Asana |
| SSE | Server-sent events (deprecated) | Legacy services |
| stdio | Local processes | Custom scripts, npx packages |

## Contents

This section includes:
- MCP server configurations
- Custom tool definitions
- Integration patterns
- Connection examples

## Quick Start

```bash
# Add an HTTP server
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Add a local server
claude mcp add --transport stdio my-server -- npx -y @package/server

# List servers
claude mcp list

# Check status in Claude Code
/mcp
```

## Getting Started

MCP enables AI agents to interact with:
- File systems
- Databases
- APIs and web services
- Development tools
- Custom business logic

Each tool definition includes schema, usage examples, and configuration guidance.
