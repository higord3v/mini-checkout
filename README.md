# Mini Checkout - Spec Driven Development Project (Github SpecKit)

A local full-stack phone case purchase simulator with validation, in-memory stock,
async processing feedback, and a React checkout UI.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Backend | Node.js, TypeScript, Express, Zod |
| Frontend | React, TypeScript, Vite |
| Backend tests | Jest, Supertest |
| Frontend tests | Vitest, React Testing Library |

## Architecture

- **Monorepo** with `backend/` and `frontend/` at the repository root.
- **Backend**: routes → controllers → services → in-memory repository; Zod validation;
  centralized error middleware mapping HTTP status codes.
- **Frontend**: service layer (`productService`, `purchaseService`) over a shared
  `api/client`; UI components stay free of direct `fetch` calls.
- **TDD**: tests written before implementation per project constitution.

## Folder structure

```text
backend/src/     API, business logic, validation
backend/tests/   Jest unit + integration tests
frontend/src/    React UI, hooks, services
frontend/tests/  Vitest component tests
specs/           Spec Kit feature documentation
```

## Setup

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Run

**API** (port 3000):

```bash
cd backend
npm run dev
```

**UI** (port 5173):

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Assumptions

- No authentication; single local user.
- Catalog resets when the API restarts (in-memory store).
- Currency is implicit (no conversion).
- Purchase delay (1–2 seconds) simulates processing, not payment.

## Future improvements

- Persistent database
- Order history page
- Admin catalog management
- E2E tests (Playwright)
- Docker Compose for one-command startup

## Feature documentation

See `specs/001-phone-case-purchase/` for spec, plan, tasks, and API contract.
