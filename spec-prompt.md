
Project Specification: Phone Cases Purchase Attempt System

Goal:
Build a simple full-stack application that simulates a Phone Cases purchase attempt flow while prioritizing clean architecture, maintainable code, good engineering practices, simple local execution, proper validation/error handling, and a good user experience during async operations.

Stack:
Backend:
- Node.js
- TypeScript
- Express (preferred)

Frontend:
- React
- TypeScript
- Vite (preferred)

Additional libraries can be used if they improve organization and developer experience.

Functional Requirements

Backend:
Create an API for purchase attempts.

Endpoint:
POST /api/purchases

Example request:
{
  "productId": "p1",
  "quantity": 2
}

Create a simple product representation:

type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};

Use only local resources:
- In-memory storage or lightweight local database
- No cloud services

Pre-populate sample products such as:

[
  {
    id: "p1",
    name: "Samsung Green Case",
    price: 45,
    stock: 5
  },
  {
    id: "p2",
    name: "Iphone Red Case",
    price: 30,
    stock: 10
  }
]

Purchase flow rules:
1. Validate request body
2. Product must exist
3. Quantity must be greater than zero
4. Quantity cannot exceed stock
5. Simulate processing delay between 1–2 seconds
6. Reduce stock after successful purchase
7. Return proper success and error responses

HTTP Responses:

Success:
HTTP 201
{
  "success": true,
  "message": "Purchase completed",
  "purchaseId": "generated-id"
}

Invalid request:
HTTP 400
Examples:
- missing productId
- invalid quantity
- malformed body

Product not found:
HTTP 404

Insufficient stock:
HTTP 409

Unexpected error:
HTTP 500

Use a consistent error response shape:
{
  "success": false,
  "message": "Human readable message"
}

Validation:
Use Zod (preferred).

Validation should include:
- Required fields
- Type validation
- Business rule validation

Architecture:

Backend structure example:

src/
  routes/
  controllers/
  services/
  repositories/
  models/
  validators/
  middleware/
  utils/

Follow SOLID principles when appropriate:
- Service layer for business logic
- Repository abstraction for data access
- Dependency injection where useful
- Centralized error handling middleware

Frontend Requirements:

Create a simple purchase screen that:

- Displays available products
- Allows selecting a product
- Allows entering quantity
- Allows starting a purchase
- Shows loading state while purchase is processing
- Prevents duplicate submissions
- Disables button while loading
- Shows success messages
- Shows meaningful error messages

UI behavior:

During processing:
- Show loading indicator or spinner
- Disable form inputs
- Disable submit button
- Prevent duplicate API requests

After success:
Display:
"Purchase completed successfully"

After failure:
Display meaningful server messages such as:
- Product not found
- Insufficient stock
- Invalid quantity

Frontend structure example:

src/
  components/
  pages/
  hooks/
  services/
  types/
  api/
  utils/

Create reusable components when appropriate:
- Button
- Input
- ProductCard
- LoadingSpinner
- Alert

API communication:

Create a dedicated API/service layer.

Example:
purchaseService.ts

Responsibilities:
- API requests
- Response typing
- Error mapping

Do not call fetch directly from UI components.

Error Handling:

Handle:
- Network failures
- Validation errors
- Unexpected server errors

Provide user-friendly messages.

Testing (preferred):

Backend:
- Unit tests for services
- API integration tests

Frontend:
- Component tests
- Basic user-flow tests

Suggested tools:
Backend:
- Vitest or Jest
- Supertest

Frontend:
- Vitest
- React Testing Library

README Requirements:

Include:

1. Project overview
2. Tech stack
3. Architecture decisions
4. Folder structure explanation
5. Setup instructions
6. How to run backend
7. How to run frontend
8. How to run tests
9. Assumptions made
10. Future improvements

Non-functional Requirements:

- Keep code clean and readable
- Enable TypeScript strict mode
- Avoid unnecessary complexity
- Keep setup simple
- Use Docker Compose only if needed
- Everything must run locally

Expected Deliverables:

✓ Purchase API
✓ Product and stock representation
✓ Validation
✓ Proper HTTP responses
✓ Purchase screen
✓ Loading state
✓ Duplicate action prevention
✓ User feedback
✓ Organized architecture
✓ README
✓ Automated tests (preferred)

Generate production-quality code without overengineering.