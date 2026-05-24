# Implementation Plan: Backend API Interactive Documentation

**Branch**: `main` (trunk-based; no feature branches) | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-swagger-api-docs/spec.md`.

## Summary

Add **Swagger UI** to the existing Express backend so developers and testers can browse and
execute `GET /api/products` and `POST /api/purchases` from the browser. Deliver a hand-maintained
OpenAPI 3 document (`backend/src/openapi/openapi.json`) aligned with the `001` API contract,
mount `swagger-ui-express` at `/api-docs` when not in production, and cover mounting behavior
with Jest + Supertest. No frontend changes. Same-origin docs avoid CORS changes.

## Technical Context

**Language/Version**: TypeScript strict; Node.js 20+ (existing backend)

**Primary Dependencies**: Express, cors, Zod (unchanged); **add** `swagger-ui-express`

**Storage**: N/A (static OpenAPI JSON file; in-memory catalog unchanged)

**Testing**: Jest + Supertest — integration tests for `/api-docs` mount and spec path coverage

**Target Platform**: Local API `http://localhost:3000`; docs at `http://localhost:3000/api-docs`

**Project Type**: Monorepo — **backend-only** change for this feature

**Performance Goals**: Docs page loads in under 2s on local machine (SC-001); Try it out
reflects existing 1–2s purchase delay unchanged

**Constraints**: Docs disabled when `NODE_ENV === 'production'`; must not affect purchase UI;
Jest remains source of regression truth (FR-006)

**Scale/Scope**: 2 documented paths; 1 new route prefix; 2 new npm packages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify before Phase 0 research (re-check after Phase 1 design):

- [x] **TDD**: Integration tests for docs mounting precede `swagger-ui-express` wiring in `tasks.md`
- [x] **Incremental**: P1 static spec + mount → P2 tests/smoke → P3 quickstart only
- [x] **Simplicity**: Single UI library + static JSON; no codegen or extra services
- [x] **Stack**: Node + TS + Express; Jest on backend; no frontend work
- [x] **Tests**: Jest + Supertest for `/api-docs` and OpenAPI path assertions
- [x] **Workflow**: `main` branch; spec in `specs/002-swagger-api-docs/`
- [x] **Prompts**: Recorded in `PROMPTS.md`

**Post-design re-check (Phase 1)**: All gates pass. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/002-swagger-api-docs/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── openapi.yaml     # Design-time OpenAPI mirror
└── tasks.md             # /speckit-tasks (not created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── package.json                    # + swagger-ui-express, @types/swagger-ui-express
├── src/
│   ├── app.ts                      # createApp({ enableApiDocs? }); conditional mount
│   ├── server.ts                   # unchanged listen
│   ├── openapi/
│   │   └── openapi.json            # Runtime OpenAPI (sync with contracts/openapi.yaml)
│   └── swagger/
│       └── setupSwagger.ts         # register swagger-ui-express at /api-docs
└── tests/
    └── integration/
        └── swagger.docs.test.ts    # GET /api-docs, path coverage, prod guard
```

**Structure Decision**: Keep swagger setup in a small `setupSwagger.ts` module; pass
`enableApiDocs` into `createApp` for tests. Convert `contracts/openapi.yaml` to JSON at
implement time (or author `openapi.json` directly from contract). Frontend tree unchanged.

## Implementation Phases (for `/speckit-tasks`)

| Phase | Scope | User story |
|-------|--------|------------|
| Setup | Add dependencies; add `openapi.json` from contract | — |
| Tests (red) | Jest: `/api-docs` 200 when enabled; 404 when disabled; paths in spec | — |
| P1 | `setupSwagger.ts` + conditional mount in `app.ts` | US1 Discover |
| P2 | Manual quickstart verification; console log docs URL on dev start | US2 Execute |
| P3 | Document production guard in quickstart/README | US3 Local-only |
| Polish | PROMPTS.md, optional README link to `/api-docs` | FR-007 |

## Complexity Tracking

> No constitution violations.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Generated Artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| OpenAPI contract | [contracts/openapi.yaml](./contracts/openapi.yaml) |
| Quickstart | [quickstart.md](./quickstart.md) |
