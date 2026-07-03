CREATE TABLE receipt_items
(
    id                      SERIAL PRIMARY KEY,

    receipt_id              INTEGER NOT NULL
                            REFERENCES receipts(id)
                            ON DELETE CASCADE,

    invoice_id              INTEGER NOT NULL
                            REFERENCES sales_invoices(id),

    received_amount         NUMERIC(18,2) NOT NULL
);