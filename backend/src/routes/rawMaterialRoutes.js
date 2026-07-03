const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const { authorizeRoles } = require("../middlewares/roleMiddleware");

const {
    addRawMaterial,
    listRawMaterials,
    getRawMaterial,
    updateRawMaterialById,
    deleteRawMaterialById
} = require("../controllers/rawMaterialController");


// Create Raw Material
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addRawMaterial
);


// Raw Material List
router.get(
    "/",
    authMiddleware,
    listRawMaterials
);


// Single Raw Material
router.get(
    "/:id",
    authMiddleware,
    getRawMaterial
);


// Update Raw Material
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    updateRawMaterialById
);


// Soft Delete Raw Material
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    deleteRawMaterialById
);

module.exports = router;