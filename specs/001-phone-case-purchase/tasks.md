# Tasks: Phone Case Purchase Flow

**Input**: Design documents from `specs/001-phone-case-purchase/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: MANDATORY (constitution TDD). Write tests → **user approves** → confirm red → implement → green. Commit after each logical group on `main`.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no blocking deps)
- **[Story]**: US1, US2, US3 for user-story phases only

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo scaffolding with TypeScript strict mode and test runners.

- [ ] T001 Create `backend/package.json` with Express, Zod, cors, TypeScript, Jest, Supertest, and `dev`/`start`/`test` scripts
- [ ] T002 Create `backend/tsconfig.json` (`strict: true`) and `backend/jest.config.ts` for `tests/**/*.test.ts`
- [ ] T003 Create `frontend/package.json` with React, Vite, TypeScript, Vitest, and `@testing-library/react`
- [ ] T004 Create `frontend/tsconfig.json` (`strict: true`), `frontend/vite.config.ts`, and Vitest config in `frontend/vite.config.ts`
- [ ] T005 [P] Add repository root `.gitignore` for `node_modules/`, `dist/`, coverage output
- [ ] T006 [P] Create backend folder scaffold per `plan.md` under `backend/src/` (routes, controllers, services, repositories, models, validators, middleware, utils)
- [ ] T007 [P] Create frontend folder scaffold per `plan.md` under `frontend/src/` (pages, components, hooks, services, types, api)

**Checkpoint**: `cd backend && npm install` and `cd frontend && npm install` succeed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API infrastructure and catalog read — MUST complete before user stories.

**⚠️ CRITICAL**: No user story work until this phase is complete.

### Tests for Foundation (write first — must fail)

- [ ] T008 Write failing integration test for `GET /api/products` in `backend/tests/integration/products.api.test.ts` (expects 200 + seeded products per `data-model.md`)
- [ ] T009 Write failing unit test for seed data in `backend/tests/unit/product.repository.test.ts`

### Implementation for Foundation

- [ ] T010 Implement `Product` type in `backend/src/models/product.ts`
- [ ] T011 Implement in-memory `ProductRepository` with seed data in `backend/src/repositories/product.repository.ts`
- [ ] T012 Implement centralized error middleware in `backend/src/middleware/error.middleware.ts` (`{ success, message }` shape)
- [ ] T013 Implement Express app factory in `backend/src/app.ts` (JSON parser, cors for `http://localhost:5173`, mount routes)
- [ ] T014 Implement `GET /api/products` in `backend/src/controllers/products.controller.ts` and `backend/src/routes/products.routes.ts`
- [ ] T015 Implement entrypoint in `backend/src/server.ts` (listen port 3000)
- [ ] T016 Run backend tests; fix until T008–T009 pass (green)
- [ ] T017 Implement HTTP client in `frontend/src/api/client.ts` (base URL `http://localhost:3000`)
- [ ] T018 Implement API types in `frontend/src/types/api.ts` (Product, ApiResponse)
- [ ] T019 Implement `getProducts()` in `frontend/src/services/productService.ts`
- [ ] T020 [P] Create base UI components `frontend/src/components/Button.tsx`, `Input.tsx`, `LoadingSpinner.tsx`, `Alert.tsx`

**Checkpoint**: `GET /api/products` returns seeded catalog; backend foundation tests green.

---

## Phase 3: User Story 1 — Complete a Purchase (Priority: P1) 🎯 MVP

**Goal**: Shopper completes a valid purchase with loading state, success message, and updated stock.

**Independent Test**: Select product with sufficient stock, quantity 2, submit → 201 success, stock −2, UI shows "Purchase completed successfully", controls disabled while loading.

### Tests for User Story 1 (MANDATORY — write first, must fail)

> **STOP**: Obtain user approval on tests T021–T024 before any implementation tasks T025+.

- [ ] T021 [P] [US1] Write failing unit tests for successful purchase in `backend/tests/unit/purchase.service.test.ts` (delay, stock decrement, purchaseId)
- [ ] T022 [P] [US1] Write failing integration test `POST /api/purchases` → 201 in `backend/tests/integration/purchases.api.test.ts` (happy path only)
- [ ] T023 [P] [US1] Write failing Vitest test for loading/disabled submit in `frontend/tests/hooks/usePurchase.test.ts`
- [ ] T024 [P] [US1] Write failing Vitest test for success message in `frontend/tests/pages/PurchasePage.test.tsx`

### Implementation for User Story 1

- [ ] T025 [US1] Implement random delay helper in `backend/src/utils/delay.ts` (1000–2000 ms)
- [ ] T026 [US1] Implement Zod schema in `backend/src/validators/purchase.validator.ts` (`productId`, `quantity` integer > 0)
- [ ] T027 [US1] Implement `PurchaseService.createPurchase()` in `backend/src/services/purchase.service.ts`
- [ ] T028 [US1] Implement `POST /api/purchases` in `backend/src/controllers/purchases.controller.ts` and `backend/src/routes/purchases.routes.ts`
- [ ] T029 [US1] Register purchases routes in `backend/src/app.ts`
- [ ] T030 [US1] Run backend tests; fix until T021–T022 pass (green)
- [ ] T031 [US1] Implement `createPurchase()` in `frontend/src/services/purchaseService.ts`
- [ ] T032 [US1] Implement `usePurchase` hook in `frontend/src/hooks/usePurchase.ts` (loading, disable duplicate submit)
- [ ] T033 [P] [US1] Implement `frontend/src/components/ProductCard.tsx`
- [ ] T034 [US1] Implement purchase screen in `frontend/src/pages/PurchasePage.tsx` (list products, select, quantity, submit, spinner, success text)
- [ ] T035 [US1] Wire `PurchasePage` in `frontend/src/App.tsx` and `frontend/src/main.tsx`
- [ ] T036 [US1] Run frontend tests; fix until T023–T024 pass (green)
- [ ] T037 [US1] Manual smoke test per `quickstart.md` (successful purchase + stock refresh via `GET /api/products`)

**Checkpoint**: MVP complete — US1 independently testable end-to-end.

---

## Phase 4: User Story 2 — Invalid Purchase Input (Priority: P2)

**Goal**: Reject invalid/missing input with HTTP 400 and clear messages; stock unchanged.

**Independent Test**: Submit zero quantity, missing productId, malformed body → 400 + message; stock unchanged; UI shows server message.

### Tests for User Story 2 (MANDATORY — write first, must fail)

> **STOP**: Obtain user approval on tests T038–T040 before implementation T041+.

- [ ] T038 [P] [US2] Extend `backend/tests/unit/purchase.service.test.ts` with validation failure cases (no stock change)
- [ ] T039 [P] [US2] Add integration tests for 400 responses in `backend/tests/integration/purchases.validation.test.ts`
- [ ] T040 [P] [US2] Add Vitest tests for validation error display in `frontend/tests/pages/PurchasePage.validation.test.tsx`

### Implementation for User Story 2

- [ ] T041 [US2] Harden `backend/src/validators/purchase.validator.ts` (missing fields, invalid types, quantity ≤ 0 messages)
- [ ] T042 [US2] Map Zod/validation errors to HTTP 400 in `backend/src/middleware/error.middleware.ts`
- [ ] T043 [US2] Map API errors to user messages in `frontend/src/services/purchaseService.ts`
- [ ] T044 [US2] Display validation errors in `frontend/src/pages/PurchasePage.tsx` via `Alert`
- [ ] T045 [US2] Run all US2 tests until green; verify stock unchanged on 400

**Checkpoint**: US1 + US2 both work independently.

---

## Phase 5: User Story 3 — Unavailable Product / Insufficient Stock (Priority: P3)

**Goal**: Return 404 for unknown product and 409 for insufficient stock; stock unchanged on failure.

**Independent Test**: `productId: "unknown"` → 404; quantity > stock → 409; UI shows distinct messages.

### Tests for User Story 3 (MANDATORY — write first, must fail)

> **STOP**: Obtain user approval on tests T046–T048 before implementation T049+.

- [ ] T046 [P] [US3] Add service unit tests for not-found and conflict in `backend/tests/unit/purchase.service.test.ts`
- [ ] T047 [P] [US3] Add integration tests for 404/409 in `backend/tests/integration/purchases.errors.test.ts`
- [ ] T048 [P] [US3] Add Vitest tests for not-found and insufficient-stock messages in `frontend/tests/pages/PurchasePage.errors.test.tsx`

### Implementation for User Story 3

- [ ] T049 [US3] Add domain errors (e.g. `backend/src/errors/app.errors.ts`) for NotFound and Conflict
- [ ] T050 [US3] Implement product-exists and stock checks in `backend/src/services/purchase.service.ts`
- [ ] T051 [US3] Map 404/409 in `backend/src/middleware/error.middleware.ts` per `contracts/api.md`
- [ ] T052 [US3] Handle 404/409 in `frontend/src/services/purchaseService.ts` with distinct UI messages
- [ ] T053 [US3] Run all US3 tests until green

**Checkpoint**: All three user stories independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final validation.

- [ ] T054 Create root `README.md` with overview, stack, architecture, folder structure, setup, run, test, assumptions, future improvements (FR-016)
- [ ] T055 Validate `specs/001-phone-case-purchase/quickstart.md` end-to-end (install, run, test, smoke scenarios)
- [ ] T056 [P] Add network-error handling in `frontend/src/services/purchaseService.ts` (friendly offline message)
- [ ] T057 Run full suites: `cd backend && npm test` and `cd frontend && npm test`
- [ ] T058 Commit any remaining changes with conventional commit message on `main`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → no dependencies
- **Foundational (Phase 2)** → depends on Setup; **blocks all user stories**
- **US1 (Phase 3)** → depends on Foundational → **MVP**
- **US2 (Phase 4)** → depends on Foundational; extends US1 purchase path
- **US3 (Phase 5)** → depends on Foundational; extends US1 purchase path
- **Polish (Phase 6)** → depends on desired stories (recommend US1–US3 complete)

### User Story Dependencies

| Story | Depends on | Notes |
|-------|------------|-------|
| US1 | Foundation | Core purchase flow |
| US2 | Foundation + US1 endpoint/UI | Adds 400 paths to same POST |
| US3 | Foundation + US1 endpoint/UI | Adds 404/409 to same POST |

US2 and US3 can proceed sequentially after US1 MVP; they touch overlapping files — avoid parallel edits to `purchase.service.ts` across stories.

### Within Each User Story (TDD)

1. Write tests (T00x) → **user approval** → confirm red
2. Implement backend → green backend tests
3. Implement frontend → green frontend tests
4. Manual checkpoint / commit

---

## Parallel Example: User Story 1

```bash
# After user approves tests, launch backend test files together:
# backend/tests/unit/purchase.service.test.ts
# backend/tests/integration/purchases.api.test.ts

# Parallel frontend test authoring:
# frontend/tests/hooks/usePurchase.test.ts
# frontend/tests/pages/PurchasePage.test.tsx

# Parallel UI components (after hook exists):
# frontend/src/components/ProductCard.tsx
# frontend/src/components/Button.tsx (if not done in foundation)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE** per `quickstart.md` smoke test  
5. Demo/deploy locally if ready  

### Incremental Delivery

1. Foundation → catalog API ready  
2. US1 → full happy-path checkout (MVP)  
3. US2 → validation hardening  
4. US3 → not-found and stock conflict  
5. Polish → README + full regression  

### Suggested Commits (conventional)

| After | Message example |
|-------|-----------------|
| Phase 1 | `chore: scaffold backend and frontend monorepo` |
| Phase 2 | `feat: add product catalog API with tests` |
| US1 tests | `test: add purchase happy-path tests` |
| US1 impl | `feat: implement purchase flow and checkout UI` |
| US2 | `feat: add purchase validation errors` |
| US3 | `feat: handle not-found and insufficient stock` |
| Polish | `docs: add README and finalize quickstart` |

---

## Notes

- Backend tests: **Jest** + Supertest only (constitution)  
- Frontend tests: **Vitest** + React Testing Library  
- Do not call `fetch` from React components — use `frontend/src/services/*`  
- Spec reference: `specs/001-phone-case-purchase/spec.md`  
- API contract: `specs/001-phone-case-purchase/contracts/api.md`
