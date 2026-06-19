const express = require("express");
const cors = require("cors");
const companyRoutes = require("./routes/companyRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const companyAdminRoutes = require("./routes/companyAdminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Multi Company Hindi ERP API Running Successfully");
});

app.use("/api/companies", companyRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/company-admin", companyAdminRoutes);
app.use("/api/employees", employeeRoutes);

module.exports = app;