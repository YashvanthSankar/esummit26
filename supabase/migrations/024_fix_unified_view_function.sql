-- ==========================================
-- Fix: Unified View Function - Correct column references
-- The previous function (023) referenced non-existent columns:
--   - m.fulfillment_status (doesn't exist, now derived from m.status)
--   - a.days (doesn't exist, now calculated from dates)
--   - a.amount (should be a.payment_amount)
--   - a.check_in_time (doesn't exist)
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
    item_id UUID -- Original ID of the item (ticket/merch/acc)
) AS $$
BEGIN
    RETURN QUERY
    
    -- 1. TICKETS
    SELECT 
        t.id,
        p.full_name as user_name,
        p.email as user_email,
        COALESCE(p.phone::text, 'N/A') as phone_number,
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
    JOIN profiles p ON t.user_id = p.id

    UNION ALL

    -- 2. MERCHANDISE (FIXED: use correct column names)
    SELECT 
        m.id,
        p.full_name,
        p.email,
        COALESCE(p.phone::text, 'N/A'),
        'Merchandise'::TEXT,
        m.item_type::TEXT,  -- Correct column name
        CASE 
            WHEN m.payment_status = 'paid' THEN 'Paid'
            WHEN m.payment_status = 'verified' THEN 'Paid'
            ELSE 'Pending'
        END,
        CASE  -- Fixed: use m.status instead of non-existent m.fulfillment_status
            WHEN m.status = 'delivered' THEN 'Delivered'
            WHEN m.status = 'confirmed' THEN 'Confirmed'
            WHEN m.status = 'rejected' THEN 'Rejected'
            ELSE 'Pending'
        END,
        m.amount,
        m.created_at,
        m.id
    FROM merch_orders m
    JOIN profiles p ON m.user_id = p.id

    UNION ALL

    -- 3. ACCOMMODATION (FIXED: calculate days from dates, use correct columns)
    SELECT 
        a.id,
        p.full_name,
        p.email,
        COALESCE(p.phone::text, 'N/A'),
        'Accommodation'::TEXT,
        ((a.date_of_departure - a.date_of_arrival) || ' Days')::TEXT,  -- Calculate days from dates
        a.status::TEXT,
        CASE 
            WHEN a.status = 'approved' THEN 'Approved'
            WHEN a.status = 'rejected' THEN 'Rejected'
            ELSE 'Pending'
        END,
        COALESCE(a.payment_amount, 0)::BIGINT,  -- payment_amount is the correct column
        a.created_at,
        a.id
    FROM accommodation_requests a
    JOIN profiles p ON a.user_id = p.id
    
    -- Order by most recent first
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_unified_admin_view() TO authenticated;
