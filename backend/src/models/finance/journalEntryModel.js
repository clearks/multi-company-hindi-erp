const db = require("../../config/db");

const createJournalEntry = async (data) => {

    const {
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
    } = data;

    const query = `
        INSERT INTO journal_entries
        (
            company_id,
            voucher_type,
            voucher_number,
            voucher_date,
            reference_type,
            reference_id,
            total_debit,
            total_credit,
            narration,
            created_by
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *;
    `;

    const values = [
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
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

module.exports = {
    createJournalEntry
};