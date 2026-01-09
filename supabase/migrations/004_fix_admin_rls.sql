-- Allow admins to read all profiles
-- Drop existing policy if it exists to ensure clean application
-- (Ideally we check for existence, but for quick iteration in SQL editor, this is common)
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
