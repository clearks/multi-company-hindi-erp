const db = require("../config/db");


const getNextProductionNumber =
async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(
                REPLACE(
                    production_no,
                    'PROD',
                    ''
                ) AS INTEGER
            )
        ) AS last_number
        FROM production_entries
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber =
        (result.rows[0].last_number || 0)
        + 1;

    return `PROD${String(nextNumber)
        .padStart(5,"0")}`;
};


const createProductionEntry =
async (
    companyId,
    productionData
) => {

    const {
        productionNo,
        productId,
        bomId,
        quantity,
        productionDate,
        sourceWarehouseId,
        finishedWarehouseId,
        remarks
    } = productionData;

    const result = await db.query(
        `
        INSERT INTO production_entries
        (
            company_id,
            production_no,
            product_id,
            bom_id,
            quantity,
            production_date,
            source_warehouse_id,
            finished_warehouse_id,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9
        )
        RETURNING *;
        `,
        [
            companyId,
            productionNo,
            productId,
            bomId,
            quantity,
            productionDate,
            sourceWarehouseId,
            finishedWarehouseId,
            remarks
        ]
    );

    return result.rows[0];
};


const createProductionItem =
async (
    productionId,
    item
) => {

    const result = await db.query(
        `
        INSERT INTO production_items
        (
            production_id,
            raw_material_id,
            required_qty,
            consumed_qty
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
        `,
        [
            productionId,
            item.rawMaterialId,
            item.requiredQty,
            item.consumedQty
        ]
    );

    return result.rows[0];
};


const getAllProductions =
async (companyId) => {

    const result = await db.query(
        `
        SELECT *
        FROM production_entries
        WHERE company_id = $1
        ORDER BY id DESC;
        `,
        [companyId]
    );

    return result.rows;
};


const getProductionById =
async (
    id,
    companyId
) => {

    const result = await db.query(
        `
        SELECT *
        FROM production_entries
        WHERE id = $1
        AND company_id = $2
        `,
        [id, companyId]
    );

    return result.rows[0];
};

module.exports = {
    getNextProductionNumber,
    createProductionEntry,
    createProductionItem,
    getAllProductions,
    getProductionById
};