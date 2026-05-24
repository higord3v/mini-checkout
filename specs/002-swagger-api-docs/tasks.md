# Tasks: Backend API Interactive Documentation

**Input**: Design documents from `specs/002-swagger-api-docs/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: MANDATORY (constitution TDD). Write tests → **user approves** → confirm red → implement → green. Commit after each logical group on `main`.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no blocking deps)
- **[Story]**: US1, US2, US3 for user-story phases only

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add Swagger dependencies and OpenAPI artifact before tests or routes.

- [x] T001 Add `swagger-ui-express` to `backend/package.json` dependencies and `@types/swagger-ui-express` to devDependencies
- [x] T002 Create `backend/src/openapi/openapi.json` from `specs/002-swagger-api-docs/contracts/openapi.yaml` (paths `/api/products`, `/api/purchases`, all documented status codes)
- [x] T003 Run `cd backend && npm install` to verify lockfile and dependency resolution

**Checkpoint**: `openapi.json` validates as OpenAPI 3; `npm install` succeeds in `backend/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: `createApp` options and failing integration tests for docs mounting — MUST complete before user stories.

**⚠️ CRITICAL**: No user story implementation until this phase is complete.

### Tests for Foundation (write first — must fail)

> **STOP**: Obtain user approval on tests T004–T006 before any implementation tasks T007+.

- [x] T004 Extend `createApp` in `backend/src/app.ts` with optional `enableApiDocs?: boolean` (no swagger mount yet)
- [x] T005 [P] Write failing integration test: `GET /api-docs/` returns 200 when `createApp(repo, { enableApiDocs: true })` in `backend/tests/integration/swagger.docs.test.ts`
- [x] T006 [P] Write failing integration tests in `backend/tests/integration/swagger.docs.test.ts`: `GET /api-docs/` returns 404 when `enableApiDocs: false`; imported spec includes paths `/api/products` and `/api/purchases`
- [x] T007 Run `cd backend && npm test`; confirm T005–T006 fail (red)

**Checkpoint**: Tests exist and fail for missing swagger wiring; existing purchase/product tests still pass.

---

## Phase 3: User Story 1 — Discover API Operations (Priority: P1) 🎯 MVP

**Goal**: Browser-accessible Swagger UI lists catalog and purchase operations with schemas and error responses.

**Independent Test**: With backend running and docs enabled, open `http://localhost:3000/api-docs` and verify both operations appear with request/response documentation matching `specs/001-phone-case-purchase/contracts/api.md`.

### Implementation for User Story 1

> Tests T005–T006 were written in Phase 2; implement to turn them green.

- [x] T008 [US1] Implement `setupSwagger(app, spec)` in `backend/src/swagger/setupSwagger.ts` using `swagger-ui-express` at `/api-docs`
- [x] T009 [US1] Mount swagger in `backend/src/app.ts` when `enableApiDocs === true` (import `openapi.json` and call `setupSwagger`)
- [x] T010 [US1] Ensure `backend/src/openapi/openapi.json` documents `GET /api/products` (200) and `POST /api/purchases` (201, 400, 404, 409, 500) with `Product`, `PurchaseRequest`, and `ErrorResponse` schemas
- [x] T011 [US1] Run `cd backend && npm test`; fix until T005–T006 pass (green)

**Checkpoint**: MVP — interactive docs page loads; operations discoverable without reading source.

---

## Phase 4: User Story 2 — Execute Requests from the Browser (Priority: P2)

**Goal**: Try it out sends live requests to the API and displays status and JSON body.

**Independent Test**: From Swagger UI, execute catalog read and valid purchase; confirm 200/201 responses and error cases (400, 404, 409) per `specs/002-swagger-api-docs/quickstart.md`.

### Implementation for User Story 2

- [x] T012 [US2] Set OpenAPI `servers[0].url` to `http://localhost:3000` in `backend/src/openapi/openapi.json` so Try it out targets the running API
- [x] T013 [US2] Log documentation URL on dev startup in `backend/src/server.ts` (e.g. `API docs: http://localhost:${PORT}/api-docs`)
- [x] T014 [US2] Manual smoke test per `specs/002-swagger-api-docs/quickstart.md` (catalog 200, purchase 201, validation 400, not found 404, conflict 409)

**Checkpoint**: US1 + US2 — discover and execute flows work without Postman.

---

## Phase 5: User Story 3 — Safe Local-Only Access (Priority: P3)

**Goal**: Documentation mounted only in non-production; not part of shopper flow.

**Independent Test**: `createApp` with `enableApiDocs: false` (or `NODE_ENV=production`) → `GET /api-docs/` returns 404; `npm run dev` → docs reachable.

### Tests for User Story 3 (MANDATORY — write first, must fail if not covered)

> **STOP**: Obtain user approval if adding new test cases beyond T006.

- [x] T015 [P] [US3] Add or extend test in `backend/tests/integration/swagger.docs.test.ts`: default `createApp` with `NODE_ENV=production` does not expose `/api-docs` (404)

### Implementation for User Story 3

- [x] T016 [US3] Default `enableApiDocs` to `process.env.NODE_ENV !== 'production'` in `backend/src/app.ts` when option omitted
- [x] T017 [US3] Run `cd backend && npm test`; all suites green including swagger and existing purchase tests
- [x] T018 [US3] Verify `npm run dev` exposes docs and document production guard in `specs/002-swagger-api-docs/quickstart.md` (already drafted — confirm accuracy after impl)

**Checkpoint**: All three user stories independently satisfied; docs absent in production mode.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final validation.

- [x] T019 [P] Add **API documentation** section to repository `README.md` with `/api-docs` URL and link to `specs/002-swagger-api-docs/quickstart.md`
- [x] T020 Validate `specs/002-swagger-api-docs/quickstart.md` end-to-end (install, dev server, browser docs, smoke scenarios)
- [x] T021 Run full backend suite: `cd backend && npm test`
- [x] T022 Append `/speckit-tasks` entry to `PROMPTS.md`
- [ ] T023 Commit on `main` with conventional message (e.g. `feat(backend): add swagger api docs`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → no dependencies
- **Foundational (Phase 2)** → depends on Setup; **blocks all user stories**
- **US1 (Phase 3)** → depends on Foundational → **MVP**
- **US2 (Phase 4)** → depends on US1 (docs must mount before Try it out)
- **US3 (Phase 5)** → depends on US1 mount logic; can follow US2
- **Polish (Phase 6)** → depends on US1–US3 complete

### User Story Dependencies

| Story | Depends on | Notes |
|-------|------------|-------|
| US1 | Foundation | Swagger mount + OpenAPI completeness |
| US2 | US1 | Try it out requires UI and correct `servers` URL |
| US3 | US1 | Production guard on same `createApp` / mount path |

US2 and US3 are sequential after US1; avoid parallel edits to `backend/src/app.ts`.

### Within Each User Story (TDD)

1. Write tests (Phase 2 / US3) → **user approval** → confirm red
2. Implement backend → green tests
3. Manual checkpoint per quickstart where applicable
4. Commit with conventional message

---

## Parallel Example: Phase 2 (Foundation Tests)

```bash
# After user approves tests, author in parallel (same file — coordinate or single PR):
# T005: GET /api-docs 200 when enabled
# T006: GET /api-docs 404 when disabled + path coverage assertion
```

## Parallel Example: Phase 1

```bash
# T002 openapi.json and T001 package.json can be done in parallel by different authors
# T003 must wait for T001
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (red tests)
3. Complete Phase 3: User Story 1 (green tests)
4. **STOP and VALIDATE**: Open `/api-docs` in browser; both operations visible
5. Commit before US2/US3 if desired

### Incremental Delivery

1. Setup + Foundation → red tests ready
2. US1 → browsable API docs (MVP)
3. US2 → Try it out smoke verified
4. US3 → production guard + full regression
5. Polish → README + PROMPTS + final commit

### Suggested Commits (conventional)

| After | Message example |
|-------|-----------------|
| Phase 1 | `chore(backend): add swagger dependencies and openapi spec` |
| Phase 2 tests | `test(backend): add swagger docs integration tests` |
| US1 | `feat(backend): mount swagger ui at /api-docs` |
| US3 | `feat(backend): disable api docs in production` |
| Polish | `docs: document swagger api docs in README` |

---

## Notes

- Backend tests: **Jest** + Supertest only (constitution)
- No frontend tasks — purchase UI unchanged (FR-005, SC-005)
- Same-origin docs at `:3000` — no CORS changes required (see `research.md`)
- Sync rule: changes to `specs/001-phone-case-purchase/contracts/api.md` require updating `backend/src/openapi/openapi.json`
- Spec reference: `specs/002-swagger-api-docs/spec.md`
- OpenAPI contract: `specs/002-swagger-api-docs/contracts/openapi.yaml`
