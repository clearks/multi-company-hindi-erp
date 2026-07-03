/**
 * ============================================
 * Multi Company ERP
 * Module  : Sales Order
 * Layer   : Model
 * Purpose : Sales Order Database Operations
 * ============================================
 */

const db = require("../config/db");

const {
    generateDocumentNumber
} = require("../utils/documentNumberGenerator");


// ============================================
// Generate Sales Order Number
// ============================================

const generateSalesOrderNumber = async (
    companyId
) => {

    return await generateDocumentNumber(
        companyId,
        "sales_orders",
        "sales_order_no",
        "SO"
    );
};


// ============================================
// Create Sales Order Header
// ============================================

const createSalesOrder = async (
    companyId,
    salesOrderData
) => {

    const {
        salesOrderNo,
        customerId,
        orderDate,
        expectedDeliveryDate,
        remarks,
        totalAmount
    } = salesOrderData;

    const query = `

        INSERT INTO sales_orders
        (
            company_id,
            sales_order_no,
            customer_id,
            order_date,
            expected_delivery_date,
            remarks,
            total_amount
        )

        VALUES

        (
            $1,$2,$3,$4,$5,$6,$7
        )

        RETURNING *;

    `;

    const values = [

        companyId,

        salesOrderNo,

        customerId,

        orderDate,

        expectedDeliveryDate,

        remarks,

        totalAmount

    ];

    const result =
        await db.query(query, values);

    return result.rows[0];

};


// ============================================
// Create Sales Order Item
// ============================================

const createSalesOrderItem = async (
    salesOrderId,
    item
) => {

    const query = `

        INSERT INTO sales_order_items
        (
            sales_order_id,
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

        salesOrderId,

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
// Get All Sales Orders
// ============================================

const getAllSalesOrders = async (
    companyId
) => {

    const query = `

        SELECT
            so.*,
            c.customer_name

        FROM sales_orders so

        JOIN customers c

        ON so.customer_id = c.id

        WHERE
            so.company_id = $1
        AND
            so.status != 'CANCELLED'

        ORDER BY
            so.id DESC;

    `;

    const result =
        await db.query(query, [companyId]);

    return result.rows;

};


// ============================================
// Get Sales Order By Id
// ============================================

const getSalesOrderById = async (
    id,
    companyId
) => {

    const query = `

        SELECT *

        FROM sales_orders

        WHERE
            id = $1
        AND
            company_id = $2;

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
// Get Sales Order Items
// ============================================

const getSalesOrderItems = async (

    salesOrderId

) => {

    const query = `

        SELECT

            *

        FROM

            sales_order_items

        WHERE

            sales_order_id = $1

        ORDER BY id;

    `;

    const result =
        await db.query(

            query,

            [

                salesOrderId

            ]

        );

    return result.rows;

};

// ============================================
// Mark Sales Order as Invoiced
// ============================================

const markSalesOrderInvoiced = async (

    salesOrderId

) => {

    const query = `

        UPDATE sales_orders

        SET

            status = 'INVOICED',

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $1

        RETURNING *;

    `;

    const result = await db.query(

        query,

        [

            salesOrderId

        ]

    );

    return result.rows[0];

};

// ============================================
// Cancel Sales Order
// ============================================

const deleteSalesOrder = async (
    id,
    companyId
) => {

    const query = `

        UPDATE sales_orders

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

    generateSalesOrderNumber,

    createSalesOrder,

    createSalesOrderItem,

    getAllSalesOrders,

    getSalesOrderById,

    getSalesOrderItems,

    markSalesOrderInvoiced,

    deleteSalesOrder

};