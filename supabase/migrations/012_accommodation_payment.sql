-- ==========================================
-- Accommodation Payment System - Database Schema
-- Migration: 012_accommodation_payment
-- ==========================================

-- 1. Add payment-related columns to accommodation_requests
ALTER TABLE accommodation_requests
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'pending_verification', 'paid', 'rejected')),
ADD COLUMN IF NOT EXISTS payment_amount INTEGER DEFAULT 500,
ADD COLUMN IF NOT EXISTS payment_utr TEXT,
ADD COLUMN IF NOT EXISTS payment_screenshot_path TEXT,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_verified_by UUID REFERENCES auth.users(id);

-- 2. Create index for payment status queries
CREATE INDEX IF NOT EXISTS idx_accommodation_payment_status ON accommodation_requests(payment_status);

-- 3. Update RLS policy for payment updates by users (for submitting payment proof)
DROP POLICY IF EXISTS "Users can update own accommodation payment" ON accommodation_requests;
CREATE POLICY "Users can update own accommodation payment"
    ON accommodation_requests
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id 
        AND status = 'pending' -- Can only update while request is pending
    );

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON COLUMN accommodation_requests.payment_status IS 'Payment verification status: pending, pending_verification, paid, rejected';
COMMENT ON COLUMN accommodation_requests.payment_amount IS 'Amount to be paid in INR (default 500)';
COMMENT ON COLUMN accommodation_requests.payment_utr IS 'UPI Transaction Reference number provided by user';
COMMENT ON COLUMN accommodation_requests.payment_screenshot_path IS 'Storage path to payment proof screenshot';
