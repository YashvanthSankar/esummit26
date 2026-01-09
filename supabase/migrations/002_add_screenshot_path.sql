-- Add screenshot_path to tickets table if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'screenshot_path') THEN
        ALTER TABLE tickets ADD COLUMN screenshot_path TEXT;
    END IF;
END $$;

-- Add utr to tickets table
ALTER TABLE tickets ADD COLUMN utr TEXT;

-- Update payment_status enum
-- Postgres doesn't support 'IF NOT EXISTS' for enum values easily in a single block without complexity.
-- We will attempt to add them. If they exist, it might error, but in a migration script we usually want idempotency.
-- However, for the user's specific request 'pending_verification' and 'rejected', we will alter the type.
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'pending_verification';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'rejected';

-- Allow admins to update tickets (for verification)
-- Dropping policy first to key idempotent
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
