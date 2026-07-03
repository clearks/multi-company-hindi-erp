const db = require("../../config/db");
const {getCompanyById} = require("../../models/companyModel");
const {getDocumentType} = require("../../models/documentTypeModel");

// ============================================
// Current Financial Year
// ============================================

const getFinancialYear = () => {

    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth() + 1;

    if (month >= 4) {

        return `${String(year).slice(2)}-${String(year + 1).slice(2)}`;

    }

    return `${String(year - 1).slice(2)}-${String(year).slice(2)}`;

};

// ============================================
// Get Current Sequence
// ============================================

const getCurrentSequence = async (

    companyId,

    moduleCode,

    financialYear

) => {

    const result = await db.query(

        `

        SELECT *

        FROM document_sequences

        WHERE company_id = $1

        AND module_code = $2

        AND financial_year = $3

        `,

        [

            companyId,

            moduleCode,

            financialYear

        ]

    );

    return result.rows[0];

};

// ============================================
// Create Sequence
// ============================================

const createSequence = async (

    companyId,

    moduleCode,

    financialYear

) => {

    const result = await db.query(

        `

        INSERT INTO document_sequences

        (

            company_id,

            module_code,

            financial_year,

            last_number

        )

        VALUES

        (

            $1,

            $2,

            $3,

            1

        )

        RETURNING *;

        `,

        [

            companyId,

            moduleCode,

            financialYear

        ]

    );

    return result.rows[0];

};

// ============================================
// Update Sequence
// ============================================

const updateSequence = async (

    id,

    nextNumber

) => {

    const result = await db.query(

        `

        UPDATE document_sequences

        SET

            last_number = $2,

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $1

        RETURNING *;

        `,

        [

            id,

            nextNumber

        ]

    );

    return result.rows[0];

};



// ============================================
// Generate Document Number
// ============================================

const generateDocumentNumber = async (

    companyId,

    moduleName

) => {

    // Get Company

    const company = await getCompanyById(

        companyId

    );

    if (!company) {

        throw new Error(

            "Company not found."

        );

    }

    const companyCode = company.company_code;

    // Get Document Type

    const documentType = await getDocumentType(

        moduleName

    );

    if (!documentType) {

        throw new Error(

            "Document Type not found."

        );

    }

    const moduleCode = documentType.module_code;

    // Get Financial Year

    const financialYear = getFinancialYear();

    // Get Current Sequence

    let sequence = await getCurrentSequence(

        companyId,

        moduleCode,

        financialYear

    );

    // Create First Sequence

    if (!sequence) {

        sequence = await createSequence(

            companyId,

            moduleCode,

            financialYear

        );

    }

    // Update Existing Sequence

    else {

        sequence = await updateSequence(

            sequence.id,

            sequence.last_number + 1

        );

    }

    // Running Number

    const runningNo =

        String(sequence.last_number)

            .padStart(6, "0");

    // Final Document Number

    return `${companyCode}-${financialYear}-${moduleCode}-${runningNo}`;

};

module.exports = {

    getFinancialYear,

    getCurrentSequence,

    createSequence,

    updateSequence,

    generateDocumentNumber

};