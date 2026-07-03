CREATE TABLE general_ledger
(

    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL
    REFERENCES companies(id)
    ON DELETE CASCADE,

    transaction_date DATE NOT NULL,

    voucher_type VARCHAR(50) NOT NULL,

    voucher_id INTEGER NOT NULL,

    account_id INTEGER NOT NULL
    REFERENCES chart_of_accounts(id),

    debit NUMERIC(18,2) DEFAULT 0,

    credit NUMERIC(18,2) DEFAULT 0,

    narration TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE INDEX idx_gl_company

ON general_ledger(company_id);

CREATE INDEX idx_gl_account

ON general_ledger(account_id);

CREATE INDEX idx_gl_voucher

ON general_ledger

(

voucher_type,

voucher_id

);