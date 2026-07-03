const accountModel = require("../../models/accountModel");
const ACCOUNT_KEYS = require("../../constants/accountKeys");

/**
 * ============================================
 * Multi Company Enterprise ERP
 * Finance
 * Account Lookup Service
 * ============================================
 * Purpose:
 * Find System Accounts using ACCOUNT_KEYS
 * ============================================
 */

/**
 * ============================================
 * Get Account By Key
 * ============================================
 */
const getAccountByKey = async (
    companyId,
    accountKey
) => {

    const account =
        await accountModel.getAccountByAccountKey(
            companyId,
            accountKey
        );

    if (!account) {
        throw new Error(
            `System Account '${accountKey}' not configured.`
        );
    }

    return account;
};


/**
 * ============================================
 * Purchase Accounts
 * ============================================
 */
const getPurchaseAccounts = async (
    companyId
) => {

    const inventoryAccount =
        await getAccountByKey(
            companyId,
            ACCOUNT_KEYS.INVENTORY_RAW
        );

    const supplierAccount =
        await getAccountByKey(
            companyId,
            ACCOUNT_KEYS.ACCOUNTS_PAYABLE
        );

    return {

        inventoryAccount,

        supplierAccount

    };
};


module.exports = {

    getAccountByKey,

    getPurchaseAccounts

};