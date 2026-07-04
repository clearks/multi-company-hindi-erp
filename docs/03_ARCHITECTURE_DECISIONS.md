# Multi Company Enterprise ERP

# Architecture Decisions

---

# Purpose

This document defines the core architecture of the Multi Company Enterprise ERP.

It explains how every module should be designed, how business logic should flow, and which architectural rules every future development must follow.

This is the permanent technical blueprint of the ERP.

---

# ADR-001

## Enterprise Layered Architecture

Every request must follow the same execution flow.

```
Client

↓

Routes

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Business Service

↓

Repository / Model

↓

Database
```

### Responsibilities

**Routes**

* API endpoint mapping only.

**Middleware**

* Authentication
* Authorization
* Company Isolation
* Permission Checking

**Validators**

* Validate request payload.
* No business logic.

**Controllers**

* Receive request.
* Call services.
* Return response.
* No SQL.
* No accounting logic.
* No stock calculation.

**Services**

* Complete business logic.
* Cross-module coordination.
* Transaction management.
* Workflow execution.

**Models**

* Database operations only.
* SQL queries only.
* No business decisions.

---

# ADR-002

## Multi Company Isolation

Every business record belongs to exactly one company.

Rules:

* Every table contains company_id where applicable.
* Every query filters company_id.
* No cross-company access.
* Company data must remain completely isolated.

---

# ADR-003

## Finance Engine

Finance is an independent engine.

Business modules never create accounting records directly.

Correct flow:

```
Purchase

↓

Finance Integration Service

↓

Journal Entry

↓

Journal Entry Lines

↓

General Ledger

↓

Account Balance
```

Same architecture will be reused for:

* Purchase
* Sales
* Receipt
* Supplier Payment
* Production
* Inventory Adjustment
* Stock Transfer
* Opening Entries

---

# ADR-004

## Inventory Engine

Inventory must remain independent from Finance.

Inventory responsibilities:

* Stock Ledger
* Warehouse Stock
* Finished Goods
* Raw Material Stock
* Stock Movement History

Finance only records monetary impact.

---

# ADR-005

## Manufacturing Engine

Manufacturing should be separated into logical stages.

```
BOM

↓

Production Order

↓

Material Consumption

↓

Production Entry

↓

Finished Goods

↓

Stock Ledger

↓

Finance
```

---

# ADR-006

## Document Number Engine

All document numbers are generated centrally.

No module generates its own numbering.

Supported examples:

* Purchase
* Sales Invoice
* Receipt
* Payment
* Production
* Stock Transfer
* Journal Voucher

Future modules must use the same service.

---

# ADR-007

## Bootstrap Engine

Whenever a new company is created, the ERP automatically initializes:

* Account Groups
* System Accounts
* Document Types
* Document Sequences

Future additions may include:

* Default Warehouses
* Default Units
* Default Tax Settings
* Default Roles
* Default Permissions

---

# ADR-008

## Account Identification

System accounts are identified using Account Keys.

Never by database IDs.

Examples:

* CASH
* BANK
* AP
* AR
* INVENTORY_RAW
* INVENTORY_WIP
* INVENTORY_FINISHED
* SALES
* PURCHASE

This ensures portability across companies.

---

# ADR-009

## Database Design Principles

Rules:

* Normalize data.
* Avoid duplication.
* Use foreign keys.
* Use indexes where appropriate.
* Use transactions for critical operations.
* Maintain referential integrity.

---

# ADR-010

## Service-Oriented Business Logic

Business rules must live inside Services.

Examples:

Purchase Service

* Purchase validation
* Stock update
* Ledger posting
* Supplier payable

Controller should only orchestrate the request.

---

# ADR-011

## API Standards

Standard success response:

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

Standard error response:

```json
{
  "success": false,
  "message": ""
}
```

This standard applies to every API.

---

# ADR-012

## Naming Standards

Files:

* purchaseController.js
* purchaseService.js
* purchaseModel.js
* purchaseRoutes.js
* purchaseValidator.js

Variables:

* camelCase

Constants:

* UPPER_CASE

Database:

* snake_case

---

# ADR-013

## Logging & Audit (Future)

Every important transaction should eventually generate an audit trail.

Examples:

* Purchase Created
* Invoice Cancelled
* Payment Posted
* Stock Adjusted
* User Login
* User Permission Changed

Audit data must never replace business data.

---

# ADR-014

## Scalability Goals

The architecture should support:

* Large databases
* Multiple companies
* High transaction volume
* Mobile applications
* REST APIs
* Background jobs
* Cloud deployment
* Future AI integration

---

# ADR-015

## Long-Term Engineering Principle

Whenever a new module is developed, it must integrate with the existing architecture rather than introducing parallel implementations.

New functionality should extend the ERP, not duplicate it.

---

## Architecture Motto

**One Business Logic. One Finance Engine. One Inventory Engine. One Architecture.**

---

Document Version: 1.0

Status: Active

Last Updated: 03 July 2026
