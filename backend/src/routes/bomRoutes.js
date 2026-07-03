const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const {
    authorizeRoles
} = require("../middlewares/roleMiddleware");

const {
    addBom,
    listBoms,
    getBom,
    removeBom
} = require("../controllers/bomController");


// Create BOM
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addBom
);


// Get All BOMs
router.get(
    "/",
    authMiddleware,
    listBoms
);


// Get BOM By Id
router.get(
    "/:id",
    authMiddleware,
    getBom
);


// Delete BOM
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    removeBom
);

module.exports = router;