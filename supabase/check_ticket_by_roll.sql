-- Diagnostic Query: Check profile and pending ticket status for multiple users

WITH user_profiles AS (
    SELECT id, email, roll_number, full_name
    FROM profiles
    WHERE LOWER(roll_number) IN (LOWER('me25i1030'), LOWER('me25b2003'))
),
assigned_tickets AS (
    SELECT p.roll_number, t.id as ticket_id, t.type, t.status, 'Assigned' as ticket_type
    FROM user_profiles p
    JOIN tickets t ON t.user_id = p.id
),
pending_tickets AS (
    SELECT 
        p.roll_number,
        t.id as ticket_id,
        t.type,
        t.status,
        t.pending_email,
        'Pending - Can be claimed' as ticket_type
    FROM user_profiles p
    LEFT JOIN tickets t ON 
        t.user_id IS NULL AND (
            LOWER(t.pending_email) = LOWER(p.email) 
            OR 
            LOWER(t.pending_email) = LOWER(p.roll_number || '@iiitdm.ac.in')
        )
)
-- Show comprehensive results for both users
SELECT 
    p.roll_number,
    p.full_name,
    p.email as profile_email,
    COALESCE(at.ticket_id, pt.ticket_id) as ticket_id,
    COALESCE(at.type, pt.type) as ticket_type,
    COALESCE(at.status, pt.status) as ticket_status,
    COALESCE(at.ticket_type, pt.ticket_type, 'No ticket found') as finding,
    pt.pending_email
FROM user_profiles p
LEFT JOIN assigned_tickets at ON at.roll_number = p.roll_number
LEFT JOIN pending_tickets pt ON pt.roll_number = p.roll_number
ORDER BY p.roll_number;
