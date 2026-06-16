-- ===========================================
-- Multi Company Hindi ERP
-- Database Tables - Part 1
-- ===========================================

-- ==========================
-- Companies
-- ==========================

CREATE TABLE IF NOT EXISTS companies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    company_code VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(150),

    mobile VARCHAR(15),
    email VARCHAR(150),

    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),

    gst_number VARCHAR(20),

    status BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- Roles
-- ==========================

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    role_name VARCHAR(100) UNIQUE NOT NULL,

    status BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- Users
-- ==========================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    company_id BIGINT,
    role_id BIGINT,

    full_name VARCHAR(200) NOT NULL,

    username VARCHAR(100) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    mobile VARCHAR(15),

    email VARCHAR(150),

    status BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_company
        FOREIGN KEY(company_id)
        REFERENCES companies(id),

    CONSTRAINT fk_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
);

-- ==========================
-- Default Roles
-- ==========================

INSERT INTO roles(role_name)
VALUES
('Super Admin'),
('Company Admin'),
('Accountant'),
('Thekedar Supervisor')
ON CONFLICT (role_name) DO NOTHING;