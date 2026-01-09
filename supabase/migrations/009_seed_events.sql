-- 1. Schema Update: Add 'category' column if it doesn't exist
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- 2. Clean up existing events if needed (Optional, but ensures clean slate for this request)
-- DELETE FROM events; -- deciding NOT to delete old data to be safe, just adding new ones.

-- 3. Insert Flagship Events
INSERT INTO events (name, category) VALUES
    ('Pitch', 'Flagship'),
    ('MUN', 'Flagship');

-- 4. Insert Formal Events
INSERT INTO events (name, category) VALUES
    ('Ideathon', 'Formal'),
    ('Quiz', 'Formal'),
    ('Case Study', 'Formal'),
    ('Best Manager', 'Formal'),
    ('Bid & Build', 'Formal');

-- 5. Insert Informal Events
INSERT INTO events (name, category) VALUES
    ('IPL Auction', 'Informal'),
    ('Geoguessr', 'Informal'),
    ('Kalabazaar', 'Informal');

-- 6. Update existing legacy events to have a category if they are null (just in case)
UPDATE events SET category = 'General' WHERE category IS NULL;
