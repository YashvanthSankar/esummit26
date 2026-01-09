'use client';

import { createClient } from '@/lib/supabase/client';
import { TICKET_PRICES, UPI_CONFIG } from '@/types/payment';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import TicketCard from '@/components/TicketCard';
import { LogOut, User, Ticket, Users, Loader2, Link as LinkIcon, Download, Upload, CheckCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { compressImage } from '@/lib/utils';

// Specific Configuration from Request
const UPI_ID = UPI_CONFIG.VPA;
const RECIPIENT_NAME = UPI_CONFIG.NAME;

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
    status: 'pending' | 'paid' | 'failed' | 'pending_verification' | 'rejected';
    qr_secret: string;
    pax_count: number;
    utr?: string;
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
    const [utr, setUtr] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Should be handled by middleware, but client-side backup:
                window.location.href = '/login';
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // Security: If no profile data (e.g. RLS failure or incomplete), don't show dashboard
            if (profileError || !profileData) {
                console.error('Profile load error:', profileError);
                // Redirect to login or onboarding if profile is missing
                window.location.href = '/login';
                return;
            }

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
        if (!selectedPass || !profile) return;

        // Validation: Expect EITHER UTR OR Payment Proof
        if (!utr && !paymentProof) {
            alert('Please provide EITHER a Transaction UTR OR a Payment Screenshot to verify.');
            return;
        }

        setUploading(true);

        try {
            let screenshotPath = null;

            // 1. Upload screenshot if exists
            if (paymentProof) {
                const compressedFile = await compressImage(paymentProof);
                const fileExt = 'jpg';
                const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError, data: uploadData } = await supabase
                    .storage
                    .from('payment-proofs')
                    .upload(fileName, compressedFile);

                if (uploadError) throw uploadError;
                screenshotPath = uploadData.path;
            }

            // 2. Create ticket record with status 'pending_verification'
            const ticketInfo = TICKET_PRICES[selectedPass];
            const { error: insertError } = await supabase
                .from('tickets')
                .insert({
                    user_id: profile.id,
                    type: selectedPass,
                    amount: ticketInfo.amount,
                    status: 'pending_verification',
                    pax_count: ticketInfo.pax,
                    qr_secret: 'pending_' + Date.now(),
                    screenshot_path: screenshotPath, // Can be null
                    utr: utr || null // Can be null (empty string becomes null)
                });

            if (insertError) throw insertError;

            // 3. Refresh data
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

    // Helper to generate UPI String
    const getUPIString = () => {
        if (!selectedPass) return '';
        const amount = TICKET_PRICES[selectedPass].amount;
        return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(RECIPIENT_NAME)}&am=${amount}&tn=ESummit26`;
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </main>
        );
    }

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
                    {!ticket ? (
                        // 1. NO TICKET -> BUY PASS UI
                        !showPaymentModal ? (
                            <div>
                                <h2 className="font-heading text-2xl text-white mb-6">Select a Pass</h2>
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
                                            <h3 className="font-heading text-xl text-white mb-2">{info.label}</h3>
                                            <p className="font-heading text-3xl text-[#a855f7]">₹{info.amount}</p>
                                            <div className="flex items-center gap-2 mt-4">
                                                <Users className="w-4 h-4 text-white/50" />
                                                <span className="font-mono text-xs text-white/50">
                                                    {info.pax} {info.pax === 1 ? 'PERSON' : 'PEOPLE'}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // 2. PAYMENT MODAL
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
                                    Change Plan
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    {/* QR Code Column */}
                                    <div className="flex flex-col items-center p-6 rounded-2xl bg-white">
                                        <h3 className="text-black font-heading text-xl mb-4 text-center">
                                            Scan to Pay ₹{selectedPass && TICKET_PRICES[selectedPass].amount}
                                        </h3>
                                        <div className="p-2 border-2 border-black rounded-lg mb-4 bg-white">
                                            <QRCode value={getUPIString()} size={200} />
                                        </div>
                                        <p className="font-mono text-xs text-black/60 text-center break-all max-w-[200px]">
                                            {UPI_ID}
                                        </p>
                                    </div>

                                    {/* Upload Column */}
                                    <div>
                                        <h3 className="font-heading text-2xl text-white mb-2">Confirm Payment</h3>
                                        <p className="font-body text-white/50 text-sm mb-6">
                                            1. Transfer the amount.<br />
                                            2. Enter UTR/Reference ID.<br />
                                            3. Upload screenshot.
                                        </p>

                                        {/* UTR Input */}
                                        <div className="mb-4">
                                            <label className="block font-mono text-xs text-white/40 mb-2">UTR / REFERENCE NO.</label>
                                            <input
                                                type="text"
                                                value={utr}
                                                onChange={(e) => setUtr(e.target.value)}
                                                placeholder="e.g. 432189012345"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-[#a855f7]"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-px bg-white/10 flex-1"></div>
                                            <span className="text-white/40 text-xs font-mono">OR</span>
                                            <div className="h-px bg-white/10 flex-1"></div>
                                        </div>

                                        {/* File Input */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${paymentProof
                                                ? 'border-[#a855f7] bg-[#a855f7]/5'
                                                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                                }`}
                                        >
                                            {paymentProof ? (
                                                <div className="text-center">
                                                    <CheckCircle className="w-8 h-8 text-[#a855f7] mx-auto mb-2" />
                                                    <p className="font-body text-white text-sm truncate max-w-[200px]">{paymentProof.name}</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                                                    <p className="font-body text-white/70 text-sm">Upload Screenshot</p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleSubmitPayment}
                                            disabled={(!paymentProof && !utr) || uploading}
                                            className="w-full py-4 rounded-xl bg-[#a855f7] text-[#050505] font-heading text-lg font-bold hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {uploading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Uploading...
                                                </span>
                                            ) : (
                                                'Submit Verification'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    ) : ticket.status === 'paid' ? (
                        // 3. PAID -> SHOW TICKET (QR)
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <Ticket className="w-8 h-8 text-[#a855f7]" />
                                <h2 className="font-heading text-3xl text-white">Your Ticket</h2>
                            </div>

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
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white font-heading text-lg shadow-lg shadow-[#a855f7]/20"
                            >
                                {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                Download Pass
                            </motion.button>
                        </motion.div>
                    ) : (
                        // 4. PENDING VERIFICATION / REJECTED
                        <div className="text-center py-12">
                            {ticket.status === 'rejected' ? (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                                        <AlertTriangle className="w-10 h-10 text-red-500" />
                                    </div>
                                    <h3 className="font-heading text-2xl text-white mb-2">Payment Rejected</h3>
                                    <p className="font-body text-white/60 max-w-md mx-auto mb-8">
                                        Your payment could not be verified. Please contact support.
                                    </p>
                                    {/* Option to retry could be added here by deleting the ticket record or updating it */}
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                                        <Clock className="w-10 h-10 text-yellow-500" />
                                    </div>
                                    <h3 className="font-heading text-2xl text-white mb-2">Verification in Progress</h3>
                                    <p className="font-body text-white/60 max-w-md mx-auto">
                                        We are verifying your payment details (UTR: {ticket.utr}).<br />
                                        This usually takes just a few hours.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
