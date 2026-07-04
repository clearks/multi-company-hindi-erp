# Multi Company Enterprise ERP

# Database Standards

---

# Purpose

This document defines the database design standards for the Multi Company Enterprise ERP.

Every existing and future database object must follow these standards.

---

# DB-001

## Database Philosophy

The database is the foundation of the ERP.

Goals:

* Consistency
* Reliability
* Scalability
* Performance
* Data Integrity
* Enterprise Readiness

---

# DB-002

## Naming Convention

### Tables

Use plural names.

Examples:

* companies
* customers
* suppliers
* purchases
* purchase_items
* journal_entries
* journal_entry_lines
* general_ledger

---

### Columns

Use snake_case.

Examples:

company_id

purchase_date

invoice_no

current_balance

created_at

updated_at

---

### Primary Key

Every table uses:

id

INTEGER GENERATED ALWAYS AS IDENTITY

---

# DB-003

## Company Isolation

Every business table must include:

company_id

Rules:

* Foreign key to companies(id)
* Indexed
* Mandatory unless the table is global

Global tables (examples):

* document_types
* system_settings (future)
* countries (future)
* states (future)

---

# DB-004

## Audit Columns

Business tables should contain:

created_at

updated_at

created_by

updated_by (future)

deleted_at (only where soft delete is required)

---

# DB-005

## Foreign Key Standards

Every relationship must use foreign keys.

Never store orphan references.

Examples:

purchase_items.purchase_id

journal_entry_lines.journal_entry_id

general_ledger.account_id

warehouse_stock.raw_material_id

---

# DB-006

## Index Standards

Indexes should exist for:

* company_id
* document numbers
* foreign keys
* frequently searched columns

Composite indexes should be added where query patterns justify them.

Indexes should not be created unnecessarily.

---

# DB-007

## Unique Constraints

Use unique constraints only for true business uniqueness.

Examples:

(company_id, purchase_no)

(company_id, customer_code)

(company_id, supplier_code)

(company_id, account_name)

(company_id, account_code)

---

# DB-008

## Transactions

Critical operations must execute inside database transactions.

Examples:

Purchase

Sales Invoice

Receipt

Supplier Payment

Production

Stock Transfer

Rollback on failure.

---

# DB-009

## No Duplicate Masters

Only one master table should exist for one business concept.

Examples:

✔ accounts

✘ chart_of_accounts

✔ products

✘ duplicate product tables

Duplicate structures are prohibited.

---

# DB-010

## Canonical Tables

The following tables are considered canonical.

Finance

* account_groups
* accounts
* journal_entries
* journal_entry_lines
* general_ledger

Inventory

* warehouses
* warehouse_stock
* stock_ledger

Purchase

* purchases
* purchase_items

Sales

* sales_orders
* sales_invoices

Manufacturing

* bom
* bom_items
* production_entries
* production_items

---

# DB-011

## Soft Delete Policy

Soft delete should be used only where business history must remain available.

Examples:

Employees

Customers

Suppliers

Products

Hard delete should be avoided for transactional data.

Transactional records should normally be cancelled or reversed instead of deleted.

---

# DB-012

## Financial Data Rules

Financial records must never be physically deleted.

Examples:

Journal Entries

General Ledger

Receipts

Payments

Purchase Entries

Sales Invoices

Corrections should be made using reversal or adjustment entries.

---

# DB-013

## Migration Policy

Database migrations must:

* Be version controlled.
* Never modify production data without backup.
* Avoid destructive changes where possible.
* Be reversible whenever practical.

Legacy SQL files should be archived after migration.

---

# DB-014

## Performance Guidelines

Prefer:

* Indexed lookups
* Batch inserts
* Pagination
* Optimized joins

Avoid:

* SELECT *
* N+1 query patterns
* Duplicate queries inside loops
* Unnecessary full table scans

---

# DB-015

## Future Database Enhancements

Planned improvements:

* Table partitioning for large ledgers
* Read replicas
* Materialized reporting views
* Background archival
* Query performance monitoring
* Database health dashboards

---

## Database Motto

One Canonical Table.
One Source of Truth.
No Duplicate Structures.
Integrity Before Convenience.

---

Document Version: 1.0

Status: Active

Last Updated: 03 July 2026
