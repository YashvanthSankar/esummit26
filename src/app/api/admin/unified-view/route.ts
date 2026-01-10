import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Cache for 5 minutes (300 seconds)
export const revalidate = 300;
export const dynamic = 'force-dynamic';

interface UnifiedRecord {
    id: string;
    user_name: string;
    user_email: string;
    category: 'Ticket' | 'Merchandise' | 'Accommodation';
    type: string;
    status: string;
    fulfillment_status: string;
    amount: number;
    created_at: string;
    phone_number: string;
}

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

        // OPTIMIZATION: Use server-side SQL function for high performance
        // This replaces multiple queries + N+1 profile lookups with a single optimized query

        console.time('unified-view-rpc');

        const { data: unifiedData, error: rpcError } = await supabase
            .rpc('get_unified_admin_view');

        console.timeEnd('unified-view-rpc');

        if (rpcError) {
            console.error('RPC Error:', rpcError);
            throw rpcError;
        }

        const response = NextResponse.json({
            data: unifiedData || [],
            success: true,
            cached_at: new Date().toISOString(),
            count: unifiedData?.length || 0
        });

        // Set cache headers: cache for 30 seconds (fresh enough for admin)
        response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');

        return response;

    } catch (error) {
        console.error('Error fetching unified data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch unified data' },
            { status: 500 }
        );
    }
}
