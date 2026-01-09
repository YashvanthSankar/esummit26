'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ExternalLink, RefreshCw, ZoomIn, Copy } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface PendingTicket {
    id: string;
    type: string;
    amount: number;
    screenshot_path: string;
    utr: string;
    created_at: string;
    user: {
        full_name: string;
        email: string;
        phone: string;
        college_name: string;
    };
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
        const { data, error } = await supabase
            .from('tickets')
            .select(`
                *,
                user:profiles(full_name, email, phone, college_name)
            `)
            .eq('status', 'pending_verification')
            .order('created_at', { ascending: true });

        if (data) {
            setTickets(data as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingTickets();
    }, [supabase]);

    const handleVerify = async (ticketId: string, action: 'approve' | 'reject') => {
        setProcessing(ticketId);

        try {
            if (action === 'approve') {
                // Generate secret: timestamp + random string
                const secret = `TICKET_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

                const { error } = await supabase
                    .from('tickets')
                    .update({
                        status: 'paid',
                        qr_secret: secret
                    })
                    .eq('id', ticketId);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('tickets')
                    .update({ status: 'rejected' })
                    .eq('id', ticketId);

                if (error) throw error;
            }

            // Remove from list
            setTickets(prev => prev.filter(t => t.id !== ticketId));

        } catch (error) {
            console.error('Verification error:', error);
            alert('Action failed. Please try again.');
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
        <main className="min-h-screen bg-[#050505] p-6 lg:p-12 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="font-heading text-3xl text-white">Payment Verification</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-white/30 text-sm font-mono">{tickets.length} PENDING</span>
                        <button
                            onClick={fetchPendingTickets}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-white/30">
                        <CheckCircle className="w-16 h-16 mb-4 opacity-50" />
                        <p className="font-body text-lg">All caught up! No pending verifications.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tickets.map((ticket) => (
                            <motion.div
                                key={ticket.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card rounded-2xl p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center"
                            >
                                {/* Screenshot Thumbnail */}
                                <div className="relative group shrink-0">
                                    <div className="w-full sm:w-48 h-64 sm:h-48 rounded-xl overflow-hidden bg-black/50 border border-white/10 relative flex items-center justify-center">
                                        {ticket.screenshot_path ? (
                                            <>
                                                <Image
                                                    src={getImageUrl(ticket.screenshot_path)}
                                                    alt="Payment Proof"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setSelectedImage(getImageUrl(ticket.screenshot_path))}>
                                                    <ZoomIn className="w-8 h-8 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                <p className="text-white/30 text-xs font-mono mb-2">NO SCREENSHOT</p>
                                                <XCircle className="w-8 h-8 text-white/10 mx-auto" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                    {/* User Info */}
                                    <div>
                                        <p className="text-xs text-white/30 font-mono mb-1">USER</p>
                                        <h3 className="font-heading text-lg text-white truncate mb-1">
                                            {ticket.user?.full_name || 'Unknown User'}
                                        </h3>
                                        <p className="font-body text-xs text-white/50">{ticket.user?.college_name}</p>
                                        <p className="font-mono text-xs text-white/30 mt-1">{ticket.user?.phone}</p>
                                    </div>

                                    {/* Ticket Info */}
                                    <div>
                                        <p className="text-xs text-white/30 font-mono mb-1">TICKET</p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mb-1 ${ticket.type === 'quad' ? 'bg-purple-500/20 text-purple-400' :
                                            ticket.type === 'duo' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-white/10 text-white/70'
                                            }`}>
                                            {ticket.type}
                                        </span>
                                        <p className="font-heading text-xl text-white">₹{ticket.amount}</p>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <p className="text-xs text-white/30 font-mono mb-1">UTR / REF</p>
                                        {ticket.utr ? (
                                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(ticket.utr)}>
                                                <p className="font-mono text-lg text-[#a855f7] truncate">{ticket.utr}</p>
                                                <Copy className="w-3 h-3 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ) : (
                                            <p className="font-mono text-sm text-white/30 italic">Not Provided</p>
                                        )}
                                        <p className="font-mono text-xs text-white/30 mt-1">
                                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                                        </p>
                                    </div>


                                    {/* Actions */}
                                    <div className="flex gap-3 items-center">
                                        <button
                                            onClick={() => handleVerify(ticket.id, 'approve')}
                                            disabled={processing === ticket.id}
                                            className="flex-1 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            {processing === ticket.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" /> Approve
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleVerify(ticket.id, 'reject')}
                                            disabled={processing === ticket.id}
                                            className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-sm transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
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
                        <div className="relative w-full max-w-5xl h-[85vh]">
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
        </main>
    );
}
