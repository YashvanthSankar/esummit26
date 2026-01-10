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

        // Fetch tickets
        const { data: tickets, error: ticketsError } = await supabase
            .from('tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (ticketsError) throw ticketsError;

        // Fetch merch orders
        const { data: merchOrders, error: merchError } = await supabase
            .from('merch_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (merchError) throw merchError;

        // Fetch accommodation requests
        const { data: accommodations, error: accomError } = await supabase
            .from('accommodation_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (accomError) throw accomError;

        // Transform and merge data
        const unifiedData: UnifiedRecord[] = [];

        // Process tickets (need to join with profiles for user details)
        if (tickets) {
            for (const ticket of tickets) {
                // Fetch profile for user details
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, email, phone')
                    .eq('id', ticket.user_id)
                    .single();

                unifiedData.push({
                    id: `ticket-${ticket.id}`,
                    user_name: profile?.full_name || 'N/A',
                    user_email: profile?.email || 'N/A',
                    category: 'Ticket',
                    type: ticket.type?.toUpperCase() || 'N/A',
                    status: ticket.status === 'paid' ? 'Paid' : 
                            ticket.status === 'pending_verification' ? 'Pending Verification' : 'Pending',
                    fulfillment_status: ticket.status === 'paid' ? 'Issued' : 'Not Issued',
                    amount: ticket.amount || 0,
                    created_at: ticket.created_at,
                    phone_number: profile?.phone || 'N/A'
                });
            }
        }

        // Process merch orders
        if (merchOrders) {
            merchOrders.forEach(order => {
                unifiedData.push({
                    id: `merch-${order.id}`,
                    user_name: order.name || 'N/A',
                    user_email: order.email || 'N/A',
                    category: 'Merchandise',
                    type: order.bundle_type?.toUpperCase() || 'N/A',
                    status: order.payment_status === 'paid' ? 'Paid' : 
                            order.payment_status === 'pending_verification' ? 'Pending Verification' : 'Pending',
                    fulfillment_status: order.status === 'delivered' ? 'Delivered' : 
                                       order.status === 'confirmed' ? 'Confirmed' : 'Not Issued',
                    amount: order.amount || 0,
                    created_at: order.created_at,
                    phone_number: order.phone_number || 'N/A'
                });
            });
        }

        // Process accommodation requests
        if (accommodations) {
            accommodations.forEach(accom => {
                unifiedData.push({
                    id: `accom-${accom.id}`,
                    user_name: accom.name || 'N/A',
                    user_email: accom.email || 'N/A',
                    category: 'Accommodation',
                    type: `${accom.gender?.toUpperCase()} - ${accom.date_of_arrival} to ${accom.date_of_departure}` || 'N/A',
                    status: accom.payment_status === 'paid' ? 'Paid' : 
                            accom.payment_status === 'pending_verification' ? 'Pending Verification' : 'Pending',
                    fulfillment_status: accom.status === 'approved' ? 'Approved' : 
                                       accom.status === 'rejected' ? 'Rejected' : 'Pending',
                    amount: accom.payment_amount || 500,
                    created_at: accom.created_at,
                    phone_number: accom.phone_number || 'N/A'
                });
            });
        }

        // Sort by created_at descending
        unifiedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const response = NextResponse.json({ 
            data: unifiedData, 
            success: true,
            cached_at: new Date().toISOString()
        });
        
        // Set cache headers: cache for 5 minutes, revalidate in background
        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        
        return response;

    } catch (error) {
        console.error('Error fetching unified data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch unified data' },
            { status: 500 }
        );
    }
}
