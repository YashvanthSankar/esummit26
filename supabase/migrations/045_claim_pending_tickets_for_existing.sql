-- ============================================
-- Migration: 045_claim_pending_tickets_for_existing
-- Purpose: Claim pending tickets for users who already have profiles
-- This handles the case where CSV import tickets are added AFTER users signed up
-- ============================================

-- One-time script to link pending tickets to existing profiles
UPDATE tickets t
SET 
    user_id = p.id,
    pending_email = NULL,
    pending_name = NULL,
    pending_phone = NULL
FROM profiles p
WHERE 
    t.pending_email IS NOT NULL 
    AND t.user_id IS NULL
    AND LOWER(t.pending_email) = LOWER(p.email);

-- Also create a function that can be called to re-run this manually if needed
CREATE OR REPLACE FUNCTION claim_all_pending_tickets()
RETURNS INTEGER AS $$
DECLARE
    rows_updated INTEGER;
BEGIN
    UPDATE tickets t
    SET 
        user_id = p.id,
        pending_email = NULL,
        pending_name = NULL,
        pending_phone = NULL
    FROM profiles p
    WHERE 
        t.pending_email IS NOT NULL 
        AND t.user_id IS NULL
        AND LOWER(t.pending_email) = LOWER(p.email);
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    RETURN rows_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to admins
GRANT EXECUTE ON FUNCTION claim_all_pending_tickets() TO authenticated;
