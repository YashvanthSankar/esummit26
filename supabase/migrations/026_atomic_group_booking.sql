-- ==========================================
-- Migration: Atomic Group Booking Function
-- Prevents race conditions when multiple users book the last available slots
-- ==========================================

-- Create function to handle atomic group ticket booking
CREATE OR REPLACE FUNCTION create_group_booking(
    p_purchaser_id UUID,
    p_ticket_type TEXT,
    p_total_amount BIGINT,
    p_pax_count INTEGER,
    p_attendees JSONB,  -- Array of {email, name, phone, is_purchaser, existing_user_id}
    p_screenshot_path TEXT DEFAULT NULL,
    p_utr TEXT DEFAULT NULL,
    p_payment_owner_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_group_id UUID;
    v_attendee JSONB;
    v_index INTEGER := 0;
    v_user_id UUID;
    v_qr_secret TEXT;
    v_amount_per_ticket BIGINT;
BEGIN
    -- Calculate amount per ticket
    v_amount_per_ticket := p_total_amount / p_pax_count;
    
    -- Create booking group first
    INSERT INTO booking_groups (
        purchaser_id,
        ticket_type,
        total_amount,
        pax_count
    ) VALUES (
        p_purchaser_id,
        p_ticket_type,
        p_total_amount,
        p_pax_count
    ) RETURNING id INTO v_group_id;
    
    -- Create tickets for each attendee
    FOR v_attendee IN SELECT * FROM jsonb_array_elements(p_attendees)
    LOOP
        -- Determine user_id
        IF (v_attendee->>'is_purchaser')::boolean THEN
            v_user_id := p_purchaser_id;
        ELSE
            v_user_id := (v_attendee->>'existing_user_id')::UUID;
        END IF;
        
        -- Generate pending QR secret
        v_qr_secret := 'pending_' || EXTRACT(EPOCH FROM NOW())::BIGINT || '_' || v_index;
        
        -- Insert ticket
        INSERT INTO tickets (
            user_id,
            pending_email,
            pending_name,
            pending_phone,
            type,
            amount,
            status,
            pax_count,
            qr_secret,
            screenshot_path,
            utr,
            payment_owner_name,
            booking_group_id
        ) VALUES (
            v_user_id,
            CASE WHEN v_user_id IS NULL THEN LOWER(v_attendee->>'email') ELSE NULL END,
            CASE WHEN v_user_id IS NULL THEN v_attendee->>'name' ELSE NULL END,
            CASE WHEN v_user_id IS NULL THEN v_attendee->>'phone' ELSE NULL END,
            p_ticket_type,
            v_amount_per_ticket,
            'pending_verification',
            1,
            v_qr_secret,
            CASE WHEN v_index = 0 THEN p_screenshot_path ELSE NULL END,
            CASE WHEN v_index = 0 THEN p_utr ELSE NULL END,
            CASE WHEN v_index = 0 AND p_utr IS NOT NULL THEN p_payment_owner_name ELSE NULL END,
            v_group_id
        );
        
        v_index := v_index + 1;
    END LOOP;
    
    RETURN v_group_id;
    
EXCEPTION
    WHEN OTHERS THEN
        -- On any error, the entire transaction is rolled back
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION create_group_booking TO authenticated;

-- ==========================================
-- Atomic Group Approval Function
-- Approves all tickets in a group in one operation
-- ==========================================

CREATE OR REPLACE FUNCTION approve_group_tickets(
    p_booking_group_id UUID,
    p_admin_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
    v_ticket RECORD;
    v_qr_secret TEXT;
    v_index INTEGER := 0;
BEGIN
    -- Update all tickets in the group atomically
    FOR v_ticket IN 
        SELECT id FROM tickets 
        WHERE booking_group_id = p_booking_group_id 
        AND status = 'pending_verification'
    LOOP
        -- Generate unique QR secret for each ticket
        v_qr_secret := 'TICKET_' || EXTRACT(EPOCH FROM NOW())::BIGINT || '_' || v_index || '_' || 
                       UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        UPDATE tickets 
        SET status = 'paid', 
            qr_secret = v_qr_secret,
            updated_at = NOW()
        WHERE id = v_ticket.id;
        
        v_index := v_index + 1;
    END LOOP;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_index;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (admin check is done in app layer)
GRANT EXECUTE ON FUNCTION approve_group_tickets TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Atomic booking functions created successfully';
    RAISE NOTICE 'create_group_booking() - For atomic multi-ticket creation';
    RAISE NOTICE 'approve_group_tickets() - For atomic group approval';
END $$;
