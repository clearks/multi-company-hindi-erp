const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const {

    addSupplierPayment

} = require("../controllers/supplierPaymentController");


router.post(

    "/",

    verifyToken,

    addSupplierPayment

);

module.exports = router;