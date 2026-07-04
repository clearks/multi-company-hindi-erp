# Multi Company Enterprise ERP
# Refactoring Execution Plan

---

# PURPOSE

This document defines the step-by-step refactoring roadmap to stabilize and optimize the ERP system into a production-grade architecture.

It ensures:

- Consistent Finance System
- Stable Inventory Flow
- Clean Architecture Separation
- Multi-Company Data Safety
- Production-Ready Reliability

---

# PHASE 0 — SAFETY & BASELINE

## Step 0.1 — Backup System

- Take database snapshot
- Create Git branch/tag (pre-refactor-v1)
- Enable logging for all critical modules

---

## Step 0.2 — Flow Mapping

Document current system flows:

- Purchase Flow
- Sales Flow
- Stock Flow
- Finance Flow
- Ledger Flow

---

## Step 0.3 — Identify Issues

Known issues:

- Ledger FK mismatch (chart_of_accounts vs accounts)
- Account mapping inconsistency
- Stock duplication risks
- Finance integration tightly coupled
- Missing transaction safety in some modules

---

# PHASE 1 — ARCHITECTURE CLEANUP

## Step 1.1 — Single Source of Truth Decision

FINAL RULE:

- Finance system will use ONLY `accounts` table
- `chart_of_accounts` will NOT be used in transactions

Reason:
- Accounts table already integrated with ledger system
- System consistency required

---

## Step 1.2 — Standard Account Lookup Service

Create unified service:

accountLookupService.js

Rules:
- Fetch accounts using companyId + accountKey
- No direct ID usage in business logic
- No chart_of_accounts dependency in transactions

---

## Step 1.3 — Remove Duplicate Finance Logic

Consolidate into:

- financeIntegrationService
- ledgerService
- accountLookupService

Remove:
- Direct account balance updates outside ledger system

---

# PHASE 2 — PURCHASE MODULE REFACTOR

## Step 2.1 — Controller Cleanup

Rules:

- No direct stock manipulation in controller
- No duplicate finance logic
- All operations go through service layer

---

## Step 2.2 — Transaction Safety

All purchase operations must be wrapped in DB transaction:

- Purchase creation
- Item creation
- Stock updates
- Ledger posting
- Supplier payable creation

If any step fails → ROLLBACK

---

## Step 2.3 — Service Separation

Create modular services:

- purchaseService.js → core purchase logic
- inventoryService.js → stock updates
- financeService.js → journal & ledger entries

---

# PHASE 3 — INVENTORY SYSTEM REFACTOR

## Step 3.1 — Single Stock Engine

All stock updates must go through:

inventoryService.js

Rules:

- No direct raw_material updates in controllers
- No duplicate stock logic across modules

---

## Step 3.2 — Standard Stock Flow

Purchase Flow:
- Increase raw_material stock
- Update warehouse_stock
- Create stock_ledger entry

Sales Flow:
- Decrease finished_goods stock
- Update warehouse_stock
- Create stock_ledger entry

---

## Step 3.3 — Remove Inconsistencies

Fix:

- current_stock mismatch
- duplicate warehouse stock updates
- missing stock ledger entries

---

# PHASE 4 — FINANCE REFACTOR

## Step 4.1 — Single Entry Point

Only allowed entry:

financeIntegrationService.processTransaction()

---

## Step 4.2 — Double Entry Rule

Every transaction must ensure:

- Debit = Credit
- Valid account IDs
- Proper voucher mapping

---

## Step 4.3 — Remove Direct Ledger Writes

- No direct inserts into general_ledger
- Only via journal_entry → ledger pipeline

---

# PHASE 5 — DATABASE CONSISTENCY

## Step 5.1 — Foreign Key Alignment

Ensure:

- accounts.id used everywhere in finance
- No chart_of_accounts dependency in transactions

---

## Step 5.2 — Index Optimization

Ensure indexes exist on:

- account_id
- company_id
- voucher_no
- voucher_type

---

# PHASE 6 — ERROR HANDLING STANDARDIZATION

## Step 6.1 — Unified Error Format

Standard API response:

{
  success: false,
  message: "",
  code: ""
}

---

## Step 6.2 — Service Layer Errors

- Services throw errors
- Controllers handle responses only

---

# PHASE 7 — TESTING & VALIDATION

## Step 7.1 — Module Testing

Test:

- Purchase Module
- Sales Module
- Stock Transfer
- Journal Posting

---

## Step 7.2 — Multi Company Testing

Ensure:

- Company isolation works correctly
- No cross-company data leakage

---

## Step 7.3 — Financial Accuracy

Validate:

- Trial Balance
- Ledger Balances
- Stock vs Finance reconciliation

---

# PHASE 8 — FINAL STABILIZATION

## Step 8.1 — Logging Cleanup

- Remove debug logs
- Keep only error logs

---

## Step 8.2 — Performance Optimization

- Remove N+1 queries
- Optimize loops
- Batch DB operations where needed

---

## Step 8.3 — Production Readiness

System is ready when:

- No critical bugs
- Finance is stable
- Inventory is consistent
- Ledger is balanced

---

# FINAL OUTCOME

After completion:

- ERP becomes production-grade system
- Finance system becomes fully double-entry compliant
- Inventory becomes ERP-level accurate
- Multi-company architecture becomes stable

---

# VERSION

Version: 1.0  
Last Updated: 03 July 2026