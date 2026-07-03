const {
    createWarehouse,
    getAllWarehouses,
    getNextWarehouseCode,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse
} = require("../models/warehouseModel");


// Add Warehouse
const addWarehouse = async (req, res) => {

    try {

        const warehouseCode =
            await getNextWarehouseCode(
                req.user.companyId
            );

        const warehouseData = {
            warehouseCode,
            warehouseName: req.body.warehouseName,
            warehouseType: req.body.warehouseType,
            address: req.body.address
        };

        const warehouse =
            await createWarehouse(
                req.user.companyId,
                warehouseData
            );

        return res.status(201).json({
            success: true,
            message: "Warehouse Created Successfully.",
            warehouse
        });

    } catch (err) {

        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// Warehouse List
const listWarehouses = async (req, res) => {

    try {

        const warehouses =
            await getAllWarehouses(
                req.user.companyId
            );

        return res.status(200).json({
            success: true,
            warehouses
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get Warehouse
const getWarehouse = async (req, res) => {

    try {

        const warehouse =
            await getWarehouseById(
                req.params.id,
                req.user.companyId
            );

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found."
            });
        }

        return res.status(200).json({
            success: true,
            warehouse
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Update Warehouse
const editWarehouse = async (req, res) => {

    try {

        const warehouse =
            await updateWarehouse(
                req.params.id,
                req.user.companyId,
                req.body
            );

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Warehouse updated successfully.",
            warehouse
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Delete Warehouse
const removeWarehouse = async (req, res) => {

    try {

        const warehouse =
            await deleteWarehouse(
                req.params.id,
                req.user.companyId
            );

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Warehouse deleted successfully."
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
    addWarehouse,
    listWarehouses,
    getWarehouse,
    editWarehouse,
    removeWarehouse
};