const db = require("../config/db");

const getWarehouseStock = async (
    warehouseId,
    rawMaterialId
) => {

    const query = `
        SELECT *
        FROM warehouse_stock
        WHERE warehouse_id = $1
        AND raw_material_id = $2;
    `;

    const result =
        await db.query(
            query,
            [warehouseId, rawMaterialId]
        );

    return result.rows[0];
};


const addWarehouseStock = async (
    companyId,
    warehouseId,
    rawMaterialId,
    qty
) => {

    const query = `
        INSERT INTO warehouse_stock
        (
            company_id,
            warehouse_id,
            raw_material_id,
            quantity
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [
                companyId,
                warehouseId,
                rawMaterialId,
                qty
            ]
        );

    return result.rows[0];
};


const updateWarehouseStock =
async (
    warehouseId,
    rawMaterialId,
    qty
) => {

    const query = `
        UPDATE warehouse_stock
        SET
            quantity =
            quantity + $1,
            updated_at =
            CURRENT_TIMESTAMP
        WHERE warehouse_id = $2
        AND raw_material_id = $3
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [
                qty,
                warehouseId,
                rawMaterialId
            ]
        );

    return result.rows[0];
};

module.exports = {
    getWarehouseStock,
    addWarehouseStock,
    updateWarehouseStock
};