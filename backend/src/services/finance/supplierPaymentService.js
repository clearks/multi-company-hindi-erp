/**
 * ============================================
 * Multi Company ERP
 * Module  : Finance
 * Service : Supplier Payment Service
 * Purpose : Complete Supplier Payment Process
 * ============================================
 */

const {

    generateSupplierPaymentNumber,

    createSupplierPayment

} = require("../../models/finance/supplierPaymentModel");


const {

    createSupplierPaymentItem

} = require("../../models/finance/supplierPaymentItemModel");


const {

    getSupplierPayableByPurchase,

    updateSupplierPayable

} = require("../../models/finance/supplierPayableModel");

// ============================================
// Fetch Supplier Payable
// ============================================

const fetchSupplierPayable = async (

    companyId,

    purchaseId

) => {

    const payable =

        await getSupplierPayableByPurchase(

            companyId,

            purchaseId

        );

    if (!payable) {

        throw new Error(

            "Supplier Payable not found."

        );

    }

    return payable;

};

// ============================================
// Validate Payment Amount
// ============================================

const validatePayment = async (

    payable,

    paymentAmount

) => {

    if (

        Number(paymentAmount) <= 0

    ) {

        throw new Error(

            "Payment amount must be greater than zero."

        );

    }

    if (

        Number(paymentAmount)

        >

        Number(payable.outstanding_amount)

    ) {

        throw new Error(

            "Payment exceeds outstanding amount."

        );

    }

};

// ============================================
// Create Supplier Payment Entry
// ============================================

const createPaymentEntry = async (

    companyId,

    paymentData

) => {

    const paymentNo =

        await generateSupplierPaymentNumber(

            companyId

        );

    const payment =

        await createSupplierPayment(

            companyId,

            {

                paymentNo,

                supplierId:
                    paymentData.supplierId,

                paymentDate:
                    paymentData.paymentDate,

                paymentMode:
                    paymentData.paymentMode,

                referenceNo:
                    paymentData.referenceNo,

                remarks:
                    paymentData.remarks,

                totalAmount:
                    paymentData.totalAmount

            }

        );

    return payment;

};

// ============================================
// Update Supplier Payable
// ============================================

const updatePayable = async (

    payable,

    paymentAmount

) => {

    const paidAmount =

        Number(payable.paid_amount)

        +

        Number(paymentAmount);

    const outstandingAmount =

        Number(payable.invoice_amount)

        -

        paidAmount;

    let status = "UNPAID";

    if (outstandingAmount === 0) {

        status = "PAID";

    }

    else if (paidAmount > 0) {

        status = "PARTIAL";

    }

    await updateSupplierPayable(

        payable.id,

        paidAmount,

        outstandingAmount,

        status

    );

};

// ============================================
// Complete Supplier Payment
// ============================================

const completeSupplierPayment = async (

    companyId,

    paymentData

) => {

    let totalAmount = 0;

    // Validate all payments

    for (const item of paymentData.items) {

        const payable =

            await fetchSupplierPayable(

                companyId,

                item.purchaseId

            );

        await validatePayment(

            payable,

            item.amount

        );

        totalAmount += Number(item.amount);

    }

    // Create Payment Header

    const payment =

        await createPaymentEntry(

            companyId,

            {

                supplierId:
                    paymentData.supplierId,

                paymentDate:
                    paymentData.paymentDate,

                paymentMode:
                    paymentData.paymentMode,

                referenceNo:
                    paymentData.referenceNo,

                remarks:
                    paymentData.remarks,

                totalAmount

            }

        );

    // Create Payment Items

    for (const item of paymentData.items) {

        await createSupplierPaymentItem(

            payment.id,

            item.purchaseId,

            item.amount

        );

        const payable =

            await fetchSupplierPayable(

                companyId,

                item.purchaseId

            );

        await updatePayable(

            payable,

            item.amount

        );

    }

    return payment;

};

module.exports = {

    fetchSupplierPayable,

    validatePayment,

    createPaymentEntry,

    updatePayable,

    completeSupplierPayment

};