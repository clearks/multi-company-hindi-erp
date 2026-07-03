CREATE TABLE supplier_payables (

    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL REFERENCES companies(id),

    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),

    purchase_id INTEGER NOT NULL REFERENCES purchases(id),

    invoice_amount NUMERIC(18,2) NOT NULL,

    paid_amount NUMERIC(18,2) NOT NULL DEFAULT 0,

    outstanding_amount NUMERIC(18,2) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_payables_company
ON supplier_payables(company_id);

CREATE INDEX idx_supplier_payables_supplier
ON supplier_payables(supplier_id);

CREATE INDEX idx_supplier_payables_purchase
ON supplier_payables(purchase_id);