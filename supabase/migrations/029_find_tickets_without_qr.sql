-- Find tickets that are paid for and claimed, but are missing a QR code secret.
-- The qr_secret should ideally never be null for a paid ticket, so this is a data integrity check.
SELECT
    t.id,
    p.email,
    p.full_name,
    t.created_at
FROM
    tickets t
JOIN
    profiles p ON t.user_id = p.id
WHERE
    t.status = 'paid'
    AND t.qr_secret IS NULL;
