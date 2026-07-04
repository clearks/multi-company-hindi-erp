/**
 * ============================================
 * Multi Company ERP
 * Module  : Purchase
 * Layer   : Purchase Stock Service
 * Purpose : Handle Inventory Updates After Purchase
 * ============================================
 */

const {
    getRawMaterialById,
    updateRawMaterialStock
} = require("../../models/rawMaterialModel");

const {
    createStockLedgerEntry
} = require("../../models/stockLedgerModel");

const {
    getWarehouseStock,
    addWarehouseStock,
    updateWarehouseStock
} = require("../../models/warehouseStockModel");

/**
 * ============================================
 * UPDATE INVENTORY AFTER PURCHASE
 * ============================================
 */

const updateInventory = async (
    companyId,
    purchaseId,
    purchaseNo,
    warehouseId,
    item
) => {

    const rawMaterial =
        await getRawMaterialById(
            item.rawMaterialId,
            companyId
        );

    const newBalance =
        Number(rawMaterial.current_stock) +
        Number(item.qty);

    await updateRawMaterialStock(
        item.rawMaterialId,
        item.qty
    );

    await createStockLedgerEntry(
        companyId,
        item.rawMaterialId,
        "PURCHASE",
        purchaseId,
        item.qty,
        0,
        newBalance,
        `Purchase No ${purchaseNo}`
    );

    const warehouseStock =
        await getWarehouseStock(
            warehouseId,
            item.rawMaterialId
        );

    if (!warehouseStock) {

        await addWarehouseStock(
            companyId,
            warehouseId,
            item.rawMaterialId,
            item.qty
        );

    } else {

        await updateWarehouseStock(
            warehouseId,
            item.rawMaterialId,
            item.qty
        );

    }

};

module.exports = {

    updateInventory

};