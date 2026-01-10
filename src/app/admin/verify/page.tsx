'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ExternalLink, RefreshCw, ZoomIn, Copy, Users } from 'lucide-react';
import { toast } from 'sonner';
import AdminDock from '@/components/AdminDock';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { main } from 'framer-motion/client';

interface GroupMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    isRegistered: boolean; // True if user has signed up
}

interface PendingTicket {
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
    groupMembers?: GroupMember[]; // All members in the booking group
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
    const [tickets, setTickets] = useState<PendingTicket[]>([]);
    const [processing, setProcessing] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchPendingTickets = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = '/login';
            return;
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            window.location.href = '/dashboard';
            return;
        }

        // Fetch pending tickets with user details
        // Only fetch tickets with screenshot/utr (main booking tickets, not linked ones)
        const { data, error } = await supabase
            .from('tickets')
            .select(`
                *,
                user:profiles(full_name, email, phone, college_name)
            `)
            .eq('status', 'pending_verification')
            .or('screenshot_path.not.is.null,utr.not.is.null')
            .order('created_at', { ascending: true });

        if (data) {
            // For each ticket with a booking_group_id, fetch all group members
            const ticketsWithGroupMembers = await Promise.all(
                data.map(async (ticket: any) => {
                    if (ticket.booking_group_id) {
                        // Fetch all tickets in this booking group
                        const { data: groupTickets } = await supabase
                            .from('tickets')
                            .select(`
                                id,
                                pending_name,
                                pending_email,
                                pending_phone,
                                user_id,
                                user:profiles(full_name, email, phone)
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

            setTickets(ticketsWithGroupMembers as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingTickets();
    }, [supabase]);

    const handleVerify = async (ticketId: string, action: 'approve' | 'reject') => {
        setProcessing(ticketId);

        try {
            // Find the ticket data for email
            const currentTicket = tickets.find(t => t.id === ticketId);
            if (!currentTicket) {
                throw new Error('Ticket not found');
            }

            if (action === 'approve') {
                // Check if this ticket is part of a booking group
                if (currentTicket.booking_group_id) {
                    // Approve all tickets in the booking group
                    const { data: groupTickets, error: fetchError } = await supabase
                        .from('tickets')
                        .select('id, pending_email, pending_name, user:profiles(email, full_name)')
                        .eq('booking_group_id', currentTicket.booking_group_id);

                    if (fetchError) throw fetchError;

                    // Update each ticket with a unique QR secret
                    for (let i = 0; i < (groupTickets?.length || 0); i++) {
                        const ticket = groupTickets![i];
                        const secret = `TICKET_${Date.now()}_${i}_${Math.random().toString(36).substring(7).toUpperCase()}`;

                        await supabase
                            .from('tickets')
                            .update({
                                status: 'paid',
                                qr_secret: secret
                            })
                            .eq('id', ticket.id);

                        // Send email to each attendee (if they have an account or pending email)
                        const email = (ticket.user as any)?.email || ticket.pending_email;
                        const name = (ticket.user as any)?.full_name || ticket.pending_name || 'User';

                        if (email) {
                            try {
                                await fetch('/api/email/send-approval', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        to: email,
                                        userName: name,
                                        ticketType: currentTicket.type,
                                        amount: currentTicket.amount,
                                    }),
                                });
                            } catch (emailError) {
                                console.error('Email error for', email, emailError);
                            }
                        }
                    }

                    toast.success(`Approved ${groupTickets?.length || 1} tickets in booking group`);
                } else {
                    // Single ticket approval (original flow)
                    const secret = `TICKET_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

                    const { error } = await supabase
                        .from('tickets')
                        .update({
                            status: 'paid',
                            qr_secret: secret
                        })
                        .eq('id', ticketId);

                    if (error) throw error;

                    // Send approval email
                    try {
                        const response = await fetch('/api/email/send-approval', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                to: currentTicket.user?.email,
                                userName: currentTicket.user?.full_name || 'User',
                                ticketType: currentTicket.type,
                                amount: currentTicket.amount,
                            }),
                        });

                        if (!response.ok) {
                            console.error('Email send failed, but ticket approved');
                        }
                    } catch (emailError) {
                        console.error('Email error:', emailError);
                    }

                    toast.success('Ticket approved');
                }
            } else {
                // Rejection - also reject all tickets in booking group
                if (currentTicket.booking_group_id) {
                    const { error } = await supabase
                        .from('tickets')
                        .update({ status: 'rejected' })
                        .eq('booking_group_id', currentTicket.booking_group_id);

                    if (error) throw error;
                    toast.success('All tickets in booking group rejected');
                } else {
                    const { error } = await supabase
                        .from('tickets')
                        .update({ status: 'rejected' })
                        .eq('id', ticketId);

                    if (error) throw error;
                }

                // Send rejection email to purchaser
                try {
                    const response = await fetch('/api/email/send-rejection', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: currentTicket.user?.email,
                            userName: currentTicket.user?.full_name || 'User',
                            ticketType: currentTicket.type,
                            amount: currentTicket.amount,
                        }),
                    });

                    if (!response.ok) {
                        console.error('Email send failed, but ticket rejected');
                    }
                } catch (emailError) {
                    console.error('Email error:', emailError);
                }
            }

            // Remove from list
            setTickets(prev => prev.filter(t => t.id !== ticketId));

        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Action failed. Please try again.');
        } finally {
            setProcessing(null);
        }
    };

    const getImageUrl = (path: string) => {
        const { data } = supabase.storage.from('payment-proofs').getPublicUrl(path);
        return data.publicUrl;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show a toast here
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] relative">
            {/* Background - subtle grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* Gradient overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            {/* Admin Dock */}
            <AdminDock currentPage="verify" />

            {/* Content Container - stays left of dock */}
            <div className="p-4 lg:p-8 mr-0 md:mr-20 relative z-10">
                <div className="max-w-7xl mx-auto space-y-6">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-4xl text-white mb-2">Payment Verification</h1>
                            <p className="text-white/60 text-base">
                                Pending: <span className="font-bold text-amber-400">{tickets.length}</span>
                            </p>
                        </div>

                        <button
                            onClick={fetchPendingTickets}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold uppercase bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/40">
                            <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
                            <p className="font-body text-base">All caught up! No pending verifications.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {tickets.map((ticket) => (
                                <motion.div
                                    key={ticket.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center"
                                >
                                    {/* Screenshot Thumbnail */}
                                    <div className="relative group shrink-0">
                                        <div className="w-28 h-28 rounded-xl overflow-hidden bg-black/50 border border-white/10 relative flex items-center justify-center">
                                            {ticket.screenshot_path ? (
                                                <>
                                                    <Image
                                                        src={getImageUrl(ticket.screenshot_path)}
                                                        alt="Payment Proof"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setSelectedImage(getImageUrl(ticket.screenshot_path))}>
                                                        <ZoomIn className="w-6 h-6 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-2">
                                                    <XCircle className="w-6 h-6 text-white/20 mx-auto" />
                                                    <p className="text-white/30 text-xs mt-1">NO IMG</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-3">
                                            {/* Purchaser Info */}
                                            <div className="min-w-[180px]">
                                                <p className="text-xs text-white/40 font-mono mb-1">PURCHASER</p>
                                                <h3 className="font-heading text-base text-white truncate">
                                                    {ticket.user?.full_name || 'Unknown'}
                                                </h3>
                                                <p className="text-sm text-white/50">{ticket.user?.phone}</p>
                                            </div>

                                            {/* Ticket Info */}
                                            <div>
                                                <p className="text-xs text-white/40 font-mono mb-1">TICKET</p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.type === 'quad' ? 'bg-purple-500/20 text-purple-400' :
                                                        ticket.type === 'duo' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-white/10 text-white/70'
                                                        }`}>
                                                        {ticket.type}
                                                    </span>
                                                    <span className="font-heading text-lg text-white">₹{ticket.amount}</span>
                                                    {ticket.groupMembers && ticket.groupMembers.length > 1 && (
                                                        <span className="text-sm text-white/50">
                                                            ({ticket.groupMembers.length}p)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="min-w-[140px]">
                                                <p className="text-xs text-white/40 font-mono mb-1">UTR & OWNER</p>
                                                {ticket.utr ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(ticket.utr)}>
                                                            <p className="font-mono text-sm text-[#a855f7] truncate max-w-[120px]">{ticket.utr}</p>
                                                            <Copy className="w-3 h-3 text-white/40 opacity-0 group-hover:opacity-100" />
                                                        </div>
                                                        {ticket.payment_owner_name && (
                                                            <p className="text-xs text-white/60 truncate max-w-[120px]" title={ticket.payment_owner_name}>
                                                                {ticket.payment_owner_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="font-mono text-sm text-white/40">—</p>
                                                )}
                                                <p className="text-xs text-white/40 mt-1">
                                                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 items-center ml-auto">
                                                <button
                                                    onClick={() => handleVerify(ticket.id, 'approve')}
                                                    disabled={processing === ticket.id}
                                                    className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-bold text-sm transition-colors flex items-center gap-2"
                                                >
                                                    {processing === ticket.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            {ticket.groupMembers && ticket.groupMembers.length > 1 ? `Approve ${ticket.groupMembers.length}` : 'Approve'}
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(ticket.id, 'reject')}
                                                    disabled={processing === ticket.id}
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Group Members Section (Compact) */}
                                        {ticket.groupMembers && ticket.groupMembers.length > 1 && (
                                            <div className="border-t border-white/5 pt-2 mt-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {ticket.groupMembers.map((member, index) => (
                                                        <div
                                                            key={member.id}
                                                            className={`px-2 py-1 rounded text-[10px] flex items-center gap-1.5 ${member.isRegistered
                                                                ? 'bg-green-500/10 border border-green-500/20'
                                                                : 'bg-amber-500/10 border border-amber-500/20'
                                                                }`}
                                                        >
                                                            <span className="text-white/70 truncate max-w-[120px]">{member.name}</span>
                                                            <span className={`text-[8px] font-bold uppercase ${member.isRegistered
                                                                ? 'text-green-400'
                                                                : 'text-amber-400'
                                                                }`}>
                                                                {member.isRegistered ? '✓' : '?'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                        >
                            <div className="relative w-full max-w-4xl h-[80vh]">
                                <Image
                                    src={selectedImage}
                                    alt="Full proof"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
