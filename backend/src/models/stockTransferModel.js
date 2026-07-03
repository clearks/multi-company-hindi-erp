const db = require("../config/db");

const getNextTransferNumber = async (companyId) => {

    const result = await db.query(
        `
        SELECT MAX(
            CAST(REPLACE(transfer_no,'TRF','') AS INTEGER)
        ) AS last_number
        FROM stock_transfers
        WHERE company_id = $1
        `,
        [companyId]
    );

    const nextNumber =
        (result.rows[0].last_number || 0) + 1;

    return `TRF${String(nextNumber).padStart(5, "0")}`;
};


const createStockTransfer = async (
    companyId,
    transferData
) => {

    const {
        transferNo,
        fromWarehouseId,
        toWarehouseId,
        transferDate,
        remarks
    } = transferData;

    const query = `
        INSERT INTO stock_transfers
        (
            company_id,
            transfer_no,
            from_warehouse_id,
            to_warehouse_id,
            transfer_date,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        transferNo,
        fromWarehouseId,
        toWarehouseId,
        transferDate,
        remarks
    ];

    const result =
        await db.query(query, values);

    return result.rows[0];
};


const createStockTransferItem = async (
    transferId,
    item
) => {

    const query = `
        INSERT INTO stock_transfer_items
        (
            transfer_id,
            raw_material_id,
            qty
        )
        VALUES
        (
            $1,$2,$3
        )
        RETURNING *;
    `;

    const values = [
        transferId,
        item.rawMaterialId,
        item.qty
    ];

    const result =
        await db.query(query, values);

    return result.rows[0];
};


const getAllTransfers = async (
    companyId
) => {

    const query = `
        SELECT *
        FROM stock_transfers
        WHERE company_id = $1
        AND status = 'ACTIVE'
        ORDER BY id DESC;
    `;

    const result =
        await db.query(query, [companyId]);

    return result.rows;
};


const getTransferById = async (
    id,
    companyId
) => {

    const query = `
        SELECT *
        FROM stock_transfers
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


const deleteTransfer = async (
    id,
    companyId
) => {

    const query = `
        UPDATE stock_transfers
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
            [id, companyId]
        );

    return result.rows[0];
};


module.exports = {
    getNextTransferNumber,
    createStockTransfer,
    createStockTransferItem,
    getAllTransfers,
    getTransferById,
    deleteTransfer
};