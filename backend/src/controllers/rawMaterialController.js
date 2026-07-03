const {
    createRawMaterial,
    getAllRawMaterials,
    getNextRawMaterialCode,
    getRawMaterialById,
    updateRawMaterial,
    deleteRawMaterial
} = require("../models/rawMaterialModel");


// Add Raw Material
const addRawMaterial = async (req, res) => {

    try {

        const itemCode =
            await getNextRawMaterialCode(req.user.companyId);

        const rawMaterialData = {
            itemCode,
            itemName: req.body.itemName,
            category: req.body.category,
            unit: req.body.unit,
            minimumStock: req.body.minimumStock,
            currentStock: req.body.currentStock
        };

        const rawMaterial = await createRawMaterial(
            req.user.companyId,
            rawMaterialData
        );

        return res.status(201).json({
            success: true,
            message: "Raw Material Created Successfully.",
            rawMaterial
        });

    } catch (err) {

        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// Raw Material List
const listRawMaterials = async (req, res) => {

    try {

        const rawMaterials =
            await getAllRawMaterials(req.user.companyId);

        return res.status(200).json({
            success: true,
            rawMaterials
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Single Raw Material
const getRawMaterial = async (req, res) => {

    try {

        const rawMaterial =
            await getRawMaterialById(
                req.params.id,
                req.user.companyId
            );

        if (!rawMaterial) {
            return res.status(404).json({
                success: false,
                message: "Raw Material not found."
            });
        }

        return res.status(200).json({
            success: true,
            rawMaterial
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Update Raw Material
const updateRawMaterialById = async (req, res) => {

    try {

        const rawMaterialData = {
            itemCode: req.body.itemCode,
            itemName: req.body.itemName,
            category: req.body.category,
            unit: req.body.unit,
            minimumStock: req.body.minimumStock,
            currentStock: req.body.currentStock
        };

        const rawMaterial = await updateRawMaterial(
            req.params.id,
            req.user.companyId,
            rawMaterialData
        );

        if (!rawMaterial) {
            return res.status(404).json({
                success: false,
                message: "Raw Material not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Raw Material updated successfully.",
            rawMaterial
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Soft Delete Raw Material
const deleteRawMaterialById = async (req, res) => {

    try {

        const rawMaterial = await deleteRawMaterial(
            req.params.id,
            req.user.companyId
        );

        if (!rawMaterial) {
            return res.status(404).json({
                success: false,
                message: "Raw Material not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Raw Material deleted successfully."
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
    addRawMaterial,
    listRawMaterials,
    getRawMaterial,
    updateRawMaterialById,
    deleteRawMaterialById
};