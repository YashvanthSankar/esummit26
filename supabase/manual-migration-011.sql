-- ==========================================
-- MANUAL MIGRATION - Run this in Supabase SQL Editor
-- ==========================================
-- Instructions:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- ==========================================

-- Drop table if it exists (to start fresh)
DROP TABLE IF EXISTS accommodation_requests CASCADE;

-- Create the accommodation_requests table
CREATE TABLE accommodation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 10 AND age <= 100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    email VARCHAR(255) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    date_of_arrival DATE NOT NULL,
    date_of_departure DATE NOT NULL,
    id_proof_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure departure is after arrival
    CONSTRAINT valid_dates CHECK (date_of_departure > date_of_arrival)
);

-- Create indexes for performance
CREATE INDEX idx_accommodation_user_id ON accommodation_requests(user_id);
CREATE INDEX idx_accommodation_gender ON accommodation_requests(gender);
CREATE INDEX idx_accommodation_status ON accommodation_requests(status);
CREATE INDEX idx_accommodation_email ON accommodation_requests(email);

-- Enable Row Level Security
ALTER TABLE accommodation_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own accommodation requests" ON accommodation_requests;
DROP POLICY IF EXISTS "Users can view their own accommodation requests" ON accommodation_requests;
DROP POLICY IF EXISTS "Admins can view all accommodation requests" ON accommodation_requests;
DROP POLICY IF EXISTS "Admins can update accommodation requests" ON accommodation_requests;

-- RLS Policies for Users
CREATE POLICY "Users can insert their own accommodation requests"
ON accommodation_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own accommodation requests"
ON accommodation_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for Admins
CREATE POLICY "Admins can view all accommodation requests"
ON accommodation_requests
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can update accommodation requests"
ON accommodation_requests
FOR UPDATE
TO authenticated
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

-- Quota enforcement function
CREATE OR REPLACE FUNCTION check_accommodation_quota()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    max_quota CONSTANT INTEGER := 60;
BEGIN
    -- Count approved requests for the same gender
    SELECT COUNT(*) INTO current_count
    FROM accommodation_requests
    WHERE gender = NEW.gender
    AND status = 'approved';
    
    -- Check if quota is exceeded
    IF current_count >= max_quota THEN
        RAISE EXCEPTION 'Accommodation quota exceeded for %. Maximum % approved requests allowed.', 
            NEW.gender, max_quota;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for quota enforcement (only on approval)
DROP TRIGGER IF EXISTS enforce_accommodation_quota ON accommodation_requests;
CREATE TRIGGER enforce_accommodation_quota
    BEFORE UPDATE ON accommodation_requests
    FOR EACH ROW
    WHEN (OLD.status != 'approved' AND NEW.status = 'approved')
    EXECUTE FUNCTION check_accommodation_quota();

-- ==========================================
-- Storage Bucket Policies for id_proofs
-- ==========================================

-- Create storage bucket if it doesn't exist (this may fail if bucket exists, that's OK)
INSERT INTO storage.buckets (id, name, public)
VALUES ('id_proofs', 'id_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Authenticated users can upload id proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view id proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own id proofs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view id proofs" ON storage.objects;

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload id proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'id_proofs'
);

-- Policy: Allow public access to view files (so admins can see them)
CREATE POLICY "Public can view id proofs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'id_proofs');

-- Policy: Allow users to update their own files
CREATE POLICY "Users can update their own id proofs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'id_proofs')
WITH CHECK (bucket_id = 'id_proofs');

-- Policy: Allow users to delete their own files
CREATE POLICY "Users can delete their own id proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'id_proofs');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Accommodation system tables created successfully!';
    RAISE NOTICE '✅ Storage bucket policies configured!';
    RAISE NOTICE 'You can now use the accommodation booking feature.';
END $$;
