CREATE TABLE supplier_payments (

    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL REFERENCES companies(id),

    payment_no VARCHAR(50) NOT NULL,

    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),

    payment_date DATE NOT NULL,

    payment_mode VARCHAR(50),

    reference_no VARCHAR(100),

    remarks TEXT,

    total_amount NUMERIC(18,2) NOT NULL,

    status VARCHAR(20) DEFAULT 'POSTED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_payment_items (

    id SERIAL PRIMARY KEY,

    payment_id INTEGER NOT NULL REFERENCES supplier_payments(id) ON DELETE CASCADE,

    purchase_id INTEGER NOT NULL REFERENCES purchases(id),

    amount NUMERIC(18,2) NOT NULL
);