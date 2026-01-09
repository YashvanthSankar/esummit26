-- FIX: Schema Mismatch for event_logs
-- The table was created by 001 with 'event_id' (UUID)
-- But the code expects 'event_name' (TEXT)
-- Migration 003 failed to apply because of 'IF NOT EXISTS'

-- 1. Add 'event_name' column
ALTER TABLE event_logs 
ADD COLUMN IF NOT EXISTS event_name TEXT;

-- 2. Make 'event_id' optional (so inserts without it don't fail)
ALTER TABLE event_logs 
ALTER COLUMN event_id DROP NOT NULL;

-- 3. Populate 'event_name' for existing rows (default to 'ENTRY')
UPDATE event_logs 
SET event_name = 'ENTRY' 
WHERE event_name IS NULL;

-- 4. Enforce Non-Null on 'event_name' now that it's populated
ALTER TABLE event_logs 
ALTER COLUMN event_name SET NOT NULL;

-- 5. Drop the old unique constraint (which used event_id)
ALTER TABLE event_logs
DROP CONSTRAINT IF EXISTS unique_ticket_event;

-- 6. Add new unique constraint (using event_name)
-- (But first, ensure we don't have duplicates that would break this)
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_logs_ticket_event_name 
ON event_logs(ticket_id, event_name);
