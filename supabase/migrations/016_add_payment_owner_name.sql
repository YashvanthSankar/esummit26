-- Add payment_owner_name to merch_orders table
ALTER TABLE merch_orders ADD COLUMN IF NOT EXISTS payment_owner_name VARCHAR(255);

COMMENT ON COLUMN merch_orders.payment_owner_name IS 'Name of the account holder for UTR verification';
