<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: N/A (initial ratification)
- Added sections: Core Principles (5), Technology Stack, Development Workflow, Governance
- Removed sections: None
- Templates: ✅ plan-template.md | ✅ spec-template.md | ✅ tasks-template.md | ✅ extensions.yml (disabled feature-branch hook)
- Follow-up TODOs: None
-->

# Mini Checkout Constitution

## Core Principles

### I. Test-First (NON-NEGOTIABLE)

TDD is mandatory for all behavior changes. The cycle MUST be:

1. Write tests that express the desired behavior.
2. Obtain explicit user approval of the tests.
3. Run tests and confirm they fail (red).
4. Implement the minimum code to make tests pass (green).
5. Refactor only with tests still passing.

No production implementation MAY begin before steps 1–3 are complete. Backend tests MUST use Jest.

**Rationale**: Failing tests first prove the test is meaningful and prevent speculative code.

### II. Incremental Delivery

Features MUST be broken into small, independently completable tasks. Each task or
logical group MUST be committed before starting unrelated work. Tasks MUST be small
enough to review in minutes, not hours.

**Rationale**: Small commits reduce risk, simplify rollback, and keep progress visible.

### III. Clean Code & Simplicity

Code MUST be readable, focused, and free of unnecessary abstraction. Prefer clear
names, small functions, and direct solutions over patterns added “for later.”
Over-engineering (premature frameworks, unused layers, speculative generalization) is
forbidden unless justified in writing under Complexity Tracking in the plan.

**Rationale**: This is a small project; complexity cost compounds faster than reuse benefit.

### IV. Prompt Traceability

Every user or agent prompt that drives specification, planning, or implementation MUST
be appended to `PROMPTS.md` at the repository root with date and brief context. Missing
prompt history is a process violation.

**Rationale**: Auditable intent prevents drift between specs and delivered behavior.

### V. Conventional Commits & Direct Workflow

All commits MUST follow [Conventional Commits](https://www.conventionalcommits.org/)
(e.g., `feat:`, `fix:`, `test:`, `docs:`, `refactor:`). Work proceeds on the default
branch (`main`); feature branches MUST NOT be created for this project. Spec Kit
feature folders under `specs/` use numeric prefixes without branch-per-feature workflow.

**Rationale**: Conventional messages enable readable history; trunk-based flow matches project size.

## Technology Stack

This project is a **monorepo** with the following mandatory stack:

| Area | Technology |
|------|------------|
| Backend | Node.js, TypeScript, Express.js |
| Frontend | React.js, Vite |
| Backend tests | Jest |
| Repository layout | `backend/` and `frontend/` at repository root |

Deviations from this stack require documented justification in the implementation plan
Complexity Tracking table and user approval.

## Development Workflow

1. **Specify** → capture requirements in `specs/[###-feature]/spec.md` on `main`.
2. **Plan** → pass Constitution Check gates in `plan.md`.
3. **Tasks** → generate small, ordered tasks; include test tasks before implementation tasks.
4. **Implement** → TDD cycle per principle I; commit per principle II and V.
5. **Record** → append prompts to `PROMPTS.md` per principle IV.

Quality gates before merge or release:

- All relevant Jest tests pass.
- No unexplained Constitution Check violations in the plan.
- Each user story independently testable per spec.

## Governance

This constitution supersedes conflicting local habits and template defaults. Amendments
require updating this file, bumping the version per semantic versioning, and propagating
changes to `.specify/templates/*` and `.specify/extensions.yml` when hooks or gates
are affected.

- **MAJOR**: Removing or redefining a principle incompatibly with prior work.
- **MINOR**: Adding a principle or materially expanding requirements.
- **PATCH**: Clarifications, typos, non-semantic wording.

Compliance review: every `/speckit-plan` Constitution Check and every `/speckit-analyze`
run MUST verify TDD order, stack constraints, commit conventions, and direct-workflow rules.

**Version**: 1.0.0 | **Ratified**: 2026-05-24 | **Last Amended**: 2026-05-24
