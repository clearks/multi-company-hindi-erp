const db = require("../config/db");

const getNextPurchaseNumber = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(purchase_no,'PUR','') AS INTEGER)
        ) AS last_number
        FROM purchases
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber =
        (result.rows[0].last_number || 0) + 1;

    return `PUR${String(nextNumber).padStart(5, "0")}`;
};


// Create Purchase Header
const createPurchase = async (
    companyId,
    purchaseData
) => {

    const {
        purchaseNo,
        supplierId,
        warehouseId,
        purchaseDate,
        invoiceNo,
        remarks,
        totalAmount
    } = purchaseData;

    const query = `
        INSERT INTO purchases
        (
            company_id,
            purchase_no,
            supplier_id,
            warehouse_id,
            purchase_date,
            invoice_no,
            remarks,
            total_amount
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        purchaseNo,
        supplierId,
        warehouseId,
        purchaseDate,
        invoiceNo,
        remarks,
        totalAmount
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};


// Create Purchase Item
const createPurchaseItem = async (
    purchaseId,
    item
) => {

    const query = `
        INSERT INTO purchase_items
        (
            purchase_id,
            raw_material_id,
            qty,
            rate,
            amount
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `;

    const values = [
        purchaseId,
        item.rawMaterialId,
        item.qty,
        item.rate,
        item.amount
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};


// List Purchases
const getAllPurchases = async (
    companyId
) => {

    const query = `
        SELECT *
        FROM purchases
        WHERE company_id = $1
        AND status='ACTIVE'
        ORDER BY id DESC;
    `;

    const result =
        await db.query(query, [companyId]);

    return result.rows;
};


// Purchase By ID
const getPurchaseById = async (
    id,
    companyId
) => {

    const query = `
        SELECT *
        FROM purchases
        WHERE id = $1
        AND company_id = $2
        AND status='ACTIVE';
    `;

    const result =
        await db.query(query,
        [id, companyId]);

    return result.rows[0];
};


// Soft Delete
const deletePurchase = async (
    id,
    companyId
) => {

    const query = `
        UPDATE purchases
        SET
            status='INACTIVE',
            updated_at=CURRENT_TIMESTAMP
        WHERE id=$1
        AND company_id=$2
        RETURNING *;
    `;

    const result =
        await db.query(query,
        [id, companyId]);

    return result.rows[0];
};

module.exports = {
    getNextPurchaseNumber,
    createPurchase,
    createPurchaseItem,
    getAllPurchases,
    getPurchaseById,
    deletePurchase
};