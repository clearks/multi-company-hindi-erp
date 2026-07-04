# Multi Company Enterprise ERP

# Coding Standards

---

# Purpose

This document defines the coding standards for the Multi Company Enterprise ERP.

Every module, service, controller, model, middleware, validator, and utility must follow these standards to ensure consistency, maintainability, readability, and scalability.

---

# CODE-001

## General Principles

Every piece of code should be:

* Readable
* Predictable
* Modular
* Reusable
* Testable
* Enterprise Ready

Code should always be written for long-term maintenance rather than short-term convenience.

---

# CODE-002

## Project Structure

```
src/

controllers/
middlewares/
validators/
routes/
services/
models/
constants/
config/
utils/
scripts/
```

Each folder has a single responsibility.

---

# CODE-003

## Layer Responsibilities

### Routes

* API mapping only.
* No business logic.

### Middleware

* Authentication
* Authorization
* Permissions
* Company validation

### Validators

* Validate request payload.
* Return validation errors.
* Never access the database unless uniqueness validation is required.

### Controllers

Controllers should:

* Receive request
* Call service
* Return response

Controllers should NOT:

* Write SQL
* Perform calculations
* Update stock
* Create journal entries

---

### Services

Services contain:

* Business logic
* Workflow execution
* Transaction management
* Cross-module coordination

Every important business process belongs here.

---

### Models

Models contain:

* SQL queries
* CRUD operations
* Database access only

No business rules should exist inside models.

---

# CODE-004

## Naming Convention

Files

```
purchaseController.js
purchaseService.js
purchaseModel.js
purchaseRoutes.js
purchaseValidator.js
```

Variables

```
camelCase
```

Constants

```
UPPER_CASE
```

Database

```
snake_case
```

---

# CODE-005

## Function Design

Functions should:

* Perform one responsibility.
* Have descriptive names.
* Be small whenever practical.
* Avoid deeply nested logic.

Example:

Good

```
createPurchase()

updateWarehouseStock()

postJournal()

generateDocumentNumber()
```

Bad

```
doEverything()
```

---

# CODE-006

## Error Handling

All APIs should return a consistent response.

Success

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": ""
}
```

Never expose internal stack traces in API responses.

---

# CODE-007

## Async Standards

Use:

* async / await

Avoid:

* Nested callbacks
* Promise chains where async/await is clearer

Always handle exceptions using:

```
try {
   ...
}
catch(error){
   ...
}
```

---

# CODE-008

## Transactions

Database transactions should be used for all critical operations.

Examples:

* Purchase
* Sales
* Receipt
* Supplier Payment
* Production
* Stock Transfer

Rollback on failure.

---

# CODE-009

## Reusability

Duplicate logic is prohibited.

If the same logic is needed in multiple modules:

Move it into:

* Service
* Utility
* Helper

Never copy and paste business logic.

---

# CODE-010

## Constants

Never hardcode:

* Account Keys
* Document Types
* Voucher Types
* Roles
* Status values

Use constants instead.

Examples:

```
ACCOUNT_KEYS

DOCUMENT_TYPES

USER_ROLES

STATUS
```

---

# CODE-011

## Comments

Use comments to explain:

* Why something exists
* Business rules
* Complex logic

Do not comment obvious code.

Preferred style:

```
/**
 * ==========================================
 * Create Purchase Journal
 * ==========================================
 */
```

---

# CODE-012

## Logging

Use logging for:

* Critical failures
* Financial posting
* Unexpected exceptions
* Background jobs

Avoid excessive console logging in production code.

Future logging should support centralized log storage.

---

# CODE-013

## Validation Rules

Validation should occur before business logic.

Examples:

* Required fields
* Data types
* Date formats
* Numeric ranges
* Duplicate checks

Business rules belong to services, not validators.

---

# CODE-014

## File Size Guidelines

Recommended limits:

* Controller: 200–300 lines
* Service: 300–500 lines
* Model: 300–500 lines

If a file grows significantly larger, split it into smaller modules based on responsibility.

---

# CODE-015

## Refactoring Rule

Whenever existing code is modified:

* Improve readability where appropriate.
* Remove dead code.
* Remove duplication.
* Preserve business behavior.
* Update documentation if architecture changes.

Refactoring should improve quality without changing functional outcomes unless intentionally planned.

---

## Coding Motto

Readable Code.
Reusable Logic.
One Responsibility.
Enterprise Quality.

---

Document Version: 1.0

Status: Active

Last Updated: 03 July 2026
