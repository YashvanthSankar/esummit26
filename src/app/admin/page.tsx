'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AdminDock from '@/components/AdminDock';
import { Loader2, DollarSign, Ticket, Clock, Star, CheckCircle } from 'lucide-react';

export default function AdminOverview() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        ticketsSold: 0,
        pending: 0,
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            // Explicit Admin Check
            const { data: profile, error } = await supabase.from('profiles').select('email, role').eq('id', user.id).single();

            console.log('[AdminPage] Role Check:', {
                email: profile?.email,
                role: profile?.role,
                error: error?.message,
                user_id: user.id
            });

            if (profile?.role !== 'admin') {
                console.warn('[AdminPage] Access Denied: User is not admin. Redirecting...');
                window.location.href = '/dashboard';
                return;
            }

            // OPTIMIZATION: Use database aggregations instead of fetching all tickets
            // Old: Fetched 500+ tickets (~50KB payload)
            // New: Fetch only aggregated stats (~1KB payload)

            // Parallel queries for better performance
            const [statsResult, chartResult, recentActivityResult, ratingsResult] = await Promise.all([
                // Stats aggregation
                supabase.rpc('get_ticket_stats'),

                // Chart data aggregation  
                supabase.rpc('get_ticket_type_distribution'),

                // Recent activity (only 5 latest)
                supabase
                    .from('tickets')
                    .select('id, type, amount, created_at, user:profiles!tickets_user_id_fkey(full_name), pending_name')
                    .eq('status', 'paid')
                    .order('created_at', { ascending: false })
                    .limit(5),

                // Ratings
                supabase.from('app_ratings').select('rating')
            ]);

            // Fallback if RPC functions don't exist yet - use manual queries
            if (statsResult.error?.code === '42883') { // Function does not exist
                console.log('[AdminPage] Using fallback stats calculation');

                // Fetch minimal data for stats
                const { data: paidTickets } = await supabase
                    .from('tickets')
                    .select('id, amount')
                    .eq('status', 'paid');

                const { data: pendingTickets } = await supabase
                    .from('tickets')
                    .select('id, booking_group_id, screenshot_path, utr')
                    .eq('status', 'pending_verification')
                    .or('screenshot_path.not.is.null,utr.not.is.null');

                const revenue = paidTickets?.reduce((sum, t) => sum + t.amount, 0) || 0;
                const pendingBookingGroups = new Set(pendingTickets?.map(t => t.booking_group_id || t.id));

                setStats({
                    revenue,
                    ticketsSold: paidTickets?.length || 0,
                    pending: pendingBookingGroups.size,
                });

                // Chart data fallback
                const { data: typeData } = await supabase
                    .from('tickets')
                    .select('type')
                    .eq('status', 'paid');

                const types = { solo: 0, duo: 0, quad: 0 };
                typeData?.forEach(t => {
                    if (t.type in types) types[t.type as keyof typeof types]++;
                });

                setChartData([
                    { name: 'Solo', count: types.solo, color: '#a855f7' },
                    { name: 'Duo', count: types.duo, color: '#3b82f6' },
                    { name: 'Quad', count: types.quad, color: '#10b981' },
                ]);
            } else {
                // Use RPC results
                if (statsResult.data) {
                    setStats(statsResult.data[0] || { revenue: 0, ticketsSold: 0, pending: 0 });
                }

                if (chartResult.data) {
                    const types = chartResult.data.reduce((acc: any, row: any) => {
                        acc[row.type] = row.count;
                        return acc;
                    }, { solo: 0, duo: 0, quad: 0 });

                    setChartData([
                        { name: 'Solo', count: types.solo || 0, color: '#a855f7' },
                        { name: 'Duo', count: types.duo || 0, color: '#3b82f6' },
                        { name: 'Quad', count: types.quad || 0, color: '#10b981' },
                    ]);
                }
            }

            // Recent activity (always works)
            if (recentActivityResult.data) {
                setRecentActivity(recentActivityResult.data);
            }

            // Ratings
            if (ratingsResult.error) {
                console.warn('[AdminPage] Ratings query failed (table may not exist yet):', ratingsResult.error);
            } else if (ratingsResult.data && ratingsResult.data.length > 0) {
                const totalRating = ratingsResult.data.reduce((sum: number, r: any) => sum + r.rating, 0);
                setRatingStats({
                    average: Math.round((totalRating / ratingsResult.data.length) * 10) / 10,
                    count: ratingsResult.data.length
                });
            }

            setLoading(false);
        };

        fetchData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Admin Dock */}
            <AdminDock currentPage="dashboard" />

            <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="font-heading text-3xl sm:text-4xl text-white mb-8">Dashboard Overview</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-[#10b981]">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-lg bg-[#10b981]/10 text-[#10b981]">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="text-white/50 text-sm font-bold uppercase">Total Revenue</span>
                        </div>
                        <p className="font-heading text-3xl text-white">₹{stats.revenue.toLocaleString()}</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border-l-4 border-[#a855f7]">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-lg bg-[#a855f7]/10 text-[#a855f7]">
                                <Ticket className="w-6 h-6" />
                            </div>
                            <span className="text-white/50 text-sm font-bold uppercase">Tickets Sold</span>
                        </div>
                        <p className="font-heading text-3xl text-white">{stats.ticketsSold}</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border-l-4 border-[#f59e0b]">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b]">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-white/50 text-sm font-bold uppercase">Pending Verification</span>
                        </div>
                        <p className="font-heading text-3xl text-white">{stats.pending}</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border-l-4 border-[#ec4899]">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-lg bg-[#ec4899]/10 text-[#ec4899]">
                                <Star className="w-6 h-6" />
                            </div>
                            <span className="text-white/50 text-sm font-bold uppercase">App Rating</span>
                        </div>
                        <p className="font-heading text-3xl text-white">
                            {ratingStats.count > 0 ? `${ratingStats.average}/5.0` : 'No ratings'}
                        </p>
                        {ratingStats.count > 0 && (
                            <p className="text-white/40 text-xs mt-1">Based on {ratingStats.count} review{ratingStats.count !== 1 ? 's' : ''}</p>
                        )}
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Sales Chart */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-heading text-xl text-white mb-6">Ticket Sales by Type</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#ffffff50"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#ffffff50"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff10' }}
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            borderRadius: '12px',
                                            border: '1px solid #ffffff20',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-heading text-xl text-white mb-6">Recent Approvals</h3>
                        <div className="space-y-4">
                            {recentActivity.length === 0 ? (
                                <p className="text-white/30 text-center py-8">No approved tickets yet.</p>
                            ) : (
                                recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <div>
                                                <p className="text-white font-medium text-sm">{activity.user?.full_name || 'User'}</p>
                                                <p className="text-white/40 text-xs">Purchased {activity.type} pass</p>
                                            </div>
                                        </div>
                                        <span className="text-white/30 text-xs font-mono">
                                            {new Date(activity.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
