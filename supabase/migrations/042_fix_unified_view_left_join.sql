-- ==========================================
-- Fix: Unified Admin View - Use LEFT JOIN for Tickets
-- Migration: 042_fix_unified_view_left_join
-- 
-- Problem: INNER JOIN filtered out tickets where user_id was NULL
-- (pending group members who haven't registered yet)
-- This caused incorrect revenue totals in the Unified View.
--
-- Solution: Use LEFT JOIN and COALESCE pending fields
-- ==========================================

CREATE OR REPLACE FUNCTION get_unified_admin_view()
RETURNS TABLE (
    id UUID,
    user_name TEXT,
    user_email TEXT,
    phone_number TEXT,
    category TEXT,
    type TEXT,
    status TEXT,
    fulfillment_status TEXT,
    amount BIGINT,
    created_at TIMESTAMPTZ,
    item_id UUID
) AS $$
BEGIN
    RETURN QUERY
    
    -- 1. TICKETS (FIXED: LEFT JOIN to include tickets with NULL user_id)
    SELECT 
        t.id,
        COALESCE(p.full_name, t.pending_name, 'Unknown')::TEXT as user_name,
        COALESCE(p.email, t.pending_email, 'N/A')::TEXT as user_email,
        COALESCE(p.phone::text, t.pending_phone, 'N/A')::TEXT as phone_number,
        'Ticket'::TEXT as category,
        t.type::TEXT,
        t.status::TEXT,
        CASE 
            WHEN t.band_issued_at IS NOT NULL THEN 'Issued'
            WHEN t.status = 'paid' THEN 'Pending Issue'
            ELSE 'N/A'
        END as fulfillment_status,
        t.amount,
        t.created_at,
        t.id as item_id
    FROM tickets t
    LEFT JOIN profiles p ON t.user_id = p.id  -- Changed from JOIN to LEFT JOIN

    UNION ALL

    -- 2. MERCHANDISE
    SELECT 
        m.id,
        COALESCE(p.full_name, m.name, 'Unknown')::TEXT,
        COALESCE(p.email, m.email, 'N/A')::TEXT,
        COALESCE(p.phone::text, m.phone_number, 'N/A')::TEXT,
        'Merchandise'::TEXT,
        m.item_type::TEXT,
        CASE 
            WHEN m.payment_status = 'paid' THEN 'Paid'
            WHEN m.payment_status = 'verified' THEN 'Paid'
            ELSE 'Pending'
        END,
        CASE
            WHEN m.status = 'delivered' THEN 'Delivered'
            WHEN m.status = 'confirmed' THEN 'Confirmed'
            WHEN m.status = 'rejected' THEN 'Rejected'
            ELSE 'Pending'
        END,
        m.amount,
        m.created_at,
        m.id
    FROM merch_orders m
    LEFT JOIN profiles p ON m.user_id = p.id

    UNION ALL

    -- 3. ACCOMMODATION
    SELECT 
        a.id,
        COALESCE(p.full_name, a.name, 'Unknown')::TEXT,
        COALESCE(p.email, a.email, 'N/A')::TEXT,
        COALESCE(p.phone::text, a.phone_number, 'N/A')::TEXT,
        'Accommodation'::TEXT,
        ((a.date_of_departure - a.date_of_arrival) || ' Days')::TEXT,
        a.status::TEXT,
        CASE 
            WHEN a.status = 'approved' THEN 'Approved'
            WHEN a.status = 'rejected' THEN 'Rejected'
            ELSE 'Pending'
        END,
        COALESCE(a.payment_amount, 0)::BIGINT,
        a.created_at,
        a.id
    FROM accommodation_requests a
    LEFT JOIN profiles p ON a.user_id = p.id
    
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_unified_admin_view() TO authenticated;

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Fixed get_unified_admin_view() - now includes ALL tickets including pending group members';
END $$;
