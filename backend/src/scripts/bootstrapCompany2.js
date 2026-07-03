require("dotenv").config();

const accountBootstrapService =
require("../services/finance/accountBootstrapService");

(async () => {

    try {

        const result =
            await accountBootstrapService.bootstrapCompanyAccounts(2);

        console.log(result);

        process.exit(0);

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

})();