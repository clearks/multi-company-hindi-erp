/**
 * ============================================
 * Multi Company ERP
 * Module  : Sales Order
 * Layer   : Controller
 * Purpose : Sales Order APIs
 * ============================================
 */

const {

    createSalesOrder,

    createSalesOrderItem,

    getAllSalesOrders,

    getSalesOrderById,

    deleteSalesOrder

} = require("../models/salesOrderModel");

const {

    generateDocumentNumber

} = require("../services/common/numberGeneratorService");

const DOCUMENT_TYPES = require("../constants/documentTypes");

// ============================================
// Create Sales Order
// ============================================

const addSalesOrder = async (
    req,
    res
) => {

    try {

        const salesOrderNo =

    await generateDocumentNumber(

        req.user.companyId,

        DOCUMENT_TYPES.SALES_ORDER

    );
        const {

            customerId,

            orderDate,

            expectedDeliveryDate,

            remarks,

            items

        } = req.body;

        let totalAmount = 0;

        for (const item of items) {

            totalAmount +=

                Number(item.qty)

                *

                Number(item.rate);

        }

        const salesOrder =
            await createSalesOrder(

                req.user.companyId,

                {

                    salesOrderNo,

                    customerId,

                    orderDate,

                    expectedDeliveryDate,

                    remarks,

                    totalAmount

                }

            );

        for (const item of items) {

            await createSalesOrderItem(

                salesOrder.id,

                {

                    productId:
                        item.productId,

                    qty:
                        item.qty,

                    rate:
                        item.rate,

                    amount:
                        item.qty *
                        item.rate

                }

            );

        }

        return res.status(201).json({

            success: true,

            message:
                "Sales Order Created Successfully.",

            salesOrder

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


// ============================================
// List Sales Orders
// ============================================

const listSalesOrders =
async (
    req,
    res
) => {

    try {

        const salesOrders =
            await getAllSalesOrders(
                req.user.companyId
            );

        return res.status(200).json({

            success: true,

            salesOrders

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


// ============================================
// Get Sales Order
// ============================================

const getSalesOrder =
async (
    req,
    res
) => {

    try {

        const salesOrder =
            await getSalesOrderById(

                req.params.id,

                req.user.companyId

            );

        if (!salesOrder) {

            return res.status(404).json({

                success: false,

                message:
                    "Sales Order not found."

            });

        }

        return res.status(200).json({

            success: true,

            salesOrder

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


// ============================================
// Cancel Sales Order
// ============================================

const removeSalesOrder =
async (
    req,
    res
) => {

    try {

        const salesOrder =
            await deleteSalesOrder(

                req.params.id,

                req.user.companyId

            );

        if (!salesOrder) {

            return res.status(404).json({

                success: false,

                message:
                    "Sales Order not found."

            });

        }

        return res.status(200).json({

            success: true,

            message:
                "Sales Order Cancelled Successfully."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


module.exports = {

    addSalesOrder,

    listSalesOrders,

    getSalesOrder,

    removeSalesOrder

};