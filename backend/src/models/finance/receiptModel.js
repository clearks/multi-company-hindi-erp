/**
 * ============================================
 * Multi Company ERP
 * Module  : Finance
 * Model   : Receipt
 * ============================================
 */

const db = require("../../config/db");

const {
    generateDocumentNumber
} = require("../../services/common/numberGeneratorService");

const DOCUMENT_TYPES = require("../../constants/documentTypes");

// ============================================
// Generate Receipt Number
// ============================================

const generateReceiptNumber = async (

    companyId

) => {

    return await generateDocumentNumber(

        companyId,

        DOCUMENT_TYPES.RECEIPT

    );

};

// ============================================
// Create Receipt
// ============================================

const createReceipt = async (

    companyId,

    receiptData

) => {

    const result = await db.query(

        `
        INSERT INTO receipts
        (
            company_id,
            receipt_no,
            customer_id,
            receipt_date,
            payment_mode,
            reference_no,
            remarks,
            total_amount
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8
        )
        RETURNING *;
        `,

        [

            companyId,

            receiptData.receiptNo,

            receiptData.customerId,

            receiptData.receiptDate,

            receiptData.paymentMode,

            receiptData.referenceNo,

            receiptData.remarks,

            receiptData.totalAmount

        ]

    );

    return result.rows[0];

};

module.exports = {

    generateReceiptNumber,

    createReceipt

};