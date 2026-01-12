-- Migration: Admin Password System
-- Allows super_admin to set passwords that internal users can use to become admin
-- 
-- Flow:
-- 1. Super admin creates an admin_password entry with a hashed password
-- 2. Internal user enters the password to request admin access
-- 3. Password is verified against hash, if correct -> user becomes admin
-- 4. Audit log tracks all admin access grants

-- =====================================================
-- 1. ADMIN PASSWORDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_passwords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    password_hash TEXT NOT NULL, -- bcrypt hash of the password
    label TEXT NOT NULL, -- Human-readable label (e.g., "January 2026 Batch")
    is_active BOOLEAN DEFAULT true NOT NULL,
    max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
    current_uses INTEGER DEFAULT 0 NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT NULL -- NULL = never expires
);

-- Enable RLS
ALTER TABLE admin_passwords ENABLE ROW LEVEL SECURITY;

-- Only super_admin can view admin passwords
CREATE POLICY "Super admins can view admin passwords"
    ON admin_passwords FOR SELECT
    USING (is_super_admin());

-- Only super_admin can insert admin passwords
CREATE POLICY "Super admins can insert admin passwords"
    ON admin_passwords FOR INSERT
    WITH CHECK (is_super_admin());

-- Only super_admin can update admin passwords
CREATE POLICY "Super admins can update admin passwords"
    ON admin_passwords FOR UPDATE
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Only super_admin can delete admin passwords
CREATE POLICY "Super admins can delete admin passwords"
    ON admin_passwords FOR DELETE
    USING (is_super_admin());

-- =====================================================
-- 2. ADMIN ACCESS LOGS TABLE (Audit Trail)
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    password_id UUID REFERENCES admin_passwords(id) ON DELETE SET NULL,
    password_label TEXT, -- Store label in case password is deleted
    granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    granted_by_password BOOLEAN DEFAULT true -- true = password, false = manual
);

-- Enable RLS
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;

-- Only super_admin can view admin access logs
CREATE POLICY "Super admins can view admin access logs"
    ON admin_access_logs FOR SELECT
    USING (is_super_admin());

-- System can insert (via service role or security definer function)
CREATE POLICY "System can insert admin access logs"
    ON admin_access_logs FOR INSERT
    WITH CHECK (true); -- Controlled by the function, not direct access

-- =====================================================
-- 3. FUNCTION: Grant Admin Access (SECURITY DEFINER)
-- =====================================================

-- This function runs with elevated privileges to:
-- 1. Increment the usage counter on the password
-- 2. Update the user's role to 'admin'
-- 3. Log the admin access grant
-- It bypasses RLS to ensure atomic operations

CREATE OR REPLACE FUNCTION public.grant_admin_access(
    p_user_id UUID,
    p_password_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_password_record RECORD;
    v_user_record RECORD;
    v_result JSONB;
BEGIN
    -- Get user details
    SELECT id, email, role INTO v_user_record
    FROM profiles
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Check if user is internal
    IF v_user_record.role != 'internal' THEN
        -- If already admin or super_admin, that's fine
        IF v_user_record.role IN ('admin', 'super_admin') THEN
            RETURN jsonb_build_object('success', false, 'error', 'User is already an admin');
        END IF;
        RETURN jsonb_build_object('success', false, 'error', 'Only internal users can become admin');
    END IF;
    
    -- Get and validate password
    SELECT * INTO v_password_record
    FROM admin_passwords
    WHERE id = p_password_id
    FOR UPDATE; -- Lock the row
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid password ID');
    END IF;
    
    IF NOT v_password_record.is_active THEN
        RETURN jsonb_build_object('success', false, 'error', 'This password has been deactivated');
    END IF;
    
    IF v_password_record.expires_at IS NOT NULL AND v_password_record.expires_at < NOW() THEN
        RETURN jsonb_build_object('success', false, 'error', 'This password has expired');
    END IF;
    
    IF v_password_record.max_uses IS NOT NULL AND v_password_record.current_uses >= v_password_record.max_uses THEN
        RETURN jsonb_build_object('success', false, 'error', 'This password has reached its usage limit');
    END IF;
    
    -- All checks passed - grant admin access
    
    -- 1. Increment usage counter
    UPDATE admin_passwords
    SET current_uses = current_uses + 1
    WHERE id = p_password_id;
    
    -- 2. Update user role to admin
    UPDATE profiles
    SET role = 'admin', updated_at = NOW()
    WHERE id = p_user_id;
    
    -- 3. Log the access grant
    INSERT INTO admin_access_logs (user_id, user_email, password_id, password_label)
    VALUES (p_user_id, v_user_record.email, p_password_id, v_password_record.label);
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Admin access granted successfully',
        'email', v_user_record.email
    );
END;
$$;

-- =====================================================
-- 4. FUNCTION: Verify Password and Grant Access
-- =====================================================

-- Note: Actual bcrypt comparison must happen in the application layer
-- This function is called AFTER the password is verified by the API
-- The API will use bcrypt.compare() and then call grant_admin_access()

-- =====================================================
-- 5. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_admin_passwords_active 
    ON admin_passwords(is_active) 
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_admin_access_logs_user 
    ON admin_access_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_access_logs_granted_at 
    ON admin_access_logs(granted_at DESC);

-- =====================================================
-- 6. GET ACTIVE ADMIN PASSWORDS (for verification - no RLS)
-- =====================================================

-- This function allows users to verify against active passwords
-- It returns password hashes so bcrypt comparison can happen in the app layer
-- Only returns active, non-expired passwords within their usage limits

CREATE OR REPLACE FUNCTION public.get_active_admin_passwords()
RETURNS TABLE (
    id UUID,
    password_hash TEXT,
    label TEXT,
    max_uses INTEGER,
    current_uses INTEGER,
    expires_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        id,
        password_hash,
        label,
        max_uses,
        current_uses,
        expires_at
    FROM admin_passwords
    WHERE is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR current_uses < max_uses);
$$;

-- =====================================================
-- 7. REVOKE ADMIN ACCESS FUNCTION (for super_admin use)
-- =====================================================

CREATE OR REPLACE FUNCTION public.revoke_admin_access(
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
BEGIN
    -- Only super_admin can call this
    IF NOT is_super_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only super admins can revoke admin access');
    END IF;
    
    -- Get user details
    SELECT id, email, role INTO v_user_record
    FROM profiles
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Cannot revoke super_admin
    IF v_user_record.role = 'super_admin' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cannot revoke super admin access');
    END IF;
    
    -- Check if user is actually an admin
    IF v_user_record.role != 'admin' THEN
        RETURN jsonb_build_object('success', false, 'error', 'User is not an admin');
    END IF;
    
    -- Revoke access - set back to internal (since only internal can become admin)
    UPDATE profiles
    SET role = 'internal', updated_at = NOW()
    WHERE id = p_user_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Admin access revoked',
        'email', v_user_record.email
    );
END;
$$;
