const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middlewares/authMiddleware");

const {
    authorizeRoles
} = require("../middlewares/roleMiddleware");

const {
    addWarehouse,
    listWarehouses,
    getWarehouse,
    editWarehouse,
    removeWarehouse
} = require("../controllers/warehouseController");


// Create Warehouse
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addWarehouse
);


// Warehouse List
router.get(
    "/",
    authMiddleware,
    listWarehouses
);


// Warehouse By ID
router.get(
    "/:id",
    authMiddleware,
    getWarehouse
);


// Update Warehouse
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    editWarehouse
);


// Delete Warehouse
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    removeWarehouse
);

module.exports = router;