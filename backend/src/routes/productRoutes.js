const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const {
    authorizeRoles
} = require("../middlewares/roleMiddleware");

const {
    addProduct,
    listProducts,
    getProduct,
    editProduct,
    removeProduct
} = require("../controllers/productController");


// Create Product
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addProduct
);


// Get All Products
router.get(
    "/",
    authMiddleware,
    listProducts
);


// Get Product By Id
router.get(
    "/:id",
    authMiddleware,
    getProduct
);


// Update Product
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    editProduct
);


// Delete Product
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    removeProduct
);

module.exports = router;