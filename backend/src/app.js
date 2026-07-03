const express = require("express");
const cors = require("cors");
const companyRoutes = require("./routes/companyRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const companyAdminRoutes = require("./routes/companyAdminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const rawMaterialRoutes = require("./routes/rawMaterialRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const purchaseRoutes =require("./routes/purchaseRoutes");
const stockTransferRoutes =require("./routes/stockTransferRoutes");
const productRoutes =require("./routes/productRoutes");
const bomRoutes =require("./routes/bomRoutes");
const productionRoutes =require("./routes/productionRoutes");
const salesOrderRoutes = require("./routes/salesOrderRoutes");
const salesInvoiceRoutes =require("./routes/salesInvoiceRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const supplierPaymentRoutes = require("./routes/supplierPaymentRoutes");


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
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/warehouses",warehouseRoutes);
app.use("/api/purchases",purchaseRoutes);
app.use("/api/stock-transfers",stockTransferRoutes);
app.use("/api/products",productRoutes);
app.use("/api/boms",bomRoutes);
app.use("/api/productions", productionRoutes);
app.use("/api/sales-orders",salesOrderRoutes);
app.use("/api/sales-invoices",salesInvoiceRoutes);
app.use("/api/receipts",receiptRoutes);
app.use("/api/supplier-payments", supplierPaymentRoutes);


module.exports = app;