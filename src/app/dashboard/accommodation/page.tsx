'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, Calendar, User, Mail, Phone, Building2, CreditCard, AlertCircle } from 'lucide-react';
import AccommodationForm from '@/components/AccommodationForm';
import DashboardDock from '@/components/DashboardDock';
import AdminDock from '@/components/AdminDock';

interface AccommodationRequest {
    id: string;
    name: string;
    phone_number: string;
    age: number;
    gender: string;
    email: string;
    college_name: string;
    selected_days: string[]; // Array of selected dates
    id_proof_url: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    reviewed_at: string | null;
    created_at: string;
    // Payment fields
    payment_status: 'pending' | 'pending_verification' | 'paid' | 'rejected' | null;
    payment_amount: number | null;
    payment_utr: string | null;
}

export default function AccommodationPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [request, setRequest] = useState<AccommodationRequest | null>(null);

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

            setProfile(profileData);

            // Check if user already has a request
            const { data: requestData } = await supabase
                .from('accommodation_requests')
                .select('*')
                .eq('user_id', user.id)
                .single();

            setRequest(requestData);
            setLoading(false);
        };

        loadData();
    }, [supabase]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-bold">Approved</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-bold">Rejected</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                        <Clock className="w-5 h-5 text-amber-400" />
                        <span className="text-amber-400 font-bold">Under Review</span>
                    </div>
                );
        }
    };

    const getPaymentStatusBadge = (status: string | null) => {
        switch (status) {
            case 'paid':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-bold">Payment Verified</span>
                    </div>
                );
            case 'pending_verification':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 text-sm font-bold">Verifying Payment</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm font-bold">Payment Rejected</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg">
                        <CreditCard className="w-4 h-4 text-white/50" />
                        <span className="text-white/50 text-sm font-bold">Payment Pending</span>
                    </div>
                );
        }
    };

    // Format selected days for display
    const formatSelectedDays = (days: string[]) => {
        if (!days || days.length === 0) return 'No days selected';
        return days.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }).join(', ');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    // Check if user is external
    const isExternal = profile?.role === 'external';

    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            {/* Dock Navigation */}
            {profile?.role === 'admin' ? (
                <AdminDock currentPage="accommodation" />
            ) : (
                <DashboardDock userName={profile?.full_name} userRole={profile?.role} isExternal={isExternal} currentPage="accommodation" />
            )}

            <div className="px-4 sm:px-6 py-6 sm:py-8 mr-0 md:mr-20 relative z-10 pb-24 md:pb-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-1 sm:mb-2">Accommodation</h1>
                        <p className="text-white/60 text-sm sm:text-base">Request accommodation for the event</p>
                    </div>

                    {/* Show message for non-external users */}
                    {!isExternal && profile?.role !== 'admin' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6"
                        >
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-8 h-8 text-amber-400 flex-shrink-0" />
                                <div>
                                    <h2 className="text-xl font-heading text-white mb-2">Accommodation Not Available</h2>
                                    <p className="text-white/60">
                                        Accommodation is available <strong className="text-amber-400">only for external participants</strong>.
                                        As a VIT student, you are not eligible for accommodation.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : request ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Status Card */}
                            <div className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                    <h2 className="text-2xl font-heading text-white">Your Request</h2>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {getPaymentStatusBadge(request.payment_status)}
                                        {getStatusBadge(request.status)}
                                    </div>
                                </div>

                                {/* Food info reminder */}
                                <div className="mb-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-blue-300 text-xs">
                                        <strong>Food:</strong> Participants can either pay and take their food from the hostel mess or arrange their own meals.
                                    </p>
                                </div>

                                {/* Check-in/Check-out time notice */}
                                <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-purple-300 text-xs">
                                        <strong>Check-in & Check-out Time:</strong> 10:00 AM
                                    </p>
                                </div>

                                {/* Payment Status Messages */}
                                {request.payment_status === 'pending_verification' && request.status !== 'rejected' && (
                                    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                        <p className="text-amber-300 text-sm">
                                            ⏳ Your payment of ₹{request.payment_amount} is being verified. This typically takes 24 hours.
                                            {request.payment_utr && (
                                                <span className="block mt-1 font-mono text-amber-400">UTR: {request.payment_utr}</span>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {request.payment_status === 'paid' && request.status === 'pending' && (
                                    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <p className="text-blue-300 text-sm">
                                            ✅ Payment verified! Your accommodation request is now under review.
                                        </p>
                                    </div>
                                )}

                                {request.payment_status === 'rejected' && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <p className="text-red-300 text-sm">
                                            ❌ Your payment could not be verified. Please contact the organizers for assistance.
                                        </p>
                                    </div>
                                )}

                                {request.status === 'rejected' && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <p className="text-red-300 text-sm mb-4">
                                            ❌ Your accommodation request was rejected.
                                            {request.admin_notes && (
                                                <span className="block mt-2"><strong>Reason:</strong> {request.admin_notes}</span>
                                            )}
                                        </p>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const { error } = await supabase
                                                        .from('accommodation_requests')
                                                        .delete()
                                                        .eq('id', request.id);

                                                    if (error) throw error;

                                                    setRequest(null);
                                                } catch (error: any) {
                                                    console.error('Delete error:', error);
                                                }
                                            }}
                                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white font-bold hover:shadow-lg hover:shadow-[#a855f7]/20 transition-all"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}

                                {request.status === 'approved' && request.payment_status === 'paid' && (
                                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                        <p className="text-green-300 text-sm">
                                            ✅ Your accommodation has been confirmed! We&apos;ll contact you soon with further details.
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Name</p>
                                            <p className="text-white font-medium">{request.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Email</p>
                                            <p className="text-white font-medium">{request.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Phone</p>
                                            <p className="text-white font-medium">{request.phone_number}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">College</p>
                                            <p className="text-white font-medium">{request.college_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Selected Days ({request.selected_days?.length || 0})</p>
                                            <p className="text-white font-medium">{formatSelectedDays(request.selected_days)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Payment Amount</p>
                                            <p className="text-white font-medium">₹{request.payment_amount}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-white/40 text-xs">
                                        Submitted on {new Date(request.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <AccommodationForm />
                    )}
                </div>
            </div>
        </main>
    );
}
