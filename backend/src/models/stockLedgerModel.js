const db = require("../config/db");

const createStockLedgerEntry =
async (
    companyId,
    rawMaterialId,
    transactionType,
    referenceId,
    qtyIn,
    qtyOut,
    balanceQty,
    remarks
) => {

    const query = `
        INSERT INTO stock_ledger
        (
            company_id,
            raw_material_id,
            transaction_type,
            reference_id,
            qty_in,
            qty_out,
            balance_qty,
            remarks
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        rawMaterialId,
        transactionType,
        referenceId,
        qtyIn,
        qtyOut,
        balanceQty,
        remarks
    ];

    const result =
        await db.query(
            query,
            values
        );

    return result.rows[0];
};

module.exports = {
    createStockLedgerEntry
};