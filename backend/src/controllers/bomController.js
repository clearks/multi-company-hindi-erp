const {
    getNextBomCode,
    createBom,
    createBomItem,
    getAllBoms,
    getBomById,
    deleteBom
} = require("../models/bomModel");


// Create BOM
const addBom = async (req, res) => {

    try {

        const {
            productId,
            quantity,
            items
        } = req.body;

        const bomCode =
            await getNextBomCode(
                req.user.companyId
            );

        const bom =
            await createBom(
                req.user.companyId,
                {
                    bomCode,
                    productId,
                    quantity
                }
            );

        for (const item of items) {

            await createBomItem(
                bom.id,
                item
            );
        }

        return res.status(201).json({
            success: true,
            message:
                "BOM created successfully.",
            bom
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get All BOMs
const listBoms = async (
    req,
    res
) => {

    try {

        const boms =
            await getAllBoms(
                req.user.companyId
            );

        return res.status(200).json({
            success: true,
            boms
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get BOM By Id
const getBom = async (
    req,
    res
) => {

    try {

        const bom =
            await getBomById(
                req.params.id,
                req.user.companyId
            );

        if (!bom) {

            return res.status(404).json({
                success: false,
                message:
                    "BOM not found."
            });
        }

        return res.status(200).json({
            success: true,
            bom
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Delete BOM
const removeBom = async (
    req,
    res
) => {

    try {

        const bom =
            await deleteBom(
                req.params.id,
                req.user.companyId
            );

        if (!bom) {

            return res.status(404).json({
                success: false,
                message:
                    "BOM not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "BOM deleted successfully."
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
    addBom,
    listBoms,
    getBom,
    removeBom
};