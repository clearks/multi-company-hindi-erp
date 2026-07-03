const db = require("../../config/db");

// ============================================
// Create Supplier Payable
// ============================================

const createSupplierPayable = async (

    companyId,

    supplierId,

    purchaseId,

    invoiceAmount

) => {

    const result = await db.query(

        `

        INSERT INTO supplier_payables
        (

            company_id,

            supplier_id,

            purchase_id,

            invoice_amount,

            paid_amount,

            outstanding_amount,

            status

        )

        VALUES

        (

            $1,

            $2,

            $3,

            $4,

            0,

            $4,

            'UNPAID'

        )

        RETURNING *;

        `,

        [

            companyId,

            supplierId,

            purchaseId,

            invoiceAmount

        ]

    );

    return result.rows[0];

};

// ============================================
// Get Supplier Payable
// ============================================

const getSupplierPayableByPurchase = async (

    companyId,

    purchaseId

) => {

    const result = await db.query(

        `

        SELECT *

        FROM supplier_payables

        WHERE company_id = $1

        AND purchase_id = $2

        `,

        [

            companyId,

            purchaseId

        ]

    );

    return result.rows[0];

};

// ============================================
// Update Supplier Payable
// ============================================

const updateSupplierPayable = async (

    payableId,

    paidAmount,

    outstandingAmount,

    status

) => {

    const result = await db.query(

        `

        UPDATE supplier_payables

        SET

            paid_amount = $2,

            outstanding_amount = $3,

            status = $4,

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $1

        RETURNING *;

        `,

        [

            payableId,

            paidAmount,

            outstandingAmount,

            status

        ]

    );

    return result.rows[0];

};

module.exports = {

    createSupplierPayable,

    getSupplierPayableByPurchase,

    updateSupplierPayable

};