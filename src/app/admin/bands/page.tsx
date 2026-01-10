'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Users, Ticket, Phone, Search, RefreshCw, Filter, Clock, Check } from 'lucide-react';
import AdminDock from '@/components/AdminDock';
import { toast } from 'sonner';

interface GroupMember {
    id: string;
    name: string;
    email: string;
    isRegistered: boolean;
}

interface PendingBand {
    id: string;
    type: string;
    booking_group_id: string | null;
    user: {
        full_name: string;
        phone: string;
        email: string;
    } | null;
    pending_name: string | null;
    pending_email: string | null;
    pending_phone: string | null;
    groupMembers?: GroupMember[];
    paxCount: number;
    band_issued_at: string | null;
    band_issued_by: string | null;
}

export default function AdminBandsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [allBands, setAllBands] = useState<PendingBand[]>([]);
    const [processing, setProcessing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'issued'>('pending');

    const fetchBands = async () => {
        setLoading(true);

        // Fetch all paid tickets to calculate stats
        const { data: tickets, error } = await supabase
            .from('tickets')
            .select(`
                id,
                type,
                booking_group_id,
                screenshot_path,
                utr,
                pending_name,
                pending_email,
                pending_phone,
                band_issued_at,
                band_issued_by,
                user:profiles!tickets_user_id_fkey(full_name, phone, email)
            `)
            .eq('status', 'paid')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load bands');
            setLoading(false);
            return;
        }

        // Group by booking_group_id - only show one ticket per group (team leader)
        const groupedTickets = new Map<string, PendingBand>();
        const soloTickets: PendingBand[] = [];

        for (const ticket of tickets || []) {
            if (ticket.booking_group_id) {
                if (!groupedTickets.has(ticket.booking_group_id)) {
                    // It's the first ticket of the group we've seen (Team Leader usually)
                    // Note: We need to be careful. The "Team Leader" is just one of the tickets.
                    // For logic simplicity: The first ticket we find with this Group ID represents the group.

                    // Check if *any* ticket in this group is NOT issued? 
                    // Or do we issue bands individually?
                    // The 'issue-band' API issues for the whole group.
                    // So if one is issued, all are likely issued.

                    // Fetch group members names for display
                    const { data: groupTickets } = await supabase
                        .from('tickets')
                        .select(`
                            id,
                            pending_name,
                            pending_email,
                            user_id,
                            user:profiles!tickets_user_id_fkey(full_name, email)
                        `)
                        .eq('booking_group_id', ticket.booking_group_id);

                    const groupMembers: GroupMember[] = (groupTickets || []).map((gt: any) => ({
                        id: gt.id,
                        name: gt.user?.full_name || gt.pending_name || 'Unknown',
                        email: gt.user?.email || gt.pending_email || '',
                        isRegistered: !!gt.user_id
                    }));

                    groupedTickets.set(ticket.booking_group_id, {
                        ...ticket,
                        user: ticket.user as any,
                        groupMembers,
                        paxCount: groupMembers.length
                    });
                }
            } else {
                soloTickets.push({
                    ...ticket,
                    user: ticket.user as any,
                    paxCount: 1
                });
            }
        }

        const combined = [...Array.from(groupedTickets.values()), ...soloTickets];
        // Sort: Pending first, then Issued
        combined.sort((a, b) => {
            if (a.band_issued_at === b.band_issued_at) return 0;
            if (a.band_issued_at === null) return -1;
            return 1;
        });

        setAllBands(combined);
        setLoading(false);
    };

    useEffect(() => {
        fetchBands();
    }, []);

    const handleIssueBand = async (ticket: PendingBand) => {
        if (ticket.band_issued_at) return; // Already issued

        setProcessing(ticket.id);

        try {
            const response = await fetch('/api/admin/issue-band', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: ticket.id,
                    bookingGroupId: ticket.booking_group_id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to issue band');
            }

            toast.success(`✓ Issued ${data.issuedCount} band(s)`);

            // Update local state without refetching for speed
            setAllBands(prev => prev.map(t => {
                if (t.id === ticket.id) {
                    return {
                        ...t,
                        band_issued_at: new Date().toISOString()
                    };
                }
                return t;
            }));

        } catch (error) {
            console.error('Issue band error:', error);
            toast.error('Failed to issue band');
        } finally {
            setProcessing(null);
        }
    };

    // Filter Logic
    const filteredBands = allBands.filter(ticket => {
        // 1. Status Filter
        if (filter === 'pending' && ticket.band_issued_at) return false;
        if (filter === 'issued' && !ticket.band_issued_at) return false;

        // 2. Search Filter
        const name = ticket.user?.full_name || ticket.pending_name || '';
        const phone = ticket.user?.phone || ticket.pending_phone || '';
        const email = ticket.user?.email || ticket.pending_email || '';
        const search = searchTerm.toLowerCase();

        return name.toLowerCase().includes(search) ||
            phone.includes(search) ||
            email.toLowerCase().includes(search);
    });

    // Stats Calculation
    const stats = {
        total: allBands.length,
        pending: allBands.filter(t => !t.band_issued_at).length,
        issued: allBands.filter(t => t.band_issued_at).length,
        totalPax: allBands.reduce((sum, t) => sum + t.paxCount, 0),
        issuedPax: allBands.filter(t => t.band_issued_at).reduce((sum, t) => sum + t.paxCount, 0)
    };

    return (
        <main className="min-h-screen bg-[#050505] relative">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            <AdminDock currentPage="bands" />

            <div className="p-4 lg:p-8 mr-0 md:mr-20 relative z-10">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="font-heading text-4xl text-white mb-2">Band Issuance</h1>
                        <p className="text-white/60">Manage wristband distribution</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1">Total Groups</p>
                            <p className="text-white text-2xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                            <p className="text-amber-300/70 text-xs mb-1">Pending Issuance</p>
                            <p className="text-amber-400 text-2xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <p className="text-green-300/70 text-xs mb-1">Issued Groups</p>
                            <p className="text-green-400 text-2xl font-bold">{stats.issued}</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <p className="text-blue-300/70 text-xs mb-1">Issued Pax</p>
                            <p className="text-blue-400 text-2xl font-bold">{stats.issuedPax}<span className="text-xs opacity-50 ml-1">/ {stats.totalPax}</span></p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-2">
                            {(['pending', 'issued', 'all'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === status
                                        ? 'bg-[#a855f7] text-white'
                                        : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                        }`}
                                >
                                    {status === 'pending' ? 'Ready to Issue' : status}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search name/phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a855f7]/50"
                                />
                            </div>
                            <button
                                onClick={fetchBands}
                                className="px-4 py-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                        </div>
                    ) : filteredBands.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/40">
                            <Search className="w-12 h-12 mb-3 opacity-50" />
                            <p>No bands found matching criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredBands.map((ticket) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`backdrop-blur-sm border rounded-xl p-5 transition-all ${ticket.band_issued_at
                                            ? 'bg-green-500/5 border-green-500/20'
                                            : 'bg-[#0a0a0a]/90 border-white/10 hover:border-[#a855f7]/30'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">
                                                {ticket.user?.full_name || ticket.pending_name || 'Unknown'}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/50 text-sm mt-1">
                                                <Phone className="w-3 h-3" />
                                                {ticket.user?.phone || ticket.pending_phone || 'No phone'}
                                            </div>
                                        </div>
                                        {ticket.band_issued_at ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg uppercase">
                                                <Check className="w-3 h-3" /> Issued
                                            </div>
                                        ) : (
                                            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${ticket.type === 'quad' ? 'bg-purple-500/20 text-purple-400' :
                                                ticket.type === 'duo' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-white/10 text-white/70'
                                                }`}>
                                                {ticket.type}
                                            </div>
                                        )}
                                    </div>

                                    {/* Group Members Preview */}
                                    {ticket.groupMembers && ticket.groupMembers.length > 1 && (
                                        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-4 h-4 text-purple-400" />
                                                <span className="text-white/70 text-sm font-medium">
                                                    Group ({ticket.groupMembers.length} members)
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {ticket.groupMembers.slice(0, 4).map((member, i) => (
                                                    <span
                                                        key={member.id}
                                                        className={`px-2 py-0.5 rounded text-xs ${member.isRegistered
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            }`}
                                                    >
                                                        {member.name.split(' ')[0]}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Issue Button or Issued Timestamp */}
                                    {ticket.band_issued_at ? (
                                        <div className="w-full py-3 rounded-xl bg-white/5 text-white/40 font-medium flex items-center justify-center gap-2 text-sm cursor-default">
                                            <Clock className="w-4 h-4" />
                                            Issued at {new Date(ticket.band_issued_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleIssueBand(ticket)}
                                            disabled={processing === ticket.id}
                                            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {processing === ticket.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Ticket className="w-5 h-5" />
                                                    Issue {ticket.paxCount > 1 ? `${ticket.paxCount} Bands` : 'Band'}
                                                </>
                                            )}
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
