const financeIntegrationService =
require("../services/finance/financeIntegrationService");

const accountLookupService =
require("../services/finance/accountLookupService");

const {
    createPurchase,
    createPurchaseItem,
    getAllPurchases,
    getPurchaseById,
    deletePurchase
} = require("../models/purchaseModel");

const {
    getRawMaterialById,
    updateRawMaterialStock
} = require("../models/rawMaterialModel");

const {
    createStockLedgerEntry
} = require("../models/stockLedgerModel");

const {
    getWarehouseStock,
    addWarehouseStock,
    updateWarehouseStock
} = require("../models/warehouseStockModel");

const {
    createSupplierPayable
} = require("../models/finance/supplierPayableModel");

const {
    generateDocumentNumber
} = require("../services/common/numberGeneratorService");

const DOCUMENT_TYPES = require("../constants/documentTypes");


// ============================================
// ADD PURCHASE
// ============================================
const addPurchase = async (req, res) => {

    try {

        const purchaseNo = await generateDocumentNumber(
            req.user.companyId,
            DOCUMENT_TYPES.PURCHASE
        );

        const {
    supplierId,
    warehouseId,
    purchaseDate,
    invoiceNo,
    remarks,
    items
} = req.body;

        let totalAmount = 0;

        for (const item of items) {
            totalAmount += Number(item.qty) * Number(item.rate);
        }

        const purchase = await createPurchase(
            req.user.companyId,
            {
                purchaseNo,
                supplierId,
                warehouseId,
                purchaseDate,
                invoiceNo,
                remarks,
                totalAmount
            }
        );

        for (const item of items) {

            await createPurchaseItem(
                purchase.id,
                {
                    rawMaterialId: item.rawMaterialId,
                    qty: item.qty,
                    rate: item.rate,
                    amount: item.qty * item.rate
                }
            );

            const rawMaterial = await getRawMaterialById(
                item.rawMaterialId,
                req.user.companyId
            );

            const newBalance =
                Number(rawMaterial.current_stock) + Number(item.qty);

            await createStockLedgerEntry(
                req.user.companyId,
                item.rawMaterialId,
                "PURCHASE",
                purchase.id,
                item.qty,
                0,
                newBalance,
                `Purchase No ${purchase.purchaseNo}`
            );

            await updateRawMaterialStock(
                item.rawMaterialId,
                item.qty
            );

            const warehouseStock = await getWarehouseStock(
                warehouseId,
                item.rawMaterialId
            );

            if (!warehouseStock) {

                await addWarehouseStock(
                    req.user.companyId,
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
        }

        // ============================================
        // SUPPLIER PAYABLE
        // ============================================
        await createSupplierPayable(
            req.user.companyId,
            supplierId,
            purchase.id,
            totalAmount
        );
const purchaseAccounts =
    await accountLookupService.getPurchaseAccounts(
        req.user.companyId
    );
        // ============================================
        // FINANCE INTEGRATION (FIXED - INSIDE TRY)
        // ============================================
        await financeIntegrationService.processTransaction({

            companyId: req.user.companyId,

            voucherType: "PURCHASE",

          voucherNumber: purchase.purchase_no,
voucherDate: purchase.purchase_date,

            referenceType: "PURCHASE",

            referenceId: purchase.id,

            narration: "Purchase Auto Entry",

            createdBy: req.user.userId,

            lines: [
    {
        accountId: purchaseAccounts.inventoryAccount.id,
        debit: totalAmount,
        credit: 0,
        description: "Raw Material Inventory"
    },
    {
        accountId: purchaseAccounts.supplierAccount.id,
        debit: 0,
        credit: totalAmount,
        description: "Accounts Payable"
    }
]
        });

        return res.status(201).json({
            success: true,
            message: "Purchase Created Successfully.",
            purchase
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ============================================
// LIST PURCHASES
// ============================================
const listPurchases = async (req, res) => {

    try {

        const purchases = await getAllPurchases(req.user.companyId);

        return res.status(200).json({
            success: true,
            purchases
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ============================================
// GET PURCHASE
// ============================================
const getPurchase = async (req, res) => {

    try {

        const purchase = await getPurchaseById(
            req.params.id,
            req.user.companyId
        );

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found."
            });
        }

        return res.status(200).json({
            success: true,
            purchase
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ============================================
// DELETE PURCHASE
// ============================================
const removePurchase = async (req, res) => {

    try {

        const purchase = await deletePurchase(
            req.params.id,
            req.user.companyId
        );

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Purchase deleted successfully."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


module.exports = {
    addPurchase,
    listPurchases,
    getPurchase,
    removePurchase
};