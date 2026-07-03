/**
 * ============================================
 * Multi Company ERP
 * Module  : Sales Invoice
 * Layer   : Model
 * Purpose : Sales Invoice Database Operations
 * ============================================
 */

const db = require("../config/db");

const {

    generateDocumentNumber

} = require("../services/common/numberGeneratorService");

const DOCUMENT_TYPES = require("../constants/documentTypes");


// ============================================
// Generate Invoice Number
// ============================================


const generateInvoiceNumber = async (

    companyId

) => {

    return await generateDocumentNumber(

        companyId,

        DOCUMENT_TYPES.SALES_INVOICE

    );

};

// ============================================
// Create Invoice Header
// ============================================

const createSalesInvoice = async (

    companyId,

    invoiceData

) => {

    const {

        invoiceNo,

        salesOrderId,

        customerId,

        warehouseId,

        invoiceDate,

        remarks,

        totalAmount

    } = invoiceData;

    const query = `

        INSERT INTO sales_invoices
        (

            company_id,

            invoice_no,

            sales_order_id,

            customer_id,

            warehouse_id,

            invoice_date,

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

        invoiceNo,

        salesOrderId,

        customerId,

        warehouseId,

        invoiceDate,

        remarks,

        totalAmount

    ];

    const result =
        await db.query(query, values);

    return result.rows[0];

};


// ============================================
// Create Invoice Item
// ============================================

const createSalesInvoiceItem = async (

    salesInvoiceId,

    item

) => {

    const query = `

        INSERT INTO sales_invoice_items
        (

            sales_invoice_id,

            product_id,

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

        salesInvoiceId,

        item.productId,

        item.qty,

        item.rate,

        item.amount

    ];

    const result =
        await db.query(query, values);

    return result.rows[0];

};


// ============================================
// Get All Invoices
// ============================================

const getAllSalesInvoices = async (

    companyId

) => {

    const query = `

        SELECT

            si.*,

            c.customer_name

        FROM sales_invoices si

        JOIN customers c

        ON c.id = si.customer_id

        WHERE

            si.company_id = $1

        ORDER BY

            si.id DESC;

    `;

    const result =
        await db.query(query, [companyId]);

    return result.rows;

};


// ============================================
// Get Invoice By Id
// ============================================

const getSalesInvoiceById = async (

    id,

    companyId

) => {

    const query = `

        SELECT *

        FROM sales_invoices

        WHERE

            id=$1

        AND

            company_id=$2;

    `;

    const result =
        await db.query(

            query,

            [

                id,

                companyId

            ]

        );

    return result.rows[0];

};


// ============================================
// Cancel Invoice
// ============================================

const deleteSalesInvoice = async (

    id,

    companyId

) => {

    const query = `

        UPDATE sales_invoices

        SET

            status='CANCELLED',

            updated_at=CURRENT_TIMESTAMP

        WHERE

            id=$1

        AND

            company_id=$2

        RETURNING *;

    `;

    const result =
        await db.query(

            query,

            [

                id,

                companyId

            ]

        );

    return result.rows[0];

};


module.exports = {

    generateInvoiceNumber,

    createSalesInvoice,

    createSalesInvoiceItem,

    getAllSalesInvoices,

    getSalesInvoiceById,

    deleteSalesInvoice

};