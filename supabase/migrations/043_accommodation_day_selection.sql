-- ==========================================
-- Update Accommodation System for Day Selection
-- Migration: 043_accommodation_day_selection
-- ==========================================

-- 1. Make the old columns nullable first (so we can insert without them)
ALTER TABLE accommodation_requests 
ALTER COLUMN date_of_arrival DROP NOT NULL;

ALTER TABLE accommodation_requests 
ALTER COLUMN date_of_departure DROP NOT NULL;

-- 2. Add the new selected_days column (array of dates)
ALTER TABLE accommodation_requests 
ADD COLUMN IF NOT EXISTS selected_days DATE[] DEFAULT '{}';

-- 3. Migrate existing data from date_of_arrival/date_of_departure to selected_days
-- Generate an array of dates between arrival and departure
UPDATE accommodation_requests
SET selected_days = (
    SELECT ARRAY_AGG(d::DATE ORDER BY d)
    FROM generate_series(
        date_of_arrival,
        date_of_departure - INTERVAL '1 day', -- departure is checkout day, not included in stay
        INTERVAL '1 day'
    ) AS d
)
WHERE date_of_arrival IS NOT NULL 
  AND date_of_departure IS NOT NULL
  AND (selected_days IS NULL OR selected_days = '{}');

-- 4. Drop the old date constraint
ALTER TABLE accommodation_requests 
DROP CONSTRAINT IF EXISTS valid_dates;

-- 5. Add a constraint to ensure at least one day is selected for new records
-- (Allow NULL for backward compatibility with old records)
ALTER TABLE accommodation_requests 
DROP CONSTRAINT IF EXISTS selected_days_not_empty;

ALTER TABLE accommodation_requests 
ADD CONSTRAINT selected_days_not_empty 
CHECK (array_length(selected_days, 1) >= 1 OR selected_days IS NULL OR selected_days = '{}');

-- 6. Add a constraint to ensure maximum 3 days
ALTER TABLE accommodation_requests 
DROP CONSTRAINT IF EXISTS selected_days_max_three;

ALTER TABLE accommodation_requests 
ADD CONSTRAINT selected_days_max_three 
CHECK (array_length(selected_days, 1) <= 3 OR selected_days IS NULL);

-- 7. Update index for better query performance on selected days
DROP INDEX IF EXISTS idx_accommodation_dates;
CREATE INDEX IF NOT EXISTS idx_accommodation_selected_days ON accommodation_requests USING GIN(selected_days);

-- 8. Comment for documentation
COMMENT ON COLUMN accommodation_requests.selected_days IS 'Array of dates the participant has booked for accommodation (max 3 days: 30 Jan, 31 Jan, 1 Feb 2026)';

-- ==========================================
-- END OF MIGRATION
-- ==========================================
