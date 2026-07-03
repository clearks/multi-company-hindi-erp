CREATE TABLE IF NOT EXISTS document_sequences (

    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL,

    module_code VARCHAR(20) NOT NULL,

    financial_year VARCHAR(20) NOT NULL,

    last_number INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_document_sequence
    UNIQUE
    (
        company_id,
        module_code,
        financial_year
    )

);