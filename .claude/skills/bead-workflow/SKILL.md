---
name: bead-workflow
description: Git-backed issue tracker for multi-session work with dependencies and persistent memory across conversation compaction. Use when work spans sessions, has blockers, or needs context recovery after compaction.
---

# Bead Workflow

Enforce consistent use of beads for strategic work to maintain context across sessions and compaction.

## When to Use Beads

### Always Create Beads For:

✅ **Strategic Work**
- Features (new functionality)
- Significant refactoring
- Architecture changes
- Bug fixes requiring investigation
- Multi-file changes
- Work spanning multiple sessions

✅ **Work with Dependencies**
- Tasks that block other work
- Tasks blocked by other work
- Work that's part of an epic
- Related work items

✅ **Context-Critical Work**
- Work that might need compaction mid-session
- Complex tasks requiring memory
- Work you'll return to later
- Work requiring handoff to another session

### Skip Beads For:

❌ **Trivial Work**
- Typo fixes
- Single-line changes
- Running commands for information
- Immediate, obvious fixes (< 5 minutes)

**Rule of Thumb**: If work takes > 10 minutes OR survives compaction OR has dependencies → Create a bead

## Core Workflow

### 1. Task Received → Assess if Bead Needed

```markdown
Ask:
- Is this strategic work? (feature, refactor, significant bug)
- Will it span multiple sessions?
- Might context be compacted during work?
- Does it have dependencies?
- Is it part of larger work?

If YES to any → Create bead
If NO to all → Skip bead, use TodoWrite for execution tracking
```

### 2. Create Bead Immediately

**Before starting implementation**, create the bead:

```bash
bd create "Feature: <concise title>" \
  --type=<bug|feature|task|chore> \
  --description="<detailed description with context>" \
  --acceptance="<acceptance criteria from clarification phase>" \
  --priority=<0-4> \
  --parent=<parent-id> \  # if part of epic
  --deps="<dependencies>"  # if depends on other beads
```

**Priority Guidelines:**
- **P0** (0): Critical - breaks production
- **P1** (1): High - important feature or significant bug
- **P2** (2): Medium - standard work (default)
- **P3** (3): Low - nice to have
- **P4** (4): Backlog - someday/maybe

### 3. Update Status as You Work

```bash
# Mark as in progress when you start
bd update <bead-id> --status=in_progress

# If blocked
bd update <bead-id> --status=blocked
bd dep add <bead-id> <blocking-bead-id>

# Add notes as needed
bd update <bead-id> --notes="<additional context>"
```

### 4. Close When Complete

**Only after validation passes** (see validation-before-close skill):

```bash
bd close <bead-id>
```

## Bead Metadata Best Practices

### Title: Concise and Descriptive

**Good:**
- "Feature: Add user authentication"
- "Bug: Fix memory leak in image loader"
- "Refactor: Extract auth logic to service"

**Bad:**
- "Fix stuff"
- "Update code"
- "Changes"

### Description: Provide Context

Include:
- What needs to be done
- Why it's needed
- Relevant context
- Related files/components

**Example:**
```markdown
Implement JWT-based user authentication for the app.

Context:
- Users currently have no way to authenticate
- Need secure, stateless auth for scalability
- Will integrate with existing user database

Approach:
- JWT tokens with 7-day expiration
- Registration + login + password reset
- Email verification
```

### Acceptance Criteria: Define Done

From clarification phase, include specific criteria:

```markdown
- User can register with email/password
- User can login and receive JWT token
- Password reset flow works
- Email verification functional
- All auth endpoints tested
- Documentation updated
```

### Dependencies: Link Related Work

```bash
# This bead depends on another
bd dep add <this-bead> <other-bead>

# This bead blocks another
bd dep add <other-bead> <this-bead>

# Discovered during work
bd create "Bug: ..." --deps="discovered-from:<current-bead>"
```

## Integration with Ralph Wiggum Loops

Beads provide the persistent context for loops:

```markdown
Loop Pattern with Beads:

1. Create bead
2. Mark in_progress
3. Implement + validate (loop)
4. If bugs found:
   - Create bug beads
   - Link as dependencies
   - Fix in priority order
   - Continue loop
5. When DoD met:
   - Close bead
   - Context can be compacted
   - Bead persists as memory

After compaction:
- Bead survives (in git)
- Run: bd show <bead-id> to recover context
- Continue work with full history
```

## Bead Lifecycle

```markdown
open (default)
  ↓
in_progress (actively working)
  ↓
blocked (waiting for dependency) OR
  ↓
closed (completed)
```

## Recovery After Compaction

When context is compacted, beads are your memory:

```bash
# What was I working on?
bd list --status=in_progress

# Show bead details
bd show <bead-id>

# What's next?
bd ready  # Shows beads ready to work (no blockers)

# What's blocked?
bd blocked  # Shows blocked beads with dependencies
```

## Bead Commands Reference

### Essential Commands

```bash
# Create
bd create "Title" --type=feature --priority=2 \
  --description="..." --acceptance="..."

# List
bd list --status=open
bd list --status=in_progress
bd list --type=bug

# Show details
bd show <bead-id>

# Update
bd update <bead-id> --status=in_progress
bd update <bead-id> --priority=1
bd update <bead-id> --notes="Additional context"

# Dependencies
bd dep add <issue> <depends-on>
bd blocked  # Show all blocked beads
bd ready    # Show beads ready to work

# Close
bd close <bead-id>
bd close <bead-id> --reason="Explanation if needed"

# Multiple close (efficient)
bd close <bead-1> <bead-2> <bead-3>

# Epic management
bd create "Epic title" --type=epic
bd create "Task" --parent=<epic-id>
bd epic status  # Show epic completion status
```

## Common Workflows

### Workflow 1: Feature Development

```bash
# 1. Create feature bead
bd create "Feature: User authentication" --type=feature --priority=2

# 2. Mark in progress
bd update entropy-wiki-abc --status=in_progress

# 3. During implementation, bug found
bd create "Bug: Password validation fails" --type=bug \
  --deps="discovered-from:entropy-wiki-abc"

# 4. Fix bug, close it
bd close entropy-wiki-xyz

# 5. Feature complete, close it
bd close entropy-wiki-abc
```

### Workflow 2: Epic with Multiple Tasks

```bash
# 1. Create epic
bd create "Epic: Authentication System" --type=epic

# 2. Create child tasks
bd create "Implement JWT generation" --parent=entropy-wiki-epic
bd create "Add password reset" --parent=entropy-wiki-epic
bd create "Email verification" --parent=entropy-wiki-epic

# 3. Work through tasks
bd update entropy-wiki-epic.1 --status=in_progress
# ... implement ...
bd close entropy-wiki-epic.1

# 4. Check epic status
bd epic status  # Shows completion progress

# 5. When all children closed, epic auto-closes
bd epic close-eligible
```

### Workflow 3: Blocked Work

```bash
# 1. Start task
bd update entropy-wiki-abc --status=in_progress

# 2. Discover dependency
bd create "Bug: Auth service needs HTTPS" --type=bug
bd dep add entropy-wiki-abc entropy-wiki-def  # abc depends on def

# 3. Check what's blocking
bd blocked  # Shows entropy-wiki-abc blocked by def

# 4. Work on blocker
bd update entropy-wiki-def --status=in_progress
bd close entropy-wiki-def

# 5. Original bead now unblocked
bd ready  # Shows entropy-wiki-abc is ready
bd update entropy-wiki-abc --status=in_progress
```

## Integration with Other Skills

### With task-intake
```markdown
Phase 2 (Planning):
→ Use bead-workflow to create bead
→ Include acceptance criteria from Phase 1
→ Link dependencies if known
```

### With auto-bug-tracking
```markdown
During implementation:
→ Bug discovered
→ auto-bug-tracking creates bug bead
→ bead-workflow ensures it's linked
→ Dependency tracked automatically
```

### With validation-before-close
```markdown
Before closing:
→ validation-before-close checks DoD
→ Only close bead when validation passes
→ bead-workflow enforces this pattern
```

### With context-management
```markdown
When context full:
→ Compact conversation
→ Bead persists in git
→ bd show <bead-id> recovers context
→ Continue work with memory intact
```

## Beads as Project Memory

Beads survive:
- ✅ Conversation compaction
- ✅ Session endings
- ✅ Context limits
- ✅ Model switches
- ✅ Days/weeks between work

Beads provide:
- 📊 Progress visibility
- 🔗 Dependency tracking
- 💾 Persistent context
- 🎯 Clear scope
- ✅ Definition of done

## Best Practices

### Do
- ✅ Create beads before implementation
- ✅ Include detailed acceptance criteria
- ✅ Update status as you work
- ✅ Link dependencies when discovered
- ✅ Close only after validation
- ✅ Use beads to recover context after compaction
- ✅ Create bug beads during development

### Don't
- ❌ Skip beads for strategic work
- ❌ Create beads for trivial changes
- ❌ Close beads without validation
- ❌ Forget to mark as in_progress
- ❌ Ignore dependencies
- ❌ Create beads without acceptance criteria

## Anti-Patterns

❌ Working on strategic tasks without creating beads
❌ Creating beads but not updating status
❌ Closing beads when validation hasn't passed
❌ Not linking bug beads to parent work
❌ Creating beads for every tiny change
❌ Not using beads to recover after compaction
❌ Forgetting to check bd ready for next work

## Quick Decision Tree

```markdown
New task received?
├─ Trivial (< 5 min, no complexity)?
│  └─ Skip bead, use TodoWrite
└─ Strategic/Complex?
   └─ Create bead FIRST
      ├─ Add acceptance criteria
      ├─ Link dependencies
      ├─ Mark in_progress
      ├─ Implement + validate
      ├─ Create bug beads as needed
      └─ Close when DoD met
```

## Example: Complete Bead Workflow

**Task**: "Implement user authentication"

```bash
# 1. Create bead (before implementation)
bd create "Feature: User authentication" \
  --type=feature \
  --priority=2 \
  --description="JWT-based auth with registration, login, password reset" \
  --acceptance="
  - User can register with email/password
  - User can login and receive JWT
  - Password reset works
  - Email verification functional
  - Tests pass
  - Docs updated"

# Output: entropy-wiki-auth

# 2. Mark in progress
bd update entropy-wiki-auth --status=in_progress

# 3. During implementation, bug found
bd create "Bug: Email service not configured" \
  --type=bug \
  --priority=1 \
  --deps="discovered-from:entropy-wiki-auth"

# Output: entropy-wiki-email

# 4. Fix bug
bd update entropy-wiki-email --status=in_progress
# ... fix ...
bd close entropy-wiki-email

# 5. Continue feature, validation loop
# ... implement ... validate ... fix issues ... validate ...

# 6. All DoD criteria met
bd close entropy-wiki-auth

# 7. Context compacted
# /compact

# 8. Later, what was I working on?
bd list --status=closed --limit=5
# Shows: entropy-wiki-auth (closed)

# 9. Need context?
bd show entropy-wiki-auth
# Shows: Full description, acceptance criteria, history
```

**Result**: Persistent memory across compaction, clear scope, tracked dependencies.
