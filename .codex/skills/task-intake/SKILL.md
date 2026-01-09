---
name: task-intake
description: Orchestrates upfront clarification and planning before autonomous execution. Use automatically when receiving ANY non-trivial task to ensure all design decisions are made before implementation starts, enabling long autonomous ralph wiggum loops without human intervention.
---

# Task Intake Workflow

Enforce a structured intake process that front-loads ALL decision-making, enabling autonomous execution loops without mid-implementation interruptions.

## Core Principle

**Get ALL questions answered upfront → Then run autonomous loops with ZERO human intervention**

## When This Skill Activates

This skill should activate for **ANY non-trivial task**:

✅ **Always Use For:**
- New feature requests
- Significant refactoring
- Architecture changes
- API design/changes
- Configuration changes
- Complex bug fixes
- Multi-file changes
- Anything with ambiguity

❌ **Skip For:**
- Obvious typo fixes
- Simple one-line changes
- Running predefined commands
- Clearly specified trivial tasks

**When in doubt → USE THIS SKILL**

## The Four-Phase Workflow

### Phase 1: Clarification (REQUIRED FIRST)

**Objective**: Eliminate ALL ambiguity before writing code

```markdown
1. Assess Task Specification
   - Is objective clear?
   - Is scope defined?
   - Is "done" defined?
   - Are constraints known?
   - Are design decisions settled?

2. If ANY ambiguity exists:
   → Use ask-questions-if-underspecified skill
   → Ask 1-5 critical questions
   → Get answers BEFORE proceeding

3. If task is clear:
   → Document assumptions
   → Confirm with user
   → Proceed to Phase 2
```

**Critical Questions to Ask:**

**Scope:**
- What should change vs stay the same?
- Which files/components are in scope?
- Are there related areas to avoid touching?

**Definition of Done:**
- What does success look like?
- What are the acceptance criteria?
- What edge cases must be handled?

**Constraints:**
- Compatibility requirements?
- Performance requirements?
- Style/pattern requirements?
- Dependencies allowed/forbidden?

**Approach:**
- Is there a preferred implementation approach?
- Are there existing patterns to follow?
- Any architecture decisions needed?

**Example Questions:**
```markdown
Before implementing user authentication:

1. Authentication method?
   a) JWT (stateless) - Recommended
   b) Session-based (stateful)
   c) OAuth only

2. Scope?
   a) Just login/logout (minimal)
   b) Include registration + password reset
   c) Full user management system

3. Storage?
   a) Use existing database
   b) Add new auth service
   c) Third-party auth provider

Reply format: 1a 2b 3a (or "defaults" for all recommended)
```

### Phase 2: Planning

**Objective**: Create execution plan with clear validation strategy

```markdown
1. Create Bead (if strategic work)
   - Use bead-workflow skill
   - Include acceptance criteria from Phase 1
   - Link to parent/epic if applicable

2. Check References
   - Use reference-context skill
   - Load relevant ClaudeDocs/CodexDocs
   - Understand existing patterns

3. Identify DoD Criteria
   - Use dod-criteria skill
   - Know exactly what validation is needed
   - Understand loop exit conditions

4. Plan Implementation
   - Break into steps
   - Identify validation checkpoints
   - Plan for autonomous execution
```

### Phase 3: Autonomous Execution

**Objective**: Execute with ZERO human interruption

```markdown
1. Implement Changes
   - Follow plan from Phase 2
   - Use decisions from Phase 1
   - NO new questions to user

2. Continuous Validation (Ralph Loops)
   - After each change → validate
   - Tests fail → auto-create bug bead
   - Fix bugs → re-validate
   - Loop until DoD met

3. Handle Issues Autonomously
   - Expected issues → fix with existing context
   - Bugs → create bug beads, continue
   - Blockers → document, mark bead blocked
   - NO mid-loop clarification questions

4. If Ambiguity Arises Mid-Loop:
   ❌ DON'T: Stop and ask user
   ✅ DO: Make reasonable assumption, document, continue
   ✅ DO: Note for post-completion review if needed
```

### Phase 4: Completion

**Objective**: Finalize and prepare for next work

```markdown
1. Final Validation
   - Use validation-before-close skill
   - Verify all DoD criteria met
   - Check acceptance criteria from Phase 1

2. Documentation
   - Use auto-documentation skill
   - Update relevant docs
   - Include examples if needed

3. Close Work
   - Close bead
   - Document outcomes
   - Note any follow-up items

4. Context Management
   - Use context-management skill
   - Suggest compaction if needed
   - Prepare for next task
```

## Integration with Ralph Wiggum Loops

This workflow enables truly autonomous loops:

```markdown
Traditional (BAD):
Task → Start coding → Hit ambiguity → Stop → Ask user → Wait → Resume
[Repeated interruptions, broken flow]

Task-Intake (GOOD):
Task → Ask ALL questions → Plan → Code + Validate loop (continuous) → Done
[No interruptions, autonomous execution]
```

**Ralph Loop with Task Intake:**
```markdown
Phase 1: Clarification
├─ Task received
├─ Questions asked (ALL of them)
├─ Answers received
└─ Proceed to Phase 2

Phase 2: Planning
├─ Bead created
├─ References checked
├─ DoD identified
└─ Proceed to Phase 3

Phase 3: Autonomous Loops (NO HUMAN INPUT)
├─ Implement
├─ Validate
├─ Bug found? → Create bug bead → Fix → Validate
├─ Validate pass? → Proceed to Phase 4
└─ Loop continues without breaks

Phase 4: Completion
├─ Final validation
├─ Update docs
├─ Close bead
└─ Ready for next task
```

## Question Optimization Strategies

### Front-Load ALL Decisions

**Ask about everything that could cause mid-loop ambiguity:**

✅ **Must Ask:**
- Implementation approach if multiple valid options
- Scope boundaries if unclear
- Compatibility requirements
- Performance requirements
- Security considerations for auth/data
- Testing requirements
- Deployment targets

✅ **Should Ask:**
- Naming conventions if not obvious
- Error handling strategy
- Logging/monitoring approach
- Migration strategy for breaking changes

❌ **Don't Ask:**
- Obvious best practices (use them)
- Implementation details you can decide
- Questions you can answer by reading existing code

### Make Questions Easy to Answer

Use the patterns from ask-questions-if-underspecified:

**Good Question Format:**
```markdown
1) Scope?
   a) Minimal change (Recommended)
   b) Include related improvements
   c) Full refactor

2) Testing?
   a) Unit tests only (Recommended for this)
   b) Unit + integration tests
   c) Skip tests (not recommended)

Reply: defaults (or 1a 2b)
```

**Bad Question Format:**
```markdown
How should we approach this? What do you think about the architecture?
Should we refactor while we're here? What testing strategy?
```

### Batch Questions

Ask 1-5 questions at once, not one at a time:
- Groups related decisions
- Faster for user
- Single interruption, not multiple

## Example: Complete Task Intake

**User Task**: "Add user authentication to the app"

### Phase 1: Clarification

```markdown
Before implementing authentication, I need to clarify:

1) Authentication method?
   a) JWT (stateless, scalable) - Recommended
   b) Session-based (stateful, simpler)
   Reply: 1

2) Scope?
   a) Just login/logout
   b) Login/logout + registration
   c) Full auth system (login, register, password reset, email verification)
   Reply: 2

3) User storage?
   a) Add to existing database
   b) Use existing user table
   Reply: 3

4) Password requirements?
   a) Standard (8+ chars, mixed)
   b) Strong (12+ chars, special, mixed)
   c) Let me decide based on best practices
   Reply: 4

5) Session duration?
   a) 24 hours (default)
   b) 7 days (convenience)
   c) Custom: ____ hours
   Reply: 5

Reply format: "1a 2b 3a 4c 5a" or "defaults" for all recommended
```

**User Response**: "1a 2c 3a 4c 5b"

### Phase 2: Planning

```markdown
Plan based on clarifications:
- JWT authentication (stateless)
- Full auth system (login, register, password reset, email verification)
- Add auth tables to existing database
- Standard password requirements (will apply best practices)
- 7-day session duration

Creating bead: "Feature: Implement user authentication system"

Acceptance Criteria:
- User can register with email/password
- User can login with credentials
- User can reset password
- Email verification implemented
- JWT tokens generated and validated
- Sessions last 7 days
- Passwords meet security standards

DoD: Feature type (see dod-criteria)
- All acceptance criteria met
- Tests added (unit + integration)
- API documented
- Security reviewed
- Deployed and verified

References needed:
- Existing database schema
- API patterns in codebase
- Security best practices

Implementation plan:
1. Create auth database schema
2. Implement registration endpoint
3. Implement login endpoint
4. Implement JWT generation/validation
5. Implement password reset flow
6. Implement email verification
7. Add authentication middleware
8. Write tests
9. Update documentation

Proceeding to autonomous execution...
```

### Phase 3: Autonomous Execution

```markdown
[Implementing... no questions asked mid-loop]

Iteration 1:
- Created auth schema
- Validate: Migration runs ✅

Iteration 2:
- Implemented registration endpoint
- Validate: Tests fail (password validation)
- Created bug bead
- Fixed validation
- Re-validate: Tests pass ✅

Iteration 3:
- Implemented login endpoint
- Validate: JWT generation works ✅

[...continues autonomously until all acceptance criteria met...]

Final Iteration:
- All acceptance criteria met ✅
- All tests passing ✅
- Security reviewed ✅
- Documentation updated ✅
- Deployed to staging ✅
- Smoke tested ✅

Proceeding to completion...
```

### Phase 4: Completion

```markdown
Final validation complete:
✅ All DoD criteria met
✅ No bugs or issues
✅ Documentation updated

Closing bead: entropy-wiki-abc
Status: Complete

Context at 82% - good time to compact
Suggest: /compact
```

**Total human interventions: 1** (answered questions at start)
**Autonomous loop duration: Complete** (no breaks)

## Best Practices

### Do
- ✅ Ask ALL questions upfront (even if it's 5+ questions)
- ✅ Use multiple-choice format for speed
- ✅ Provide recommended defaults
- ✅ Document all assumptions if user says "decide"
- ✅ Trust Phase 1 answers during Phase 3
- ✅ Make reasonable decisions when tiny ambiguities arise
- ✅ Keep loops running without interruption

### Don't
- ❌ Skip clarification for "small" tasks with ambiguity
- ❌ Ask questions one at a time
- ❌ Ask open-ended questions without options
- ❌ Stop mid-loop to ask clarification
- ❌ Second-guess Phase 1 decisions during execution
- ❌ Ask questions you can answer yourself

## Troubleshooting

### "Task seems clear, but uncertainty arose mid-loop"

**Solution**: Make reasonable assumption
- Document assumption in code comment or commit
- Continue execution
- Note for post-completion review if significant

### "User gave vague task"

**Solution**: Use this skill aggressively
- Ask 5-10 questions if needed
- Better to over-clarify than under-clarify
- Front-load ALL decision-making

### "Question arose that wasn't anticipated"

**Solution**: Answer it yourself if possible
- Check existing code patterns
- Check references/docs
- Use best practices
- Only ask user if critical AND unknown

## Quick Reference

**Every new task:**
```markdown
1. Is it non-trivial? → YES → Use task-intake skill
2. Are there ANY ambiguities? → YES → Phase 1 (questions)
3. All clear? → Phase 2 (planning)
4. Execute → Phase 3 (autonomous loops)
5. Complete → Phase 4 (finalize)
```

**Goal: ZERO mid-loop human intervention**

## Anti-Patterns

❌ Starting implementation without clarification
❌ Asking "is this okay?" mid-implementation
❌ Asking questions one at a time
❌ Stopping loops to get clarification
❌ Under-specifying questions in Phase 1
❌ Skipping planning phase
❌ Breaking autonomous loops for minor uncertainties

## Integration with Other Skills

**Works with:**
- ask-questions-if-underspecified (Phase 1)
- bead-workflow (Phase 2)
- reference-context (Phase 2)
- dod-criteria (Phase 2)
- validation-before-close (Phase 3 & 4)
- auto-bug-tracking (Phase 3)
- auto-documentation (Phase 4)
- context-management (Phase 4)

**Result**: Complete autonomous workflow from task → completion
