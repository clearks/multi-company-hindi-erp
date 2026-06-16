const companyModel = require("../models/companyModel");

// सभी Companies
const getCompanies = async (req, res) => {
    try {
        const companies = await companyModel.getAllCompanies();

        res.status(200).json({
            success: true,
            total: companies.length,
            data: companies,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// नई Company बनाना
const createCompany = async (req, res) => {
    try {
        const { company_name, company_code } = req.body;

        // Validation
        if (!company_name || !company_code) {
            return res.status(400).json({
                success: false,
                message: "Company Name and Company Code are required",
            });
        }

        // Duplicate Check
        const existing = await companyModel.findCompanyByCode(company_code);

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Company Code already exists",
            });
        }

        // Save Company
        const company = await companyModel.createCompany(
            company_name,
            company_code
        );

        res.status(201).json({
            success: true,
            message: "Company Created Successfully",
            data: company,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getCompanies,
    createCompany,
};