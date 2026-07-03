/**
 * =====================================================
 * Multi Company Enterprise ERP
 * Default Chart Of Accounts Configuration
 * =====================================================
 *
 * Purpose:
 * Default Finance Structure for every new company.
 *
 * This file contains ONLY configuration.
 * No database logic should be written here.
 * =====================================================
 */

const ACCOUNT_KEYS =
require("../constants/accountKeys");

/**
 * =====================================================
 * ROOT GROUPS
 * =====================================================
 */

const ROOT_GROUPS = [

    {
        code: "1000",
        name: "Assets",
        nature: "DR",
        rootType: "ASSET"
    },

    {
        code: "2000",
        name: "Liabilities",
        nature: "CR",
        rootType: "LIABILITY"
    },

    {
        code: "3000",
        name: "Equity",
        nature: "CR",
        rootType: "EQUITY"
    },

    {
        code: "4000",
        name: "Income",
        nature: "CR",
        rootType: "INCOME"
    },

    {
        code: "5000",
        name: "Expenses",
        nature: "DR",
        rootType: "EXPENSE"
    }

];

/**
 * =====================================================
 * CHILD GROUPS
 * =====================================================
 */

const CHILD_GROUPS = [

    {
        code: "1100",
        name: "Current Assets",
        parent: "Assets",
        nature: "DR",
        rootType: "ASSET"
    },

    {
        code: "1200",
        name: "Fixed Assets",
        parent: "Assets",
        nature: "DR",
        rootType: "ASSET"
    },

    {
        code: "2100",
        name: "Current Liabilities",
        parent: "Liabilities",
        nature: "CR",
        rootType: "LIABILITY"
    },

    {
        code: "3100",
        name: "Capital",
        parent: "Equity",
        nature: "CR",
        rootType: "EQUITY"
    },

    {
        code: "4100",
        name: "Sales Income",
        parent: "Income",
        nature: "CR",
        rootType: "INCOME"
    },

    {
        code: "4200",
        name: "Other Income",
        parent: "Income",
        nature: "CR",
        rootType: "INCOME"
    },

    {
        code: "5100",
        name: "Purchase & Direct Expenses",
        parent: "Expenses",
        nature: "DR",
        rootType: "EXPENSE"
    },

    {
        code: "5200",
        name: "Indirect Expenses",
        parent: "Expenses",
        nature: "DR",
        rootType: "EXPENSE"
    }

];

/**
 * =====================================================
 * SYSTEM ACCOUNTS
 * =====================================================
 */

const SYSTEM_ACCOUNTS = [

    {
        name: "Cash",
        key: ACCOUNT_KEYS.CASH,
        parent: "Current Assets",
        type: "ASSET",
        nature: "DR",
        cash: true,
        bank: false,
        party: false
    },

    {
        name: "Bank",
        key: ACCOUNT_KEYS.BANK,
        parent: "Current Assets",
        type: "ASSET",
        nature: "DR",
        cash: false,
        bank: true,
        party: false
    },

    {
        name: "Accounts Receivable",
        key: ACCOUNT_KEYS.ACCOUNTS_RECEIVABLE,
        parent: "Current Assets",
        type: "ASSET",
        nature: "DR",
        party: true
    },

    {
        name: "Raw Material Inventory",
        key: ACCOUNT_KEYS.INVENTORY_RAW,
        parent: "Current Assets",
        type: "ASSET",
        nature: "DR"
    },

    {
        name: "WIP Inventory",
        key: ACCOUNT_KEYS.INVENTORY_WIP,
        parent: "Current Assets",
        type: "ASSET",
        nature: "DR"
    },

    {
        name: "Finished Goods Inventory",
        key: ACCOUNT_KEYS.INVENTORY_FINISHED,
        parent: "Current Assets",
        type: "ASSET",
        nature: "DR"
    },

    {
        name: "Accounts Payable",
        key: ACCOUNT_KEYS.ACCOUNTS_PAYABLE,
        parent: "Current Liabilities",
        type: "LIABILITY",
        nature: "CR",
        party: true
    },

    {
        name: "Capital",
        key: ACCOUNT_KEYS.CAPITAL,
        parent: "Capital",
        type: "EQUITY",
        nature: "CR"
    },

    {
        name: "Sales",
        key: ACCOUNT_KEYS.SALES,
        parent: "Sales Income",
        type: "INCOME",
        nature: "CR"
    },

    {
        name: "Other Income",
        key: ACCOUNT_KEYS.OTHER_INCOME,
        parent: "Other Income",
        type: "INCOME",
        nature: "CR"
    },

    {
        name: "Purchase",
        key: ACCOUNT_KEYS.PURCHASE,
        parent: "Purchase & Direct Expenses",
        type: "EXPENSE",
        nature: "DR"
    },

    {
        name: "Direct Expense",
        key: ACCOUNT_KEYS.DIRECT_EXPENSE,
        parent: "Purchase & Direct Expenses",
        type: "EXPENSE",
        nature: "DR"
    },

    {
        name: "Indirect Expense",
        key: ACCOUNT_KEYS.INDIRECT_EXPENSE,
        parent: "Indirect Expenses",
        type: "EXPENSE",
        nature: "DR"
    }

];

module.exports = {

    ROOT_GROUPS,

    CHILD_GROUPS,

    SYSTEM_ACCOUNTS

};