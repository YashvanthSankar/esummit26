'use client';

import { createClient } from '@/lib/supabase/client';
import { TICKET_PRICES, UPI_CONFIG, AttendeeInfo } from '@/types/payment';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import TicketCard from '@/components/TicketCard';
import DashboardDock from '@/components/DashboardDock';
import { LogOut, User, Ticket, Users, Loader2, Link as LinkIcon, Download, Upload, CheckCircle, Clock, AlertTriangle, ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
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
    pending_name?: string;  // For tickets purchased for pending users
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

    // Multi-attendee booking states
    const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
    const [showAttendeeForm, setShowAttendeeForm] = useState(false);

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

            // Fetch tickets - both direct (user_id) and pending (pending_email)
            const { data: ticketData } = await supabase
                .from('tickets')
                .select('*')
                .or(`user_id.eq.${user.id},pending_email.eq.${profileData.email}`)
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
        const paxCount = TICKET_PRICES[type].pax;

        // For solo pass, skip attendee form
        if (paxCount === 1) {
            setAttendees([{
                name: profile?.full_name || '',
                email: profile?.email || '',
                phone: profile?.phone || ''
            }]);
            setShowAttendeeForm(false);
            setSelectedPass(type);
            setShowPaymentModal(true);
            return;
        }

        // For duo/quad, initialize attendees form
        const initialAttendees: AttendeeInfo[] = [{
            name: profile?.full_name || '',
            email: profile?.email || '',
            phone: profile?.phone || ''
        }];

        // Add empty slots for other attendees
        for (let i = 1; i < paxCount; i++) {
            initialAttendees.push({ name: '', email: '', phone: '' });
        }

        setAttendees(initialAttendees);
        setSelectedPass(type);
        setShowAttendeeForm(true);
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
            toast.error('Please provide EITHER a Transaction UTR OR a Payment Screenshot to verify.');
            return;
        }

        // For duo/quad, validate all attendee fields
        const ticketInfo = TICKET_PRICES[selectedPass];
        if (ticketInfo.pax > 1) {
            for (let i = 0; i < attendees.length; i++) {
                const attendee = attendees[i];
                if (!attendee.name || !attendee.email || !attendee.phone) {
                    toast.error(`Please fill in all details for Attendee ${i + 1}`);
                    return;
                }
                // Basic email validation
                if (!attendee.email.includes('@')) {
                    toast.error(`Please enter a valid email for Attendee ${i + 1}`);
                    return;
                }
            }

            // Check for duplicate emails
            const emails = attendees.map(a => a.email.toLowerCase());
            if (new Set(emails).size !== emails.length) {
                toast.error('Each attendee must have a unique email address');
                return;
            }
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

            // 2. Create booking group (for duo/quad)
            let bookingGroupId: string | null = null;
            if (ticketInfo.pax > 1) {
                const { data: groupData, error: groupError } = await supabase
                    .from('booking_groups')
                    .insert({
                        purchaser_id: profile.id,
                        ticket_type: selectedPass,
                        total_amount: ticketInfo.amount,
                        pax_count: ticketInfo.pax
                    })
                    .select()
                    .single();

                if (groupError) throw groupError;
                bookingGroupId = groupData.id;
            }

            // 3. Create ticket records for each attendee
            const ticketInserts = await Promise.all(
                attendees.map(async (attendee, index) => {
                    const isPurchaser = attendee.email.toLowerCase() === profile.email.toLowerCase();

                    // Check if attendee already has an account
                    let existingUserId: string | null = null;
                    if (!isPurchaser) {
                        const { data: existingUser } = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('email', attendee.email.toLowerCase())
                            .single();
                        existingUserId = existingUser?.id || null;
                    }

                    return {
                        user_id: isPurchaser ? profile.id : existingUserId,
                        pending_email: (isPurchaser || existingUserId) ? null : attendee.email.toLowerCase(),
                        pending_name: (isPurchaser || existingUserId) ? null : attendee.name,
                        pending_phone: (isPurchaser || existingUserId) ? null : attendee.phone,
                        type: selectedPass,
                        amount: Math.floor(ticketInfo.amount / ticketInfo.pax),
                        status: 'pending_verification',
                        pax_count: 1, // Each person gets their own ticket
                        qr_secret: 'pending_' + Date.now() + '_' + index,
                        screenshot_path: index === 0 ? screenshotPath : null, // Only first ticket has screenshot
                        utr: index === 0 ? (utr || null) : null, // Only first ticket has UTR
                        booking_group_id: bookingGroupId
                    };
                })
            );

            const { error: insertError } = await supabase
                .from('tickets')
                .insert(ticketInserts);

            if (insertError) throw insertError;

            // Sync tickets to Google Sheets (fire and forget)
            ticketInserts.forEach((ticketData: any, index: number) => {
                const attendee = attendees[index];
                fetch('/api/sync/sheets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'ticket',
                        data: {
                            ticket: {
                                ...ticketData,
                                id: `TKT_${Date.now()}_${index}`, // Temporary ID for sheet
                            },
                            userName: attendee.name,
                            userEmail: attendee.email,
                        }
                    })
                }).catch(err => console.log('[Sheets Sync] Ticket sync error:', err));
            });

            // Success - show message about verification
            const otherAttendees = attendees.filter(a => a.email.toLowerCase() !== profile.email.toLowerCase());
            toast.success('Booking submitted successfully!', {
                description: ticketInfo.pax > 1
                    ? `Payment will be verified shortly. ${otherAttendees.length} other attendee(s) will receive their tickets.`
                    : 'Your payment will be verified shortly. Check back later for your ticket.',
                duration: 6000,
            });

            // 4. Refresh data
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error: any) {
            console.error('Payment submission error:', error);
            toast.error(error.message || 'Failed to submit payment proof. Please try again.');
            setUploading(false);
        }
    };

    const handleDownloadTicket = async () => {
        if (!ticketCardRef.current || !profile) {
            toast.error('Ticket not ready. Please refresh the page.');
            return;
        }
        setDownloading(true);

        try {
            console.log('[Download] Starting ticket download...');

            // Suppress console errors from html2canvas about unsupported color functions
            const originalError = console.error;
            console.error = (...args) => {
                if (args[0]?.includes?.('oklab') || args[0]?.includes?.('color function')) {
                    return; // Suppress oklab errors
                }
                originalError(...args);
            };

            console.log('[Download] Rendering canvas...');
            const canvas = await html2canvas(ticketCardRef.current, {
                backgroundColor: '#050505',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                windowWidth: 360,
                windowHeight: 600,
            });

            // Restore console.error
            console.error = originalError;
            console.log('[Download] Canvas rendered successfully');

            // Try toBlob first, fallback to toDataURL
            const safeName = profile.full_name.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `ESummit26_Ticket_${safeName}.png`;

            try {
                // Method 1: Using toBlob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        // Fallback to toDataURL
                        console.log('[Download] toBlob returned null, using toDataURL fallback');
                        downloadViaDataURL();
                        return;
                    }

                    console.log('[Download] Creating download link via blob...');
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    console.log('[Download] Download triggered successfully');
                    toast.success('Ticket downloaded successfully!');
                    setDownloading(false);
                }, 'image/png');
            } catch (blobError) {
                console.log('[Download] toBlob failed, using fallback');
                downloadViaDataURL();
            }

            // Fallback function using toDataURL
            function downloadViaDataURL() {
                try {
                    const dataURL = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = dataURL;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    console.log('[Download] Download triggered via dataURL');
                    toast.success('Ticket downloaded successfully!');
                } catch (err) {
                    console.error('[Download] DataURL fallback failed:', err);
                    toast.error('Download failed. Please try again.');
                }
                setDownloading(false);
            }

        } catch (error: any) {
            console.error('[Download] Error:', error);
            toast.error(`Download failed: ${error.message || 'Unknown error'}. Try taking a screenshot instead.`);
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
        <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Dock Navigation */}
            <DashboardDock userName={profile?.full_name} userRole={profile?.role} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white">
                        Dashboard
                    </h1>
                    <p className="font-body text-white/50 mt-2 text-sm sm:text-base">
                        Welcome back, {profile?.full_name || 'Participant'}!
                    </p>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12"
                >
                    <div className="flex items-center gap-3 sm:gap-4 mb-6">
                        <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#a855f7]" />
                        <h2 className="font-heading text-xl sm:text-2xl text-white">Your Profile</h2>
                    </div>

                    <div className="inline-block px-3 py-1 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] text-xs font-mono mb-6">
                        {profile?.role}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <p className="font-mono text-xs text-white/40 mb-1">EMAIL</p>
                            <p className="font-body text-white text-sm sm:text-base break-all">{profile?.email}</p>
                        </div>
                        <div>
                            <p className="font-mono text-xs text-white/40 mb-1">PHONE</p>
                            <p className="font-body text-white text-sm sm:text-base">{profile?.phone}</p>
                        </div>
                        <div>
                            <p className="font-mono text-xs text-white/40 mb-1">COLLEGE</p>
                            <p className="font-body text-white text-sm sm:text-base">{profile?.college_name}</p>
                        </div>
                        {profile?.roll_number && (
                            <div>
                                <p className="font-mono text-xs text-white/40 mb-1">ROLL NUMBER</p>
                                <p className="font-body text-white text-sm sm:text-base">{profile?.roll_number}</p>
                            </div>
                        )}
                    </div>
                </motion.div>

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

                                {/* Attendee Form for Duo/Quad */}
                                {showAttendeeForm && selectedPass && TICKET_PRICES[selectedPass].pax > 1 && (
                                    <div className="mb-8 pb-8 border-b border-white/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <UserPlus className="w-6 h-6 text-[#a855f7]" />
                                            <h3 className="font-heading text-xl text-white">
                                                Enter Attendee Details
                                            </h3>
                                        </div>
                                        <p className="text-white/50 text-sm mb-6 font-body">
                                            Enter the details of all {TICKET_PRICES[selectedPass].pax} people who will attend.
                                            Each person will receive their own ticket.
                                        </p>

                                        <div className="space-y-6">
                                            {attendees.map((attendee, index) => (
                                                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                                                            <span className="text-[#a855f7] font-mono text-sm">{index + 1}</span>
                                                        </div>
                                                        <span className="text-white font-heading text-sm">
                                                            {index === 0 ? 'You (Purchaser)' : `Attendee ${index + 1}`}
                                                        </span>
                                                        {index === 0 && (
                                                            <span className="text-xs text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded-full">
                                                                Auto-filled
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block font-mono text-xs text-white/40 mb-2">NAME</label>
                                                            <input
                                                                type="text"
                                                                value={attendee.name}
                                                                onChange={(e) => {
                                                                    const newAttendees = [...attendees];
                                                                    newAttendees[index].name = e.target.value;
                                                                    setAttendees(newAttendees);
                                                                }}
                                                                disabled={index === 0}
                                                                placeholder="Full Name"
                                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#a855f7] ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block font-mono text-xs text-white/40 mb-2">EMAIL</label>
                                                            <input
                                                                type="email"
                                                                value={attendee.email}
                                                                onChange={(e) => {
                                                                    const newAttendees = [...attendees];
                                                                    newAttendees[index].email = e.target.value;
                                                                    setAttendees(newAttendees);
                                                                }}
                                                                disabled={index === 0}
                                                                placeholder="email@example.com"
                                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#a855f7] ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block font-mono text-xs text-white/40 mb-2">PHONE</label>
                                                            <input
                                                                type="tel"
                                                                value={attendee.phone}
                                                                onChange={(e) => {
                                                                    const newAttendees = [...attendees];
                                                                    newAttendees[index].phone = e.target.value;
                                                                    setAttendees(newAttendees);
                                                                }}
                                                                disabled={index === 0}
                                                                placeholder="+91 98765 43210"
                                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#a855f7] ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-white/40 text-xs mt-4 font-body">
                                            💡 Other attendees will receive their tickets after signing up with their email.
                                        </p>
                                    </div>
                                )}

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
                                        Your payment could not be verified. Please try again with correct payment details.
                                    </p>
                                    <motion.button
                                        onClick={async () => {
                                            try {
                                                // Delete the rejected ticket
                                                const { error } = await supabase
                                                    .from('tickets')
                                                    .delete()
                                                    .eq('id', ticket.id);

                                                if (error) throw error;

                                                toast.success('Ready to try again!', {
                                                    description: 'Please select a pass and submit your payment.',
                                                });

                                                // Reset state to allow new payment
                                                setTicket(null);
                                                setSelectedPass(null);
                                                setPaymentProof(null);
                                                setUtr('');
                                            } catch (error: any) {
                                                console.error('Delete error:', error);
                                                toast.error('Failed to reset. Please refresh the page.');
                                            }
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white font-heading text-lg shadow-lg shadow-[#a855f7]/20 hover:shadow-[#a855f7]/40 transition-shadow"
                                    >
                                        Try Again
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <Clock className="w-10 h-10 text-yellow-500" />
                                    </div>
                                    <h3 className="font-heading text-2xl text-white mb-3">Payment Submitted Successfully! 🎉</h3>
                                    <p className="font-body text-white/70 max-w-md mx-auto mb-4">
                                        Your payment is being verified by our team.
                                    </p>
                                    
                                    {ticket.utr && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                            <span className="text-white/50 text-sm font-mono">UTR:</span>
                                            <span className="text-white text-sm font-mono">{ticket.utr}</span>
                                        </div>
                                    )}
                                    
                                    <div className="bg-[#a855f7]/5 border border-[#a855f7]/20 rounded-2xl p-6 max-w-md mx-auto mt-4">
                                        <h4 className="font-heading text-lg text-[#a855f7] mb-3">What happens next?</h4>
                                        <ul className="text-left space-y-3 text-white/60 text-sm font-body">
                                            <li className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-[#a855f7] text-xs font-bold">1</span>
                                                </span>
                                                <span>Our team will verify your payment within <strong className="text-white">24 hours</strong></span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-[#a855f7] text-xs font-bold">2</span>
                                                </span>
                                                <span>Once approved, your <strong className="text-white">ticket will be ready</strong> here</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-[#a855f7] text-xs font-bold">3</span>
                                                </span>
                                                <span>Your <strong className="text-white">QR ticket</strong> will appear here for download</span>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <p className="text-white/40 text-xs mt-6 font-mono">
                                        Check back later to download your ticket
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
