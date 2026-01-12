-- Comprehensive Database Fix for Merch Update.
-- Run this entire script in Supabase SQL Editor.

-- 1. Add 'triple' option to bundle type enum (if not exists)
ALTER TYPE merch_bundle_type ADD VALUE IF NOT EXISTS 'triple';

-- 2. Add 'tshirt3' option to item type enum (if not exists)
ALTER TYPE merch_item_type ADD VALUE IF NOT EXISTS 'tshirt3';

-- 3. Update the check constraint for total_items to allow 3 items
ALTER TABLE merch_orders DROP CONSTRAINT IF EXISTS merch_orders_total_items_check;
ALTER TABLE merch_orders ADD CONSTRAINT merch_orders_total_items_check CHECK (total_items IN (1, 2, 3, 4));
