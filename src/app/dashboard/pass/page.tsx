'use client';

import { createClient } from '@/lib/supabase/client';
import { TICKET_PRICES, UPI_CONFIG, AttendeeInfo } from '@/types/payment';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import TicketCard from '@/components/TicketCard';
import DashboardDock from '@/components/DashboardDock';
import AdminDock from '@/components/AdminDock';
import { Ticket, Users, Loader2, Download, Upload, CheckCircle, Clock, AlertTriangle, ArrowLeft, UserPlus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { compressImage, validateFile } from '@/lib/utils';

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
    pending_name?: string;
    band_issued_at?: string | null;
}

export default function PassPage() {
    const supabase = createClient();
    const ticketCardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [attendedEvents, setAttendedEvents] = useState<{ event_id: string; event_name: string; scanned_at: string }[]>([]);
    const [ticket, setTicket] = useState<UserTicket | null>(null);

    // Payment Flow States
    const [selectedPass, setSelectedPass] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [utr, setUtr] = useState('');
    const [paymentOwnerName, setPaymentOwnerName] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Multi-attendee booking states
    const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
    const [showAttendeeForm, setShowAttendeeForm] = useState(false);

    const isExternal = profile?.role === 'external';

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError || !profileData) {
                window.location.href = '/login';
                return;
            }

            setProfile(profileData);

            // Fetch tickets
            const { data: ticketData } = await supabase
                .from('tickets')
                .select('*')
                .or(`user_id.eq.${user.id},pending_email.eq.${profileData.email}`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (ticketData) {
                setTicket(ticketData);

                // Fetch attended events
                const { data: eventLogs } = await supabase
                    .from('event_logs')
                    .select('event_id, event_name, scanned_at')
                    .eq('ticket_id', ticketData.id)
                    .order('scanned_at', { ascending: false });

                if (eventLogs) {
                    setAttendedEvents(eventLogs);
                }
            }

            setLoading(false);
        };

        loadData();
    }, [supabase]);

    const handleSelectPass = (type: string) => {
        const paxCount = TICKET_PRICES[type].pax;

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

        const initialAttendees: AttendeeInfo[] = [{
            name: profile?.full_name || '',
            email: profile?.email || '',
            phone: profile?.phone || ''
        }];

        for (let i = 1; i < paxCount; i++) {
            initialAttendees.push({ name: '', email: '', phone: '' });
        }

        setAttendees(initialAttendees);
        setSelectedPass(type);
        setShowAttendeeForm(true);
        setShowPaymentModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file, {
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        });

        if (!validation.valid) {
            toast.error(validation.error);
            e.target.value = '';
            return;
        }

        setPaymentProof(file);
    };

    const handleSubmitPayment = async () => {
        if (!selectedPass || !profile) return;

        if (!utr && !paymentProof) {
            toast.error('Please provide EITHER a Transaction UTR OR a Payment Screenshot.');
            return;
        }

        if (utr && !paymentOwnerName) {
            toast.error('Please enter the Account Owner Name for UTR verification.');
            return;
        }

        const ticketInfo = TICKET_PRICES[selectedPass];
        if (ticketInfo.pax > 1) {
            for (let i = 0; i < attendees.length; i++) {
                const attendee = attendees[i];
                if (!attendee.name || !attendee.email || !attendee.phone) {
                    toast.error(`Please fill in all details for Attendee ${i + 1}`);
                    return;
                }
                if (!attendee.email.includes('@')) {
                    toast.error(`Please enter a valid email for Attendee ${i + 1}`);
                    return;
                }
            }

            const emails = attendees.map(a => a.email.toLowerCase());
            if (new Set(emails).size !== emails.length) {
                toast.error('Each attendee must have a unique email address');
                return;
            }
        }

        setUploading(true);

        try {
            let screenshotPath = null;

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

            const ticketInserts = await Promise.all(
                attendees.map(async (attendee, index) => {
                    const isPurchaser = attendee.email.toLowerCase() === profile.email.toLowerCase();

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
                        pax_count: 1,
                        qr_secret: 'pending_' + Date.now() + '_' + index,
                        screenshot_path: index === 0 ? screenshotPath : null,
                        utr: index === 0 ? (utr || null) : null,
                        payment_owner_name: (index === 0 && utr) ? paymentOwnerName : null,
                        booking_group_id: bookingGroupId
                    };
                })
            );

            const { error: insertError } = await supabase
                .from('tickets')
                .insert(ticketInserts);

            if (insertError) throw insertError;

            const otherAttendees = attendees.filter(a => a.email.toLowerCase() !== profile.email.toLowerCase());
            toast.success('Booking submitted successfully!', {
                description: ticketInfo.pax > 1
                    ? `Payment will be verified shortly. ${otherAttendees.length} other attendee(s) will receive their tickets.`
                    : 'Your payment will be verified shortly.',
                duration: 6000,
            });

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Payment submission error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit payment proof.');
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
            const originalError = console.error;
            console.error = (...args) => {
                if (args[0]?.includes?.('oklab') || args[0]?.includes?.('color function')) {
                    return;
                }
                originalError(...args);
            };

            const canvas = await html2canvas(ticketCardRef.current, {
                backgroundColor: '#050505',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                windowWidth: 360,
                windowHeight: 600,
            });

            console.error = originalError;

            const safeName = profile.full_name.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `ESummit26_Ticket_${safeName}.png`;

            try {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        downloadViaDataURL();
                        return;
                    }

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    toast.success('Ticket downloaded successfully!');
                    setDownloading(false);
                }, 'image/png');
            } catch {
                downloadViaDataURL();
            }

            function downloadViaDataURL() {
                try {
                    const dataURL = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = dataURL;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.success('Ticket downloaded successfully!');
                } catch {
                    toast.error('Download failed. Please try again.');
                }
                setDownloading(false);
            }

        } catch (error) {
            toast.error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}.`);
            setDownloading(false);
        }
    };

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
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {profile?.role === 'admin' ? (
                <AdminDock currentPage="dashboard" userName={profile?.full_name} />
            ) : (
                <DashboardDock userName={profile?.full_name} userRole={profile?.role} isExternal={isExternal} currentPage="pass" />
            )}

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-[#a855f7]" />
                        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white">
                            Event Pass
                        </h1>
                    </div>
                    <p className="font-body text-white/50 text-sm">
                        Purchase or view your E-Summit &apos;26 pass
                    </p>
                </div>

                {/* Pass Content */}
                <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
                    {!ticket ? (
                        !showPaymentModal ? (
                            <div>
                                <h2 className="font-heading text-xl sm:text-2xl text-white mb-4 sm:mb-6">Select a Pass</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    {Object.entries(TICKET_PRICES).map(([type, info]) => (
                                        <motion.button
                                            key={type}
                                            onClick={() => handleSelectPass(type)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 text-left ${type === 'duo'
                                                ? 'border-[#a855f7] bg-[#a855f7]/5'
                                                : 'border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            <h3 className="font-heading text-lg sm:text-xl text-white mb-1 sm:mb-2">{info.label}</h3>
                                            <p className="font-heading text-2xl sm:text-3xl text-[#a855f7]">₹{info.amount}</p>
                                            <div className="flex items-center gap-2 mt-3 sm:mt-4">
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4 sm:mb-6 text-sm font-body"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Change Plan
                                </button>

                                {/* Attendee Form for Duo/Quad */}
                                {showAttendeeForm && selectedPass && TICKET_PRICES[selectedPass].pax > 1 && (
                                    <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10">
                                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-[#a855f7]" />
                                            <h3 className="font-heading text-lg sm:text-xl text-white">
                                                Enter Attendee Details
                                            </h3>
                                        </div>
                                        <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-6 font-body">
                                            Enter the details of all {TICKET_PRICES[selectedPass].pax} people.
                                        </p>

                                        <div className="space-y-4 sm:space-y-6">
                                            {attendees.map((attendee, index) => (
                                                <div key={index} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                                                            <span className="text-[#a855f7] font-mono text-xs sm:text-sm">{index + 1}</span>
                                                        </div>
                                                        <span className="text-white font-heading text-xs sm:text-sm">
                                                            {index === 0 ? 'You (Purchaser)' : `Attendee ${index + 1}`}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                                                        <div>
                                                            <label className="block font-mono text-xs text-white/40 mb-1 sm:mb-2">NAME</label>
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
                                                                className={`w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-[#a855f7] ${index === 0 ? 'opacity-50' : ''}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block font-mono text-xs text-white/40 mb-1 sm:mb-2">EMAIL</label>
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
                                                                className={`w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-[#a855f7] ${index === 0 ? 'opacity-50' : ''}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block font-mono text-xs text-white/40 mb-1 sm:mb-2">PHONE</label>
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
                                                                className={`w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-[#a855f7] ${index === 0 ? 'opacity-50' : ''}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {/* QR Code Column */}
                                    <div className="flex flex-col items-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white order-2 md:order-1">
                                        <h3 className="text-black font-heading text-lg sm:text-xl mb-3 sm:mb-4 text-center">
                                            Scan to Pay ₹{selectedPass && TICKET_PRICES[selectedPass].amount}
                                        </h3>
                                        <div className="p-2 border-2 border-black rounded-lg mb-3 sm:mb-4 bg-white">
                                            <QRCode value={getUPIString()} size={160} className="sm:w-[200px] sm:h-[200px]" />
                                        </div>
                                        <p className="font-mono text-xs text-black/60 text-center break-all max-w-[200px]">
                                            {UPI_ID}
                                        </p>
                                    </div>

                                    {/* Upload Column */}
                                    <div className="order-1 md:order-2">
                                        <h3 className="font-heading text-xl sm:text-2xl text-white mb-2">Confirm Payment</h3>
                                        <p className="font-body text-white/50 text-xs sm:text-sm mb-4 sm:mb-6">
                                            1. Transfer the amount.<br />
                                            2. Enter UTR/Reference ID.<br />
                                            3. Upload screenshot.
                                        </p>

                                        <div className="mb-3 sm:mb-4">
                                            <label className="block font-mono text-xs text-white/40 mb-1 sm:mb-2">UTR / REFERENCE NO.</label>
                                            <input
                                                type="text"
                                                value={utr}
                                                onChange={(e) => setUtr(e.target.value)}
                                                placeholder="e.g. 432189012345"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white font-mono text-sm focus:outline-none focus:border-[#a855f7]"
                                            />
                                        </div>

                                        {utr && (
                                            <div className="mb-3 sm:mb-4 animate-in fade-in slide-in-from-top-2">
                                                <label className="block font-mono text-xs text-white/40 mb-1 sm:mb-2">ACCOUNT OWNER NAME <span className="text-red-400">*</span></label>
                                                <input
                                                    type="text"
                                                    value={paymentOwnerName}
                                                    onChange={(e) => setPaymentOwnerName(e.target.value)}
                                                    placeholder="Name on Bank Account / UPI"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#a855f7]"
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 mb-3 sm:mb-4">
                                            <div className="h-px bg-white/10 flex-1"></div>
                                            <span className="text-white/40 text-xs font-mono">OR</span>
                                            <div className="h-px bg-white/10 flex-1"></div>
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer transition-colors mb-4 sm:mb-6 ${paymentProof
                                                ? 'border-[#a855f7] bg-[#a855f7]/5'
                                                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                            }`}
                                        >
                                            {paymentProof ? (
                                                <div className="text-center">
                                                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#a855f7] mx-auto mb-2" />
                                                    <p className="font-body text-white text-xs sm:text-sm truncate max-w-[200px]">{paymentProof.name}</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white/40 mx-auto mb-2" />
                                                    <p className="font-body text-white/70 text-xs sm:text-sm">Upload Screenshot</p>
                                                    <p className="font-body text-white/30 text-xs mt-1">Max 500KB • JPG, PNG, WebP</p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleSubmitPayment}
                                            disabled={(!paymentProof && !utr) || uploading}
                                            className="w-full py-3 sm:py-4 rounded-xl bg-[#a855f7] text-[#050505] font-heading text-base sm:text-lg font-bold hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center w-full"
                        >
                            {/* Band Status Badge */}
                            <div className={`mb-4 sm:mb-6 px-3 sm:px-6 py-2 sm:py-3 rounded-full border flex items-center gap-2 text-xs sm:text-sm ${ticket.band_issued_at
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            }`}>
                                {ticket.band_issued_at ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="font-heading tracking-wide">BAND RECEIVED</span>
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-4 h-4" />
                                        <span className="font-heading tracking-wide">YET TO COLLECT BAND</span>
                                    </>
                                )}
                            </div>

                            {/* Ticket Card */}
                            <div className="w-full flex justify-center mb-4 sm:mb-6">
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

                            {/* Download Button */}
                            <motion.button
                                onClick={handleDownloadTicket}
                                disabled={downloading}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white font-heading text-sm sm:text-base shadow-lg shadow-[#a855f7]/20"
                            >
                                {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                Download Pass
                            </motion.button>

                            {/* Attended Events */}
                            {attendedEvents.length > 0 && (
                                <div className="w-full mt-6 sm:mt-8">
                                    <h3 className="font-heading text-lg sm:text-xl text-white mb-3 sm:mb-4">Attended Events</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {attendedEvents.map((log) => (
                                            <div
                                                key={log.event_id}
                                                className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4"
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <div className="p-1.5 sm:p-2 rounded-lg bg-[#a855f7]/10">
                                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#a855f7]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium text-sm sm:text-base truncate">{log.event_name}</h4>
                                                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>
                                                                {new Date(log.scanned_at).toLocaleString('en-IN', {
                                                                    timeZone: 'Asia/Kolkata',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="text-center py-8 sm:py-12">
                            {ticket.status === 'rejected' ? (
                                <>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                        <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                                    </div>
                                    <h3 className="font-heading text-xl sm:text-2xl text-white mb-2">Payment Rejected</h3>
                                    <p className="font-body text-white/60 text-sm max-w-md mx-auto mb-6 sm:mb-8">
                                        Your payment could not be verified. Please try again.
                                    </p>
                                    <motion.button
                                        onClick={async () => {
                                            try {
                                                const { error } = await supabase
                                                    .from('tickets')
                                                    .delete()
                                                    .eq('id', ticket.id);

                                                if (error) throw error;

                                                toast.success('Ready to try again!');
                                                setTicket(null);
                                                setSelectedPass(null);
                                                setPaymentProof(null);
                                                setUtr('');
                                            } catch {
                                                toast.error('Failed to reset. Please refresh.');
                                            }
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white font-heading text-base sm:text-lg"
                                    >
                                        Try Again
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                                        <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                                    </div>
                                    <h3 className="font-heading text-xl sm:text-2xl text-white mb-2 sm:mb-3">Payment Submitted! 🎉</h3>
                                    <p className="font-body text-white/70 text-sm max-w-md mx-auto mb-3 sm:mb-4">
                                        Your payment is being verified by our team.
                                    </p>

                                    {ticket.utr && (
                                        <div className="mb-4 sm:mb-6">
                                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10">
                                                <span className="text-white/50 text-xs font-mono">UTR:</span>
                                                <span className="text-white text-xs sm:text-sm font-mono">{ticket.utr}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-[#a855f7]/5 border border-[#a855f7]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md mx-auto mt-4">
                                        <h4 className="font-heading text-base sm:text-lg text-[#a855f7] mb-3">What happens next?</h4>
                                        <ul className="text-left space-y-2 sm:space-y-3 text-white/60 text-xs sm:text-sm font-body">
                                            <li className="flex items-start gap-2 sm:gap-3">
                                                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-[#a855f7] text-xs font-bold">1</span>
                                                </span>
                                                <span>Verification within <strong className="text-white">24 hours</strong></span>
                                            </li>
                                            <li className="flex items-start gap-2 sm:gap-3">
                                                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-[#a855f7] text-xs font-bold">2</span>
                                                </span>
                                                <span>Ticket will appear here when approved</span>
                                            </li>
                                            <li className="flex items-start gap-2 sm:gap-3">
                                                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-[#a855f7] text-xs font-bold">3</span>
                                                </span>
                                                <span>Download your QR ticket</span>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
