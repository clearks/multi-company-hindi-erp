const db = require("../../config/db");

const {

    generateDocumentNumber

} = require("../../services/common/numberGeneratorService");

const DOCUMENT_TYPES = require("../../constants/documentTypes");

// ============================================
// Generate Payment Number
// ====================================// 

const generateSupplierPaymentNumber = async (

    companyId

) => {

    return await generateDocumentNumber(

        companyId,

        DOCUMENT_TYPES.SUPPLIER_PAYMENT

    );

};

// ============================================
// Create Supplier Payment
// ============================================

const createSupplierPayment = async (

    companyId,

    paymentData

) => {

    const result = await db.query(

        `

        INSERT INTO supplier_payments
        (

            company_id,

            payment_no,

            supplier_id,

            payment_date,

            payment_mode,

            reference_no,

            remarks,

            total_amount

        )

        VALUES
        (

            $1,

            $2,

            $3,

            $4,

            $5,

            $6,

            $7,

            $8

        )

        RETURNING *;

        `,

        [

            companyId,

            paymentData.paymentNo,

            paymentData.supplierId,

            paymentData.paymentDate,

            paymentData.paymentMode,

            paymentData.referenceNo,

            paymentData.remarks,

            paymentData.totalAmount

        ]

    );

    return result.rows[0];

};

module.exports = {

    generateSupplierPaymentNumber,

    createSupplierPayment

};