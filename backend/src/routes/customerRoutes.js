const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const { authorizeRoles } = require("../middlewares/roleMiddleware");

const {
    addCustomer,
    listCustomers,
    getCustomer,
    updateCustomerById,
    deleteCustomerById
} = require("../controllers/customerController");


// Create Customer
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addCustomer
);


// Customer List
router.get(
    "/",
    authMiddleware,
    listCustomers
);


// Single Customer
router.get(
    "/:id",
    authMiddleware,
    getCustomer
);


// Update Customer
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    updateCustomerById
);


// Soft Delete Customer
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    deleteCustomerById
);

module.exports = router;