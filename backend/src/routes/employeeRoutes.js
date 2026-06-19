const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const { authorizeRoles } = require("../middlewares/roleMiddleware");

const {
    addEmployee,
} = require("../controllers/employeeController");

router.post(
    "/",
    authMiddleware,
    authorizeRoles("COMPANY_ADMIN"),
    addEmployee
);

module.exports = router;