ALTER TABLE purchases
ALTER COLUMN purchase_no TYPE VARCHAR(50);

ALTER TABLE sales_orders
ALTER COLUMN sales_order_no TYPE VARCHAR(50);

ALTER TABLE sales_invoices
ALTER COLUMN invoice_no TYPE VARCHAR(50);

ALTER TABLE receipts
ALTER COLUMN receipt_no TYPE VARCHAR(50);

ALTER TABLE supplier_payments
ALTER COLUMN payment_no TYPE VARCHAR(50);