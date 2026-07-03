/**
 * ============================================
 * Multi Company ERP
 * Module  : Sales
 * Service : Sales Invoice Service
 * Purpose : Complete Sales Invoice Process
 * ============================================
 */

const {

    getSalesOrderById,

    getSalesOrderItems,

    markSalesOrderInvoiced

} = require("../../models/salesOrderModel");


const {

    generateInvoiceNumber,

    createSalesInvoice,

    createSalesInvoiceItem

} = require("../../models/salesInvoiceModel");


const {

    issueFinishedGoods

} = require("../inventory/stockMovementService");

const {
    createOutstandingForInvoice
} = require("../finance/customerOutstandingService");

// ============================================
// Fetch Sales Order
// ============================================

const fetchSalesOrder = async (

    companyId,

    salesOrderId

) => {

    const salesOrder =
        await getSalesOrderById(

            salesOrderId,

            companyId

        );

    if (!salesOrder) {

        throw new Error(
            "Sales Order not found."
        );

    }
if (

    salesOrder.status === "INVOICED"

) {

    throw new Error(

        "Sales Order already invoiced."

    );

}
    return salesOrder;

};

// ============================================
// Fetch Sales Order Items
// ============================================

const fetchSalesOrderItems = async (

    salesOrderId

) => {

    const items =
        await getSalesOrderItems(

            salesOrderId

        );

    if (!items.length) {

        throw new Error(
            "Sales Order Items not found."
        );

    }

    return items;

};

// ============================================
// Validate Finished Goods
// ============================================

const validateFinishedGoods = async (

    companyId,

    warehouseId,

    items

) => {

    const {

        getFinishedGoodsStock

    } = require("../../models/finishedGoodsStockModel");

    for (const item of items) {

        const stock =
            await getFinishedGoodsStock(

                companyId,

                warehouseId,

                item.product_id

            );

        if (
            !stock ||
            Number(stock.quantity) <
            Number(item.qty)
        ) {

            throw new Error(

                `Insufficient Finished Goods Stock for Product ID ${item.product_id}`

            );

        }

    }

};

// ============================================
// Create Invoice
// ============================================

const createInvoice = async (

    companyId,

    salesOrder,

    items,

    invoiceData

) => {

    const invoiceNo =
        await generateInvoiceNumber(

            companyId

        );

    let totalAmount = 0;

    for (const item of items) {

        totalAmount +=
            Number(item.amount);

    }

    const invoice =
        await createSalesInvoice(

            companyId,

            {

                invoiceNo,

                salesOrderId:
                    salesOrder.id,

                customerId:
                    salesOrder.customer_id,

                warehouseId:
                    invoiceData.warehouseId,

                invoiceDate:
                    invoiceData.invoiceDate,

                remarks:
                    invoiceData.remarks,

                totalAmount

            }

        );

    for (const item of items) {

        await createSalesInvoiceItem(

            invoice.id,

            {

                productId:
                    item.product_id,

                qty:
                    item.qty,

                rate:
                    item.rate,

                amount:
                    item.amount

            }

        );

    }

    return invoice;

};

// ============================================
// Complete Sales Invoice Process
// ============================================

const completeSalesInvoice = async (

    companyId,

    invoiceData

) => {

    // Fetch Sales Order

    const salesOrder =
        await fetchSalesOrder(

            companyId,

            invoiceData.salesOrderId

        );

    // Fetch Items

    const items =
        await fetchSalesOrderItems(

            salesOrder.id

        );

    // Validate Finished Goods

    await validateFinishedGoods(

        companyId,

        invoiceData.warehouseId,

        items

    );

    // Create Invoice

    const invoice =
        await createInvoice(

            companyId,

            salesOrder,

            items,

            invoiceData

        );

    // Issue Finished Goods

    for (const item of items) {

        await issueFinishedGoods(

            companyId,

            invoiceData.warehouseId,

            item.product_id,

            item.qty,

            invoice.id,

            "SALES",

            `Sales Invoice ${invoice.invoice_no}`

        );

    }
await markSalesOrderInvoiced(
    salesOrder.id
);

await createOutstandingForInvoice(
    companyId,
    salesOrder.customer_id,
    invoice.id,
    invoice.total_amount
);

return invoice;

};



module.exports = {

    fetchSalesOrder,
    fetchSalesOrderItems,
    validateFinishedGoods,
    createInvoice,
    completeSalesInvoice

};