const db = require("../../config/db");

// ============================================
// Create Customer Outstanding
// ============================================

const createCustomerOutstanding = async (

    companyId,
    customerId,
    invoiceId,
    invoiceAmount

) => {

    const query = `

        INSERT INTO customer_outstanding
        (

            company_id,

            customer_id,

            invoice_id,

            invoice_amount,

            received_amount,

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

    `;

    const result = await db.query(

        query,

        [

            companyId,

            customerId,

            invoiceId,

            invoiceAmount

        ]

    );

    return result.rows[0];

};

// ============================================
// Get Outstanding By Invoice
// ============================================

const getOutstandingByInvoice = async (

    companyId,
    invoiceId

) => {

    const query = `

        SELECT *

        FROM customer_outstanding

        WHERE company_id = $1

        AND invoice_id = $2;

    `;

    const result = await db.query(

        query,

        [

            companyId,

            invoiceId

        ]

    );

    return result.rows[0];

};

// ============================================
// Update Customer Outstanding
// ============================================

const updateCustomerOutstanding = async (

    outstandingId,

    receivedAmount,

    outstandingAmount,

    status

) => {

    const query = `

        UPDATE customer_outstanding

        SET

            received_amount = $2,

            outstanding_amount = $3,

            status = $4,

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $1

        RETURNING *;

    `;

    const result = await db.query(

        query,

        [

            outstandingId,

            receivedAmount,

            outstandingAmount,

            status

        ]

    );

    return result.rows[0];

};

module.exports = {

    createCustomerOutstanding,

    getOutstandingByInvoice,

    updateCustomerOutstanding

};