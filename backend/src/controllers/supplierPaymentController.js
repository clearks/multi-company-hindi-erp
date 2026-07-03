/**
 * ============================================
 * Multi Company ERP
 * Module  : Finance
 * Controller : Supplier Payment
 * ============================================
 */

const {

    completeSupplierPayment

} = require("../services/finance/supplierPaymentService");


// ============================================
// Create Supplier Payment
// ============================================

const addSupplierPayment = async (

    req,

    res

) => {

    try {

        const payment =

            await completeSupplierPayment(

                req.user.companyId,

                req.body

            );

        return res.status(201).json({

            success: true,

            message:

                "Supplier Payment Created Successfully.",

            payment

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    addSupplierPayment

};