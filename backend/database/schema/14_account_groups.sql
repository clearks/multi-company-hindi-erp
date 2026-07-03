CREATE TABLE account_groups (

    id BIGSERIAL PRIMARY KEY,

    company_id BIGINT NOT NULL
    REFERENCES companies(id)
    ON DELETE CASCADE,

    parent_id BIGINT NULL
    REFERENCES account_groups(id),

    group_name VARCHAR(150) NOT NULL,

    group_code VARCHAR(50),

    root_type VARCHAR(30) NOT NULL,

    account_nature VARCHAR(20) NOT NULL,

    level INT DEFAULT 0,

    is_system BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_by BIGINT,

    updated_by BIGINT,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_account_group_company
ON account_groups(company_id);

CREATE INDEX idx_account_group_parent
ON account_groups(parent_id);

CREATE UNIQUE INDEX uq_group_name
ON account_groups(company_id, group_name);