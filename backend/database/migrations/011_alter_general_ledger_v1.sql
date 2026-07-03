-- ===========================================================
-- Multi Company Enterprise ERP
-- Migration : General Ledger V1 Enhancement
-- ===========================================================

ALTER TABLE general_ledger

ADD COLUMN IF NOT EXISTS voucher_no VARCHAR(50),

ADD COLUMN IF NOT EXISTS posting_status VARCHAR(20) DEFAULT 'POSTED',

ADD COLUMN IF NOT EXISTS financial_year VARCHAR(20),

ADD COLUMN IF NOT EXISTS created_by BIGINT,

ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_gl_voucher_no
ON general_ledger(voucher_no);

CREATE INDEX IF NOT EXISTS idx_gl_financial_year
ON general_ledger(financial_year);