# Multi Company Enterprise ERP

# Refactoring Master Document

---

# Purpose

This document records every major architectural decision, refactoring decision, coding rule, migration plan, and future improvement agreed during ERP development.

This document is the single source of truth for future refactoring.

---

# Current Refactoring Status

Status : In Progress

Development Policy :

No new business module will be developed until the current architecture is reviewed and stabilized.

---

# REF-001

## Single Source of Truth

Every business logic should exist only once.

Never duplicate logic between Controllers, Services and Models.

Business Rules belong to Services.

Database Queries belong to Models.

Controllers only coordinate requests.

Status

Approved

---

# REF-002

## Enterprise Layered Architecture

Architecture

Routes

↓

Middleware

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

Controllers must remain thin.

Status

Approved

---

# REF-003

## Finance Engine becomes Generic

Finance logic must never remain inside Purchase, Sales, Receipt or Manufacturing modules.

Every module will only send accounting data.

Finance Engine will create:

* Journal Entry
* Journal Lines
* General Ledger
* Account Balance

Status

Approved

---

# REF-004

## Automatic Accounting

Business modules must never manually create Journal Entries.

Instead:

Business Module

↓

Finance Integration Service

↓

Journal

↓

Ledger

↓

Account Balance

Status

Approved

---

# REF-005

## System Accounts

No Account ID should ever be hardcoded.

Every lookup must happen using Account Keys.

Example

INVENTORY_RAW

AP

AR

SALES

CASH

BANK

Status

Completed

---

# REF-006

## Company Bootstrap

Every new company must automatically receive:

Account Groups

Accounts

Document Types

Document Sequences

Future Default Masters

No manual setup.

Status

Partially Completed

---

# REF-007

## Canonical Accounts Table

The ERP will use only one accounting master table.

Canonical Table

accounts

Legacy table

chart_of_accounts

Legacy table must be removed completely after migration.

Status

Migration Started

---

# REF-008

## Ledger Posting Flow

Correct Flow

Business Module

↓

Finance Integration

↓

Journal Entry

↓

Journal Entry Lines

↓

General Ledger

↓

Account Balance Update

No shortcut posting allowed.

Status

Completed

---

# REF-009

## Company Isolation

Every business table must contain company_id.

Every query must filter using company_id.

Cross-company data access is prohibited.

Status

Approved

---

# REF-010

## Document Number Generation

Every transaction must use the centralized Number Generator Service.

No module should generate document numbers independently.

Status

Implemented

---

# REF-011

## Database Integrity

All foreign keys must reference the current production tables only.

Legacy references must be removed.

No duplicate accounting schema will remain.

Status

In Progress

---

# REF-012

## Naming Standards

Controllers

xxxController.js

Models

xxxModel.js

Services

xxxService.js

Validators

xxxValidator.js

Routes

xxxRoutes.js

Constants

UPPER_CASE

Variables

camelCase

Status

Approved

---

# REF-013

## Error Handling

Every API should return a standard structure.

{
"success": true,
"message": "",
"data": {}
}

Status

Planned

---

# REF-014

## Transactions

All accounting operations must execute inside database transactions wherever atomicity is required.

Rollback must occur on failure.

Status

Partially Implemented

---

# REF-015

## Future Refactoring Queue

Modules planned for future review:

* Purchase
* Sales
* Receipt
* Supplier Payment
* Production
* Stock Transfer
* Reports
* Dashboard
* Settings

Status

Open

---

# Migration Checklist

* Remove chart_of_accounts
* Remove duplicate SQL files
* Remove legacy foreign keys
* Verify indexes
* Verify account lookups
* Verify finance posting flow
* Verify company bootstrap
* Verify document numbering
* Standardize API responses
* Complete service-layer migration

---

# Documentation Rule

Any architectural decision affecting multiple modules must be recorded in this document before implementation.

---

Document Version : 1.0

Status : Active

Last Updated : 03 July 2026
