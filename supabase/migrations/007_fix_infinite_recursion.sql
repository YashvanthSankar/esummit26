-- FIX: Infinite Recursion in RLS Policies
-- Problem: 'Admins can read all profiles' queries 'profiles', triggering the policy loop.
-- Solution: Use a SECURITY DEFINER function to check admin status without triggering RLS.

-- 1. Create Helper Function (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public -- Secure the search path
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- 2. Fix Profiles Policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
    ON profiles
    FOR SELECT
    USING (is_admin());

-- 3. Fix Tickets Policy (Just in case, though cross-table is usually fine, functionality consistency is good)
DROP POLICY IF EXISTS "Admins can read all tickets" ON tickets;
CREATE POLICY "Admins can read all tickets"
    ON tickets
    FOR SELECT
    USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all tickets" ON tickets;
CREATE POLICY "Admins can update all tickets"
    ON tickets
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- 4. Fix Event Logs Policies
DROP POLICY IF EXISTS "Admins can insert event logs" ON event_logs;
CREATE POLICY "Admins can insert event logs"
    ON event_logs
    FOR INSERT
    WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can read all event logs" ON event_logs;
CREATE POLICY "Admins can read all event logs"
    ON event_logs
    FOR SELECT
    USING (is_admin());
