# Quickstart: Phone Case Purchase Flow

**Feature**: `001-phone-case-purchase` | **Date**: 2026-05-24

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+

## Repository layout

```text
backend/     # Express API, Jest tests
frontend/    # React + Vite, Vitest tests
specs/001-phone-case-purchase/   # This feature's design docs
```

## First-time setup

```bash
# From repository root
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## Run locally

**Terminal 1 — API** (port 3000):

```bash
cd backend
npm run dev
```

**Terminal 2 — UI** (port 5173):

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` — purchase screen lists products from `GET /api/products`.

## Run tests

**Backend** (Jest + Supertest):

```bash
cd backend
npm test
```

**Frontend** (Vitest + RTL):

```bash
cd frontend
npm test
```

## Manual smoke test

1. Select **Samsung Green Case**, quantity `2`, submit → success message, stock decreases.
2. Submit quantity `0` or empty product → validation error, stock unchanged.
3. Request quantity greater than remaining stock → insufficient stock message.
4. Double-click submit during loading → only one purchase processed.

## TDD workflow (constitution)

1. Write failing Jest test for behavior.
2. Get user approval on tests.
3. Confirm red → implement → green.
4. Commit with conventional message (`test:`, `feat:`, etc.) on `main`.

## Key documents

| Document | Path |
|----------|------|
| Spec | `specs/001-phone-case-purchase/spec.md` |
| Plan | `specs/001-phone-case-purchase/plan.md` |
| API contract | `specs/001-phone-case-purchase/contracts/api.md` |
| Data model | `specs/001-phone-case-purchase/data-model.md` |
