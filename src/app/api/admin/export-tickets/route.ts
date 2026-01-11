import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Enhanced Ticket Export API
 * Returns all ticket data with full band management fields for offline use.
 * Designed for Excel compatibility and offline band issuance tracking.
 */
export async function GET() {
    try {
        const supabase = await createClient();

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all tickets with full details for export
        const { data: tickets, error: ticketsError } = await supabase
            .from('tickets')
            .select(`
                id,
                type,
                amount,
                status,
                pax_count,
                booking_group_id,
                band_issued_at,
                band_issued_by,
                screenshot_path,
                utr,
                pending_name,
                pending_email,
                pending_phone,
                created_at,
                user:profiles!tickets_user_id_fkey(id, full_name, email, phone, college_name)
            `)
            .order('created_at', { ascending: false });

        if (ticketsError) {
            console.error('Tickets fetch error:', ticketsError);
            throw ticketsError;
        }

        // Group bookings to determine group leaders
        const bookingGroupLeaders = new Map<string, string>();

        // First pass: identify group leaders (first ticket in each group with screenshot/utr)
        for (const ticket of tickets || []) {
            if (ticket.booking_group_id && !bookingGroupLeaders.has(ticket.booking_group_id)) {
                // The ticket with screenshot_path or utr is usually the leader
                if (ticket.screenshot_path || ticket.utr) {
                    bookingGroupLeaders.set(ticket.booking_group_id, ticket.id);
                }
            }
        }

        // Second pass: if no leader found by screenshot, use first occurrence
        for (const ticket of tickets || []) {
            if (ticket.booking_group_id && !bookingGroupLeaders.has(ticket.booking_group_id)) {
                bookingGroupLeaders.set(ticket.booking_group_id, ticket.id);
            }
        }

        // Count group sizes
        const groupSizes = new Map<string, number>();
        for (const ticket of tickets || []) {
            if (ticket.booking_group_id) {
                groupSizes.set(
                    ticket.booking_group_id,
                    (groupSizes.get(ticket.booking_group_id) || 0) + 1
                );
            }
        }

        // Transform tickets for export
        const exportData = (tickets || []).map(ticket => {
            const user = ticket.user as any;
            const isGroupLeader = ticket.booking_group_id
                ? bookingGroupLeaders.get(ticket.booking_group_id) === ticket.id
                : false;

            // Calculate actual pax count from group size
            const actualPaxCount = ticket.booking_group_id
                ? groupSizes.get(ticket.booking_group_id) || 1
                : 1;

            return {
                ticket_id: ticket.id,
                user_name: user?.full_name || ticket.pending_name || 'Not Registered',
                user_email: user?.email || ticket.pending_email || 'N/A',
                user_phone: user?.phone || ticket.pending_phone || 'N/A',
                college: user?.college_name || 'N/A',
                ticket_type: ticket.type,
                amount: ticket.amount,
                payment_status: ticket.status,
                pax_count: actualPaxCount,
                group_id: ticket.booking_group_id || '-',
                group_leader: ticket.booking_group_id ? (isGroupLeader ? 'Yes' : 'No') : '-',
                band_status: ticket.band_issued_at ? 'Issued' : (ticket.status === 'paid' ? 'Pending' : 'N/A'),
                band_issued_at: ticket.band_issued_at || '-',
                utr: ticket.utr || '-',
                created_at: ticket.created_at
            };
        });

        return NextResponse.json({
            success: true,
            data: exportData,
            count: exportData.length,
            exported_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error exporting tickets:', error);
        return NextResponse.json(
            { error: 'Failed to export tickets' },
            { status: 500 }
        );
    }
}
