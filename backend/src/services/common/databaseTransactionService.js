/**
 * ============================================
 * Multi Company ERP
 * Module  : Common
 * Service : Database Transaction Service
 * Purpose : Handle Database Transactions
 * ============================================
 */

const db = require("../../config/db");

/**
 * Execute Database Transaction
 */

const executeTransaction = async (callback) => {

    const client =
        await db.connect();

    try {

        await client.query("BEGIN");

        const result =
            await callback(client);

        await client.query("COMMIT");

        return result;

    }

    catch (err) {

        await client.query("ROLLBACK");

        throw err;

    }

    finally {

        client.release();

    }

};


module.exports = {

    executeTransaction

};