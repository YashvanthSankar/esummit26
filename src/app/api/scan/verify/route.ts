import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

        // Step 1: Verify admin (with caching)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { success: false, status: 'ERROR', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check admin cache
        const cached = adminCache.get(user.id);
        let adminName = 'Admin';

        if (cached && cached.expires > Date.now()) {
            if (!cached.isAdmin) {
                return NextResponse.json(
                    { success: false, status: 'ERROR', message: 'Admin required' },
                    { status: 403 }
                );
            }
            adminName = cached.name;
        } else {
            const { data: adminProfile } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', user.id)
                .single();

            const isAdmin = adminProfile?.role === 'admin';
            adminCache.set(user.id, {
                isAdmin,
                name: adminProfile?.full_name || 'Admin',
                expires: Date.now() + 5 * 60 * 1000 // 5 minutes
            });

            if (!isAdmin) {
                return NextResponse.json(
                    { success: false, status: 'ERROR', message: 'Admin required' },
                    { status: 403 }
                );
            }
            adminName = adminProfile?.full_name || 'Admin';
        }

        // Step 2: Single query to get ticket with holder info
        const { data: ticket, error: ticketError } = await supabase
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

        if (ticketError || !ticket) {
            return NextResponse.json({
                success: false,
                status: 'INVALID',
                message: 'Invalid QR code',
                ms: Date.now() - startTime
            });
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

