/**

* ============================================
* Multi Company ERP
* Module  : Sales
* Controller : Sales Invoice
* ============================================
  */

const {
completeSalesInvoice
} = require("../services/sales/salesInvoiceService");

// ============================================
// Create Sales Invoice
// ============================================

const addSalesInvoice = async (req, res) => {

try {

    const invoice = await completeSalesInvoice(
        req.user.companyId,
        req.body
    );

    return res.status(201).json({
        success: true,
        message: "Sales Invoice Created Successfully.",
        invoice
    });

} catch (err) {

    console.error(err);

    return res.status(500).json({
        success: false,
        message: err.message
    });

}


};

module.exports = {
addSalesInvoice
};
