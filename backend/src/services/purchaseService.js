/**
 * ============================================
 * Multi Company ERP
 * Module  : Purchase
 * Layer   : Service
 * Purpose : Purchase Business Logic
 * ============================================
 */
const db = require("../config/db");

const { createPurchase, createPurchaseItem } =
require("../models/purchaseModel");

const { getRawMaterialById, updateRawMaterialStock } =
require("../models/rawMaterialModel");

const { createStockLedgerEntry } =
require("../models/stockLedgerModel");

const {
  getWarehouseStock,
  addWarehouseStock,
  updateWarehouseStock
} = require("../models/warehouseStockModel");

const { createSupplierPayable } =
require("../models/finance/supplierPayableModel");

const financeIntegrationService =
require("./finance/financeIntegrationService");

const { generateDocumentNumber } =
require("./common/numberGeneratorService");

const DOCUMENT_TYPES =
require("../constants/documentTypes");

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
      inventoryAccountId,
      supplierAccountId
    } = data;

    const purchaseNo = await generateDocumentNumber(
      user.companyId,
      DOCUMENT_TYPES.PURCHASE
    );

    let totalAmount = 0;

    for (const item of items) {
      totalAmount += Number(item.qty) * Number(item.rate);
    }

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

      const rawMaterial =
        await getRawMaterialById(
          item.rawMaterialId,
          user.companyId
        );

      const newBalance =
        Number(rawMaterial.current_stock) + Number(item.qty);

      await updateRawMaterialStock(
        item.rawMaterialId,
        item.qty
      );

      await createStockLedgerEntry(
        user.companyId,
        item.rawMaterialId,
        "PURCHASE",
        purchase.id,
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
          user.companyId,
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

    await createSupplierPayable(
      user.companyId,
      supplierId,
      purchase.id,
      totalAmount
    );

    await financeIntegrationService.processTransaction({
      companyId: user.companyId,
      voucherType: "PURCHASE",
      voucherNumber: purchaseNo,
      voucherDate: purchase.purchase_date,
      referenceType: "PURCHASE",
      referenceId: purchase.id,
      narration: "Purchase Auto Entry",
      createdBy: user.userId,
      lines: [
        {
          accountId: inventoryAccountId,
          debit: totalAmount,
          credit: 0,
          description: "Stock Purchase"
        },
        {
          accountId: supplierAccountId,
          debit: 0,
          credit: totalAmount,
          description: "Supplier Payable"
        }
      ]
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