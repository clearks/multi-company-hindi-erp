const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const {
    authorizeRoles
} = require("../middlewares/roleMiddleware");

const {
    addPurchase,
    listPurchases,
    getPurchase,
    removePurchase
} = require("../controllers/purchaseController");


router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addPurchase
);

router.get(
    "/",
    authMiddleware,
    listPurchases
);

router.get(
    "/:id",
    authMiddleware,
    getPurchase
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    removePurchase
);

module.exports = router;