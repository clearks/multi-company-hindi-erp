const db = require("../../config/db");

const createJournalLines = async (lines) => {

    const query = `
        INSERT INTO journal_entry_lines
        (
            journal_entry_id,
            account_id,
            debit,
            credit,
            description
        )
        VALUES
        ($1,$2,$3,$4,$5)
    `;

    for (let line of lines) {
        await db.query(query, [
            line.journalEntryId,
            line.accountId,
            line.debit,
            line.credit,
            line.description
        ]);
    }
};

module.exports = {
    createJournalLines
};