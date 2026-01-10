-- ==========================================
-- Database Functions for Admin Dashboard
-- These provide pre-aggregated stats instead of fetching all tickets
-- ==========================================

-- Function to get ticket stats (revenue, count, pending)
CREATE OR REPLACE FUNCTION get_ticket_stats()
RETURNS TABLE (
    revenue BIGINT,
    "ticketsSold" INT,
    pending BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS revenue,
        COUNT(CASE WHEN status = 'paid' THEN 1 END)::INT AS "ticketsSold",
        COUNT(DISTINCT CASE 
            WHEN status = 'pending_verification' 
            AND (screenshot_path IS NOT NULL OR utr IS NOT NULL)
            THEN COALESCE(booking_group_id::TEXT, id::TEXT)
        END) AS pending
    FROM tickets;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get ticket type distribution for chart
CREATE OR REPLACE FUNCTION get_ticket_type_distribution()
RETURNS TABLE (
    type TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.type::TEXT,
        COUNT(*)::BIGINT as count
    FROM tickets t
    WHERE t.status = 'paid'
    GROUP BY t.type
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_ticket_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_ticket_type_distribution() TO authenticated;
