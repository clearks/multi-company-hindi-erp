const journalService = require("./journalService");
const ledgerService = require("./ledgerService");

/**
 * ============================================
 * FINANCE INTEGRATION LAYER (ERP CORE BRAIN)
 * ============================================
 */

const processTransaction = async (data) => {

    // STEP 1: CREATE JOURNAL
    const journal = await journalService.createJournalEntry({
        companyId: data.companyId,
        voucherType: data.voucherType,
        voucherNumber: data.voucherNumber,
        voucherDate: data.voucherDate,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        narration: data.narration,
        lines: data.lines,
        createdBy: data.createdBy
    });

    // STEP 2: POST TO LEDGER
    await ledgerService.postToLedger(journal.id);

    return {
        success: true,
        journalId: journal.id,
        message: "Transaction processed successfully"
    };
};

module.exports = {
    processTransaction
};