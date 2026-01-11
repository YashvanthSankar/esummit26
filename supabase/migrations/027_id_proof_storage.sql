-- ==========================================
-- Migration: Add ID proof columns to profiles
-- For external users to store their college and government ID proofs
-- ==========================================

-- Add columns for ID proof storage paths
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS college_id_proof TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS govt_id_proof TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.college_id_proof IS 'Storage path to compressed college ID proof image (external users only)';
COMMENT ON COLUMN profiles.govt_id_proof IS 'Storage path to compressed government ID proof image (external users only)';

-- Create id_proofs bucket if not exists (skip if exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'id_proofs', 
    'id_proofs', 
    false,  -- Private bucket
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS policies for id_proofs bucket
DROP POLICY IF EXISTS "Users can upload their own id proofs" ON storage.objects;
CREATE POLICY "Users can upload their own id proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'id_proofs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Admins can view all id proofs" ON storage.objects;
CREATE POLICY "Admins can view all id proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'id_proofs'
    AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ ID proof columns added to profiles table';
    RAISE NOTICE '✅ id_proofs storage bucket configured';
END $$;
