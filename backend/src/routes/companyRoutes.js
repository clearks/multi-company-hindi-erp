const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");

const authMiddleware = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// सभी Companies
router.get(
    "/",
    authMiddleware,
    authorizeRoles("SUPER_ADMIN"),
    companyController.getCompanies
);

// नई Company
router.post(
    "/",
    authMiddleware,
    authorizeRoles("SUPER_ADMIN"),
    companyController.createCompany
);

module.exports = router;