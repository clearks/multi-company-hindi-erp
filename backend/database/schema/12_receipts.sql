CREATE TABLE receipts
(
    id                  SERIAL PRIMARY KEY,

    company_id          INTEGER NOT NULL
                        REFERENCES companies(id)
                        ON DELETE CASCADE,

    receipt_no          VARCHAR(30) NOT NULL,

    customer_id         INTEGER NOT NULL
                        REFERENCES customers(id),

    receipt_date        DATE NOT NULL,

    payment_mode        VARCHAR(30) NOT NULL,

    reference_no        VARCHAR(100),

    remarks             TEXT,

    total_amount        NUMERIC(18,2) NOT NULL,

    status              VARCHAR(20)
                        DEFAULT 'POSTED',

    created_at          TIMESTAMP
                        DEFAULT CURRENT_TIMESTAMP,

    updated_at          TIMESTAMP
                        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_receipt_no
    UNIQUE(company_id, receipt_no)
);