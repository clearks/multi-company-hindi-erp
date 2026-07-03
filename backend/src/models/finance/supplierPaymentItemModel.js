const db = require("../../config/db");

// ============================================
// Create Supplier Payment Item
// ============================================

const createSupplierPaymentItem = async (

    paymentId,

    purchaseId,

    amount

) => {

    const result = await db.query(

        `

        INSERT INTO supplier_payment_items
        (

            payment_id,

            purchase_id,

            amount

        )

        VALUES
        (

            $1,

            $2,

            $3

        )

        RETURNING *;

        `,

        [

            paymentId,

            purchaseId,

            amount

        ]

    );

    return result.rows[0];

};

module.exports = {

    createSupplierPaymentItem

};