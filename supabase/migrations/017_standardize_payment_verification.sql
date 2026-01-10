-- Standardize Payment Verification
-- Add payment_owner_name to tickets and accommodation_requests tables

-- 1. Add to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS payment_owner_name VARCHAR(255);

COMMENT ON COLUMN tickets.payment_owner_name IS 'Name of the account holder for UTR verification';

-- 2. Add to accommodation_requests table
ALTER TABLE accommodation_requests 
ADD COLUMN IF NOT EXISTS payment_owner_name VARCHAR(255);

COMMENT ON COLUMN accommodation_requests.payment_owner_name IS 'Name of the account holder for UTR verification';
