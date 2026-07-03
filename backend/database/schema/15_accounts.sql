CREATE TABLE accounts (

    id BIGSERIAL PRIMARY KEY,

    company_id BIGINT NOT NULL
    REFERENCES companies(id)
    ON DELETE CASCADE,

    group_id BIGINT NOT NULL
    REFERENCES account_groups(id),

    account_name VARCHAR(150) NOT NULL,

    account_code VARCHAR(50),

    account_key VARCHAR(100),

    account_type VARCHAR(50),

    opening_balance NUMERIC(18,2) DEFAULT 0,

    opening_balance_type VARCHAR(10),

    current_balance NUMERIC(18,2) DEFAULT 0,

    allow_manual_entry BOOLEAN DEFAULT TRUE,

    is_cash_account BOOLEAN DEFAULT FALSE,

    is_bank_account BOOLEAN DEFAULT FALSE,

    is_party_account BOOLEAN DEFAULT FALSE,

    is_system BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_by BIGINT,

    updated_by BIGINT,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_account_company
ON accounts(company_id);

CREATE INDEX idx_account_group
ON accounts(group_id);

CREATE INDEX idx_account_key
ON accounts(account_key);

CREATE UNIQUE INDEX uq_account_name
ON accounts(company_id, account_name);

CREATE UNIQUE INDEX uq_account_code
ON accounts(company_id, account_code);