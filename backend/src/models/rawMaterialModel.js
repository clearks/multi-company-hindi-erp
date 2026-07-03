const db = require("../config/db");


// Create Raw Material
const createRawMaterial = async (companyId, rawMaterialData) => {

    const {
        itemCode,
        itemName,
        category,
        unit,
        minimumStock,
        currentStock
    } = rawMaterialData;

    const query = `
        INSERT INTO raw_materials
        (
            company_id,
            item_code,
            item_name,
            category,
            unit,
            minimum_stock,
            current_stock
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        itemCode,
        itemName,
        category,
        unit,
        minimumStock,
        currentStock
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};


// Get All Raw Materials
const getAllRawMaterials = async (companyId) => {

    const query = `
        SELECT
            id,
            item_code,
            item_name,
            category,
            unit,
            minimum_stock,
            current_stock
        FROM raw_materials
        WHERE company_id = $1
        AND status = 'ACTIVE'
        ORDER BY id DESC;
    `;

    const result = await db.query(query, [companyId]);

    return result.rows;
};


// Generate Next Raw Material Code
const getNextRawMaterialCode = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(item_code, 'RM', '') AS INTEGER)
        ) AS last_number
        FROM raw_materials
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber = (result.rows[0].last_number || 0) + 1;

    return `RM${String(nextNumber).padStart(5, "0")}`;
};


// Get Raw Material By ID
const getRawMaterialById = async (id, companyId) => {

    const query = `
        SELECT *
        FROM raw_materials
        WHERE id = $1
        AND company_id = $2
        AND status = 'ACTIVE';
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};


// Update Raw Material
const updateRawMaterial = async (
    id,
    companyId,
    rawMaterialData
) => {

    const {
        itemCode,
        itemName,
        category,
        unit,
        minimumStock,
        currentStock
    } = rawMaterialData;

    const query = `
        UPDATE raw_materials
        SET
            item_code = $1,
            item_name = $2,
            category = $3,
            unit = $4,
            minimum_stock = $5,
            current_stock = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        AND company_id = $8
        AND status = 'ACTIVE'
        RETURNING *;
    `;

    const values = [
        itemCode,
        itemName,
        category,
        unit,
        minimumStock,
        currentStock,
        id,
        companyId
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};


// Soft Delete Raw Material
const deleteRawMaterial = async (id, companyId) => {

    const query = `
        UPDATE raw_materials
        SET
            status = 'INACTIVE',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        AND company_id = $2
        RETURNING *;
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};

const updateRawMaterialStock =async (rawMaterialId, qty) => {

    const query = `
        UPDATE raw_materials
        SET
            current_stock =
            current_stock + $1,
            updated_at =
            CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [qty, rawMaterialId]
        );

    return result.rows[0];
};


module.exports = {
    createRawMaterial,
    getAllRawMaterials,
    getNextRawMaterialCode,
    getRawMaterialById,
    updateRawMaterial,
    deleteRawMaterial,
    updateRawMaterialStock
    
};