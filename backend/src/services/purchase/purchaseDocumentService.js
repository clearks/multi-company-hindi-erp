/**
 * ============================================
 * Multi Company ERP
 * Module  : Purchase
 * Layer   : Purchase Document Service
 * Purpose : Purchase Number & Amount Calculation
 * ============================================
 */

const { generateDocumentNumber } =
require("../common/numberGeneratorService");

const DOCUMENT_TYPES =
require("../../constants/documentTypes");

/**
 * ============================================
 * GENERATE PURCHASE NUMBER
 * ============================================
 */

const generatePurchaseNumber = async (companyId) => {

    return await generateDocumentNumber(
        companyId,
        DOCUMENT_TYPES.PURCHASE
    );

};

/**
 * ============================================
 * CALCULATE PURCHASE TOTAL
 * ============================================
 */

const calculatePurchaseTotal = (items = []) => {

    let totalAmount = 0;

    for (const item of items) {

        totalAmount +=
            Number(item.qty) * Number(item.rate);

    }

    return totalAmount;

};

module.exports = {

    generatePurchaseNumber,
    calculatePurchaseTotal

};