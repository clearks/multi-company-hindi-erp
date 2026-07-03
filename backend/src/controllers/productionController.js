const {
    getNextProductionNumber,
    createProductionEntry,
    createProductionItem,
    getAllProductions,
    getProductionById
} = require("../models/productionModel");

const {
    getBomById,
    getBomItems
} = require("../models/bomModel");

const {
    getWarehouseStock,
    updateWarehouseStock
} = require("../models/warehouseStockModel");

const {
    getFinishedGoodsStock,
    addFinishedGoodsStock,
    updateFinishedGoodsStock
} = require("../models/finishedGoodsStockModel");

const {
    createStockLedgerEntry
} = require("../models/stockLedgerModel");


// Create Production
const addProduction = async (
    req,
    res
) => {

    try {

        const {
            productId,
            bomId,
            quantity,
            productionDate,
            sourceWarehouseId,
            finishedWarehouseId,
            remarks
        } = req.body;

        const bom =
            await getBomById(
                bomId,
                req.user.companyId
            );

        if (!bom) {

            return res.status(404).json({
                success: false,
                message:
                    "BOM not found."
            });
        }

        const bomItems =
            await getBomItems(
                bomId
            );

        // STOCK VALIDATION

        for (const item of bomItems) {

            const requiredQty =
                Number(item.quantity)
                *
                Number(quantity);

            const stock =
                await getWarehouseStock(
                    sourceWarehouseId,
                    item.raw_material_id
                );

            if (
                !stock ||
                Number(stock.quantity)
                < requiredQty
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                    `Insufficient stock for ${item.item_name}`
                });
            }
        }

        const productionNo =
            await getNextProductionNumber(
                req.user.companyId
            );

        const production =
            await createProductionEntry(
                req.user.companyId,
                {
                    productionNo,
                    productId,
                    bomId,
                    quantity,
                    productionDate,
                    sourceWarehouseId,
                    finishedWarehouseId,
                    remarks
                }
            );

        // CONSUME MATERIALS

        for (const item of bomItems) {

            const requiredQty =
                Number(item.quantity)
                *
                Number(quantity);

            await createProductionItem(
                production.id,
                {
                    rawMaterialId:
                    item.raw_material_id,

                    requiredQty,

                    consumedQty:
                    requiredQty
                }
            );

            // Minus Raw Material

            await updateWarehouseStock(
                sourceWarehouseId,
                item.raw_material_id,
                -requiredQty
            );

            // Stock Ledger

            await createStockLedgerEntry(
                req.user.companyId,
                item.raw_material_id,
                "PRODUCTION_CONSUME",
                production.id,
                0,
                requiredQty,
                0,
                `Production ${productionNo}`
            );
        }

        // FINISHED GOODS STOCK

       const fgStock =
    await getFinishedGoodsStock(
        req.user.companyId,
        finishedWarehouseId,
        productId
    );

        if (!fgStock) {

            await addFinishedGoodsStock(
                req.user.companyId,
                finishedWarehouseId,
                productId,
                quantity
            );

        } else {

            await updateFinishedGoodsStock(
                finishedWarehouseId,
                productId,
                quantity
            );
        }

        return res.status(201).json({
            success: true,
            message:
                "Production completed successfully.",
            production
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// List Productions

const listProductions = async (
    req,
    res
) => {

    try {

        const productions =
            await getAllProductions(
                req.user.companyId
            );

        return res.status(200).json({
            success: true,
            productions
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get Production

const getProduction = async (
    req,
    res
) => {

    try {

        const production =
            await getProductionById(
                req.params.id,
                req.user.companyId
            );

        if (!production) {

            return res.status(404).json({
                success: false,
                message:
                    "Production not found."
            });
        }

        return res.status(200).json({
            success: true,
            production
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
    addProduction,
    listProductions,
    getProduction
};