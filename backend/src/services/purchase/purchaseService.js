/**
 * ============================================
 * Multi Company ERP
 * Module  : Purchase
 * Layer   : Service
 * Purpose : Purchase Business Logic
 * ============================================
 */
const db = require("../../config/db");

const { createPurchase, createPurchaseItem } =
require("../../models/purchaseModel");

const purchaseStockService =
require("./purchaseStockService");

const purchaseFinanceService =
require("./purchaseFinanceService");

const purchaseDocumentService =
require("./purchaseDocumentService");

const accountLookupService =
require("../finance/accountLookupService");

/**
 * ============================================
 * CREATE PURCHASE (SERVICE LAYER)
 * ============================================
 */

const createPurchaseTransaction = async (data, user) => {

  const client = await db.connect();

  try {

    await client.query("BEGIN");

    const {
      supplierId,
      warehouseId,
      purchaseDate,
      invoiceNo,
      remarks,
      items,
      
    } = data;

    const purchaseAccounts =
    await accountLookupService.getPurchaseAccounts(
        user.companyId
    );

  const purchaseNo =
await purchaseDocumentService.generatePurchaseNumber(
    user.companyId
);

const totalAmount =
purchaseDocumentService.calculatePurchaseTotal(
    items
);

    const purchase = await createPurchase(
      user.companyId,
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

  await purchaseStockService.updateInventory(
    user.companyId,
    purchase.id,
    purchaseNo,
    warehouseId,
    item
);
    }

   await purchaseFinanceService.processPurchaseFinance({

    companyId: user.companyId,

    supplierId,

    purchaseId: purchase.id,

    purchaseNo,

    purchaseDate: purchase.purchase_date,

    totalAmount,

    userId: user.userId,

    inventoryAccountId: purchaseAccounts.inventoryAccount.id,

supplierAccountId: purchaseAccounts.supplierAccount.id,

});

    await client.query("COMMIT");

    return purchase;

  } catch (err) {

    await client.query("ROLLBACK");
    throw err;

  } finally {
    client.release();
  }
};

module.exports = {
  createPurchaseTransaction
};