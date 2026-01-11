-- Migration: Fix Band Issuance RLS
-- 
-- PROBLEM: The previous policy blocked regular admins from updating ANY field
-- on tickets with status='paid', including band_issued_at.
--
-- FIX: Remove the WITH CHECK restriction since band issuance doesn't change payment status.
-- Payment status changes are enforced at the application level (API routes check for super_admin).

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Admins can update tickets (non-payment)" ON tickets;

-- Create a simpler policy that allows admins to update tickets
-- Payment status enforcement is handled in the API layer
CREATE POLICY "Admins can update tickets"
    ON tickets FOR UPDATE
    USING (is_admin());

-- Similarly fix accommodation_requests if it has the same issue
DROP POLICY IF EXISTS "Admins can update accommodation requests" ON accommodation_requests;
CREATE POLICY "Admins can update accommodation requests"
    ON accommodation_requests FOR UPDATE
    USING (is_admin());

-- Similarly fix merch_orders if it has the same issue  
DROP POLICY IF EXISTS "Admins can update merch orders" ON merch_orders;
CREATE POLICY "Admins can update merch orders"
    ON merch_orders FOR UPDATE
    USING (is_admin());

-- Add comments
COMMENT ON POLICY "Admins can update tickets" ON tickets IS 
    'Allows admins to update tickets. Payment verification restricted to super_admin at API level.';
