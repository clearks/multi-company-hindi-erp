const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
    addReceipt
} = require("../controllers/receiptController");

router.post(
    "/",
    verifyToken,
    addReceipt
);

module.exports = router;