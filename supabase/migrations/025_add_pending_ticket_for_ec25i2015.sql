-- Migration: 025_add_pending_ticket_for_ec25i2015
-- Purpose: Manually add a pending ticket for a specific user.

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
VALUES (
    'ec25i2015@iiitdm.ac.in',
    'EC25I2015',
    NULL,
    'solo',
    150,
    'paid',
    generate_ticket_qr_secret(),
    1,
    'a0000000-0000-0000-0000-000000000001'::uuid
);
