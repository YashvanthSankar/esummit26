-- ============================================
-- Migration: Multi-Ticket Booking System
-- Allows one user to purchase passes for multiple attendees
-- ============================================

-- 1. Add pending attendee columns to tickets table
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS pending_email TEXT,
ADD COLUMN IF NOT EXISTS pending_name TEXT,
ADD COLUMN IF NOT EXISTS pending_phone TEXT,
ADD COLUMN IF NOT EXISTS booking_group_id UUID;

-- 2. Make user_id nullable (for pending attendees who haven't signed up yet)
ALTER TABLE tickets ALTER COLUMN user_id DROP NOT NULL;

-- 3. Add constraint: either user_id OR pending_email must exist
-- First drop if exists to avoid errors on re-run
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS ticket_identity;
ALTER TABLE tickets ADD CONSTRAINT ticket_identity 
CHECK (user_id IS NOT NULL OR pending_email IS NOT NULL);

-- 4. Index for fast email lookups (critical for claim flow)
CREATE INDEX IF NOT EXISTS idx_tickets_pending_email 
ON tickets(pending_email) 
WHERE pending_email IS NOT NULL AND user_id IS NULL;

-- 5. Create booking_groups table to link related tickets
CREATE TABLE IF NOT EXISTS booking_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchaser_id UUID NOT NULL REFERENCES profiles(id),
    ticket_type TEXT NOT NULL,
    total_amount INT NOT NULL,
    pax_count INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on booking_groups
ALTER TABLE booking_groups ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own booking groups
CREATE POLICY "Users can read own booking groups"
ON booking_groups FOR SELECT
USING (auth.uid() = purchaser_id);

-- Policy: Users can insert their own booking groups
CREATE POLICY "Users can insert own booking groups"
ON booking_groups FOR INSERT
WITH CHECK (auth.uid() = purchaser_id);

-- Policy: Admins can read all booking groups
CREATE POLICY "Admins can read all booking groups"
ON booking_groups FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 6. Auto-link trigger: when a new user signs up, claim their pending tickets
CREATE OR REPLACE FUNCTION claim_pending_tickets()
RETURNS TRIGGER AS $$
BEGIN
    -- Find and link any pending tickets for this email
    UPDATE tickets
    SET 
        user_id = NEW.id,
        pending_email = NULL,
        pending_name = NULL,
        pending_phone = NULL
    WHERE 
        pending_email = NEW.email
        AND user_id IS NULL;
    
    -- Log for debugging
    IF FOUND THEN
        RAISE NOTICE 'Linked pending tickets for user: %', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS on_profile_created_claim_tickets ON profiles;
CREATE TRIGGER on_profile_created_claim_tickets
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION claim_pending_tickets();

-- 7. Update RLS policy to include pending tickets
-- Users should be able to see tickets where:
--   a) user_id matches their ID, OR
--   b) pending_email matches their email
DROP POLICY IF EXISTS "Users can read own tickets" ON tickets;
CREATE POLICY "Users can read own tickets"
ON tickets FOR SELECT
USING (
    auth.uid() = user_id 
    OR pending_email = (SELECT email FROM profiles WHERE id = auth.uid())
);

-- 8. Policy for inserting tickets (users can create tickets with their user_id)
DROP POLICY IF EXISTS "Users can insert own tickets" ON tickets;
CREATE POLICY "Users can insert own tickets"
ON tickets FOR INSERT
WITH CHECK (
    auth.uid() = user_id 
    OR user_id IS NULL  -- Allow creating tickets for pending attendees
);

-- 9. Admins can update all tickets (for verification)
DROP POLICY IF EXISTS "Admins can update all tickets" ON tickets;
CREATE POLICY "Admins can update all tickets"
ON tickets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
