# Data Model: Phone Case Purchase Flow

**Feature**: `001-phone-case-purchase` | **Date**: 2026-05-24

## Product

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | string | Required, unique | e.g. `p1`, `p2` |
| `name` | string | Required, non-empty | Display name |
| `price` | number | Required, ≥ 0 | Unit price (implicit currency) |
| `stock` | integer | Required, ≥ 0 | Mutable on successful purchase |

### Seed data (initial)

| id | name | price | stock |
|----|------|-------|-------|
| p1 | Samsung Green Case | 45 | 5 |
| p2 | Iphone Red Case | 30 | 10 |

## PurchaseRequest (input)

| Field | Type | Constraints |
|-------|------|-------------|
| `productId` | string | Required, non-empty |
| `quantity` | number (int) | Required, integer, > 0 |

Validated by Zod before service layer. Business rules (product exists, stock) enforced in
`PurchaseService`.

## PurchaseResult (success output)

| Field | Type | Constraints |
|-------|------|-------------|
| `success` | boolean | `true` |
| `message` | string | e.g. `"Purchase completed"` |
| `purchaseId` | string | UUID |

## ErrorResponse (failure output)

| Field | Type | Constraints |
|-------|------|-------------|
| `success` | boolean | `false` |
| `message` | string | Human-readable, no stack trace |

## PurchaseAttempt (logical)

Not persisted as a separate table in v1. Represents the in-flight operation:

| State | Description |
|-------|-------------|
| `validating` | Schema + business checks |
| `processing` | Delay 1–2s (simulated) |
| `completed` | Stock decremented, ID returned |
| `failed` | Stock unchanged, error returned |

## Relationships

```text
Catalog 1──* Product
PurchaseRequest *──1 Product (by productId, when exists)
Successful PurchaseAttempt → decrements Product.stock by quantity
```

## Validation rules (summary)

| Rule | Layer | Failure |
|------|-------|---------|
| Body parseable JSON | Express | 400 |
| `productId` present, `quantity` integer > 0 | Zod | 400 |
| Product exists | Service | 404 |
| `quantity <= stock` | Service | 409 |
| Unexpected exception | Middleware | 500 |

## State transitions (Product.stock)

```text
stock = N
  → [successful purchase qty Q] → stock = N - Q  (where Q ≤ N)
  → [failed attempt] → stock unchanged
```

Stock MUST NOT go negative; reject with 409 when `quantity > stock`.
