import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { qrSecret, eventId } = await request.json();

        if (!qrSecret || !eventId) {
            return NextResponse.json(
                { success: false, error: 'Missing qrSecret or eventId' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Verify admin user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { data: adminProfile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

        if (adminProfile?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Step A: Find ticket by QR secret
        const { data: ticket, error: ticketError } = await supabase
            .from('tickets')
            .select('id, type, status, pax_count, user_id')
            .eq('qr_secret', qrSecret)
            .single();

        if (ticketError || !ticket) {
            return NextResponse.json({
                success: false,
                status: 'INVALID',
                message: 'Invalid ticket - QR code not found',
            });
        }

        // Step B: Check ticket status
        if (ticket.status !== 'paid') {
            return NextResponse.json({
                success: false,
                status: 'INVALID',
                message: `Ticket not valid - Status: ${ticket.status}`,
            });
        }

        // Step B.1: Fetch Event Details (Name is required for logs)
        const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('name')
            .eq('id', eventId)
            .single();

        if (eventError || !eventData) {
            return NextResponse.json({
                success: false,
                error: 'Invalid Event ID'
            }, { status: 400 });
        }

        // Step C: Check for duplicate scan
        // We check using event_id because that's stricter for this specific scan type
        const { data: existingLog } = await supabase
            .from('event_logs')
            .select(`
                id,
                scanned_at,
                scanned_by,
                profiles!event_logs_scanned_by_fkey(full_name)
            `)
            .eq('ticket_id', ticket.id)
            .eq('event_id', eventId)
            .single();

        if (existingLog) {
            const scannedAt = new Date(existingLog.scanned_at).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: 'short',
            });

            return NextResponse.json({
                success: false,
                status: 'DUPLICATE',
                message: 'Already scanned for this event',
                scannedAt,
                scannedBy: (existingLog.profiles as any)?.full_name || 'Unknown',
            });
        }

        // All checks passed - Insert event log
        const { error: insertError } = await supabase
            .from('event_logs')
            .insert({
                ticket_id: ticket.id,
                event_id: eventId,
                event_name: eventData.name, // Required field
                scanned_by: user.id,
            });

        if (insertError) {
            // Could be a race condition duplicate (UNIQUE constraint on ticket_id + event_name)
            if (insertError.code === '23505') {
                return NextResponse.json({
                    success: false,
                    status: 'DUPLICATE',
                    message: 'Already scanned (concurrent scan detected)',
                });
            }

            console.error('Insert error:', insertError);
            return NextResponse.json(
                { success: false, error: 'Failed to log scan' },
                { status: 500 }
            );
        }

        // Get ticket holder name
        const { data: ticketHolder } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', ticket.user_id)
            .single();

        return NextResponse.json({
            success: true,
            status: 'SUCCESS',
            message: 'Access granted',
            ticketType: ticket.type,
            paxCount: ticket.pax_count,
            holderName: ticketHolder?.full_name || 'Unknown',
        });

    } catch (error) {
        console.error('Scan verification error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
