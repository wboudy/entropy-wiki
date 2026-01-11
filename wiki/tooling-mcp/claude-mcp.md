---
title: MCP in Claude Code
description: Connecting Claude Code to tools via Model Context Protocol
---

# Connect Claude Code to Tools via MCP

Claude Code can connect to hundreds of external tools and data sources through the Model Context Protocol (MCP), an open source standard for AI-tool integrations.

## What You Can Do with MCP

With MCP servers connected, you can ask Claude Code to:

- **Implement features from issue trackers**: "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub."
- **Analyze monitoring data**: "Check Sentry and Statsig to check the usage of the feature described in ENG-4521."
- **Query databases**: "Find emails of 10 random users who used feature ENG-4521, based on our PostgreSQL database."
- **Integrate designs**: "Update our standard email template based on the new Figma designs that were posted in Slack"
- **Automate workflows**: "Create Gmail drafts inviting these 10 users to a feedback session about the new feature."

## Installing MCP Servers

### Option 1: Remote HTTP Server (Recommended)

HTTP servers are the recommended option for connecting to remote MCP servers.

```bash
# Basic syntax
claude mcp add --transport http <name> <url>

# Real example: Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Example with Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### Option 2: Remote SSE Server (Deprecated)

```bash
# Basic syntax
claude mcp add --transport sse <name> <url>

# Real example: Connect to Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

### Option 3: Local stdio Server

Stdio servers run as local processes on your machine. They're ideal for tools that need direct system access.

```bash
# Basic syntax
claude mcp add [options] <name> -- <command> [args...]

# Real example: Add Airtable server
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

**Important**: All options must come **before** the server name. The `--` separates the server name from the command.

## Managing Servers

```bash
# List all configured servers
claude mcp list

# Get details for a specific server
claude mcp get github

# Remove a server
claude mcp remove github

# (within Claude Code) Check server status
/mcp
```

## Configuration Scopes

Use the `--scope` flag to specify where the configuration is stored:

- `local` (default): Available only to you in the current project
- `project`: Shared with everyone via `.mcp.json` file
- `user`: Available to you across all projects

## Tips

- Set environment variables with `--env` flags (e.g., `--env KEY=value`)
- Configure MCP server startup timeout using `MCP_TIMEOUT` environment variable
- Claude Code displays a warning when MCP tool output exceeds 10,000 tokens
- Use `/mcp` to authenticate with remote servers that require OAuth 2.0

## Windows Users

On native Windows (not WSL), local MCP servers that use `npx` require the `cmd /c` wrapper:

```bash
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

## Plugin-Provided MCP Servers

Plugins can bundle MCP servers, automatically providing tools and integrations when the plugin is enabled.

## Reference

[Model Context Protocol](https://modelcontextprotocol.io/introduction)
