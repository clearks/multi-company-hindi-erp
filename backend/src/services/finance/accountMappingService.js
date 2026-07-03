const accountModel = require("../../models/accountModel");
const ACCOUNT_KEYS = require("../../constants/accountKeys");

/**
 * ============================================
 * Finance Account Mapping Service
 * ============================================
 */

const getPurchaseAccounts = async (companyId) => {

    const inventoryAccount =
        await accountModel.getAccountByKey(
            companyId,
            ACCOUNT_KEYS.INVENTORY_RAW
        );

    const payableAccount =
        await accountModel.getAccountByKey(
            companyId,
            ACCOUNT_KEYS.ACCOUNTS_PAYABLE
        );

    if (!inventoryAccount) {
        throw new Error(
            "Inventory Raw Account not found."
        );
    }

    if (!payableAccount) {
        throw new Error(
            "Accounts Payable Account not found."
        );
    }

    return {
        inventoryAccount,
        payableAccount
    };
};

module.exports = {
    getPurchaseAccounts
};