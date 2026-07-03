const db = require("../config/db");

/**
 * Create Account Group
 */
const createAccountGroup = async (companyId, groupData) => {

    const {
        parentId,
        groupName,
        groupCode,
        rootType,
        accountNature,
        level,
        isSystem,
        createdBy
    } = groupData;

    const query = `
        INSERT INTO account_groups
        (
            company_id,
            parent_id,
            group_name,
            group_code,
            root_type,
            account_nature,
            level,
            is_system,
            created_by
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        RETURNING *;
    `;

    const values = [
        companyId,
        parentId,
        groupName,
        groupCode,
        rootType,
        accountNature,
        level,
        isSystem,
        createdBy
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

/**
 * Get All Groups
 */
const getAllAccountGroups = async (companyId) => {

    const query = `
        SELECT *
        FROM account_groups
        WHERE company_id = $1
        AND is_active = TRUE
        ORDER BY level ASC, id ASC;
    `;

    const result = await db.query(query, [companyId]);

    return result.rows;
};

/**
 * Get Group By Id
 */
const getAccountGroupById = async (id, companyId) => {

    const query = `
        SELECT *
        FROM account_groups
        WHERE id = $1
        AND company_id = $2
        AND is_active = TRUE;
    `;

    const result = await db.query(query, [id, companyId]);

    return result.rows[0];
};

/**
 * Get Group By Code
 */
const getAccountGroupByCode = async (companyId, groupCode) => {

    const query = `
        SELECT *
        FROM account_groups
        WHERE company_id = $1
        AND group_code = $2
        LIMIT 1;
    `;

    const result = await db.query(query, [
        companyId,
        groupCode
    ]);

    return result.rows[0];
};

/**
 * Get Group By Name
 */
const getAccountGroupByName = async (
    companyId,
    groupName
) => {

    const query = `
        SELECT *
        FROM account_groups
        WHERE company_id = $1
        AND group_name = $2
        LIMIT 1;
    `;

    const result = await db.query(
        query,
        [
            companyId,
            groupName
        ]
    );

    return result.rows[0];
};

/**
 * Get Child Groups
 */
const getChildGroups = async (companyId, parentId) => {

    const query = `
        SELECT *
        FROM account_groups
        WHERE company_id = $1
        AND parent_id = $2
        AND is_active = TRUE
        ORDER BY id;
    `;

    const result = await db.query(query, [
        companyId,
        parentId
    ]);

    return result.rows;
};

/**
 * Update Account Group
 */
const updateAccountGroup = async (
    id,
    companyId,
    groupData
) => {

    const {
        parentId,
        groupName,
        groupCode,
        updatedBy
    } = groupData;

    const query = `
        UPDATE account_groups
        SET
            parent_id=$1,
            group_name=$2,
            group_code=$3,
            updated_by=$4,
            updated_at=CURRENT_TIMESTAMP
        WHERE id=$5
        AND company_id=$6
        RETURNING *;
    `;

    const values = [
        parentId,
        groupName,
        groupCode,
        updatedBy,
        id,
        companyId
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

/**
 * Soft Delete
 */
const deleteAccountGroup = async (
    id,
    companyId
) => {

    const query = `
        UPDATE account_groups
        SET
            is_active=FALSE,
            updated_at=CURRENT_TIMESTAMP
        WHERE id=$1
        AND company_id=$2
        RETURNING *;
    `;

    const result = await db.query(query, [
        id,
        companyId
    ]);

    return result.rows[0];
};

const hasChildGroups = async (companyId, groupId) => {

    const query = `
        SELECT EXISTS (
            SELECT 1
            FROM account_groups
            WHERE company_id = $1
            AND parent_id = $2
            AND is_active = TRUE
        ) AS exists;
    `;

    const result = await db.query(query, [companyId, groupId]);

    return result.rows[0].exists;
};

const hasAccounts = async (companyId, groupId) => {

    const query = `
        SELECT EXISTS (
            SELECT 1
            FROM accounts
            WHERE company_id = $1
            AND group_id = $2
            AND is_active = TRUE
        ) AS exists;
    `;

    const result = await db.query(query, [companyId, groupId]);

    return result.rows[0].exists;
};

module.exports = {

    createAccountGroup,

    getAllAccountGroups,

    getAccountGroupById,

    getAccountGroupByCode,

    getAccountGroupByName,

    getChildGroups,

    hasChildGroups,

    hasAccounts,

    updateAccountGroup,

    deleteAccountGroup

};