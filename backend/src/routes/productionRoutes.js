const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const {
    authorizeRoles
} = require("../middlewares/roleMiddleware");

const {
    addProduction,
    listProductions,
    getProduction
} = require("../controllers/productionController");


// Create Production
router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addProduction
);


// Get All Productions
router.get(
    "/",
    authMiddleware,
    listProductions
);


// Get Production By Id
router.get(
    "/:id",
    authMiddleware,
    getProduction
);

module.exports = router;