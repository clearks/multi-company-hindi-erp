/**
 * =====================================================
 * Multi Company Enterprise ERP
 * Finance Bootstrap Service
 * =====================================================
 * Purpose:
 * Automatically create default Account Groups
 * and System Accounts for every new company.
 * =====================================================
 */

const {

    ROOT_GROUPS,

    CHILD_GROUPS,

    SYSTEM_ACCOUNTS

} = require("../../config/defaultChartOfAccounts");

const {

    createAccountGroup,

    getAccountGroupByName

} = require("../../models/accountGroupModel");

const {

    createAccount,

    getAccountByName

} = require("../../models/accountModel");

/**
 * =====================================================
 * Create Root Groups
 * =====================================================
 */

const createRootGroups = async (
    companyId,
    createdBy = null
) => {

    for (const group of ROOT_GROUPS) {

        const exists =
            await getAccountGroupByName(
                companyId,
                group.name
            );

        if (exists) {

            continue;

        }

        await createAccountGroup(
            companyId,
            {
                parentId: null,
                groupName: group.name,
                groupCode: group.code,
                rootType: group.rootType,
                accountNature: group.nature,
                level: 0,
                isSystem: true,
                createdBy
            }
        );
    }

};

/**
 * =====================================================
 * Create Child Groups
 * =====================================================
 */

const createChildGroups = async (
    companyId,
    createdBy = null
) => {

    for (const group of CHILD_GROUPS) {

        // Parent Group
        const parentGroup =
            await getAccountGroupByName(
                companyId,
                group.parent
            );

        if (!parentGroup) {

            throw new Error(
                `Parent Group '${group.parent}' not found.`
            );

        }

        // Duplicate Check
        const exists =
            await getAccountGroupByName(
                companyId,
                group.name
            );

        if (exists) {

            continue;

        }

        await createAccountGroup(
            companyId,
            {
                parentId: parentGroup.id,
                groupName: group.name,
                groupCode: group.code,
                rootType: group.rootType,
                accountNature: group.nature,
                level: parentGroup.level + 1,
                isSystem: true,
                createdBy
            }
        );

    }

};

/**
 * =====================================================
 * Create System Accounts
 * =====================================================
 */

const createSystemAccounts = async (
    companyId,
    createdBy = null
) => {

    for (const account of SYSTEM_ACCOUNTS) {

        // Parent Group
        const parentGroup =
            await getAccountGroupByName(
                companyId,
                account.parent
            );

        if (!parentGroup) {

            throw new Error(
                `Parent Group '${account.parent}' not found.`
            );

        }

        // Duplicate Check
        const exists =
            await getAccountByName(
                companyId,
                account.name
            );

        if (exists) {

            continue;

        }

        await createAccount(
            companyId,
            {
                groupId: parentGroup.id,

                accountName: account.name,

                accountCode: null,

                accountKey: account.key,

                accountType: account.type,

                openingBalance: 0,

                openingBalanceType: account.nature,

                allowManualEntry: true,

                isCashAccount: account.cash || false,

                isBankAccount: account.bank || false,

                isPartyAccount: account.party || false,

                isSystem: true,

                createdBy
            }
        );

    }

};

/**
 * =====================================================
 * Bootstrap Company Accounts
 * =====================================================
 */

const bootstrapCompanyAccounts = async (
    companyId,
    createdBy = null
) => {

    // Step 1
    await createRootGroups(
        companyId,
        createdBy
    );

    // Step 2
    await createChildGroups(
        companyId,
        createdBy
    );

    // Step 3
    await createSystemAccounts(
        companyId,
        createdBy
    );

    return {

        success: true,

        message:
            "Default Chart Of Accounts Created Successfully."

    };

};

module.exports = {

    bootstrapCompanyAccounts

};

