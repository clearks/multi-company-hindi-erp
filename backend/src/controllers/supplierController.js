const {
    createSupplier,
    getAllSuppliers,
    getNextSupplierCode,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require("../models/supplierModel");


// Add Supplier
const addSupplier = async (req, res) => {

    try {

        const supplierCode =
            await getNextSupplierCode(req.user.companyId);

        const supplierData = {
            supplierCode,
            supplierName: req.body.supplierName,
            mobile: req.body.mobile,
            email: req.body.email,
            gstNumber: req.body.gstNumber,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            openingBalance: req.body.openingBalance
        };

        const supplier = await createSupplier(
            req.user.companyId,
            supplierData
        );

        return res.status(201).json({
            success: true,
            message: "Supplier Created Successfully.",
            supplier
        });

    } catch (err) {

        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// Supplier List
const listSuppliers = async (req, res) => {

    try {

        const suppliers =
            await getAllSuppliers(req.user.companyId);

        return res.status(200).json({
            success: true,
            suppliers
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Single Supplier
const getSupplier = async (req, res) => {

    try {

        const supplier =
            await getSupplierById(
                req.params.id,
                req.user.companyId
            );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found."
            });
        }

        return res.status(200).json({
            success: true,
            supplier
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Update Supplier
const updateSupplierById = async (req, res) => {

    try {

        const supplierData = {
            supplierCode: req.body.supplierCode,
            supplierName: req.body.supplierName,
            mobile: req.body.mobile,
            email: req.body.email,
            gstNumber: req.body.gstNumber,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            openingBalance: req.body.openingBalance
        };

        const supplier = await updateSupplier(
            req.params.id,
            req.user.companyId,
            supplierData
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Supplier updated successfully.",
            supplier
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Delete Supplier
const deleteSupplierById = async (req, res) => {

    try {

        const supplier = await deleteSupplier(
            req.params.id,
            req.user.companyId
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Supplier deleted successfully."
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
    addSupplier,
    listSuppliers,
    getSupplier,
    updateSupplierById,
    deleteSupplierById
};