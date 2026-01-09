import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('event_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

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
            .select('role')
            .eq('id', user.id)
            .single();

        if (adminProfile?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Build query
        let query = supabase
            .from('event_logs')
            .select(`
                id,
                event_name,
                event_id,
                scanned_at,
                ticket:tickets(
                    type,
                    user:profiles(full_name, email)
                ),
                scanned_by_profile:profiles!event_logs_scanned_by_fkey(full_name)
            `)
            .order('scanned_at', { ascending: false });

        // Apply filters
        if (eventId) {
            query = query.eq('event_id', eventId);
        }

        if (startDate) {
            query = query.gte('scanned_at', startDate);
        }

        if (endDate) {
            query = query.lte('scanned_at', endDate);
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await supabase
            .from('event_logs')
            .select('*', { count: 'exact', head: false })
            .order('scanned_at', { ascending: false });

        if (error) {
            console.error('[API] Scan history error:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        const { data: logs } = await query;

        return NextResponse.json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error: any) {
        console.error('[API] Scan history error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
