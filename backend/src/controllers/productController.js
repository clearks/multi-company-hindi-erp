const {
    createProduct,
    getAllProducts,
    getNextProductCode,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../models/productModel");


// Create Product
const addProduct = async (req, res) => {

    try {

        const productCode =
            await getNextProductCode(
                req.user.companyId
            );

        const {
            productName,
            category,
            unit
        } = req.body;

        const product =
            await createProduct(
                req.user.companyId,
                {
                    productCode,
                    productName,
                    category,
                    unit
                }
            );

        return res.status(201).json({
            success: true,
            message:
                "Product created successfully.",
            product
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// List Products
const listProducts = async (
    req,
    res
) => {

    try {

        const products =
            await getAllProducts(
                req.user.companyId
            );

        return res.status(200).json({
            success: true,
            products
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get Product
const getProduct = async (
    req,
    res
) => {

    try {

        const product =
            await getProductById(
                req.params.id,
                req.user.companyId
            );

        if (!product) {

            return res.status(404).json({
                success: false,
                message:
                    "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Update Product
const editProduct = async (
    req,
    res
) => {

    try {

        const existingProduct =
            await getProductById(
                req.params.id,
                req.user.companyId
            );

        if (!existingProduct) {

            return res.status(404).json({
                success: false,
                message:
                    "Product not found."
            });
        }

        const product =
            await updateProduct(
                req.params.id,
                req.user.companyId,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Product updated successfully.",
            product
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Delete Product
const removeProduct = async (
    req,
    res
) => {

    try {

        const product =
            await deleteProduct(
                req.params.id,
                req.user.companyId
            );

        if (!product) {

            return res.status(404).json({
                success: false,
                message:
                    "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Product deleted successfully."
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
    addProduct,
    listProducts,
    getProduct,
    editProduct,
    removeProduct
};