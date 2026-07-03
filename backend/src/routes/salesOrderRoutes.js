/**
 * ============================================
 * Multi Company ERP
 * Module  : Sales Order
 * Layer   : Routes
 * Purpose : Sales Order APIs
 * ============================================
 */

const express = require("express");

const router = express.Router();

const {

    addSalesOrder,

    listSalesOrders,

    getSalesOrder,

    removeSalesOrder

} = require("../controllers/salesOrderController");

const authMiddleware =
require("../middlewares/authMiddleware");


// ============================================
// Create Sales Order
// ============================================

router.post(

    "/",

    authMiddleware,

    addSalesOrder

);


// ============================================
// Get All Sales Orders
// ============================================

router.get(

    "/",

    authMiddleware,

    listSalesOrders

);


// ============================================
// Get Sales Order By Id
// ============================================

router.get(

    "/:id",

    authMiddleware,

    getSalesOrder

);


// ============================================
// Cancel Sales Order
// ============================================

router.delete(

    "/:id",

    authMiddleware,

    removeSalesOrder

);


module.exports = router;