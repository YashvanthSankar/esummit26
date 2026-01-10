-- ==========================================
-- Migration: Performance Optimization Indexes
-- Adds indexes to frequently queried columns
-- Target: 60-75% query performance improvement
-- ==========================================

-- ==========================================
-- TICKETS TABLE INDEXES
-- ==========================================

-- Index on status (used in all admin queries, dashboard stats)
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);

-- Index on user_id (used in dashboard, user lookups)
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);

-- Index on pending_email (used for guest ticket lookups)
CREATE INDEX IF NOT EXISTS idx_tickets_pending_email ON tickets(pending_email);

-- Index on booking_group_id (used for group ticket operations)
CREATE INDEX IF NOT EXISTS idx_tickets_booking_group_id ON tickets(booking_group_id);

-- Index on created_at DESC (used for recent activity, sorting)
CREATE INDEX IF NOT EXISTS idx_tickets_created_at_desc ON tickets(created_at DESC);

-- Composite index for payment verification queries
CREATE INDEX IF NOT EXISTS idx_tickets_status_payment ON tickets(status, screenshot_path) 
WHERE status = 'pending_verification';

-- ==========================================
-- EVENT LOGS TABLE INDEXES
-- ==========================================

-- Index on ticket_id (used for attended events lookup)
CREATE INDEX IF NOT EXISTS idx_event_logs_ticket_id ON event_logs(ticket_id);

-- Index on event_id (used for event attendance stats)
CREATE INDEX IF NOT EXISTS idx_event_logs_event_id ON event_logs(event_id);

-- Index on scanned_at (used for recent scans, sorting)
CREATE INDEX IF NOT EXISTS idx_event_logs_scanned_at ON event_logs(scanned_at DESC);

-- Composite index for duplicate scan checks
CREATE INDEX IF NOT EXISTS idx_event_logs_ticket_event ON event_logs(ticket_id, event_id);

-- ==========================================
-- MERCH ORDERS TABLE INDEXES
-- ==========================================

-- Index on status (used in admin merch filtering)
CREATE INDEX IF NOT EXISTS idx_merch_orders_status ON merch_orders(status);

-- Index on payment_status (used for payment verification)
CREATE INDEX IF NOT EXISTS idx_merch_orders_payment_status ON merch_orders(payment_status);

-- Index on user_id (used for user's order history)
CREATE INDEX IF NOT EXISTS idx_merch_orders_user_id ON merch_orders(user_id);

-- Index on created_at (used for sorting recent orders)
CREATE INDEX IF NOT EXISTS idx_merch_orders_created_at ON merch_orders(created_at DESC);

-- ==========================================
-- ACCOMMODATION REQUESTS TABLE INDEXES
-- ==========================================

-- Index on status (used in admin accommodation filtering)
CREATE INDEX IF NOT EXISTS idx_accommodation_status ON accommodation_requests(status);

-- Index on payment_status (used for payment verification)
CREATE INDEX IF NOT EXISTS idx_accommodation_payment_status ON accommodation_requests(payment_status);

-- Index on user_id (used for user's accommodation lookup)
CREATE INDEX IF NOT EXISTS idx_accommodation_user_id ON accommodation_requests(user_id);

-- Index on gender (used for stats and filtering)
CREATE INDEX IF NOT EXISTS idx_accommodation_gender ON accommodation_requests(gender);

-- ==========================================
-- PROFILES TABLE INDEXES
-- ==========================================

-- Index on email (used for user lookups, admin checks)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Index on role (used for admin filtering)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ==========================================
-- EVENTS TABLE INDEXES
-- ==========================================

-- Index on is_active (used for active events listing)
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);

-- Index on category (used for grouped event display)
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- ==========================================
-- ANALYZE TABLES FOR QUERY PLANNER
-- ==========================================

ANALYZE tickets;
ANALYZE event_logs;
ANALYZE merch_orders;
ANALYZE accommodation_requests;
ANALYZE profiles;
ANALYZE events;
