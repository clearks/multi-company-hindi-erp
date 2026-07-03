const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const { authorizeRoles } = require("../middlewares/roleMiddleware");

const {
    addSupplier,
    listSuppliers,
    getSupplier,
    updateSupplierById,
    deleteSupplierById
} = require("../controllers/supplierController");


// Create Supplier
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addSupplier
);


// Supplier List
router.get(
    "/",
    authMiddleware,
    listSuppliers
);


// Single Supplier
router.get(
    "/:id",
    authMiddleware,
    getSupplier
);


// Update Supplier
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    updateSupplierById
);


// Soft Delete Supplier
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    deleteSupplierById
);

module.exports = router;