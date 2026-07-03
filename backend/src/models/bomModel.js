const db = require("../config/db");

const getNextBomCode = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(bom_code,'BOM','') AS INTEGER)
        ) AS last_number
        FROM bom
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber =
        (result.rows[0].last_number || 0) + 1;

    return `BOM${String(nextNumber).padStart(5,"0")}`;
};


const createBom = async (
    companyId,
    bomData
) => {

    const {
        bomCode,
        productId,
        quantity
    } = bomData;

    const query = `
        INSERT INTO bom
        (
            company_id,
            bom_code,
            product_id,
            quantity
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `;

    const result = await db.query(
        query,
        [
            companyId,
            bomCode,
            productId,
            quantity
        ]
    );

    return result.rows[0];
};


const createBomItem = async (
    bomId,
    item
) => {

    const query = `
        INSERT INTO bom_items
        (
            bom_id,
            raw_material_id,
            quantity,
            wastage_percent
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
    `;

    const result = await db.query(
        query,
        [
            bomId,
            item.rawMaterialId,
            item.quantity,
            item.wastagePercent || 0
        ]
    );

    return result.rows[0];
};


const getAllBoms = async (
    companyId
) => {

    const query = `
        SELECT
            b.*,
            p.product_name
        FROM bom b
        JOIN products p
        ON p.id = b.product_id
        WHERE b.company_id = $1
        AND b.status='ACTIVE'
        ORDER BY b.id DESC;
    `;

    const result =
        await db.query(query,[companyId]);

    return result.rows;
};


const getBomById = async (
    id,
    companyId
) => {

    const query = `
        SELECT *
        FROM bom
        WHERE id=$1
        AND company_id=$2
        AND status='ACTIVE';
    `;

    const result =
        await db.query(
            query,
            [id,companyId]
        );

    return result.rows[0];
};


const deleteBom = async (
    id,
    companyId
) => {

    const query = `
        UPDATE bom
        SET
            status='INACTIVE',
            updated_at=CURRENT_TIMESTAMP
        WHERE id=$1
        AND company_id=$2
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [id,companyId]
        );

    return result.rows[0];
};

const getBomItems = async (bomId) => {

    const result = await db.query(
        `
        SELECT
            bi.*,
            rm.item_name,
            rm.unit
        FROM bom_items bi
        JOIN raw_materials rm
        ON rm.id = bi.raw_material_id
        WHERE bi.bom_id = $1
        `,
        [bomId]
    );

    return result.rows;
};

module.exports = {
    getNextBomCode,
    createBom,
    createBomItem,
    getAllBoms,
    getBomById,
    deleteBom,
    getBomItems
};