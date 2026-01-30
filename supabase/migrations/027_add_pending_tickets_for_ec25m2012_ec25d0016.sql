-- Migration: 027_add_pending_tickets_for_ec25m2012_ec25d0016
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
    'ec25m2012@iiitdm.ac.in',
    'EC25M2012',
    NULL,
    'solo',
    150,
    'paid',
    generate_ticket_qr_secret(),
    1,
    'a0000000-0000-0000-0000-000000000001'::uuid
),
(
    'ec25d0016@iiitdm.ac.in',
    'EC25D0016',
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
