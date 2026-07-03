const db = require("../config/db");

const createAccount = async (companyId, accountData) => {

    const {
        groupId,
        accountName,
        accountCode,
        accountKey,
        accountType,
        openingBalance,
        openingBalanceType,
        allowManualEntry,
        isCashAccount,
        isBankAccount,
        isPartyAccount,
        isSystem,
        createdBy
    } = accountData;

    const query = `
        INSERT INTO accounts
        (
            company_id,
            group_id,
            account_name,
            account_code,
            account_key,
            account_type,
            opening_balance,
            opening_balance_type,
            allow_manual_entry,
            is_cash_account,
            is_bank_account,
            is_party_account,
            is_system,
            created_by
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        groupId,
        accountName,
        accountCode,
        accountKey,
        accountType,
        openingBalance,
        openingBalanceType,
        allowManualEntry,
        isCashAccount,
        isBankAccount,
        isPartyAccount,
        isSystem,
        createdBy
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};


const getAllAccounts = async (companyId) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND is_active = TRUE
        ORDER BY account_code;
    `;

    const result = await db.query(query, [companyId]);
    return result.rows;
};


const getAccountById = async (id, companyId) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE id = $1
        AND company_id = $2
        AND is_active = TRUE;
    `;

    const result = await db.query(query, [id, companyId]);
    return result.rows[0];
};


const getAccountByKey = async (companyId, accountKey) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND account_key = $2
        LIMIT 1;
    `;

    const result = await db.query(query, [companyId, accountKey]);
    return result.rows[0];
};


const getAccountsByGroup = async (companyId, groupId) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND group_id = $2
        AND is_active = TRUE;
    `;

    const result = await db.query(query, [companyId, groupId]);
    return result.rows;
};


const getCashAccount = async (companyId) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND is_cash_account = TRUE
        AND is_active = TRUE
        LIMIT 1;
    `;

    const result = await db.query(query, [companyId]);
    return result.rows[0];
};


const getBankAccounts = async (companyId) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND is_bank_account = TRUE
        AND is_active = TRUE
        ORDER BY account_name;
    `;

    const result = await db.query(query, [companyId]);
    return result.rows;
};


const getPartyAccounts = async (companyId) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND is_party_account = TRUE
        AND is_active = TRUE
        ORDER BY account_name;
    `;

    const result = await db.query(query, [companyId]);
    return result.rows;
};


const updateAccount = async (id, companyId, accountData) => {

    const {
        accountName,
        accountCode,
        accountType,
        openingBalance,
        openingBalanceType,
        allowManualEntry,
        updatedBy
    } = accountData;

    const query = `
        UPDATE accounts
        SET
            account_name = $1,
            account_code = $2,
            account_type = $3,
            opening_balance = $4,
            opening_balance_type = $5,
            allow_manual_entry = $6,
            updated_by = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        AND company_id = $9
        RETURNING *;
    `;

    const values = [
        accountName,
        accountCode,
        accountType,
        openingBalance,
        openingBalanceType,
        allowManualEntry,
        updatedBy,
        id,
        companyId
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};


const deleteAccount = async (id, companyId) => {

    const query = `
        UPDATE accounts
        SET
            is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        AND company_id = $2
        RETURNING *;
    `;

    const result = await db.query(query, [id, companyId]);
    return result.rows[0];
};

const getAccountByCode = async (
    companyId,
    accountCode
) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND account_code = $2
        LIMIT 1;
    `;

    const result = await db.query(
        query,
        [
            companyId,
            accountCode
        ]
    );

    return result.rows[0];
};

const getAccountByName = async (
    companyId,
    accountName
) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND account_name = $2
        LIMIT 1;
    `;

    const result = await db.query(
        query,
        [
            companyId,
            accountName
        ]
    );

    return result.rows[0];
};

/**
 * Get Account By Account Key
 */
const getAccountByAccountKey = async (
    companyId,
    accountKey
) => {

    const query = `
        SELECT *
        FROM accounts
        WHERE company_id = $1
        AND account_key = $2
        AND is_active = TRUE
        LIMIT 1;
    `;

    const result = await db.query(query, [
        companyId,
        accountKey
    ]);

    return result.rows[0];
};

module.exports = {

    createAccount,

    getAllAccounts,

    getAccountById,

    getAccountByKey,

    getAccountByAccountKey,

    getAccountByCode,

    getAccountByName,

    getAccountsByGroup,

    getCashAccount,

    getBankAccounts,

    getPartyAccounts,

    updateAccount,

    deleteAccount

};