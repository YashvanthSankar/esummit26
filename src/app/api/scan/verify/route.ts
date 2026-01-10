import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CacheKeys, getCached, setCached } from '@/lib/redis';

// Cache admin check for 5 minutes to reduce DB calls
const adminCache = new Map<string, { isAdmin: boolean; name: string; expires: number }>();

export async function POST(request: Request) {
    const startTime = Date.now();

    try {
        const { qrSecret, eventId, eventName } = await request.json();

        if (!qrSecret || !eventId) {
            return NextResponse.json(
                { success: false, status: 'ERROR', message: 'Missing data' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Step 1: Verify admin (KV Cache First)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { success: false, status: 'ERROR', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check KV for admin status
        const adminKey = CacheKeys.ADMIN(user.id);
        let isAdmin = await getCached<boolean>(adminKey);
        let adminName = 'Admin'; // We can cache name too if needed, but keeping it simple

        if (isAdmin === null) {
            // Cache Miss - Hit DB
            const { data: adminProfile } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', user.id)
                .single();

            isAdmin = adminProfile?.role === 'admin';
            adminName = adminProfile?.full_name || 'Admin';

            // Cache result for 1 hour
            await setCached(adminKey, isAdmin, 3600);
        }

        if (!isAdmin) {
            return NextResponse.json(
                { success: false, status: 'ERROR', message: 'Admin required' },
                { status: 403 }
            );
        }

        // Step 2: Get Ticket (KV Cache First)
        const ticketKey = CacheKeys.TICKET_QR(qrSecret);
        let ticket: any = await getCached(ticketKey);

        if (!ticket) {
            // Cache Miss - Hit DB
            const { data: dbTicket, error: ticketError } = await supabase
                .from('tickets')
                .select(`
                    id, 
                    type, 
                    status, 
                    pax_count, 
                    user:profiles!tickets_user_id_fkey(full_name)
                `)
                .eq('qr_secret', qrSecret)
                .single();

            if (ticketError || !dbTicket) {
                return NextResponse.json({
                    success: false,
                    status: 'INVALID',
                    message: 'Invalid QR code',
                    ms: Date.now() - startTime
                });
            }

            ticket = dbTicket;
            // Cache for 5 mins (clears if status changes via webhook usually, but 5m is safe)
            await setCached(ticketKey, ticket, 300);
        }

        if (ticket.status !== 'paid') {
            return NextResponse.json({
                success: false,
                status: 'INVALID',
                message: `Status: ${ticket.status}`,
                ms: Date.now() - startTime
            });
        }

        // Step 3: Check duplicate and insert in one operation using upsert-like logic
        // Try to insert first - if constraint violation, it's a duplicate
        const resolvedEventName = eventName || 'Event';

        const { error: insertError } = await supabase
            .from('event_logs')
            .insert({
                ticket_id: ticket.id,
                event_id: eventId,
                event_name: resolvedEventName,
                scanned_by: user.id,
            });

        if (insertError) {
            // Unique constraint violation = already scanned
            if (insertError.code === '23505') {
                // Fetch existing log details for better UX
                const { data: existingLog } = await supabase
                    .from('event_logs')
                    .select('scanned_at')
                    .eq('ticket_id', ticket.id)
                    .eq('event_id', eventId)
                    .single();

                const scannedAt = existingLog ? new Date(existingLog.scanned_at).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                }) : 'Earlier';

                return NextResponse.json({
                    success: false,
                    status: 'DUPLICATE',
                    message: `Already scanned at ${scannedAt}`,
                    ms: Date.now() - startTime
                });
            }

            console.error('Insert error:', insertError);
            return NextResponse.json(
                { success: false, status: 'ERROR', message: 'Log failed' },
                { status: 500 }
            );
        }

        // Success!
        const holderName = (ticket.user as any)?.full_name || 'Guest';

        return NextResponse.json({
            success: true,
            status: 'SUCCESS',
            message: 'Access granted',
            ticketType: ticket.type,
            paxCount: ticket.pax_count,
            holderName,
            ms: Date.now() - startTime
        });

    } catch (error) {
        console.error('Scan error:', error);
        return NextResponse.json(
            { success: false, status: 'ERROR', message: 'Server error' },
            { status: 500 }
        );
    }
}

