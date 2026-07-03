CREATE TABLE chart_of_accounts
(

    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL
    REFERENCES companies(id)
    ON DELETE CASCADE,

    account_code VARCHAR(20) NOT NULL,

    account_name VARCHAR(150) NOT NULL,

    parent_account_id INTEGER
    REFERENCES chart_of_accounts(id),

    account_type VARCHAR(50) NOT NULL,

    account_nature VARCHAR(10) NOT NULL,

    is_group BOOLEAN DEFAULT FALSE,

    is_system BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE UNIQUE INDEX idx_account_code_company

ON chart_of_accounts

(

company_id,

account_code

);