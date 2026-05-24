# Quickstart: Backend API Interactive Documentation

**Feature**: `002-swagger-api-docs` | **Date**: 2026-05-24

## Prerequisites

- Node.js 20+
- Backend from feature `001` installed and runnable (`cd backend && npm install`)

## Run API with documentation

**Terminal — API** (port 3000):

```bash
cd backend
npm run dev
```

Open in browser:

**http://localhost:3000/api-docs**

Swagger UI loads with `GET /api/products` and `POST /api/purchases`. Use **Try it out** to
send live requests to the same server (no Postman required).

> Documentation is **not** mounted when `NODE_ENV=production` (e.g. `npm start` in a
> production-like environment). Use `npm run dev` for local testing.

## Manual smoke test (5 minutes)

1. **Catalog** — Execute `GET /api/products` → `200`, `success: true`, array with `p1` and `p2`.
2. **Valid purchase** — Execute `POST /api/purchases` with `{ "productId": "p1", "quantity": 1 }`
   → wait 1–2s → `201`, `purchaseId` present, stock decreases on repeat catalog call.
3. **Validation** — `quantity: 0` → `400`, `{ "success": false, "message": "..." }`.
4. **Not found** — `productId: "unknown"` → `404`.
5. **Conflict** — quantity greater than remaining stock → `409`.

## Run automated tests

```bash
cd backend
npm test
```

Includes integration tests for `/api-docs` availability when docs are enabled and absence
when disabled.

## Relationship to purchase UI

- Customer flow: `http://localhost:5173` (unchanged).
- Developer/testing flow: `http://localhost:3000/api-docs` (this feature).
- No frontend changes required.

## Key documents

| Document | Path |
|----------|------|
| Spec | `specs/002-swagger-api-docs/spec.md` |
| Plan | `specs/002-swagger-api-docs/plan.md` |
| OpenAPI contract | `specs/002-swagger-api-docs/contracts/openapi.yaml` |
| Runtime spec (implement) | `backend/src/openapi/openapi.json` |
| Purchase API (source of truth) | `specs/001-phone-case-purchase/contracts/api.md` |

## TDD workflow

1. Add failing Jest tests for docs routes and OpenAPI path coverage.
2. Obtain user approval on tests.
3. Implement `swagger-ui-express` mount + `openapi.json`.
4. Commit on `main` with conventional message (e.g. `feat(backend): add swagger api docs`).
