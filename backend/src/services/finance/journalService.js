const db = require("../../config/db");
const journalEntryModel = require("../../models/finance/journalEntryModel");
const journalLineModel = require("../../models/finance/journalEntryLineModel");
/**
 * ============================================
 * CREATE JOURNAL ENTRY (CORE FUNCTION)
 * ============================================
 */

const createJournalEntry = async (data) => {

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const {
            companyId,
            voucherType,
            voucherNumber,
            voucherDate,
            referenceType,
            referenceId,
            narration,
            lines,
            createdBy
        } = data;

        // ============================================
        // 1. VALIDATION (DEBIT = CREDIT)
        // ============================================

        let totalDebit = 0;
        let totalCredit = 0;

        lines.forEach(line => {
            totalDebit += Number(line.debit || 0);
            totalCredit += Number(line.credit || 0);
        });

        if (totalDebit !== totalCredit) {
            throw new Error("Debit and Credit mismatch");
        }

        // ============================================
        // 2. CREATE JOURNAL ENTRY HEADER
        // ============================================

        const journal = await journalEntryModel.createJournalEntry({
            companyId,
            voucherType,
            voucherNumber,
            voucherDate,
            referenceType,
            referenceId,
            totalDebit,
            totalCredit,
            narration,
            createdBy
        });

        // ============================================
        // 3. CREATE JOURNAL LINES
        // ============================================

        const formattedLines = lines.map(line => ({
            journalEntryId: journal.id,
            accountId: line.accountId,
            debit: line.debit || 0,
            credit: line.credit || 0,
            description: line.description || null
        }));

        await journalLineModel.createJournalLines(formattedLines);

        // ============================================
        // 4. COMMIT TRANSACTION
        // ============================================

        await client.query("COMMIT");

        return journal;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;
    }
};

module.exports = {
    createJournalEntry
};