# Multi Company Enterprise ERP

# API Standards

---

# Purpose

This document defines the API standards for the Multi Company Enterprise ERP.

Every API must follow these standards to ensure consistency, security, scalability, and ease of integration.

---

# API-001

## API Design Principles

Every API should be:

* Predictable
* Consistent
* Stateless
* Secure
* Version Ready
* Mobile Friendly

---

# API-002

## URL Convention

Use REST-style endpoints.

Examples

```
POST   /api/purchases

GET    /api/purchases

GET    /api/purchases/:id

PUT    /api/purchases/:id

DELETE /api/purchases/:id
```

Avoid verbs inside URLs.

Good

```
/api/purchases
```

Bad

```
/api/createPurchase
```

---

# API-003

## HTTP Methods

GET

Read data

POST

Create data

PUT

Update complete resource

PATCH

Partial update (future)

DELETE

Soft delete or cancel where applicable

---

# API-004

## Standard Success Response

Every successful API should return:

```json
{
    "success": true,
    "message": "Purchase created successfully.",
    "data": {}
}
```

For list APIs:

```json
{
    "success": true,
    "data": []
}
```

---

# API-005

## Standard Error Response

Validation Error

```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": [
        {
            "field": "supplierId",
            "message": "Supplier is required."
        }
    ]
}
```

Business Error

```json
{
    "success": false,
    "message": "Insufficient warehouse stock."
}
```

Server Error

```json
{
    "success": false,
    "message": "Internal Server Error."
}
```

Never expose stack traces or SQL errors in API responses.

---

# API-006

## HTTP Status Codes

200 → Success

201 → Resource Created

204 → No Content

400 → Validation Error

401 → Unauthorized

403 → Forbidden

404 → Resource Not Found

409 → Conflict

422 → Business Rule Violation

500 → Internal Server Error

---

# API-007

## Authentication

Protected APIs must require JWT authentication.

JWT payload should include:

* User ID
* Company ID
* Role

Controllers should use authenticated values instead of trusting client-provided company information.

---

# API-008

## Authorization

Permissions must be role-based.

Examples:

* Super Admin
* Company Admin
* Accountant
* Supervisor
* Sales User (future)
* Purchase User (future)

Authorization should be enforced through middleware.

---

# API-009

## Pagination

Large datasets must support pagination.

Example:

```
GET /api/purchases?page=1&limit=20
```

Recommended response:

```json
{
    "success": true,
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 20,
        "totalRecords": 500,
        "totalPages": 25
    }
}
```

---

# API-010

## Filtering

List APIs should support filtering where applicable.

Examples:

* Date Range
* Status
* Customer
* Supplier
* Warehouse
* Product
* Employee

Filtering should use query parameters.

---

# API-011

## Sorting

Support sorting using query parameters.

Example:

```
?sortBy=created_at&order=desc
```

Default sorting should be deterministic.

---

# API-012

## Searching

Support keyword search where practical.

Example:

```
?search=plywood
```

Search behavior should be documented for each module.

---

# API-013

## Validation

Validation must occur before business logic.

Typical validations include:

* Required fields
* Data types
* Date format
* Numeric limits
* Duplicate checks
* Company ownership

---

# API-014

## Idempotency

Read operations must be idempotent.

Critical future APIs (payments, external integrations) should support idempotency keys to prevent duplicate transactions.

---

# API-015

## API Versioning

Prepare all APIs for versioning.

Preferred format:

```
/api/v1/purchases
/api/v1/sales
/api/v1/receipts
```

Version changes should remain backward compatible whenever feasible.

---

# API-016

## File Upload Standards

Future upload APIs should support:

* Images
* PDFs
* Excel
* CSV
* Attachments

Files should be validated for size and type before processing.

---

# API-017

## Audit Information

Where appropriate, APIs should automatically record:

* created_by
* updated_by
* company_id
* timestamps

These values should be derived from authenticated user context rather than client input.

---

# API-018

## Response Consistency

Responses for similar operations should follow the same structure across all modules.

Examples:

Purchase

Sales

Receipt

Supplier Payment

Production

Stock Transfer

Consistency improves frontend development and API usability.

---

## API Motto

Consistent.
Secure.
Predictable.
Integration Ready.

---

Document Version: 1.0

Status: Active

Last Updated: 03 July 2026
