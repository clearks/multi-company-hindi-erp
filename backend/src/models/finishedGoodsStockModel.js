const db = require("../config/db");


const getFinishedGoodsStock = async (
    companyId,
    warehouseId,
    productId
) => {

    const result = await db.query(
        `
        SELECT *
FROM finished_goods_stock
WHERE company_id = $1
AND warehouse_id = $2
AND product_id = $3
        `,
        [
    companyId,
    warehouseId,
    productId
]
    );

    return result.rows[0];
};


const addFinishedGoodsStock = async (
    companyId,
    warehouseId,
    productId,
    quantity
) => {

    const result = await db.query(
        `
        INSERT INTO finished_goods_stock
        (
            company_id,
            warehouse_id,
            product_id,
            quantity
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
        `,
        [
            companyId,
            warehouseId,
            productId,
            quantity
        ]
    );

    return result.rows[0];
};


const updateFinishedGoodsStock = async (
    warehouseId,
    productId,
    quantity
) => {

    const result = await db.query(
        `
        UPDATE finished_goods_stock
        SET
            quantity =
            quantity + $3,
            updated_at =
            CURRENT_TIMESTAMP
        WHERE warehouse_id = $1
        AND product_id = $2
        RETURNING *;
        `,
        [
            warehouseId,
            productId,
            quantity
        ]
    );

    return result.rows[0];
};

module.exports = {
    getFinishedGoodsStock,
    addFinishedGoodsStock,
    updateFinishedGoodsStock
};