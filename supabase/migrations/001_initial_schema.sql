-- ============================================
-- E-SUMMIT '26 - SUPABASE DATABASE SCHEMA
-- Event Management System
-- ============================================

-- ==========================================
-- 1. CUSTOM ENUM TYPES
-- ==========================================

CREATE TYPE user_role AS ENUM ('internal', 'external', 'admin');
CREATE TYPE ticket_type AS ENUM ('solo', 'duo', 'quad');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');

-- ==========================================
-- 2. PROFILES TABLE
-- ==========================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    college_name TEXT,
    roll_number TEXT,
    role user_role DEFAULT 'external' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. TICKETS TABLE
-- ==========================================

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type ticket_type NOT NULL,
    amount INTEGER NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    qr_secret TEXT UNIQUE NOT NULL,
    pax_count INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own tickets
CREATE POLICY "Users can read own tickets"
    ON tickets
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Admins can read all tickets
CREATE POLICY "Admins can read all tickets"
    ON tickets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ==========================================
-- 4. EVENTS TABLE
-- ==========================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS (public read)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read events
CREATE POLICY "Anyone can read events"
    ON events
    FOR SELECT
    TO authenticated
    USING (true);

-- Insert default events
INSERT INTO events (name) VALUES
    ('Entry Gate'),
    ('Lunch Day 1'),
    ('Merchandise');

-- ==========================================
-- 5. EVENT_LOGS TABLE
-- ==========================================

CREATE TABLE event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    scanned_by UUID NOT NULL REFERENCES profiles(id),
    scanned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- CRITICAL: Prevent duplicate scans per ticket per event
    CONSTRAINT unique_ticket_event UNIQUE (ticket_id, event_id)
);

-- Enable RLS
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can insert event logs (scan tickets)
CREATE POLICY "Admins can insert event logs"
    ON event_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Admins can read all event logs
CREATE POLICY "Admins can read all event logs"
    ON event_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ==========================================
-- 6. HELPER INDEXES
-- ==========================================

CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_qr_secret ON tickets(qr_secret);
CREATE INDEX idx_event_logs_ticket_id ON event_logs(ticket_id);
CREATE INDEX idx_event_logs_event_id ON event_logs(event_id);
CREATE INDEX idx_event_logs_scanned_at ON event_logs(scanned_at);

-- ==========================================
-- 7. UPDATED_AT TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
