/**
 * ============================================
 * Multi Company ERP
 * Module  : Finance
 * Model   : Receipt Item
 * ============================================
 */

const db = require("../../config/db");

// ============================================
// Create Receipt Item
// ============================================

const createReceiptItem = async (

    receiptId,

    invoiceId,

    amount

) => {

    const result = await db.query(

        `
        INSERT INTO receipt_items
        (
            receipt_id,
            invoice_id,
            received_amount
        )
        VALUES
        (
            $1,$2,$3
        )
        RETURNING *;
        `,

        [

            receiptId,

            invoiceId,

            amount

        ]

    );

    return result.rows[0];

};

module.exports = {

    createReceiptItem

};