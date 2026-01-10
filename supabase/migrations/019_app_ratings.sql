-- ==========================================
-- Migration: App Ratings System
-- Allows users to submit ratings and reviews for the app
-- ==========================================

-- Create app_ratings table
CREATE TABLE IF NOT EXISTS app_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one rating per user
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE app_ratings ENABLE ROW LEVEL SECURITY;

-- Users can view their own rating
CREATE POLICY "Users can view own rating"
ON app_ratings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own rating
CREATE POLICY "Users can insert own rating"
ON app_ratings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own rating
CREATE POLICY "Users can update own rating"
ON app_ratings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all ratings
CREATE POLICY "Admins can view all ratings"
ON app_ratings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Create an index for faster aggregation
CREATE INDEX IF NOT EXISTS idx_app_ratings_rating ON app_ratings(rating);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_app_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_app_ratings_updated_at
    BEFORE UPDATE ON app_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_app_ratings_updated_at();
