# MCP Agent Mail - Asynchronous Agent Communication

## Overview
MCP Agent Mail implements an asynchronous "Post Office" protocol for agent-to-agent communication using the Model Context Protocol (MCP). It enables multiple agents to coordinate work without blocking each other.

## Core Components

### Post Office Protocol
Provides asynchronous messaging between agents:
- **Send messages**: Agents post messages to other agents' mailboxes
- **Read messages**: Agents poll their mailbox for new messages
- **Non-blocking**: Sender doesn't wait for receiver to be online

### File Lease System (Mutex Locking)
Critical for preventing race conditions when multiple agents edit shared files:
- **Acquire lease**: Agent requests exclusive access to a file
- **Hold lease**: Agent has exclusive write access
- **Release lease**: Agent releases file for others to use
- **Timeout protection**: Leases automatically expire to prevent deadlocks

## Use Cases

### Multi-Agent Coordination
When multiple agents (e.g., "Polecats" in Gas Town architecture) work in parallel:
- Prevents simultaneous edits to the same file
- Enables message passing for task coordination
- Reduces merge conflicts in Git

### Swarm Development
For parallel worktree setups where multiple agents run simultaneously:
- File leases prevent write conflicts
- Asynchronous messages enable work orchestration
- Agents can request help or signal completion

## Technical Architecture

Built on MCP (Model Context Protocol):
- Agents connect via MCP servers
- Messages stored persistently
- Leases managed with timeout logic
- Compatible with MCP-enabled tools

## Integration Pattern

```
Agent A needs to edit file.txt:
1. Request lease on file.txt
2. If granted: edit file, release lease
3. If blocked: wait or work on other tasks

Agent A needs to notify Agent B:
1. Send message to Agent B's mailbox
2. Agent B reads message when ready
3. No blocking on Agent A
```

**Note**: This reference is based on repository description as the full documentation exceeded WebFetch limits. For complete details, see the repository directly.

**Technical Value for Agents:** Asynchronous Post Office for agent-to-agent messaging. File Lease system (mutex locking) prevents race conditions when multiple agents edit shared files simultaneously. Essential for swarm/parallel development.

**URL:** https://github.com/Dicklesworthstone/mcp_agent_mail
