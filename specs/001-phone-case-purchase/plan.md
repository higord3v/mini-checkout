# Implementation Plan: Phone Case Purchase Flow

**Branch**: `main` (trunk-based; no feature branches) | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-phone-case-purchase/spec.md` and technical
details from `spec-prompt.md`.

## Summary

Build a local monorepo checkout simulator: Express API with in-memory product catalog,
Zod-validated `POST /api/purchases` (1–2s simulated delay, stock rules, standard HTTP
errors), and a React purchase screen with loading state, duplicate-submit prevention,
and a dedicated API service layer. Backend tested with Jest + Supertest; frontend with
Vitest + React Testing Library. TDD and small commits on `main` per constitution.

## Technical Context

**Language/Version**: TypeScript strict mode; Node.js 20+; React 18+

**Primary Dependencies**: Express, Zod, cors, uuid (via `crypto.randomUUID`); Vite,
React; dev: Jest, Supertest, Vitest, React Testing Library

**Storage**: In-memory product repository (seeded at startup)

**Testing**: Jest + Supertest (backend); Vitest + RTL (frontend)

**Target Platform**: Local Node.js API (`:3000`) + browser (Vite `:5173`)

**Project Type**: Monorepo web application (`backend/` + `frontend/`)

**Performance Goals**: Purchase feedback within ~3s including 1–2s simulated processing;
loading UI visible within 500ms of submit (SC-005)

**Constraints**: No cloud services; no Docker required for v1; CORS for local dev only

**Scale/Scope**: 2 seed products, single purchase screen, one write endpoint + catalog read

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify before Phase 0 research (re-check after Phase 1 design):

- [x] **TDD**: Test tasks will precede implementation in `tasks.md`; service + API tests first
- [x] **Incremental**: Phased by user story (P1 → P2 → P3) with commit per task group
- [x] **Simplicity**: Layered backend per requirements; no extra packages beyond Zod/cors
- [x] **Stack**: Node + TS + Express; React + Vite; Jest on backend
- [x] **Tests**: Jest + Supertest backend; Vitest frontend (backend Jest per constitution)
- [x] **Workflow**: `main` branch; spec in `specs/001-phone-case-purchase/`
- [x] **Prompts**: Recorded in `PROMPTS.md`

**Post-design re-check (Phase 1)**: All gates pass. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/001-phone-case-purchase/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api.md
└── tasks.md             # /speckit-tasks (not created by plan)
```

### Source Code (repository root)

```text
backend/
├── package.json
├── tsconfig.json
├── jest.config.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   │   ├── products.routes.ts
│   │   └── purchases.routes.ts
│   ├── controllers/
│   │   ├── products.controller.ts
│   │   └── purchases.controller.ts
│   ├── services/
│   │   └── purchase.service.ts
│   ├── repositories/
│   │   └── product.repository.ts
│   ├── models/
│   │   └── product.ts
│   ├── validators/
│   │   └── purchase.validator.ts
│   ├── middleware/
│   │   └── error.middleware.ts
│   └── utils/
│       └── delay.ts
└── tests/
    ├── unit/
    │   └── purchase.service.test.ts
    └── integration/
        └── purchases.api.test.ts

frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   └── PurchasePage.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ProductCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Alert.tsx
│   ├── hooks/
│   │   └── usePurchase.ts
│   ├── services/
│   │   ├── productService.ts
│   │   └── purchaseService.ts
│   ├── types/
│   │   └── api.ts
│   └── api/
│       └── client.ts
└── tests/
    ├── components/
    └── pages/
```

**Structure Decision**: Monorepo per constitution. Backend layers match `spec-prompt.md`
without extra indirection (one repository implementation). Frontend isolates HTTP in
`services/` + `api/client.ts`; components remain presentational.

## Implementation Phases (for `/speckit-tasks`)

| Phase | Scope | User story |
|-------|--------|------------|
| Setup | Monorepo scaffolding, TS strict, scripts | — |
| Foundation | Express app, error middleware, seed repo, GET products | — |
| P1 | POST purchases happy path, delay, stock, UI purchase flow | US1 |
| P2 | Validation errors 400, UI error display | US2 |
| P3 | 404/409 paths, edge cases | US3 |
| Polish | README, PROMPTS, final commits | FR-016 |

## Complexity Tracking

> No constitution violations. Layered architecture is required by feature prompt, not
> speculative over-engineering.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Generated Artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| API contract | [contracts/api.md](./contracts/api.md) |
| Quickstart | [quickstart.md](./quickstart.md) |
