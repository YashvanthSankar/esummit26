-- FIX: Onboarding Submission Failures
-- 1. Ensure Users can UPDATE their own profile (Re-apply just in case)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Allow Users to INSERT their own profile (Needed for UPSERT if trigger failed)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
    ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 3. Ensure role defaults to 'external' if not specified (handled by Table Default)
-- (No action needed, defaults are set in schema)
