# PRD Skill

Generate detailed PRDs with user stories sized for autonomous execution.

## Usage

```
Load the prd skill and create a PRD for [your feature]
```

## Output Format

Save PRDs to `tasks/prd-[feature-name].md`

## Story Sizing Guidelines

Each user story must be completable in ONE context window (~1-2 hours of work).

### Good Story Examples
- "Add email validation to registration form"
- "Create API endpoint for user profile retrieval"
- "Add loading spinner to video upload button"
- "Implement local storage for project persistence"

### Too Big (Split These)
- "Build authentication system" -> Split into: login form, validation, session management, logout
- "Create video editor" -> Split into: upload, preview, timeline, export
- "Add user management" -> Split into: registration, profile view, profile edit, delete account

### Sizing Checklist
- [ ] Can be completed without external dependencies blocking progress
- [ ] Has clear, testable acceptance criteria
- [ ] Touches 1-3 files maximum
- [ ] No more than ~200 lines of code changes
- [ ] Can be verified independently

## PRD Template

```markdown
# PRD: [Feature Name]

## Overview
[2-3 sentences describing the feature, its purpose, and value to users]

## Goals
- [Primary goal]
- [Secondary goal]

## Non-Goals
- [What this feature explicitly will NOT do]

## Technical Context
[Relevant files, dependencies, or architectural considerations]

## User Stories

### US-001: [Short Descriptive Title]
**Priority:** 1 (1=highest, 5=lowest)
**Estimated Effort:** Small | Medium
**Files Likely Affected:** `path/to/file.js`

**Description:**
[1-2 sentences describing what the user can do]

**Acceptance Criteria:**
- [ ] Criterion 1 (specific, testable)
- [ ] Criterion 2 (specific, testable)
- [ ] Criterion 3 (specific, testable)

**Technical Notes:**
[Optional: Implementation hints or constraints]

---

### US-002: [Short Descriptive Title]
**Priority:** 2
**Estimated Effort:** Small | Medium
**Files Likely Affected:** `path/to/file.js`

**Description:**
[1-2 sentences describing what the user can do]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

---

## Success Metrics
- [How will we know this feature is successful?]

## Open Questions
- [Any unresolved decisions or dependencies]
```

## Priority Definitions

| Priority | Meaning | When to Use |
|----------|---------|-------------|
| 1 | Critical | Core functionality, blocking other work |
| 2 | High | Important for feature completeness |
| 3 | Medium | Enhances user experience |
| 4 | Low | Nice to have |
| 5 | Future | Backlog for later consideration |

## Effort Definitions

| Effort | Time | Complexity |
|--------|------|------------|
| Small | ~30 min | Single function or component change |
| Medium | ~1-2 hrs | Multiple related changes, one context window |

Note: If effort exceeds "Medium", the story should be split into smaller stories.
