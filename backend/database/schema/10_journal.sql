-- ============================================
-- JOURNAL ENGINE (ERP Finance Core)
-- Multi Company ERP - SAINI FURNITURE
-- ============================================

-- ============================================
-- 1. JOURNAL ENTRIES TABLE
-- ============================================

CREATE TABLE journal_entries (

    id BIGSERIAL PRIMARY KEY,

    company_id BIGINT NOT NULL 
        REFERENCES companies(id) 
        ON DELETE CASCADE,

    voucher_type VARCHAR(50) NOT NULL,      -- PURCHASE, SALES, RECEIPT, PAYMENT, etc.

    voucher_number VARCHAR(50) NOT NULL,

    voucher_date DATE NOT NULL,

    reference_type VARCHAR(50),             -- PURCHASE, SALES_ORDER, etc.

    reference_id BIGINT,

    total_debit NUMERIC(18,2) DEFAULT 0,

    total_credit NUMERIC(18,2) DEFAULT 0,

    narration TEXT,

    is_posted BOOLEAN DEFAULT TRUE,

    created_by BIGINT,

    created_at TIMESTAMP DEFAULT NOW()

);

-- ============================================
-- 2. JOURNAL ENTRY LINES TABLE
-- ============================================

CREATE TABLE journal_entry_lines (

    id BIGSERIAL PRIMARY KEY,

    journal_entry_id BIGINT NOT NULL
        REFERENCES journal_entries(id)
        ON DELETE CASCADE,

    account_id BIGINT NOT NULL
        REFERENCES accounts(id),

    debit NUMERIC(18,2) DEFAULT 0,

    credit NUMERIC(18,2) DEFAULT 0,

    description TEXT

);

-- ============================================
-- INDEXES (Performance Optimization)
-- ============================================

CREATE INDEX idx_journal_company 
    ON journal_entries(company_id);

CREATE INDEX idx_journal_voucher 
    ON journal_entries(voucher_number);

CREATE INDEX idx_journal_reference 
    ON journal_entries(reference_type, reference_id);

CREATE INDEX idx_journal_lines_entry 
    ON journal_entry_lines(journal_entry_id);

CREATE INDEX idx_journal_lines_account 
    ON journal_entry_lines(account_id);

-- ============================================
-- RULE (IMPORTANT NOTE)
-- ============================================

-- Every journal entry must satisfy:
-- SUM(debit) = SUM(credit)
-- This validation will be enforced in Service Layer