import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // Verify admin
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

    // Parse request
    const { ticketId, bookingGroupId } = await request.json();

    if (!ticketId && !bookingGroupId) {
        return NextResponse.json({ error: 'ticketId or bookingGroupId required' }, { status: 400 });
    }

    try {
        const now = new Date().toISOString();
        let issuedCount = 0;

        if (bookingGroupId) {
            // Issue bands to all tickets in the booking group
            const { data, error } = await supabase
                .from('tickets')
                .update({
                    band_issued_at: now,
                    band_issued_by: user.id
                })
                .eq('booking_group_id', bookingGroupId)
                .eq('status', 'paid')
                .is('band_issued_at', null)
                .select('id');

            if (error) throw error;
            issuedCount = data?.length || 0;

        } else {
            // Single ticket - check if part of a group
            const { data: ticket, error: fetchError } = await supabase
                .from('tickets')
                .select('id, booking_group_id, status, band_issued_at')
                .eq('id', ticketId)
                .single();

            if (fetchError) throw fetchError;

            if (!ticket) {
                return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
            }

            if (ticket.status !== 'paid') {
                return NextResponse.json({ error: 'Ticket not paid' }, { status: 400 });
            }

            if (ticket.band_issued_at) {
                return NextResponse.json({ error: 'Band already issued' }, { status: 400 });
            }

            if (ticket.booking_group_id) {
                // Issue to entire group
                const { data, error } = await supabase
                    .from('tickets')
                    .update({
                        band_issued_at: now,
                        band_issued_by: user.id
                    })
                    .eq('booking_group_id', ticket.booking_group_id)
                    .is('band_issued_at', null)
                    .select('id');

                if (error) throw error;
                issuedCount = data?.length || 0;
            } else {
                // Solo ticket
                const { error } = await supabase
                    .from('tickets')
                    .update({
                        band_issued_at: now,
                        band_issued_by: user.id
                    })
                    .eq('id', ticketId);

                if (error) throw error;
                issuedCount = 1;
            }
        }

        return NextResponse.json({
            success: true,
            issuedCount,
            issuedAt: now
        });

    } catch (error) {
        console.error('Band issuance error:', error);
        return NextResponse.json({ error: 'Failed to issue band' }, { status: 500 });
    }
}
