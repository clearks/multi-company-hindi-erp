/**
 * ============================================
 * Multi Company ERP
 * Module  : Inventory
 * Service : Stock Movement Service
 * Purpose : Common Inventory Operations
 * ============================================
 */

/**
 * NOTE
 *
 * This service will run inside
 * Database Transaction Layer.
 *
 * DO NOT call directly from
 * Controller in future.
 */

const {

    getWarehouseStock,

    addWarehouseStock,

    updateWarehouseStock

} = require("../../models/warehouseStockModel");


const {

    getFinishedGoodsStock,

    addFinishedGoodsStock,

    updateFinishedGoodsStock

} = require("../../models/finishedGoodsStockModel");


const {

    createStockLedgerEntry

} = require("../../models/stockLedgerModel");

// ============================================
// Issue Finished Goods
// ============================================

const issueFinishedGoods = async (

    companyId,

    warehouseId,

    productId,

    quantity,

    referenceId,

    referenceType,

    remarks

) => {

    // Check Stock

    const stock =
        await getFinishedGoodsStock(

            companyId,

            warehouseId,

            productId

        );

    if (
        !stock ||
        Number(stock.quantity)
        < Number(quantity)
    ) {

        throw new Error(
            "Insufficient Finished Goods Stock."
        );

    }

    // Minus Stock

    await updateFinishedGoodsStock(

        warehouseId,

        productId,

        -Number(quantity)

    );

    // Stock Ledger

   /* await createStockLedgerEntry(

        companyId,

        productId,

        referenceType,

        referenceId,

        0,

        quantity,

        0,

        remarks

    );
*/
};

// ============================================
// Receive Finished Goods
// ============================================

const receiveFinishedGoods = async (

    companyId,

    warehouseId,

    productId,

    quantity,

    referenceId,

    referenceType,

    remarks

) => {

    const stock =
        await getFinishedGoodsStock(

            companyId,

            warehouseId,

            productId

        );

    if (!stock) {

        await addFinishedGoodsStock(

            companyId,

            warehouseId,

            productId,

            quantity

        );

    }

    else {

        await updateFinishedGoodsStock(

            warehouseId,

            productId,

            quantity

        );

    }

    await createStockLedgerEntry(

        companyId,

        productId,

        referenceType,

        referenceId,

        quantity,

        0,

        0,

        remarks

    );

};



module.exports = {

    issueFinishedGoods,
    receiveFinishedGoods

};