-- Migration: Add super_admin enum value
-- 
-- IMPORTANT: This migration uses a workaround for PostgreSQL's limitation
-- where ALTER TYPE ADD VALUE cannot run inside a transaction.
--
-- The workaround: Create a new enum type, migrate the column, drop old type.

-- Step 1: Check if super_admin already exists (skip if it does)
DO $$
DECLARE
    super_admin_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'super_admin' 
        AND enumtypid = 'user_role'::regtype
    ) INTO super_admin_exists;
    
    IF super_admin_exists THEN
        RAISE NOTICE 'super_admin already exists in user_role enum, skipping migration';
        RETURN;
    END IF;

    -- Step 2: Create new enum type with all values including super_admin
    CREATE TYPE user_role_new AS ENUM ('internal', 'external', 'admin', 'super_admin');

    -- Step 3: Update profiles table to use the new type
    ALTER TABLE profiles 
        ALTER COLUMN role TYPE user_role_new 
        USING role::text::user_role_new;

    -- Step 4: Drop the old enum type
    DROP TYPE user_role;

    -- Step 5: Rename new type to original name
    ALTER TYPE user_role_new RENAME TO user_role;

    RAISE NOTICE 'Successfully added super_admin to user_role enum';
END $$;
