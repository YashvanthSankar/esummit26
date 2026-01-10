'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AdminDock from '@/components/AdminDock';
import { Loader2, DollarSign, Ticket, Clock, CheckCircle, BarChart3, Users, TrendingUp } from 'lucide-react';

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

            // Fetch all tickets
            const { data: tickets } = await supabase
                .from('tickets')
                .select('id, amount, type, status, created_at, booking_group_id, screenshot_path, utr, user:profiles(full_name), pending_name, pending_email');

            if (tickets) {
                // Calculate Stats
                const paidTickets = tickets.filter(t => t.status === 'paid');
                const pendingTickets = tickets.filter(t => t.status === 'pending_verification');

                const revenue = paidTickets.reduce((sum, t) => sum + t.amount, 0);

                // Count pending payment requests (unique booking groups + solo tickets with payment proof)
                const pendingWithProof = pendingTickets.filter(t => t.screenshot_path || t.utr);
                const pendingBookingGroups = new Set(pendingWithProof.map(t => t.booking_group_id || t.id));

                setStats({
                    revenue,
                    ticketsSold: paidTickets.length,
                    pending: pendingBookingGroups.size,
                });

                // Prepare Chart Data
                const types = { solo: 0, duo: 0, quad: 0 };
                paidTickets.forEach(t => {
                    if (t.type in types) types[t.type as keyof typeof types]++;
                });

                setChartData([
                    { name: 'Solo', count: types.solo, color: '#a855f7' },
                    { name: 'Duo', count: types.duo, color: '#3b82f6' },
                    { name: 'Quad', count: types.quad, color: '#10b981' },
                ]);

                // Recent Activity (Last 5 Paid)
                setRecentActivity(
                    paidTickets
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 5)
                );
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
