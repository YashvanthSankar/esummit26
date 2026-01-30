-- Migration: 026_add_pending_tickets_for_me25i1030_me25b2003
-- Purpose: Manually add pending tickets for users who bought tickets but can't see them

INSERT INTO tickets (
    pending_email,
    pending_name,
    pending_phone,
    type,
    amount,
    status,
    qr_secret,
    pax_count,
    booking_group_id
)
VALUES 
(
    'me25i1030@iiitdm.ac.in',
    'ME25I1030',
    NULL,
    'solo',
    150,
    'paid',
    generate_ticket_qr_secret(),
    1,
    'a0000000-0000-0000-0000-000000000001'::uuid
),
(
    'me25b2003@iiitdm.ac.in',
    'ME25B2003',
    NULL,
    'solo',
    150,
    'paid',
    generate_ticket_qr_secret(),
    1,
    'a0000000-0000-0000-0000-000000000001'::uuid
);

-- After inserting, automatically claim these tickets for existing users
SELECT claim_all_pending_tickets();
