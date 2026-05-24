# Feature Specification: Backend API Interactive Documentation

**Working Branch**: `main` | **Spec folder**: `specs/002-swagger-api-docs/`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "add swagger to test backend endpoints"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover API Operations (Priority: P1)

As a developer or tester working on Mini Checkout, I want a single browsable view of all
public backend operations (catalog read and purchase create) with their inputs, outputs,
and error cases, so I can understand the API without reading source code or external notes.

**Why this priority**: Without accurate discovery, manual testing is guesswork and slows
integration with the purchase screen.

**Independent Test**: Open the documentation entry point while the backend is running;
verify both catalog and purchase operations appear with descriptions, parameters, and
example success and failure response shapes matching the existing API contract.

**Acceptance Scenarios**:

1. **Given** the backend is running locally, **When** the user opens the interactive
   documentation entry point in a browser, **Then** they see a list of all public API
   operations currently exposed by the checkout backend.
2. **Given** the documentation is open, **When** the user selects the catalog operation,
   **Then** they see that it requires no body, returns a product list on success, and
   documents the standard error envelope on failure.
3. **Given** the documentation is open, **When** the user selects the purchase operation,
   **Then** they see required fields (`productId`, `quantity`), success response fields
   (`success`, `message`, `purchaseId`), and documented failure cases (validation, not
   found, insufficient stock, server error).

---

### User Story 2 - Execute Requests from the Browser (Priority: P2)

As a developer or tester, I want to send real HTTP requests to the backend from the same
documentation interface and inspect responses, so I can validate behavior quickly during
development without installing a separate API client.

**Why this priority**: The user explicitly requested documentation to *test* endpoints;
interactive execution delivers that value beyond static reference pages.

**Independent Test**: From the documentation UI, perform a successful catalog fetch and a
valid purchase attempt (using known seed product IDs); confirm response status codes and
JSON bodies match documented shapes.

**Acceptance Scenarios**:

1. **Given** the backend is running and documentation is open, **When** the user executes
   the catalog operation with default parameters, **Then** they receive HTTP 200 with a
   JSON list of products including id, name, price, and stock.
2. **Given** a product with available stock, **When** the user executes the purchase
   operation with a valid `productId` and positive `quantity`, **Then** they receive HTTP
   201 with `success: true`, a completion message, and a `purchaseId` after the expected
   processing delay.
3. **Given** the purchase operation form, **When** the user submits invalid input (e.g.,
   missing `productId`, zero quantity, unknown product, quantity exceeding stock), **Then**
   they receive the appropriate error status (400, 404, or 409) and the standard
   `{ success: false, message }` body described in the contract.
4. **Given** a purchase is in progress (1–2 second simulated delay), **When** the user
   triggers another purchase from the documentation UI, **Then** each request is handled
   independently and responses reflect server state at the time of each call.

---

### User Story 3 - Safe Local-Only Access (Priority: P3)

As a project maintainer, I want interactive API documentation available only in local
development, so exploratory testing does not accidentally expose an executable admin-style
interface in non-local deployments.

**Why this priority**: Interactive “try it out” UIs increase risk if left enabled in
shared or production environments; constraining scope matches the project’s local-only
checkout simulator.

**Independent Test**: Start the backend in the documented local development mode; confirm
documentation is reachable. Verify project documentation states that the interactive UI
must not be enabled for production-like deployments.

**Acceptance Scenarios**:

1. **Given** local development startup instructions are followed, **When** the user
   navigates to the documentation URL documented in the project quickstart, **Then** the
   interactive documentation loads successfully.
2. **Given** the feature scope for v1, **When** the backend is configured for
   non-interactive or production-like use, **Then** the interactive documentation entry
   point is not advertised as available and is not required for end-user checkout flows.

---

### Edge Cases

- What happens when the backend process is stopped? The documentation page may load but
  executed requests fail with a clear connection error; the user must start the API first.
- What happens when request bodies are malformed JSON? The purchase operation returns the
  documented validation error response (400) with a human-readable message.
- What happens when stock is depleted by a prior successful purchase? Subsequent purchase
  attempts return conflict (409) with insufficient stock messaging.
- What happens if two testers share the same in-memory catalog? Stock changes from one
  session affect the other; documentation does not isolate data per user (expected for
  local simulator).
- What happens when CORS is required for browser-based calls from the documentation host?
  Local development CORS rules already applied for the frontend MUST also allow calls
  initiated from the documentation interface origin.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a browser-accessible interactive documentation
  entry point for all public checkout backend operations defined in the existing API
  contract (`GET` catalog, `POST` purchase).
- **FR-002**: The documentation MUST describe each operation’s HTTP method, path, request
  fields, success response shape, and documented error responses (400, 404, 409, 500) using
  human-readable labels and examples aligned with the phone-case purchase contract.
- **FR-003**: Users MUST be able to execute each documented operation from the interface,
  supply request parameters or body values, and view the live HTTP status code and response
  body returned by the running backend.
- **FR-004**: The documentation MUST stay consistent with the canonical API contract for
  feature `001-phone-case-purchase` (field names, status codes, and envelope structure);
  any contract change MUST be reflected in the documentation before the feature is
  considered complete.
- **FR-005**: The interactive documentation MUST be scoped to local development use only
  for v1; it MUST NOT be required for the customer purchase screen and MUST NOT be presented
  as part of the end-customer journey.
- **FR-006**: Automated test suites (Jest) remain the authoritative regression mechanism;
  interactive documentation supplements but does not replace automated API tests.
- **FR-007**: Project onboarding material (quickstart or equivalent) MUST include how to
  open the documentation entry point and perform a sample catalog read and purchase attempt.

### Key Entities

- **API Operation**: A single HTTP endpoint exposed by the checkout backend (method, path,
  summary, parameters, request body schema, response schemas per status code).
- **Interactive Documentation Session**: A browser visit where a user browses operations
  and optionally executes them against a running local backend instance.
- **API Contract Reference**: The existing purchase-flow contract describing products
  catalog and purchase attempt semantics (source of truth for documented shapes).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer unfamiliar with the codebase can locate and open the interactive
  documentation within 2 minutes using only project quickstart instructions.
- **SC-002**: The same developer can successfully execute a catalog read and a valid
  purchase attempt (with correct status and response fields) within 5 minutes without
  external tools such as Postman or curl.
- **SC-003**: 100% of public operations in the `001-phone-case-purchase` API contract are
  listed and executable from the documentation interface when the backend is running.
- **SC-004**: Documented error scenarios for purchase (validation, not found, insufficient
  stock) can be reproduced manually through the interface and yield the expected status
  code and message envelope in at least one verified attempt per scenario.
- **SC-005**: Zero new mandatory steps are added to the end-user purchase screen flow;
  documentation is used only by developers and testers.

## Assumptions

- “Swagger” in the user request means industry-standard OpenAPI-based interactive API
  documentation (e.g., Swagger UI or equivalent), not a separate product feature.
- Scope is limited to the two existing public endpoints; health checks or internal routes
  are out of scope unless added to the public contract later.
- Documentation runs against the same local backend instance (`localhost`) used by the
  React purchase screen during development.
- OpenAPI description may be maintained manually or generated from code, but the user-facing
  outcome is accurate, executable documentation—not a specific build tool choice.
- Production deployment is out of scope for Mini Checkout v1; local-only exposure is an
  acceptable default.
- The existing CORS policy for local frontend development will be extended as needed so
  browser-executed requests from the documentation UI succeed.
