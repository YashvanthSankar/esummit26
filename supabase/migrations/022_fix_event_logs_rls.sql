-- ==========================================
-- Fix RLS Policy for Event Logs
-- Issue: Users could not seeing their attended events in dashboard
-- ==========================================

-- Policy: Users can read their own event logs (via ticket ownership)
CREATE POLICY "Users can read own event logs"
    ON event_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tickets
            WHERE tickets.id = event_logs.ticket_id
            AND tickets.user_id = auth.uid()
        )
    );
