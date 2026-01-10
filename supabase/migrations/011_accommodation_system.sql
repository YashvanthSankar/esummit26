-- ==========================================
-- Event Accommodation System - Database Schema
-- Migration: 011_accommodation_system
-- ==========================================

-- 1. Create the accommodation_requests table
CREATE TABLE IF NOT EXISTS accommodation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 10 AND age <= 100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    email VARCHAR(255) NOT NULL UNIQUE,
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

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_accommodation_gender ON accommodation_requests(gender);
CREATE INDEX IF NOT EXISTS idx_accommodation_dates ON accommodation_requests(date_of_arrival, date_of_departure);
CREATE INDEX IF NOT EXISTS idx_accommodation_email ON accommodation_requests(email);

-- 3. Create the quota enforcement function
CREATE OR REPLACE FUNCTION check_accommodation_quota()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    max_quota CONSTANT INTEGER := 60;
BEGIN
    -- Count existing requests for the same gender
    SELECT COUNT(*) INTO current_count
    FROM accommodation_requests
    WHERE gender = NEW.gender;
    
    -- Check if quota is exceeded
    IF current_count >= max_quota THEN
        RAISE EXCEPTION 'Accommodation quota exceeded for %. Maximum % requests allowed, currently % registered.', 
            NEW.gender, max_quota, current_count
        USING ERRCODE = '23514'; -- check_violation error code
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the trigger that fires before insertion
DROP TRIGGER IF EXISTS enforce_accommodation_quota ON accommodation_requests;
CREATE TRIGGER enforce_accommodation_quota
    BEFORE INSERT ON accommodation_requests
    FOR EACH ROW
    EXECUTE FUNCTION check_accommodation_quota();

-- 5. Function to get current availability
CREATE OR REPLACE FUNCTION get_accommodation_availability()
RETURNS TABLE(
    gender VARCHAR(10),
    current_count BIGINT,
    available_slots INTEGER,
    is_full BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.gender_value::VARCHAR(10),
        COALESCE(COUNT(ar.id), 0) as current_count,
        (60 - COALESCE(COUNT(ar.id), 0))::INTEGER as available_slots,
        COALESCE(COUNT(ar.id), 0) >= 60 as is_full
    FROM (
        VALUES ('Male'), ('Female')
    ) AS g(gender_value)
    LEFT JOIN accommodation_requests ar ON ar.gender = g.gender_value
    GROUP BY g.gender_value
    ORDER BY g.gender_value;
END;
$$ LANGUAGE plpgsql;

-- 6. Enable Row Level Security (RLS) for Supabase
ALTER TABLE accommodation_requests ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert accommodation requests" ON accommodation_requests;
DROP POLICY IF EXISTS "Users can view accommodation requests" ON accommodation_requests;
DROP POLICY IF EXISTS "Admins have full access" ON accommodation_requests;

-- 8. Create RLS Policies

-- Policy: Allow authenticated users to insert their own requests
CREATE POLICY "Users can insert accommodation requests"
    ON accommodation_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own accommodation requests"
    ON accommodation_requests
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Admin can view all requests
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

-- Policy: Admin can update requests (approve/reject)
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

-- 9. Create a view for public availability check (no authentication required)
CREATE OR REPLACE VIEW public_accommodation_availability AS
SELECT 
    gender,
    current_count,
    available_slots,
    is_full
FROM get_accommodation_availability();

-- Grant access to the view
GRANT SELECT ON public_accommodation_availability TO anon, authenticated;

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE accommodation_requests IS 'Stores accommodation requests for the event with strict gender-based quotas (60 Male, 60 Female)';
COMMENT ON COLUMN accommodation_requests.id_proof_url IS 'URL to the uploaded ID proof document in storage';
COMMENT ON COLUMN accommodation_requests.gender IS 'Strictly Male or Female - enforced by CHECK constraint';
COMMENT ON FUNCTION check_accommodation_quota() IS 'Enforces the 60 person quota per gender before insertion';
COMMENT ON FUNCTION get_accommodation_availability() IS 'Returns current availability stats for both Male and Female quotas';
