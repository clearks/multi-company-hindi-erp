const db = require("../../config/db");

const {
    createLedgerEntry
} = require("../../models/finance/generalLedgerModel");

/**
 * ============================================
 * POST JOURNAL TO GENERAL LEDGER
 * ============================================
 */

const postToLedger = async (journalEntryId) => {

    const client = await db.connect();

    try {

        await client.query("BEGIN");

        // ============================================
        // GET JOURNAL HEADER
        // ============================================

        const journalRes = await client.query(
            `
            SELECT *
            FROM journal_entries
            WHERE id = $1
            `,
            [journalEntryId]
        );

        if (journalRes.rows.length === 0) {

            throw new Error("Journal Entry not found.");

        }

        const journal =
            journalRes.rows[0];

        // ============================================
        // GET JOURNAL LINES
        // ============================================

        const linesRes = await client.query(
            `
            SELECT *
            FROM journal_entry_lines
            WHERE journal_entry_id = $1
            `,
            [journalEntryId]
        );

        const lines = linesRes.rows;

        // ============================================
        // POST EVERY LINE
        // ============================================

        for (const line of lines) {

            // ----------------------------------------
            // General Ledger Entry
            // ----------------------------------------
console.log({
    accountId: line.account_id,
    companyId: journal.company_id,
    voucherId: journal.reference_id
});
          await createLedgerEntry({

    companyId: journal.company_id,

    transactionDate: journal.voucher_date,

    voucherType: journal.voucher_type,

    voucherId: journal.reference_id,

    accountId: line.account_id,

    debit: line.debit,

    credit: line.credit,

    narration: journal.narration,

    voucherNo: journal.voucher_number,

    financialYear: "2026-27",

    createdBy: journal.created_by

});

            // ----------------------------------------
            // Update Account Balance
            // ----------------------------------------

            const amount =
                Number(line.debit || 0)
                -
                Number(line.credit || 0);

            await client.query(
                `
                UPDATE accounts
                SET current_balance =
                    COALESCE(current_balance,0)
                    + $1,
                    updated_at = NOW()
                WHERE id = $2
                `,
                [
                    amount,
                    line.account_id
                ]
            );

        }

        await client.query("COMMIT");

        return {

            success: true,

            message:
                "Ledger Posted Successfully."

        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }

};

module.exports = {

    postToLedger

};