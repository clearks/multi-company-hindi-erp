/**
 * ============================================
 * Multi Company ERP
 * Module  : Common Utility
 * File    : documentNumberGenerator.js
 * Purpose : Generate Document Numbers
 * ============================================
 */

const db = require("../config/db");

/**
 * Generate Next Document Number
 *
 * @param {Number} companyId
 * @param {String} tableName
 * @param {String} fieldName
 * @param {String} prefix
 * @returns {String}
 */

const generateDocumentNumber = async (
    companyId,
    tableName,
    fieldName,
    prefix
) => {

    const query = `
        SELECT
            MAX(
                CAST(
                    REPLACE(${fieldName}, $2, '')
                    AS INTEGER
                )
            ) AS last_number
        FROM ${tableName}
        WHERE company_id = $1;
    `;

    const result =
        await db.query(
            query,
            [
                companyId,
                prefix
            ]
        );

    const nextNumber =
        (
            result.rows[0].last_number || 0
        ) + 1;

    return `${prefix}${String(nextNumber).padStart(5, "0")}`;
};

module.exports = {
    generateDocumentNumber
};