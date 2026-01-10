-- ==========================================
-- Migration: Band Issuance Tracking
-- Adds columns to track wristband issuance for physical fulfillment
-- ==========================================

-- Add band issuance tracking columns to tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS band_issued_at TIMESTAMPTZ;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS band_issued_by UUID REFERENCES profiles(id);

-- Index for fast lookups of pending band issuance
CREATE INDEX IF NOT EXISTS idx_tickets_band_pending 
ON tickets(status, band_issued_at) 
WHERE status = 'paid' AND band_issued_at IS NULL;

-- Comment for clarity
COMMENT ON COLUMN tickets.band_issued_at IS 'Timestamp when physical wristband was issued';
COMMENT ON COLUMN tickets.band_issued_by IS 'Admin who issued the wristband';
