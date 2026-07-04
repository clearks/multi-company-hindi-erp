# MCERP Refactoring Phase Decisions

## Objective

Version 1 first. Major refactoring only after Version 1.

## Locked Decisions

-   Layered architecture: Routes → Controllers → Services → Models →
    PostgreSQL
-   Controllers contain no business logic.
-   Services contain business rules.
-   Models only access the database.
-   Canonical Chart of Accounts:
    database/finance/01_chart_of_accounts.sql
-   General Ledger is the accounting backbone.
-   Business modules never post directly to General Ledger.
-   Stock Ledger is the single source of truth.
-   Strict multi-company isolation.
-   Future Chief Admin with company authorization.
-   Future company-wise module licensing.
-   Version 2: AI, Offline Sync, Mobile, Tally, Ecommerce, Workflow.
-   ERP Bible (MCERP-EDS) is the official technical documentation.

## Refactoring Checklist

-   Remove duplicate SQL schemas.
-   Consolidate finance posting engine.
-   Remove duplicate business logic.
-   Standardize naming.
-   Use transaction-based services.
-   Preserve backward compatibility.
