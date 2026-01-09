-- Create event_logs table for gate entry tracking
CREATE TABLE IF NOT EXISTS event_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL, -- e.g. 'ENTRY'
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    scanned_by UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'success' -- 'success', 'duplicate', 'failed'
);

-- Policy: specific admins can view/insert logs
CREATE POLICY "Admins can view event logs"
    ON event_logs FOR SELECT
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins can insert event logs"
    ON event_logs FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Index for faster duplicate checks
CREATE INDEX IF NOT EXISTS idx_event_logs_ticket_event ON event_logs(ticket_id, event_name);
