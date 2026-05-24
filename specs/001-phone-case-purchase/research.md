# Research: Phone Case Purchase Flow

**Feature**: `001-phone-case-purchase` | **Date**: 2026-05-24

## 1. Validation library

**Decision**: Zod for request body and shared types (inferred schemas).

**Rationale**: Explicit in `spec-prompt.md`; integrates well with TypeScript; separates
schema validation from Express handlers; supports required fields, types, and refinements
for business rules (e.g., `quantity > 0`).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| `express-validator` | Less ergonomic TypeScript inference |
| Manual checks | Error-prone, duplicates rules |

## 2. Persistence

**Decision**: In-memory `ProductRepository` with module-level seed data.

**Rationale**: Spec requires local-only, no cloud; session-scoped catalog is acceptable.
Sufficient for stock mutation during purchase attempts.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| SQLite | Adds setup complexity for challenge scope |
| JSON file | Unnecessary I/O for two products |

## 3. Backend testing

**Decision**: Jest + Supertest (constitution-mandated Jest).

**Rationale**: Unit tests for `PurchaseService`; HTTP integration tests for
`POST /api/purchases` status codes and response bodies.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Vitest (backend) | Constitution requires Jest on backend |

## 4. Frontend testing

**Decision**: Vitest + React Testing Library.

**Rationale**: Native Vite integration; spec-prompt suggests Vitest for frontend.
Constitution mandates Jest for backend only.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Jest (frontend) | Possible but weaker Vite ergonomics |
| No frontend tests | Spec marks tests as preferred; plan includes component/flow tests |

## 5. Catalog API

**Decision**: Add `GET /api/products` returning the full product list.

**Rationale**: Purchase screen must display live stock (FR-001, SC-004). Frontend should
not hardcode catalog; server is source of truth after purchases.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Hardcoded frontend catalog | Stock would desync after purchase |

## 6. Processing delay

**Decision**: Random delay `1000–2000 ms` via `setTimeout` in service before stock update.

**Rationale**: Matches spec FR-007 and acceptance scenarios for loading UX.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Fixed 1s | Does not satisfy 1–2 second range |

## 7. Purchase ID

**Decision**: `crypto.randomUUID()` for `purchaseId`.

**Rationale**: Unique, no extra dependency, satisfies FR-009.

## 8. CORS & local dev

**Decision**: `cors` middleware allowing `http://localhost:5173` (Vite default).

**Rationale**: Monorepo local dev with separate frontend/backend ports.

## 9. Error handling pattern

**Decision**: Custom error classes (`ValidationError`, `NotFoundError`, `ConflictError`)
mapped in centralized Express error middleware to HTTP 400/404/409/500 with
`{ success: false, message }`.

**Rationale**: Aligns with `spec-prompt.md` response contract; keeps controllers thin.

## 10. Layered backend layout

**Decision**: routes → controllers → services → repositories; validators as Zod schemas;
middleware for errors and JSON parsing.

**Rationale**: Requested in `spec-prompt.md`; supports TDD at service layer without
over-abstracting (single in-memory repo implementation, light constructor injection in
tests).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Fat route handlers | Harder to unit test business rules |

## 11. Duplicate submission (frontend)

**Decision**: `isSubmitting` state + disabled controls + ignore in-flight `purchaseService` calls.

**Rationale**: Satisfies FR-012 and SC-003 without server-side session complexity.

## 12. TypeScript strict mode

**Decision**: `"strict": true` in both `backend/tsconfig.json` and `frontend/tsconfig.json`.

**Rationale**: Explicit non-functional requirement in `spec-prompt.md`.
