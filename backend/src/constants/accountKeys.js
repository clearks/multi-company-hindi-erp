/**
 * ============================================
 * Multi Company Enterprise ERP
 * Finance Account Keys
 * ============================================
 */

const ACCOUNT_KEYS = {

    // -----------------------------
    // Assets
    // -----------------------------

    CASH: "CASH",

    BANK: "BANK",

    ACCOUNTS_RECEIVABLE: "AR",

    INVENTORY_RAW: "INVENTORY_RAW",

    INVENTORY_WIP: "INVENTORY_WIP",

    INVENTORY_FINISHED: "INVENTORY_FINISHED",

    INVENTORY_STORES: "INVENTORY_STORES",

    FIXED_ASSET: "FIXED_ASSET",

    GST_INPUT: "GST_INPUT",

    ADVANCE_TO_SUPPLIER: "ADVANCE_TO_SUPPLIER",

    // -----------------------------
    // Liabilities
    // -----------------------------

    ACCOUNTS_PAYABLE: "AP",

    GST_OUTPUT: "GST_OUTPUT",

    CUSTOMER_ADVANCE: "CUSTOMER_ADVANCE",

    DUTIES_PAYABLE: "DUTIES_PAYABLE",

    // -----------------------------
    // Income
    // -----------------------------

    SALES: "SALES",

    SALES_RETURN: "SALES_RETURN",

    OTHER_INCOME: "OTHER_INCOME",

    // -----------------------------
    // Expense
    // -----------------------------

    PURCHASE: "PURCHASE",

    PURCHASE_RETURN: "PURCHASE_RETURN",

    DIRECT_EXPENSE: "DIRECT_EXPENSE",

    INDIRECT_EXPENSE: "INDIRECT_EXPENSE",

    DISCOUNT_ALLOWED: "DISCOUNT_ALLOWED",

    DISCOUNT_RECEIVED: "DISCOUNT_RECEIVED",

    ROUND_OFF: "ROUND_OFF",

    // -----------------------------
    // Equity
    // -----------------------------

    CAPITAL: "CAPITAL",

    RETAINED_EARNINGS: "RETAINED_EARNINGS"

};

module.exports = ACCOUNT_KEYS;