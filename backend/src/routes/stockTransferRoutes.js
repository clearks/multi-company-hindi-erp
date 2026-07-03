const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const {
    authorizeRoles
} = require("../middlewares/roleMiddleware");

const {
    addStockTransfer,
    listTransfers,
    getTransfer,
    removeTransfer
} = require("../controllers/stockTransferController");


// Create Transfer
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addStockTransfer
);


// Get All Transfers
router.get(
    "/",
    authMiddleware,
    listTransfers
);


// Get Transfer By Id
router.get(
    "/:id",
    authMiddleware,
    getTransfer
);


// Delete Transfer
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    removeTransfer
);

module.exports = router;