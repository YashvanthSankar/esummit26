-- Find tickets that are paid for but not yet claimed by a user.
-- These are tickets that have a pending_email and the user has not yet signed up to claim it.
SELECT
    id,
    pending_email,
    pending_name,
    pending_phone,
    created_at
FROM
    tickets
WHERE
    user_id IS NULL
    AND pending_email IS NOT NULL
    AND status = 'paid';
