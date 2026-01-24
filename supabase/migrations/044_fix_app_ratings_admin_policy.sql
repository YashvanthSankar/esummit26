-- ==========================================
-- Migration: Fix App Ratings Admin RLS Policy
-- Allow both 'admin' and 'super_admin' to view all ratings
-- ==========================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Admins can view all ratings" ON app_ratings;

-- Create new policy that includes both admin and super_admin roles
CREATE POLICY "Admins can view all ratings"
ON app_ratings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'super_admin')
    )
);
