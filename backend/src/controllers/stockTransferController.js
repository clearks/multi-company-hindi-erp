const {
    getNextTransferNumber,
    createStockTransfer,
    createStockTransferItem,
    getAllTransfers,
    getTransferById,
    deleteTransfer
} = require("../models/stockTransferModel");

const {
    getWarehouseStock,
    addWarehouseStock,
    updateWarehouseStock
} = require("../models/warehouseStockModel");

const {
    createStockLedgerEntry
} = require("../models/stockLedgerModel");


// Create Transfer
const addStockTransfer = async (req, res) => {

    try {

        const transferNo =
            await getNextTransferNumber(
                req.user.companyId
            );

        const {
            fromWarehouseId,
            toWarehouseId,
            transferDate,
            remarks,
            items
        } = req.body;

        for (const item of items) {

    const fromStock =
        await getWarehouseStock(
            fromWarehouseId,
            item.rawMaterialId
        );

    if (
        !fromStock ||
        Number(fromStock.quantity)
        <
        Number(item.qty)
    ) {

        return res.status(400).json({
            success: false,
            message:
            `Insufficient stock for material ${item.rawMaterialId}`
        });
    }
}

        const transfer =
            await createStockTransfer(
                req.user.companyId,
                {
                    transferNo,
                    fromWarehouseId,
                    toWarehouseId,
                    transferDate,
                    remarks
                }
            );

        for (const item of items) {



            // FROM Warehouse Stock Check
            const fromStock =
                await createStockTransferItem(
                transfer.id,
                item
            );

            // Minus Source Warehouse
            await updateWarehouseStock(
                fromWarehouseId,
                item.rawMaterialId,
                -Number(item.qty)
            );

            // Destination Warehouse
            const toStock =
                await getWarehouseStock(
                    toWarehouseId,
                    item.rawMaterialId
                );

            if (!toStock) {

                await addWarehouseStock(
                    req.user.companyId,
                    toWarehouseId,
                    item.rawMaterialId,
                    item.qty
                );

            } else {

                await updateWarehouseStock(
                    toWarehouseId,
                    item.rawMaterialId,
                    item.qty
                );
            }

            // Stock Ledger OUT
            await createStockLedgerEntry(
                req.user.companyId,
                item.rawMaterialId,
                "TRANSFER_OUT",
                transfer.id,
                0,
                item.qty,
                0,
                `Transfer ${transfer.transfer_no}`
            );

            // Stock Ledger IN
            await createStockLedgerEntry(
                req.user.companyId,
                item.rawMaterialId,
                "TRANSFER_IN",
                transfer.id,
                item.qty,
                0,
                0,
                `Transfer ${transfer.transfer_no}`
            );
        }

        return res.status(201).json({
            success: true,
            message:
                "Stock transferred successfully.",
            transfer
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// List Transfers
const listTransfers = async (
    req,
    res
) => {

    try {

        const transfers =
            await getAllTransfers(
                req.user.companyId
            );

        return res.status(200).json({
            success: true,
            transfers
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get Transfer
const getTransfer = async (
    req,
    res
) => {

    try {

        const transfer =
            await getTransferById(
                req.params.id,
                req.user.companyId
            );

        if (!transfer) {

            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found."
            });
        }

        return res.status(200).json({
            success: true,
            transfer
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Delete Transfer
const removeTransfer = async (
    req,
    res
) => {

    try {

        const transfer =
            await deleteTransfer(
                req.params.id,
                req.user.companyId
            );

        if (!transfer) {

            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Transfer deleted successfully."
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
    addStockTransfer,
    listTransfers,
    getTransfer,
    removeTransfer
};