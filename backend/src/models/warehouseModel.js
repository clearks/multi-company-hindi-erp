const db = require("../config/db");


// Create Warehouse
const createWarehouse = async (companyId, warehouseData) => {

    const {
        warehouseCode,
        warehouseName,
        warehouseType,
        address
    } = warehouseData;

    const query = `
        INSERT INTO warehouses
        (
            company_id,
            warehouse_code,
            warehouse_name,
            warehouse_type,
            address
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        warehouseCode,
        warehouseName,
        warehouseType,
        address
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};


// Warehouse List
const getAllWarehouses = async (companyId) => {

    const query = `
        SELECT
            id,
            warehouse_code,
            warehouse_name,
            warehouse_type,
            address
        FROM warehouses
        WHERE company_id = $1
        AND status = 'ACTIVE'
        ORDER BY id DESC;
    `;

    const result = await db.query(query, [companyId]);

    return result.rows;
};


// Next Warehouse Code
const getNextWarehouseCode = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(warehouse_code,'WH','') AS INTEGER)
        ) AS last_number
        FROM warehouses
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber =
        (result.rows[0].last_number || 0) + 1;

    return `WH${String(nextNumber).padStart(5, "0")}`;
};


// Get Warehouse By ID
const getWarehouseById = async (
    id,
    companyId
) => {

    const query = `
        SELECT *
        FROM warehouses
        WHERE id = $1
        AND company_id = $2
        AND status = 'ACTIVE';
    `;

    const result = await db.query(
        query,
        [id, companyId]
    );

    return result.rows[0];
};


// Update Warehouse
const updateWarehouse = async (
    id,
    companyId,
    warehouseData
) => {

    const {
        warehouseCode,
        warehouseName,
        warehouseType,
        address
    } = warehouseData;

    const query = `
        UPDATE warehouses
        SET
            warehouse_code = $1,
            warehouse_name = $2,
            warehouse_type = $3,
            address = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        AND company_id = $6
        AND status = 'ACTIVE'
        RETURNING *;
    `;

    const values = [
        warehouseCode,
        warehouseName,
        warehouseType,
        address,
        id,
        companyId
    ];

    const result = await db.query(
        query,
        values
    );

    return result.rows[0];
};


// Soft Delete
const deleteWarehouse = async (
    id,
    companyId
) => {

    const query = `
        UPDATE warehouses
        SET
            status='INACTIVE',
            updated_at=CURRENT_TIMESTAMP
        WHERE id=$1
        AND company_id=$2
        RETURNING *;
    `;

    const result = await db.query(
        query,
        [id, companyId]
    );

    return result.rows[0];
};


module.exports = {
    createWarehouse,
    getAllWarehouses,
    getNextWarehouseCode,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse
};