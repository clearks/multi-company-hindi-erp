-- =====================================================
-- Multi Company Enterprise ERP
-- Chart Of Accounts
-- =====================================================

CREATE TABLE chart_of_accounts
(
    id                  BIGSERIAL PRIMARY KEY,

    company_id          BIGINT NOT NULL,

    account_code        VARCHAR(20) NOT NULL,

    account_name        VARCHAR(200) NOT NULL,

    account_key         VARCHAR(100),

    parent_account_id   BIGINT,

    account_type        VARCHAR(50) NOT NULL,

    account_group       VARCHAR(100),

    is_group            BOOLEAN NOT NULL DEFAULT FALSE,

    is_system           BOOLEAN NOT NULL DEFAULT TRUE,

    allow_manual_entry  BOOLEAN NOT NULL DEFAULT TRUE,

    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_coa_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id),

    CONSTRAINT fk_coa_parent
        FOREIGN KEY (parent_account_id)
        REFERENCES chart_of_accounts(id),

    CONSTRAINT uq_company_account_code
        UNIQUE(company_id, account_code)
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX idx_coa_company
ON chart_of_accounts(company_id);

CREATE INDEX idx_coa_parent
ON chart_of_accounts(parent_account_id);

CREATE INDEX idx_coa_key
ON chart_of_accounts(account_key);

CREATE INDEX idx_coa_type
ON chart_of_accounts(account_type);

CREATE INDEX idx_coa_group
ON chart_of_accounts(account_group);