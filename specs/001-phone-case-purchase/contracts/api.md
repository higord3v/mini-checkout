# API Contract: Phone Case Purchase

**Base URL (local)**: `http://localhost:3000`  
**Feature**: `001-phone-case-purchase` | **Date**: 2026-05-24

All JSON responses use `Content-Type: application/json`.

## GET /api/products

Returns the catalog for the purchase screen.

### Response `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "name": "Samsung Green Case",
      "price": 45,
      "stock": 5
    }
  ]
}
```

## POST /api/purchases

Creates a purchase attempt for one product.

### Request body

```json
{
  "productId": "p1",
  "quantity": 2
}
```

| Field | Type | Required |
|-------|------|----------|
| productId | string | yes |
| quantity | integer (> 0) | yes |

### Response `201 Created` (success)

```json
{
  "success": true,
  "message": "Purchase completed",
  "purchaseId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Processing: server waits 1–2 seconds before committing stock reduction.

### Response `400 Bad Request` (validation)

```json
{
  "success": false,
  "message": "Invalid quantity"
}
```

Examples: missing `productId`, non-integer quantity, quantity ≤ 0, malformed JSON.

### Response `404 Not Found`

```json
{
  "success": false,
  "message": "Product not found"
}
```

### Response `409 Conflict`

```json
{
  "success": false,
  "message": "Insufficient stock"
}
```

### Response `500 Internal Server Error`

```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

## Error shape (all failures)

```json
{
  "success": false,
  "message": "<human-readable string>"
}
```

## CORS

Browser clients on Vite dev origin (`http://localhost:5173`) MUST be allowed for
`GET` and `POST` during local development.

## Frontend consumption

- `productService.getProducts()` → `GET /api/products`
- `purchaseService.createPurchase({ productId, quantity })` → `POST /api/purchases`
- UI MUST NOT call `fetch` directly from components (service layer only).
