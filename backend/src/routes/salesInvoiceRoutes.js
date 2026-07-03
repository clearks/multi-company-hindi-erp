const express = require("express");

const router = express.Router();

const verifyToken =
require("../middlewares/authMiddleware");

const {

    addSalesInvoice

} = require("../controllers/salesInvoiceController");


router.post(

    "/",

    verifyToken,

    addSalesInvoice

);

module.exports = router;