'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, RefreshCw, ZoomIn, Copy, Search, Filter, Clock } from 'lucide-react';
import { toast } from 'sonner';
import AdminDock from '@/components/AdminDock';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface GroupMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    isRegistered: boolean;
}

interface PaymentTicket {
    id: string;
    type: string;
    amount: number;
    screenshot_path: string;
    utr: string;
    payment_owner_name?: string | null;
    created_at: string;
    booking_group_id: string | null;
    pending_name: string | null;
    pending_email: string | null;
    pending_phone: string | null;
    status: 'paid' | 'pending_verification' | 'rejected' | 'pending';
    groupMembers?: GroupMember[];
    user: {
        full_name: string;
        email: string;
        phone: string;
        college_name: string;
    } | null;
}

export default function VerifyPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [allTickets, setAllTickets] = useState<PaymentTicket[]>([]);
    const [processing, setProcessing] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

    const fetchTickets = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('tickets')
            .select(`
                *,
                user:profiles!tickets_user_id_fkey(full_name, email, phone, college_name)
            `)
            .or('screenshot_path.not.is.null,utr.not.is.null') // Only tickets with pass attempts
            .order('created_at', { ascending: false }); // Newest first

        if (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load passes');
            setLoading(false);
            return;
        }

        if (data) {
            // Group logic (keep existing group logic)
            const ticketsWithGroupMembers = await Promise.all(
                data.map(async (ticket: any) => {
                    if (ticket.booking_group_id) {
                        const { data: groupTickets } = await supabase
                            .from('tickets')
                            .select(`
                                id,
                                pending_name,
                                pending_email,
                                pending_phone,
                                user_id,
                                user:profiles!tickets_user_id_fkey(full_name, email, phone)
                            `)
                            .eq('booking_group_id', ticket.booking_group_id);

                        const groupMembers: GroupMember[] = (groupTickets || []).map((gt: any) => ({
                            id: gt.id,
                            name: gt.user?.full_name || gt.pending_name || 'Unknown',
                            email: gt.user?.email || gt.pending_email || '',
                            phone: gt.user?.phone || gt.pending_phone || '',
                            isRegistered: !!gt.user_id
                        }));

                        return { ...ticket, groupMembers };
                    }
                    return ticket;
                })
            );

            setAllTickets(ticketsWithGroupMembers as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleVerify = async (ticketId: string, action: 'approve' | 'reject') => {
        setProcessing(ticketId);

        try {
            const currentTicket = allTickets.find(t => t.id === ticketId);
            if (!currentTicket) throw new Error('Ticket not found');

            if (action === 'approve') {
                if (currentTicket.booking_group_id) {
                    // Approve Group
                    const { data: groupTickets } = await supabase
                        .from('tickets')
                        .select('id, user:profiles(email, full_name), pending_email, pending_name')
                        .eq('booking_group_id', currentTicket.booking_group_id);

                    if (!groupTickets) throw new Error('Group not found');

                    for (let i = 0; i < groupTickets.length; i++) {
                        const ticket = groupTickets[i];
                        const secret = `TICKET_${Date.now()}_${i}_${Math.random().toString(36).substring(7).toUpperCase()}`;

                        await supabase
                            .from('tickets')
                            .update({ status: 'paid', qr_secret: secret })
                            .eq('id', ticket.id);

                        // Email logic (fire and forget)
                        const email = (ticket.user as any)?.email || ticket.pending_email;
                        const name = (ticket.user as any)?.full_name || ticket.pending_name || 'User';
                        if (email) sendApprovalEmail(email, name, currentTicket.type, currentTicket.amount);
                    }
                    toast.success(`Approved Group (${groupTickets.length} tickets)`);
                } else {
                    // Approve Single
                    const secret = `TICKET_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;
                    await supabase.from('tickets').update({ status: 'paid', qr_secret: secret }).eq('id', ticketId);

                    const user = currentTicket.user;
                    if (user?.email) sendApprovalEmail(user.email, user.full_name, currentTicket.type, currentTicket.amount);
                    toast.success('Ticket Approved');
                }
            } else {
                // Reject logic
                if (currentTicket.booking_group_id) {
                    await supabase.from('tickets').update({ status: 'rejected' }).eq('booking_group_id', currentTicket.booking_group_id);
                } else {
                    await supabase.from('tickets').update({ status: 'rejected' }).eq('id', ticketId);
                }

                const user = currentTicket.user;
                if (user?.email) sendRejectionEmail(user.email, user.full_name, currentTicket.type, currentTicket.amount);
                toast.success('Ticket Rejected');
            }

            // Update local state without refetch
            setAllTickets(prev => prev.map(t => {
                if (t.id === ticketId || (t.booking_group_id && t.booking_group_id === currentTicket.booking_group_id)) {
                    return { ...t, status: action === 'approve' ? 'paid' : 'rejected' };
                }
                return t;
            }));

        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Action failed');
        } finally {
            setProcessing(null);
        }
    };

    const sendApprovalEmail = async (to: string, userName: string, ticketType: string, amount: number) => {
        try {
            await fetch('/api/email/send-approval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, userName, ticketType, amount }),
            });
        } catch (e) { console.error('Email failed', e); }
    };

    const sendRejectionEmail = async (to: string, userName: string, ticketType: string, amount: number) => {
        try {
            await fetch('/api/email/send-rejection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, userName, ticketType, amount }),
            });
        } catch (e) { console.error('Email failed', e); }
    };

    const getImageUrl = (path: string) => {
        const { data } = supabase.storage.from('payment-proofs').getPublicUrl(path);
        return data.publicUrl;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied!');
    };

    // Filter Logic
    const filteredTickets = allTickets.filter(ticket => {
        // 1. Status Filter
        if (filter === 'pending' && ticket.status !== 'pending_verification') return false;
        if (filter === 'approved' && ticket.status !== 'paid') return false;
        if (filter === 'rejected' && ticket.status !== 'rejected') return false;

        // 2. Search Filter
        const search = searchTerm.toLowerCase();
        const name = ticket.user?.full_name || ticket.pending_name || '';
        const email = ticket.user?.email || ticket.pending_email || '';
        const phone = ticket.user?.phone || ticket.pending_phone || '';
        const utr = ticket.utr || '';

        return name.toLowerCase().includes(search) ||
            email.toLowerCase().includes(search) ||
            phone.includes(search) ||
            utr.toLowerCase().includes(search);
    });

    const stats = {
        total: allTickets.length,
        pending: allTickets.filter(t => t.status === 'pending_verification').length,
        approved: allTickets.filter(t => t.status === 'paid').length,
        rejected: allTickets.filter(t => t.status === 'rejected').length,
        totalRevenue: allTickets.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0)
    };

    return (
        <main className="min-h-screen bg-[#050505] relative">
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            <AdminDock currentPage="verify" />

            <div className="p-4 lg:p-8 mr-0 md:mr-20 relative z-10">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="font-heading text-4xl text-white mb-2">Pass Verification</h1>
                        <p className="text-white/60">Review proofs and manage access</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1">Total Submissions</p>
                            <p className="text-white text-2xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                            <p className="text-amber-300/70 text-xs mb-1">Pending Review</p>
                            <p className="text-amber-400 text-2xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <p className="text-green-300/70 text-xs mb-1">Approved</p>
                            <p className="text-green-400 text-2xl font-bold">{stats.approved}</p>
                        </div>
                        <div className="bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-xl p-4">
                            <p className="text-[#a855f7]/70 text-xs mb-1">Revenue</p>
                            <p className="text-[#a855f7] text-2xl font-bold">₹{stats.totalRevenue}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    {/* Controls */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex gap-2">
                            {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === status
                                        ? 'bg-[#a855f7] text-white'
                                        : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                        }`}
                                >
                                    {status === 'pending' ? 'To Review' : status}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search name, UTR..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a855f7]/50"
                            />
                        </div>
                        <button onClick={fetchTickets} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/40">
                            <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
                            <p>No results found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {filteredTickets.map((ticket) => (
                                <motion.div
                                    key={ticket.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`border rounded-xl p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center ${ticket.status === 'paid' ? 'bg-green-500/5 border-green-500/20' :
                                        ticket.status === 'rejected' ? 'bg-red-500/5 border-red-500/20' :
                                            'bg-white/[0.03] border-white/10'
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative group shrink-0">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/50 border border-white/10 relative flex items-center justify-center">
                                            {ticket.screenshot_path ? (
                                                <div className="relative w-full h-full cursor-pointer" onClick={() => setSelectedImage(getImageUrl(ticket.screenshot_path))}>
                                                    <Image src={getImageUrl(ticket.screenshot_path)} alt="Proof" fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="text-center p-2"><XCircle className="w-5 h-5 text-white/20 mx-auto" /></div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Data */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-white truncate">{ticket.user?.full_name || 'Unknown'}</h3>
                                                <div className="flex items-center gap-2 text-xs text-white/50">
                                                    <span>{ticket.user?.phone}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">{ticket.utr || 'No UTR'}</span>
                                                </div>
                                            </div>
                                            {ticket.status !== 'pending_verification' && (
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${ticket.type.includes('quad') ? 'border-purple-500/30 text-purple-400' : 'border-blue-500/30 text-blue-400'
                                                    }`}>{ticket.type}</span>
                                                <span className="font-heading text-white">₹{ticket.amount}</span>
                                            </div>

                                            {ticket.status === 'pending_verification' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleVerify(ticket.id, 'approve')} disabled={processing === ticket.id} className="p-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleVerify(ticket.id, 'reject')} disabled={processing === ticket.id} className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg text-red-400 transition-colors">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                        >
                            <div className="relative w-full max-w-4xl h-[90vh]">
                                <Image src={selectedImage} alt="Full proof" fill className="object-contain" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
