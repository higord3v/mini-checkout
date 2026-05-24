# Data Model: Backend API Interactive Documentation

**Feature**: `002-swagger-api-docs` | **Date**: 2026-05-24

This feature adds **documentation artifacts**, not new business entities. Domain entities
(Product, PurchaseRequest, etc.) remain defined in `specs/001-phone-case-purchase/data-model.md`
and are **referenced** in the OpenAPI schemas below.

## OpenAPIDocument

Machine-readable description consumed by Swagger UI.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `openapi` | string | `3.0.3` | Version |
| `info` | object | title, version, description | Mini Checkout API |
| `servers` | array | url `http://localhost:3000` | Local dev only |
| `paths` | object | Keys `/api/products`, `/api/purchases` | Mirrors 001 contract |
| `components.schemas` | object | Product, envelopes, errors | Reusable response shapes |

### Path: `GET /api/products`

| Aspect | Value |
|--------|--------|
| OperationId | `listProducts` |
| Response 200 | `{ success, data: Product[] }` |

### Path: `POST /api/purchases`

| Aspect | Value |
|--------|--------|
| OperationId | `createPurchase` |
| Request body | `PurchaseRequest` |
| Response 201 | `PurchaseSuccess` |
| Response 400/404/409/500 | `ErrorResponse` |

## ApiDocsConfig (runtime)

Controls whether interactive documentation is mounted.

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `enabled` | boolean | `NODE_ENV !== 'production'` | Overridable in `createApp({ enableApiDocs })` for tests |
| `routePrefix` | string | `/api-docs` | Swagger UI mount path |
| `spec` | OpenAPIDocument | from `openapi.json` | Served to UI |

## DocumentationSession (logical)

Ephemeral browser session; not persisted.

| State | Description |
|-------|-------------|
| Browsing | User views operations and schemas |
| Executing | User submits Try it out → HTTP to live API |
| Failed connection | Backend down; UI shows fetch/network error |

## Relationships

```text
OpenAPIDocument ──describes──▶ existing REST operations (001)
ApiDocsConfig ──gates──▶ mount of swagger-ui-express on Express app
DocumentationSession ──uses──▶ OpenAPIDocument + running API instance
```

## Sync rules (FR-004)

When `specs/001-phone-case-purchase/contracts/api.md` changes:

1. Update `backend/src/openapi/openapi.json`
2. Update `specs/002-swagger-api-docs/contracts/openapi.yaml` (design mirror)
3. Extend Jest test assertions if paths or status codes change
