/**
 * ============================================
 * Multi Company ERP
 * Module  : Finance
 * Service : Receipt Service
 * Purpose : Complete Receipt Process
 * ============================================
 */

const {

    generateReceiptNumber,

    createReceipt

} = require("../../models/finance/receiptModel");


const {

    createReceiptItem

} = require("../../models/finance/receiptItemModel");


const {

    getOutstandingByInvoice,

    updateCustomerOutstanding

} = require("../../models/finance/customerOutstandingModel");

// ============================================
// Fetch Outstanding
// ============================================

const fetchOutstanding = async (

    companyId,

    invoiceId

) => {

    const outstanding =

        await getOutstandingByInvoice(

            companyId,

            invoiceId

        );

    if (!outstanding) {

        throw new Error(

            "Outstanding record not found."

        );

    }

    return outstanding;

};

// ============================================
// Validate Receipt Amount
// ============================================

const validateReceiptAmount = async (

    outstanding,

    receiveAmount

) => {

    if (

        Number(receiveAmount) <= 0

    ) {

        throw new Error(

            "Receipt amount must be greater than zero."

        );

    }

    if (

        Number(receiveAmount)

        >

        Number(outstanding.outstanding_amount)

    ) {

        throw new Error(

            "Receipt amount exceeds outstanding amount."

        );

    }

};

// ============================================
// Create Receipt Entry
// ============================================

const createReceiptEntry = async (

    companyId,

    receiptData

) => {

    const receiptNo =

        await generateReceiptNumber(

            companyId

        );

    const receipt =

        await createReceipt(

            companyId,

            {

                receiptNo,

                customerId:
                    receiptData.customerId,

                receiptDate:
                    receiptData.receiptDate,

                paymentMode:
                    receiptData.paymentMode,

                referenceNo:
                    receiptData.referenceNo,

                remarks:
                    receiptData.remarks,

                totalAmount:
                    receiptData.totalAmount

            }

        );

    return receipt;

};

// ============================================
// Update Outstanding
// ============================================

const updateOutstanding = async (

    outstanding,

    receiveAmount

) => {

    const receivedAmount =

        Number(outstanding.received_amount)

        +

        Number(receiveAmount);

    const outstandingAmount =

        Number(outstanding.invoice_amount)

        -

        receivedAmount;

    let status = "UNPAID";

    if (outstandingAmount === 0) {

        status = "PAID";

    }

    else if (

        receivedAmount > 0

    ) {

        status = "PARTIAL";

    }

    await updateCustomerOutstanding(

        outstanding.id,

        receivedAmount,

        outstandingAmount,

        status

    );

};

// ============================================
// Complete Receipt Process
// ============================================

const completeReceipt = async (

    companyId,

    receiptData

) => {

    let totalAmount = 0;

    for (const item of receiptData.items) {

        const outstanding =

            await fetchOutstanding(

                companyId,

                item.invoiceId

            );

        await validateReceiptAmount(

            outstanding,

            item.amount

        );

        totalAmount += Number(item.amount);

    }

    const receipt =

        await createReceiptEntry(

            companyId,

            {

                customerId:
                    receiptData.customerId,

                receiptDate:
                    receiptData.receiptDate,

                paymentMode:
                    receiptData.paymentMode,

                referenceNo:
                    receiptData.referenceNo,

                remarks:
                    receiptData.remarks,

                totalAmount

            }

        );

    for (const item of receiptData.items) {

        await createReceiptItem(

            receipt.id,

            item.invoiceId,

            item.amount

        );

        const outstanding =

            await fetchOutstanding(

                companyId,

                item.invoiceId

            );

        await updateOutstanding(

            outstanding,

            item.amount

        );

    }

    return receipt;

};



module.exports = {

    fetchOutstanding,

    validateReceiptAmount,

    createReceiptEntry,

    updateOutstanding,

    completeReceipt

};