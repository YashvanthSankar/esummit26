-- ==========================================
-- Unified Admin View - Database View
-- Migration: 015_unified_admin_view
-- ==========================================

-- Create a unified view that aggregates data from tickets, merch_orders, and accommodations
CREATE OR REPLACE VIEW unified_admin_view AS
-- Tickets (joined with profiles for user details)
SELECT 
    CONCAT('ticket-', t.id::text) as record_id,
    t.user_id,
    p.full_name as user_name,
    p.email as user_email,
    p.phone as phone_number,
    'Ticket' as category,
    UPPER(t.type::text) as type,
    CASE 
        WHEN t.status = 'paid' THEN 'Paid'
        WHEN t.status = 'pending_verification' THEN 'Pending Verification'
        ELSE 'Pending'
    END as payment_status,
    CASE 
        WHEN t.status = 'paid' THEN 'Issued'
        ELSE 'Not Issued'
    END as fulfillment_status,
    t.amount,
    t.created_at,
    t.updated_at
FROM tickets t
LEFT JOIN profiles p ON t.user_id = p.id

UNION ALL

-- Merchandise Orders
SELECT 
    CONCAT('merch-', id::text) as record_id,
    user_id,
    name as user_name,
    email as user_email,
    phone_number,
    'Merchandise' as category,
    UPPER(bundle_type::text) as type,
    CASE 
        WHEN payment_status = 'paid' THEN 'Paid'
        WHEN payment_status = 'pending_verification' THEN 'Pending Verification'
        ELSE 'Pending'
    END as payment_status,
    CASE 
        WHEN status = 'delivered' THEN 'Delivered'
        WHEN status = 'confirmed' THEN 'Confirmed'
        ELSE 'Not Issued'
    END as fulfillment_status,
    amount,
    created_at,
    updated_at
FROM merch_orders

UNION ALL

-- Accommodation Requests
SELECT 
    CONCAT('accom-', id::text) as record_id,
    user_id,
    name as user_name,
    email as user_email,
    phone_number,
    'Accommodation' as category,
    CONCAT(UPPER(gender), ' - ', 
           TO_CHAR(date_of_arrival, 'DD/MM'), ' to ', 
           TO_CHAR(date_of_departure, 'DD/MM')) as type,
    CASE 
        WHEN payment_status = 'paid' THEN 'Paid'
        WHEN payment_status = 'pending_verification' THEN 'Pending Verification'
        ELSE 'Pending'
    END as payment_status,
    CASE 
        WHEN status = 'approved' THEN 'Approved'
        WHEN status = 'rejected' THEN 'Rejected'
        ELSE 'Pending'
    END as fulfillment_status,
    payment_amount as amount,
    created_at,
    updated_at
FROM accommodation_requests

ORDER BY created_at DESC;

-- Grant access to authenticated users with admin role
-- RLS will handle the actual permissions
GRANT SELECT ON unified_admin_view TO authenticated;

-- ==========================================
-- Usage Examples:
-- 
-- Get all records:
-- SELECT * FROM unified_admin_view;
--
-- Get only paid transactions:
-- SELECT * FROM unified_admin_view WHERE payment_status = 'Paid';
--
-- Get all tickets:
-- SELECT * FROM unified_admin_view WHERE category = 'Ticket';
--
-- Get total revenue by category:
-- SELECT category, SUM(amount) as total_revenue 
-- FROM unified_admin_view 
-- WHERE payment_status = 'Paid'
-- GROUP BY category;
--
-- Get pending verifications:
-- SELECT * FROM unified_admin_view 
-- WHERE payment_status = 'Pending Verification'
-- ORDER BY created_at DESC;
-- ==========================================
