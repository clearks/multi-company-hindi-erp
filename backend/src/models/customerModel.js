const db = require("../config/db");

const createCustomer = async (companyId, customerData) => {
    const {
    customerCode,
    customerName,
    mobile,
    email,
    gstNumber,
    address,
    city,
    state,
    pincode,
    openingBalance
} = customerData;

    const query = `
       INSERT INTO customers
(
    company_id,
    customer_code,
    customer_name,
    mobile,
    email,
    gst_number,
    address,
    city,
    state,
    pincode,
    opening_balance
)
VALUES
(
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
)
RETURNING *;
    `;

    const values = [
    companyId,
    customerCode,
    customerName,
    mobile,
    email,
    gstNumber,
    address,
    city,
    state,
    pincode,
    openingBalance
];

    const result = await db.query(query, values);

    return result.rows[0];
};

const getAllCustomers = async (companyId) => {

    const query = `
       SELECT
    id,
    customer_code,
    customer_name,
    mobile,
    email,
    gst_number,
    city,
    state,
    opening_balance
FROM customers
WHERE company_id = $1
AND status = 'ACTIVE'
ORDER BY id DESC;
    `;

    const result = await db.query(query, [companyId]);

    return result.rows;
};

const getNextCustomerCode = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(customer_code, 'CUS', '') AS INTEGER)
        ) AS last_number
        FROM customers
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber = (result.rows[0].last_number || 0) + 1;

    return `CUS${String(nextNumber).padStart(5, "0")}`;
};
const getCustomerById = async (id, companyId) => {

    const query = `
        SELECT *
FROM customers
WHERE id = $1
AND company_id = $2
AND status = 'ACTIVE';
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};

const updateCustomer = async (id, companyId, customerData) => {

    const {
        customerCode,
customerName,
mobile,
email,
gstNumber,
address,
city,
state,
pincode,
openingBalance
    } = customerData;

    const query = `
        UPDATE customers
SET
    customer_code = $1,
    customer_name = $2,
    mobile = $3,
    email = $4,
    gst_number = $5,
    address = $6,
    city = $7,
    state = $8,
    pincode = $9,
    opening_balance = $10,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $11
AND company_id = $12
AND status = 'ACTIVE'
RETURNING *;
    `;

    const values = [
    customerCode,
    customerName,
    mobile,
    email,
    gstNumber,
    address,
    city,
    state,
    pincode,
    openingBalance,
    id,
    companyId
];

    const result = await db.query(query, values);

    return result.rows[0];
};

const deleteCustomer = async (id, companyId) => {

    const query = `
    UPDATE customers
SET
    status='INACTIVE',
    updated_at=CURRENT_TIMESTAMP
WHERE id=$1
AND company_id=$2
RETURNING *;
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getNextCustomerCode,
    getCustomerById,
    updateCustomer,
    deleteCustomer
    
};