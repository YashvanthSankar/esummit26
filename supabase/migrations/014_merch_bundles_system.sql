-- ==========================================
-- Merchandise Bundles System - Database Schema
-- Migration: 014_merch_bundles_system
-- ==========================================

-- Drop existing table and recreate with bundle support
DROP TABLE IF EXISTS merch_orders CASCADE;

-- 1. Create the bundle types enum
DO $$ BEGIN
    CREATE TYPE merch_bundle_type AS ENUM ('solo', 'duo', 'quad');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create the merch item types enum
DO $$ BEGIN
    CREATE TYPE merch_item_type AS ENUM ('tshirt1', 'tshirt2', 'combo');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. Create the updated merch_orders table with bundle support
CREATE TABLE merch_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contact details
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    
    -- Bundle details
    bundle_type merch_bundle_type NOT NULL DEFAULT 'solo',
    item_type merch_item_type NOT NULL,
    
    -- Items in the bundle (JSON array with size info for each item)
    -- Format: [{"item": "tshirt1", "size": "L"}, {"item": "tshirt2", "size": "M"}]
    bundle_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Total number of items (derived from bundle_type: solo=1, duo=2, quad=4)
    total_items INTEGER NOT NULL CHECK (total_items IN (1, 2, 4)),
    
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

-- 4. Create indexes for better query performance
CREATE INDEX idx_merch_orders_user ON merch_orders(user_id);
CREATE INDEX idx_merch_orders_status ON merch_orders(status);
CREATE INDEX idx_merch_orders_payment_status ON merch_orders(payment_status);
CREATE INDEX idx_merch_orders_bundle_type ON merch_orders(bundle_type);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE merch_orders ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies

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

-- 7. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_merch_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_merch_orders_updated_at
    BEFORE UPDATE ON merch_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_merch_orders_updated_at();

-- ==========================================
-- PRICING REFERENCE (for application layer):
-- 
-- Item Prices (per item):
--   - T-shirt 1: ₹399
--   - T-shirt 2: ₹399  
--   - Combo (Both T-shirts): ₹749
--
-- Bundle Multipliers:
--   - Solo (1 item): 1x base price
--   - Duo (2 items): 2x base price (discount: 10% off)
--   - Quad (4 items): 4x base price (discount: 15% off)
-- ==========================================
