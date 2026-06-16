const express = require("express");
const cors = require("cors");
const companyRoutes = require("./routes/companyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Multi Company Hindi ERP API Running Successfully");
});

app.use("/api/companies", companyRoutes);

module.exports = app;