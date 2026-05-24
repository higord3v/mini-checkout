# Implementation Plan: [FEATURE]

**Branch**: `main` (trunk-based; no feature branches) | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Node.js backend, React frontend)

**Primary Dependencies**: Express.js (backend), Vite + React (frontend)

**Storage**: [if applicable, e.g., in-memory, files, or N/A]

**Testing**: Jest (backend); frontend test runner TBD per feature if needed

**Target Platform**: Node.js server + browser (Vite dev/build)

**Project Type**: Monorepo web application (`backend/` + `frontend/`)

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify before Phase 0 research (re-check after Phase 1 design):

- [ ] **TDD**: Test tasks planned before implementation tasks; red-green-refactor acknowledged
- [ ] **Incremental**: Work split into small tasks with commit points identified
- [ ] **Simplicity**: No over-engineering; violations listed in Complexity Tracking below
- [ ] **Stack**: Backend uses Node.js + TypeScript + Express; frontend uses React + Vite
- [ ] **Tests**: Backend tests use Jest
- [ ] **Workflow**: Spec on `main`; no feature branch required
- [ ] **Prompts**: Feature prompts recorded in `PROMPTS.md`

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── src/
│   ├── routes/
│   ├── services/
│   └── models/
└── tests/              # Jest

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── [tests if applicable]
```

**Structure Decision**: Monorepo per constitution — `backend/` (Node.js + TypeScript +
Express + Jest) and `frontend/` (React + Vite). Remove or adjust only if Complexity
Tracking justifies a deviation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
