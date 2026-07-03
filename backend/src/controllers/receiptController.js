/**
 * ============================================
 * Multi Company ERP
 * Module  : Finance
 * Controller : Receipt
 * ============================================
 */

const {

    completeReceipt

} = require("../services/finance/receiptService");


// ============================================
// Create Receipt
// ============================================

const addReceipt = async (

    req,

    res

) => {

    try {

        const receipt =

            await completeReceipt(

                req.user.companyId,

                req.body

            );

        return res.status(201).json({

            success: true,

            message:

                "Receipt Created Successfully.",

            receipt

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

    addReceipt

};