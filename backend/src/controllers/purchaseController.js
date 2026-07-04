/**
 * ============================================
 * Multi Company ERP
 * Module  : Purchase
 * Layer   : Controller
 * Purpose : Handle Purchase APIs
 * ============================================
 */

const purchaseService =
require("../services/purchase/purchaseService");

const {
    getAllPurchases,
    getPurchaseById,
    deletePurchase
} = require("../models/purchaseModel");


// ============================================
// ADD PURCHASE
// ============================================

const addPurchase = async (req, res) => {

    try {

        const purchase =
            await purchaseService.createPurchaseTransaction(
                req.body,
                req.user
            );

        return res.status(201).json({

            success: true,

            message: "Purchase Created Successfully.",

            purchase

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ============================================
// LIST PURCHASES
// ============================================

const listPurchases = async (req, res) => {

    try {

        const purchases =
            await getAllPurchases(req.user.companyId);

        return res.status(200).json({

            success: true,

            purchases

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ============================================
// GET PURCHASE
// ============================================

const getPurchase = async (req, res) => {

    try {

        const purchase =
            await getPurchaseById(

                req.params.id,

                req.user.companyId

            );

        if (!purchase) {

            return res.status(404).json({

                success: false,

                message: "Purchase not found."

            });

        }

        return res.status(200).json({

            success: true,

            purchase

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ============================================
// DELETE PURCHASE
// ============================================

const removePurchase = async (req, res) => {

    try {

        const purchase =
            await deletePurchase(

                req.params.id,

                req.user.companyId

            );

        if (!purchase) {

            return res.status(404).json({

                success: false,

                message: "Purchase not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Purchase deleted successfully."

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

    addPurchase,

    listPurchases,

    getPurchase,

    removePurchase

};