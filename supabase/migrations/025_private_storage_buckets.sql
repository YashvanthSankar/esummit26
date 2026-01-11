-- ==========================================
-- Migration: Make Storage Buckets Private
-- Security fix: Payment proofs and ID proofs should not be publicly accessible
-- ==========================================

-- Make payment-proofs bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'payment-proofs';

-- Make id_proofs bucket private  
UPDATE storage.buckets 
SET public = false 
WHERE id = 'id_proofs';

-- Update storage policies to require authentication for viewing
-- Drop existing public access policies

DROP POLICY IF EXISTS "Public can view id proofs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view id proofs" ON storage.objects;

-- Create new policy: Only authenticated users can view files
CREATE POLICY "Authenticated users can view payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id IN ('payment-proofs', 'id_proofs'));

-- Note: Admin pages now use createSignedUrl() which generates 
-- time-limited URLs (5 minutes) that work even with private buckets.
-- The signed URLs are generated server-side with the anon/service key.

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Storage buckets are now PRIVATE';
    RAISE NOTICE '✅ Payment proofs and ID proofs are secured';
    RAISE NOTICE 'Admin pages use signed URLs with 5-minute expiry';
END $$;
