/**
 * ============================================
 * Multi Company ERP
 * Module  : Purchase
 * Layer   : Purchase Finance Service
 * Purpose : Handle Finance Posting After Purchase
 * ============================================
 */

const {
    createSupplierPayable
} = require("../../models/finance/supplierPayableModel");

const financeIntegrationService =
require("../finance/financeIntegrationService");

/**
 * ============================================
 * PROCESS PURCHASE FINANCE
 * ============================================
 */

const processPurchaseFinance = async ({
    companyId,
    supplierId,
    purchaseId,
    purchaseNo,
    purchaseDate,
    totalAmount,
    inventoryAccountId,
    supplierAccountId,
    userId
}) => {

    await createSupplierPayable(
        companyId,
        supplierId,
        purchaseId,
        totalAmount
    );

    await financeIntegrationService.processTransaction({

        companyId,

        voucherType: "PURCHASE",

        voucherNumber: purchaseNo,

        voucherDate: purchaseDate,

        referenceType: "PURCHASE",

        referenceId: purchaseId,

        narration: "Purchase Auto Entry",

        createdBy: userId,

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

};

module.exports = {

    processPurchaseFinance

};