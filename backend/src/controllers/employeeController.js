const { createEmployee,
        getAllEmployees,
        getNextEmployeeCode ,
        getEmployeeById,
        updateEmployee,
        deleteEmployee
      } = require("../models/employeeModel");



const addEmployee = async (req, res) => {
    try {

        const employeeCode = await getNextEmployeeCode(req.user.companyId);

        const employeeData = {
            companyId: req.user.companyId,
            employeeCode,
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

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


const listEmployees = async (req, res) => {
    try {

        const employees = await getAllEmployees(req.user.companyId);

        return res.status(200).json({
            success: true,
            employees
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getEmployee = async (req, res) => {
    try {

        const employee = await getEmployeeById(
            req.params.id,
            req.user.companyId
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        return res.status(200).json({
            success: true,
            employee
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const updateEmployeeDetails = async (req, res) => {

    try {

        const employee = await updateEmployee(
            req.params.id,
            req.user.companyId,
            req.body
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully.",
            employee
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const removeEmployee = async (req, res) => {

    try {

        const employee = await deleteEmployee(
            req.params.id,
            req.user.companyId
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    addEmployee,
    listEmployees,
    getEmployee,
    updateEmployeeDetails,
    removeEmployee
};