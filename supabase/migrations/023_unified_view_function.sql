-- ==========================================
-- High-Performance Unified View Function
-- Fetches Tickets, Merch, and Accommodation in ONE optimized query
-- Replaces client-side joining of 3 separate tables
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

    -- 2. MERCHANDISE
    SELECT 
        m.id,
        p.full_name,
        p.email,
        COALESCE(p.phone::text, 'N/A'),
        'Merchandise'::TEXT,
        m.item_type::TEXT,
        CASE 
            WHEN m.payment_status = 'paid' THEN 'Paid'
            WHEN m.payment_status = 'verified' THEN 'Paid' -- Handle legacy status
            ELSE 'Pending'
        END,
        COALESCE(m.fulfillment_status::TEXT, 'Pending'),
        m.amount,
        m.created_at,
        m.id
    FROM merch_orders m
    JOIN profiles p ON m.user_id = p.id

    UNION ALL

    -- 3. ACCOMMODATION
    SELECT 
        a.id,
        p.full_name,
        p.email,
        COALESCE(p.phone::text, 'N/A'),
        'Accommodation'::TEXT,
        (a.days || ' Days')::TEXT,
        a.status::TEXT,
        CASE 
            WHEN a.check_in_time IS NOT NULL THEN 'Checked In'
            WHEN a.status = 'approved' THEN 'Pending Check-in'
            ELSE 'N/A'
        END,
        a.amount,
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
