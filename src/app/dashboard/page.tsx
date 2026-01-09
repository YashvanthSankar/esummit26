'use client';

import { createClient } from '@/lib/supabase/client';
import { TICKET_PRICES } from '@/types/payment';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import TicketCard from '@/components/TicketCard';
import { LogOut, User, Ticket, Users, Loader2, Link as LinkIcon, Download, Upload, CheckCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { compressImage } from '@/lib/utils';

// TODO: Replace with your actual UPI ID
const UPI_ID = 'your-merchant-upi@bank';
const RECIPIENT_NAME = 'E-Summit IIITDM';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    college_name: string;
    roll_number: string | null;
    role: string;
}

interface UserTicket {
    id: string;
    type: 'solo' | 'duo' | 'quad';
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    qr_secret: string;
    pax_count: number;
}

export default function DashboardPage() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const ticketCardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [ticket, setTicket] = useState<UserTicket | null>(null);

    // Payment Flow States
    const [selectedPass, setSelectedPass] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
            }

            const { data: ticketData } = await supabase
                .from('tickets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (ticketData) {
                setTicket(ticketData);
            }

            setLoading(false);
        };

        loadData();
    }, [supabase]);

    const handleSelectPass = (type: string) => {
        setSelectedPass(type);
        setShowPaymentModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };


    const handleSubmitPayment = async () => {
        if (!selectedPass || !paymentProof || !profile) return;
        setUploading(true);

        try {
            // 1. Compress image
            const compressedFile = await compressImage(paymentProof);

            // 2. Upload screenshot
            const fileExt = 'jpg'; // We convert everything to JPEG
            const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError, data: uploadData } = await supabase
                .storage
                .from('payment-proofs')
                .upload(fileName, compressedFile);

            if (uploadError) throw uploadError;

            // 3. Create ticket record
            const { error: insertError } = await supabase
                .from('tickets')
                .insert({
                    user_id: profile.id,
                    type: selectedPass,
                    amount: TICKET_PRICES[selectedPass].amount,
                    status: 'pending',
                    pax_count: TICKET_PRICES[selectedPass].pax,
                    qr_secret: 'pending_' + Date.now(), // Temporary secret until approved
                    screenshot_path: uploadData.path
                });

            if (insertError) throw insertError;

            // 4. Refresh data
            window.location.reload();

        } catch (error: any) {
            console.error('Payment submission error:', error);
            alert(error.message || 'Failed to submit payment proof. Please try again.');
            setUploading(false);
        }
    };


    const handleDownloadTicket = async () => {
        if (!ticketCardRef.current || !profile) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(ticketCardRef.current, {
                backgroundColor: '#050505',
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const link = document.createElement('a');
            const safeName = profile.full_name.replace(/[^a-zA-Z0-9]/g, '_');
            link.download = `ESummit26_Ticket_${safeName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download ticket. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </main>
        );
    }

    const selectedTicketInfo = selectedPass ? TICKET_PRICES[selectedPass] : null;
    const upiUrl = selectedTicketInfo
        ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(RECIPIENT_NAME)}&am=${selectedTicketInfo.amount}&cu=INR`
        : '';

    return (
        <main className="min-h-screen px-6 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="font-heading text-4xl sm:text-5xl text-white">
                            Dashboard
                        </h1>
                        <p className="font-body text-white/50 mt-2">
                            Welcome back, {profile?.full_name || 'Participant'}!
                        </p>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors font-body text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {/* Profile Card */}
                <div className="glass-card rounded-3xl p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-[#a855f7]" />
                        </div>
                        <div>
                            <h2 className="font-heading text-2xl text-white">Your Profile</h2>
                            <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                                <span className="font-mono text-[10px] text-[#a855f7] uppercase">
                                    {profile?.role}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5">
                            <p className="font-mono text-xs text-white/40 mb-1">EMAIL</p>
                            <p className="font-body text-white">{profile?.email}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5">
                            <p className="font-mono text-xs text-white/40 mb-1">PHONE</p>
                            <p className="font-body text-white">{profile?.phone}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5">
                            <p className="font-mono text-xs text-white/40 mb-1">COLLEGE</p>
                            <p className="font-body text-white">{profile?.college_name}</p>
                        </div>
                        {profile?.roll_number && (
                            <div className="p-4 rounded-xl bg-white/5">
                                <p className="font-mono text-xs text-white/40 mb-1">ROLL NUMBER</p>
                                <p className="font-body text-white">{profile?.roll_number}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tickets Section */}
                <div className="glass-card rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-[#a855f7]" />
                        </div>
                        <div>
                            <h2 className="font-heading text-2xl text-white">
                                {ticket ? 'Your Ticket' : 'Purchase Tickets'}
                            </h2>
                            <p className="font-body text-sm text-white/50">
                                {ticket ? 'View your ticket status below' : 'Select a pass type to continue'}
                            </p>
                        </div>
                    </div>

                    {ticket ? (
                        /* Ticket Display */
                        ticket.status === 'paid' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="mb-6">
                                    <TicketCard
                                        ref={ticketCardRef}
                                        userName={profile?.full_name || ''}
                                        rollNumber={profile?.roll_number || null}
                                        ticketType={ticket.type}
                                        qrSecret={ticket.qr_secret}
                                        ticketId={ticket.id}
                                        paxCount={ticket.pax_count}
                                    />
                                </div>
                                <motion.button
                                    onClick={handleDownloadTicket}
                                    disabled={downloading}
                                    whileHover={{ scale: downloading ? 1 : 1.02 }}
                                    whileTap={{ scale: downloading ? 1 : 0.98 }}
                                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white font-heading text-lg shadow-lg shadow-[#a855f7]/20 disabled:opacity-50"
                                >
                                    {downloading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Download Pass
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        ) : (
                            /* Pending State */
                            <div className="text-center py-12">
                                <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                                    <Clock className="w-10 h-10 text-yellow-500" />
                                </div>
                                <h3 className="font-heading text-2xl text-white mb-2">Verification Pending</h3>
                                <p className="font-body text-white/60 max-w-md mx-auto">
                                    Your payment screenshot has been uploaded and is waiting for admin approval.
                                    This usually takes 24 hours.
                                </p>
                            </div>
                        )
                    ) : (
                        /* Purchase Flow */
                        !showPaymentModal ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {Object.entries(TICKET_PRICES).map(([type, info]) => (
                                    <motion.button
                                        key={type}
                                        onClick={() => handleSelectPass(type)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-6 rounded-2xl border transition-all duration-300 text-left ${type === 'duo'
                                            ? 'border-[#a855f7] bg-[#a855f7]/5'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-5 h-5 text-[#a855f7]" />
                                            <span className="font-mono text-xs text-white/50">
                                                {info.pax} {info.pax === 1 ? 'PERSON' : 'PEOPLE'}
                                            </span>
                                        </div>
                                        <h3 className="font-heading text-xl text-white mb-2">{info.label}</h3>
                                        <p className="font-heading text-3xl text-[#a855f7]">₹{info.amount}</p>
                                    </motion.button>
                                ))}
                            </div>
                        ) : (
                            /* Payment Modal */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 sm:p-8"
                            >
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm font-body"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Plans
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    {/* QR Code Section */}
                                    <div className="flex flex-col items-center p-6 rounded-2xl bg-white">
                                        <h3 className="text-black font-heading text-xl mb-4 text-center">Scan to Pay ₹{selectedTicketInfo?.amount}</h3>
                                        <div className="p-2 border-2 border-black rounded-lg mb-4">
                                            <QRCode value={upiUrl} size={200} />
                                        </div>
                                        <p className="font-mono text-sm text-black/60 text-center break-all">
                                            {UPI_ID}
                                        </p>
                                    </div>

                                    {/* Upload Section */}
                                    <div>
                                        <h3 className="font-heading text-2xl text-white mb-2">Confirm Payment</h3>
                                        <p className="font-body text-white/50 text-sm mb-6">
                                            After paying, upload the transaction screenshot here. Make sure the UTR/Transaction ID is visible.
                                        </p>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${paymentProof
                                                ? 'border-[#a855f7] bg-[#a855f7]/5'
                                                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                                }`}
                                        >
                                            {paymentProof ? (
                                                <>
                                                    <CheckCircle className="w-8 h-8 text-[#a855f7] mb-3" />
                                                    <p className="font-body text-white text-center font-medium">{paymentProof.name}</p>
                                                    <p className="font-body text-white/40 text-xs mt-1">Click to change</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-white/40 mb-3" />
                                                    <p className="font-body text-white/70 text-center">Click to upload screenshot</p>
                                                    <p className="font-body text-white/30 text-xs mt-1">JPG, PNG supported</p>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleSubmitPayment}
                                            disabled={!paymentProof || uploading}
                                            className="w-full py-4 rounded-xl bg-[#a855f7] text-[#050505] font-heading text-lg font-bold hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {uploading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Uploading...
                                                </span>
                                            ) : (
                                                'Submit verification'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    )}
                </div>
            </div>
        </main>
    );
}
