const db = require("../config/db");

// ============================================
// Get Document Type
// ============================================

const getDocumentType = async (

    moduleName

) => {

    const result = await db.query(

        `

        SELECT *

        FROM document_types

        WHERE module_name = $1

        `,

        [

            moduleName

        ]

    );

    return result.rows[0];

};

module.exports = {

    getDocumentType

};