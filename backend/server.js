require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Database Connection Test
pool.connect()
  .then((client) => {
    console.log("✅ PostgreSQL Connected Successfully");

    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 ERP Server Running On Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
  });