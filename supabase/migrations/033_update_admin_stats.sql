-- ==========================================
-- Admin Dashboard Stats Calculation Update
-- Migration: 033_update_admin_stats
-- Purpose: Aggregate revenue from both TICKETS and MERCH_ORDERS
-- ==========================================

-- Function to get comprehensive dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    ticket_revenue BIGINT,
    merch_revenue BIGINT,
    total_revenue BIGINT,
    tickets_sold INT,
    merch_sold INT,
    pending_tickets INT,
    pending_merch INT
) AS $$
BEGIN
    RETURN QUERY
    WITH ticket_stats AS (
        SELECT 
            COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS revenue,
            COUNT(CASE WHEN status = 'paid' THEN 1 END)::INT AS sold,
            COUNT(DISTINCT CASE 
                WHEN status = 'pending_verification' 
                AND (screenshot_path IS NOT NULL OR utr IS NOT NULL)
                THEN COALESCE(booking_group_id::TEXT, id::TEXT)
            END)::INT AS pending
        FROM tickets
    ),
    merch_stats AS (
        SELECT 
            COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN amount ELSE 0 END), 0) AS revenue,
            COUNT(CASE WHEN payment_status = 'paid' THEN 1 END)::INT AS sold,
            COUNT(CASE WHEN payment_status = 'pending_verification' THEN 1 END)::INT AS pending
        FROM merch_orders
    )
    SELECT 
        ts.revenue AS ticket_revenue,
        ms.revenue AS merch_revenue,
        (ts.revenue + ms.revenue) AS total_revenue,
        ts.sold AS tickets_sold,
        ms.sold AS merch_sold,
        ts.pending AS pending_tickets,
        ms.pending AS pending_merch
    FROM ticket_stats ts, merch_stats ms;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
