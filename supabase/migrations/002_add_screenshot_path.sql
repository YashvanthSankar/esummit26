-- Add screenshot_path to tickets table
ALTER TABLE tickets ADD COLUMN screenshot_path TEXT;

-- Create storage bucket for payment proofs (run via dashboard or if extension enabled)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true);

-- Policy to allow authenticated users to upload to payment-proofs
-- CREATE POLICY "Users can upload payment proofs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-proofs');
-- CREATE POLICY "Users can read payment proofs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'payment-proofs');

-- Since we can't reliably create buckets/policies via migration without proper permissions/extensions setup,
-- we'll assume the user creates the bucket 'payment-proofs' manually in the dashboard.

-- Allow admins to update tickets (for verification)
CREATE POLICY "Admins can update all tickets"
    ON tickets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
