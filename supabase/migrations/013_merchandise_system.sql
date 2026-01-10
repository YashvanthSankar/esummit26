-- ==========================================
-- Merchandise Orders System - Database Schema
-- Migration: 013_merchandise_system
-- ==========================================

-- 1. Create the merch_orders table
CREATE TABLE IF NOT EXISTS merch_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    
    -- Merch details
    item_name VARCHAR(255) NOT NULL,
    size VARCHAR(10) NOT NULL CHECK (size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 5),
    
    -- Payment details
    amount INTEGER NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending_verification' 
        CHECK (payment_status IN ('pending', 'pending_verification', 'paid', 'rejected')),
    payment_utr TEXT,
    payment_screenshot_path TEXT,
    
    -- Order status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'delivered')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_merch_orders_user ON merch_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_merch_orders_status ON merch_orders(status);
CREATE INDEX IF NOT EXISTS idx_merch_orders_payment_status ON merch_orders(payment_status);

-- 3. Enable Row Level Security (RLS) for Supabase
ALTER TABLE merch_orders ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Policy: Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert merch orders"
    ON merch_orders
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own merch orders"
    ON merch_orders
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own rejected orders
CREATE POLICY "Users can delete rejected merch orders"
    ON merch_orders
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'rejected');

-- Policy: Admin can view all orders
CREATE POLICY "Admins can view all merch orders"
    ON merch_orders
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy: Admin can update orders
CREATE POLICY "Admins can update merch orders"
    ON merch_orders
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

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE merch_orders IS 'Stores merchandise orders for E-Summit 26';
COMMENT ON COLUMN merch_orders.item_name IS 'Name of the merchandise item (e.g., T-Shirt, Hoodie)';
COMMENT ON COLUMN merch_orders.size IS 'Size of the merchandise (XS to XXL)';
