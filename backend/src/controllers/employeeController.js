const { createEmployee } = require("../models/employeeModel");

const addEmployee = async (req, res) => {
    try {

        const employeeData = {
            companyId: req.user.companyId,

            employeeCode: req.body.employeeCode,

            fullName: req.body.fullName,

            mobile: req.body.mobile,

            email: req.body.email,

            gender: req.body.gender,

            dob: req.body.dob,

            joiningDate: req.body.joiningDate,

            department: req.body.department,

            designation: req.body.designation,

            salary: req.body.salary,

            address: req.body.address
        };

        const employee = await createEmployee(employeeData);

        return res.status(201).json({
            success: true,
            message: "Employee Created Successfully.",
            employee
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });

    }
};

module.exports = {
    addEmployee
};