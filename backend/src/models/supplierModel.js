const db = require("../config/db");

const createSupplier = async (companyId, supplierData) => {
    const {
    supplierCode,
    supplierName,
    mobile,
    email,
    gstNumber,
    address,
    city,
    state,
    pincode,
    openingBalance
} = supplierData;

    const query = `
       INSERT INTO suppliers
(
    company_id,
    supplier_code,
    supplier_name,
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
    supplierCode,
    supplierName,
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

const getAllSuppliers = async (companyId) => {

    const query = `
       SELECT
    id,
    supplier_code,
    supplier_name,
    mobile,
    email,
    gst_number,
    city,
    state,
    opening_balance
FROM suppliers
WHERE company_id = $1
AND status = 'ACTIVE'
ORDER BY id DESC;
    `;

    const result = await db.query(query, [companyId]);

    return result.rows;
};

const getNextSupplierCode = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(supplier_code, 'SUP', '') AS INTEGER)
        ) AS last_number
        FROM suppliers
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber = (result.rows[0].last_number || 0) + 1;

    return `SUP${String(nextNumber).padStart(5, "0")}`;
};
const getSupplierById = async (id, companyId) => {

    const query = `
        SELECT *
FROM suppliers
WHERE id = $1
AND company_id = $2
AND status = 'ACTIVE';
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};

const updateSupplier = async (id, companyId, supplierData) => {

    const {
        supplierCode,
supplierName,
mobile,
email,
gstNumber,
address,
city,
state,
pincode,
openingBalance
    } = supplierData;

    const query = `
        UPDATE suppliers
SET
    supplier_code = $1,
    supplier_name = $2,
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
    supplierCode,
    supplierName,
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

const deleteSupplier = async (id, companyId) => {

    const query = `
    UPDATE suppliers
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
    createSupplier,
    getAllSuppliers,
    getNextSupplierCode,
    getSupplierById,
    updateSupplier,
    deleteSupplier
    
};