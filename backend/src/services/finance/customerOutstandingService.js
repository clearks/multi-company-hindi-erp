const {
    createCustomerOutstanding,
    getOutstandingByInvoice
} = require("../../models/finance/customerOutstandingModel");

// ===========================================
// Create Outstanding after Invoice
// ===========================================

const createOutstandingForInvoice = async (
    companyId,
    customerId,
    invoiceId,
    invoiceAmount
) => {

    const existingOutstanding =
        await getOutstandingByInvoice(
            companyId,
            invoiceId
        );

    if (existingOutstanding) {
        return existingOutstanding;
    }

    return await createCustomerOutstanding(
        companyId,
        customerId,
        invoiceId,
        invoiceAmount
    );
};

module.exports = {
    createOutstandingForInvoice
};