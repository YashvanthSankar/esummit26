-- ==========================================
-- Fix: Ticket Type Distribution Revenue
-- Migration: 041_fix_ticket_type_revenue
-- Purpose: Add revenue column to get_ticket_type_distribution()
-- Previously: returned only (type, count)
-- Now: returns (type, count, revenue) for accurate chart data
-- ==========================================

-- Drop existing function to redefine return type
DROP FUNCTION IF EXISTS get_ticket_type_distribution();

CREATE OR REPLACE FUNCTION get_ticket_type_distribution()
RETURNS TABLE (
    type TEXT,
    count BIGINT,
    revenue BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.type::TEXT,
        COUNT(*)::BIGINT as count,
        COALESCE(SUM(t.amount), 0)::BIGINT as revenue
    FROM tickets t
    WHERE t.status = 'paid'
    GROUP BY t.type
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_ticket_type_distribution() TO authenticated;

-- Verification message
DO $$
BEGIN
    RAISE NOTICE '✅ Fixed get_ticket_type_distribution() to include revenue per ticket type';
END $$;
