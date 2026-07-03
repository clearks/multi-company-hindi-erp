const {
    createCustomer,
    getAllCustomers,
    getNextCustomerCode,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require("../models/customerModel");


// Add Customer
const addCustomer = async (req, res) => {

    try {

        const customerCode =
            await getNextCustomerCode(req.user.companyId);

        const customerData = {
            customerCode,
            customerName: req.body.customerName,
            mobile: req.body.mobile,
            email: req.body.email,
            gstNumber: req.body.gstNumber,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            openingBalance: req.body.openingBalance
        };

        const customer = await createCustomer(
            req.user.companyId,
            customerData
        );

        return res.status(201).json({
            success: true,
            message: "Customer Created Successfully.",
            customer
        });

    } catch (err) {

        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// Customer List
const listCustomers = async (req, res) => {

    try {

        const customers =
            await getAllCustomers(req.user.companyId);

        return res.status(200).json({
            success: true,
            customers
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Single Customer
const getCustomer = async (req, res) => {

    try {

        const customer =
            await getCustomerById(
                req.params.id,
                req.user.companyId
            );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        return res.status(200).json({
            success: true,
            customer
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Update Customer
const updateCustomerById = async (req, res) => {

    try {

        const customerData = {
            customerCode: req.body.customerCode,
            customerName: req.body.customerName,
            mobile: req.body.mobile,
            email: req.body.email,
            gstNumber: req.body.gstNumber,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            openingBalance: req.body.openingBalance
        };

        const customer = await updateCustomer(
            req.params.id,
            req.user.companyId,
            customerData
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer updated successfully.",
            customer
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Soft Delete Customer
const deleteCustomerById = async (req, res) => {

    try {

        const customer = await deleteCustomer(
            req.params.id,
            req.user.companyId
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer deleted successfully."
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
    addCustomer,
    listCustomers,
    getCustomer,
    updateCustomerById,
    deleteCustomerById
};