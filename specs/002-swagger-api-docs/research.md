# Research: Backend API Interactive Documentation

**Feature**: `002-swagger-api-docs` | **Date**: 2026-05-24

## 1. Documentation UI library

**Decision**: `swagger-ui-express` serving Swagger UI from the existing Express app.

**Rationale**: De facto standard for OpenAPI interactive docs; minimal integration (mount
middleware + static OpenAPI document); satisfies user request for “Swagger” without a
separate service or frontend build step.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Redoc standalone | Extra setup; user asked for Swagger |
| `swagger-jsdoc` (annotate routes) | Duplicates contract already in `001` specs; drift risk |
| Postman collection only | Not browser-native; spec requires in-app discovery + try-it-out |
| Separate docs site (Vite) | Over-engineering for two endpoints |

## 2. OpenAPI document source

**Decision**: Hand-maintained OpenAPI 3.0 JSON at `backend/src/openapi/openapi.json`,
kept in sync with `specs/001-phone-case-purchase/contracts/api.md`.

**Rationale**: Single readable artifact; no code-generation pipeline; explicit diff in PRs
when API changes (FR-004). JSON avoids adding a YAML parser dependency.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Generate from Zod | Extra tooling; only two endpoints |
| Duplicate only in JSDoc | Harder to review against feature contract |
| Copy `api.md` only | No machine-readable spec for Swagger UI |

## 3. URL and mounting

**Decision**: Serve UI at `GET /api-docs` (Swagger UI assets and index via
`swagger-ui-express`); document base URL `http://localhost:3000` in OpenAPI `servers`.

**Rationale**: Common convention; same host/port as API so “Try it out” is **same-origin**
and does not require CORS changes (FR edge case resolved without widening `cors` origins).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| `/swagger` | Less conventional in Express ecosystems |
| Docs on port 5173 | Cross-origin CORS complexity |

## 4. Local-only / dev gating

**Decision**: Mount documentation only when `NODE_ENV !== 'production'`. Default `npm run dev`
and `npm test` use non-production env; `npm start` after build typically sets production.

**Rationale**: Satisfies FR-005 and US3 without new env vars for v1. Tests pass
`enableApiDocs: true` via `createApp` options for deterministic Jest coverage.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| `ENABLE_API_DOCS=true` | Extra config for small project |
| Always on | Violates safe local-only intent |

## 5. Backend testing approach

**Decision**: Jest + Supertest integration tests:

- With docs enabled: `GET /api-docs/` returns 200; OpenAPI JSON includes both paths.
- With docs disabled (production mode simulation): `GET /api-docs/` returns 404.

**Rationale**: Constitution mandates Jest; automated check prevents spec drift (FR-004,
FR-006). Interactive UI smoke remains manual per quickstart.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| E2E Playwright for Swagger | Heavy for dev-only tooling |
| No tests | Violates TDD principle for new behavior |

## 6. CORS

**Decision**: No CORS change required when Swagger UI is served from the API origin
(`http://localhost:3000/api-docs`).

**Rationale**: Browser requests from Try it out target `http://localhost:3000/api/*`
(same origin). Existing `cors` for `http://localhost:5173` remains for the React app only.

## 7. Scope boundaries

**Decision**: Backend-only change; no frontend package or route changes.

**Rationale**: FR-005, SC-005; documentation consumers are developers/testers, not shoppers.

## 8. Dependencies

**Decision**: Add `swagger-ui-express` (runtime) and `@types/swagger-ui-express` (dev).

**Rationale**: Smallest addition on constitution stack; no `swagger-jsdoc`, no YAML libs.
