const express = require("express");
const router = express.Router();

const companyAdminController = require("../controllers/companyAdminController");

const verifyToken = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Create Company Admin
router.post(
    "/register",
    verifyToken,
    authorizeRoles("SUPER_ADMIN"),
    companyAdminController.register
);

// Login Company Admin
router.post(
    "/login",
    companyAdminController.loginCompanyAdmin
);

module.exports = router;