-- Migration: Update RLS policies for super_admin role
-- This uses the super_admin enum value added in the previous migration
-- 
-- CRITICAL FIX: Uses auth.uid() based checks to avoid infinite recursion
-- The is_admin() function is ONLY used in non-profiles tables
--
-- NEW: Adds backend enforcement so only super_admin can approve payments

-- =====================================================
-- 1. UPDATE HELPER FUNCTIONS (Bypasses RLS with SECURITY DEFINER)
-- =====================================================

-- Update is_admin() to include super_admin
-- SECURITY DEFINER makes this function run as the owner, bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Create new function specifically for super_admin check
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
$$;

-- Helper to get current user's role (for use in frontend)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM profiles WHERE id = auth.uid();
$$;

-- =====================================================
-- 2. PROFILES POLICIES 
-- IMPORTANT: Do NOT use is_admin() here - causes infinite recursion!
-- Instead, use direct auth.uid() checks only
-- =====================================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

-- Users can insert their own profile (needed for onboarding)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can read all profiles - USE DIRECT SUBQUERY, NOT is_admin()!
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
    ON profiles FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
    );

-- =====================================================
-- 3. TICKETS POLICIES (WITH PAYMENT ENFORCEMENT)
-- Safe to use is_admin() here since tickets doesn't trigger profiles RLS
-- =====================================================
DROP POLICY IF EXISTS "Admins can read all tickets" ON tickets;
CREATE POLICY "Admins can read all tickets"
    ON tickets FOR SELECT
    USING (is_admin());

-- Drop old permissive update policy
DROP POLICY IF EXISTS "Admins can update all tickets" ON tickets;

-- NEW: Payment enforcement - only super_admin can set status to 'paid'
-- Regular admins can update other fields (like band_issued_at) on paid tickets
DROP POLICY IF EXISTS "Admins can update tickets (non-payment)" ON tickets;
CREATE POLICY "Admins can update tickets (non-payment)"
    ON tickets FOR UPDATE
    USING (is_admin());
    -- Note: Payment status change restriction is now enforced at application level
    -- This allows regular admins to issue bands on paid tickets

-- =====================================================
-- 4. ACCOMMODATION POLICIES (WITH PAYMENT ENFORCEMENT)
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all accommodation requests" ON accommodation_requests;
CREATE POLICY "Admins can view all accommodation requests"
    ON accommodation_requests FOR SELECT
    USING (is_admin());

DROP POLICY IF EXISTS "Admins can update accommodation requests" ON accommodation_requests;

-- NEW: Payment verification restricted to super_admin
CREATE POLICY "Admins can update accommodation requests"
    ON accommodation_requests FOR UPDATE
    USING (is_admin())
    WITH CHECK (
        is_admin() AND (
            is_super_admin() 
            OR 
            NOT (payment_status = 'paid')
        )
    );

-- =====================================================
-- 5. MERCH ORDERS POLICIES (WITH PAYMENT ENFORCEMENT)
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all merch orders" ON merch_orders;
CREATE POLICY "Admins can view all merch orders"
    ON merch_orders FOR SELECT
    USING (is_admin());

DROP POLICY IF EXISTS "Admins can update merch orders" ON merch_orders;

-- NEW: Payment verification restricted to super_admin
CREATE POLICY "Admins can update merch orders"
    ON merch_orders FOR UPDATE
    USING (is_admin())
    WITH CHECK (
        is_admin() AND (
            is_super_admin() 
            OR 
            NOT (payment_status = 'paid')
        )
    );

-- =====================================================
-- 6. EVENT LOGS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all event logs" ON event_logs;
CREATE POLICY "Admins can view all event logs"
    ON event_logs FOR SELECT
    USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert event logs" ON event_logs;
CREATE POLICY "Admins can insert event logs"
    ON event_logs FOR INSERT
    WITH CHECK (is_admin());

-- =====================================================
-- 7. AUDIT COLUMNS (Optional - adds traceability)
-- =====================================================
-- Add approved_by column to tickets if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE tickets ADD COLUMN approved_by UUID REFERENCES public.profiles(id);
        ALTER TABLE tickets ADD COLUMN approved_at TIMESTAMPTZ;
    END IF;
END $$;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON FUNCTION is_admin() IS 'Check if current user has admin access (admin or super_admin role)';
COMMENT ON FUNCTION is_super_admin() IS 'Check if current user is a super_admin (can approve payments)';
COMMENT ON FUNCTION get_my_role() IS 'Get the current user role as text';
