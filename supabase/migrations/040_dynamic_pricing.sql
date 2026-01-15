-- Migration: Enable Dynamic Ticket Types
-- Change 'type' column from ENUM to TEXT to support any group size/label

-- STEP 1: Drop dependent view (will be recreated after column change)
DROP VIEW IF EXISTS unified_admin_view;

-- STEP 2: Alter the tickets.type column from ENUM to TEXT
ALTER TABLE tickets 
    ALTER COLUMN type TYPE TEXT USING type::text;

-- STEP 3: Add payment_category column for reporting (Internal vs External)
ALTER TABLE tickets 
    ADD COLUMN IF NOT EXISTS payment_category TEXT DEFAULT 'external';

-- STEP 4: Update payment_category based on user profiles (approximate backfill)
UPDATE tickets 
SET payment_category = profiles.role
FROM profiles
WHERE tickets.user_id = profiles.id
AND profiles.role IN ('internal', 'external');

-- STEP 5: Recreate the unified_admin_view
-- This view combines tickets, merch, and accommodation into one unified view
CREATE VIEW unified_admin_view AS
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

SELECT 
    m.id,
    p.full_name,
    p.email,
    COALESCE(p.phone::text, 'N/A'),
    'Merchandise'::TEXT,
    m.item_type::TEXT,
    CASE 
        WHEN m.payment_status = 'paid' THEN 'Paid'
        WHEN m.payment_status = 'verified' THEN 'Paid'
        ELSE 'Pending'
    END,
    COALESCE(m.status::TEXT, 'Pending'),
    m.amount,
    m.created_at,
    m.id
FROM merch_orders m
JOIN profiles p ON m.user_id = p.id

UNION ALL

SELECT 
    a.id,
    p.full_name,
    p.email,
    COALESCE(p.phone::text, 'N/A'),
    'Accommodation'::TEXT,
    ((a.date_of_departure - a.date_of_arrival) || ' Days')::TEXT,
    a.status::TEXT,
    CASE 
        WHEN a.status = 'approved' THEN 'Approved'
        WHEN a.status = 'rejected' THEN 'Rejected'
        ELSE 'Pending'
    END,
    a.payment_amount,
    a.created_at,
    a.id
FROM accommodation_requests a
JOIN profiles p ON a.user_id = p.id
ORDER BY created_at DESC;
