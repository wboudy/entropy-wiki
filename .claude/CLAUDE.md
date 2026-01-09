# Project Workflow

## Task Intake Process

**CRITICAL**: When receiving ANY non-trivial task, follow this workflow:

### Phase 1: Clarification (REQUIRED FIRST)
1. **ALWAYS use ask-questions-if-underspecified skill FIRST**
2. Ask ALL clarifying questions upfront
3. Get ALL design decisions before implementation
4. Settle ambiguities before writing code

### Phase 2: Planning
1. Create bead for strategic work
2. Check relevant references (ClaudeDocs, CodexDocs)
3. Identify DoD criteria for work type
4. Plan validation approach

### Phase 3: Autonomous Execution
1. Implement with ralph wiggum validation loops
2. NO mid-implementation clarification questions
3. All decisions were made in Phase 1
4. Auto-create bug beads for issues
5. Validate continuously until DoD met

### Phase 4: Completion
1. Final validation
2. Update documentation
3. Close bead
4. Suggest compaction if needed

## Core Principle

**Front-load ALL decision-making so loops can run autonomously without human intervention.**

If you realize you need clarification during implementation:
- ❌ DON'T: Stop and ask mid-implementation
- ✅ DO: Note what you need, continue with reasonable assumption, ask at next natural breakpoint

## Work Types Requiring Clarification Phase

- ✅ New features (always ask upfront)
- ✅ Significant refactoring
- ✅ Architecture changes
- ✅ API changes
- ✅ Configuration changes
- ❌ Simple bug fixes (skip if obvious)
- ❌ Typo fixes
- ❌ Documentation updates (skip if straightforward)

## Standing Instructions

1. **Beads**: Create beads for all strategic work
2. **Questions**: Ask upfront, not during loops
3. **Validation**: Use ralph wiggum loops continuously
4. **Documentation**: Auto-update when changes are significant
5. **Context**: Monitor usage, suggest compaction proactively
6. **Models**: Use appropriate model for task complexity
