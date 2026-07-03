CREATE TABLE IF NOT EXISTS document_types (

    id SERIAL PRIMARY KEY,

    module_name VARCHAR(100) NOT NULL UNIQUE,

    module_code VARCHAR(30) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);