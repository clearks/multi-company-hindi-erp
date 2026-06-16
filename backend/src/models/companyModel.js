const db = require("../config/db");

// सभी Companies
const getAllCompanies = async () => {
    const result = await db.query(`
        SELECT id, company_name, company_code, created_at
        FROM companies
        ORDER BY id ASC
    `);

    return result.rows;
};

// नई Company जोड़ना
const createCompany = async (company_name, company_code) => {
    const result = await db.query(
        `
        INSERT INTO companies (company_name, company_code)
        VALUES ($1, $2)
        RETURNING *
        `,
        [company_name, company_code]
    );

    return result.rows[0];
};

// Company Code पहले से है या नहीं
const findCompanyByCode = async (company_code) => {
    const result = await db.query(
        `
        SELECT * FROM companies
        WHERE company_code = $1
        `,
        [company_code]
    );

    return result.rows[0];
};

module.exports = {
    getAllCompanies,
    createCompany,
    findCompanyByCode,
};