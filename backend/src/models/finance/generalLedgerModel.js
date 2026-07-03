const db = require("../../config/db");

/**
 * ============================================
 * CREATE GENERAL LEDGER ENTRY
 * ============================================
 */

const createLedgerEntry = async (data) => {

    const result = await db.query(
        `
        INSERT INTO general_ledger
        (
            company_id,
            transaction_date,
            voucher_type,
            voucher_id,
            account_id,
            debit,
            credit,
            narration,
            voucher_no,
            posting_status,
            financial_year,
            created_by
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )
        RETURNING *
        `,
        [
            data.companyId,
            data.transactionDate,
            data.voucherType,
            data.voucherId,
            data.accountId,
            data.debit,
            data.credit,
            data.narration,
            data.voucherNo,
            "POSTED",
            data.financialYear,
            data.createdBy
        ]
    );

    return result.rows[0];
};

module.exports = {

    createLedgerEntry

};