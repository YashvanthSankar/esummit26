-- ==========================================
-- MASTER FIX SCRIPT (Run this in Supabase SQL Editor)
-- ==========================================

-- 1. FIX: "Unknown User" & Permission Checks
-- Admins need to read profiles to verify their own role AND see user details.
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
    ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles AS p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
    );

-- 2. FIX: "Verification Error" (Cannot Approve)
-- Ensure Admins have explicit permission to UPDATE tickets.
DROP POLICY IF EXISTS "Admins can update all tickets" ON tickets;
CREATE POLICY "Admins can update all tickets"
    ON tickets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 3. FIX: Ensure Status Enum is correct
-- Sometimes 'rejected' status is missing if previous migrations failed.
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'pending_verification';

-- 4. FIX: Allow "Not Provided" UTR
-- The code allows null UTR, verify DB allows it (it should be TEXT NULL primarily, but let's ensure)
ALTER TABLE tickets ALTER COLUMN utr DROP NOT NULL;
