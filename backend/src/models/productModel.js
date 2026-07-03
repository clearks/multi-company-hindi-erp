const db = require("../config/db");

const createProduct = async (
    companyId,
    productData
) => {

    const {
        productCode,
        productName,
        category,
        unit
    } = productData;

    const query = `
        INSERT INTO products
        (
            company_id,
            product_code,
            product_name,
            category,
            unit
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        productCode,
        productName,
        category,
        unit
    ];

    const result =
        await db.query(query, values);

    return result.rows[0];
};


const getAllProducts = async (
    companyId
) => {

    const query = `
        SELECT *
        FROM products
        WHERE company_id = $1
        AND status = 'ACTIVE'
        ORDER BY id DESC;
    `;

    const result =
        await db.query(query, [companyId]);

    return result.rows;
};


const getNextProductCode = async (
    companyId
) => {

    const result =
        await db.query(
            `
            SELECT MAX(
                CAST(
                    REPLACE(
                        product_code,
                        'PRD',
                        ''
                    ) AS INTEGER
                )
            ) AS last_number
            FROM products
            WHERE company_id = $1
            `,
            [companyId]
        );

    const nextNumber =
        (result.rows[0].last_number || 0)
        + 1;

    return `PRD${String(nextNumber)
        .padStart(5, "0")}`;
};


const getProductById = async (
    id,
    companyId
) => {

    const query = `
        SELECT *
        FROM products
        WHERE id = $1
        AND company_id = $2
        AND status = 'ACTIVE';
    `;

    const result =
        await db.query(
            query,
            [id, companyId]
        );

    return result.rows[0];
};


const updateProduct = async (
    id,
    companyId,
    productData
) => {

    const {
        productCode,
        productName,
        category,
        unit
    } = productData;

    const query = `
        UPDATE products
        SET
            product_code = $1,
            product_name = $2,
            category = $3,
            unit = $4,
            updated_at =
            CURRENT_TIMESTAMP
        WHERE id = $5
        AND company_id = $6
        RETURNING *;
    `;

    const values = [
        productCode,
        productName,
        category,
        unit,
        id,
        companyId
    ];

    const result =
        await db.query(query, values);

    return result.rows[0];
};


const deleteProduct = async (
    id,
    companyId
) => {

    const query = `
        UPDATE products
        SET
            status='INACTIVE',
            updated_at=
            CURRENT_TIMESTAMP
        WHERE id=$1
        AND company_id=$2
        RETURNING *;
    `;

    const result =
        await db.query(
            query,
            [id, companyId]
        );

    return result.rows[0];
};


module.exports = {
    createProduct,
    getAllProducts,
    getNextProductCode,
    getProductById,
    updateProduct,
    deleteProduct
};