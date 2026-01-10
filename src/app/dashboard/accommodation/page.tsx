'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, Calendar, User, Mail, Phone, Building2, FileText } from 'lucide-react';
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
    date_of_arrival: string;
    date_of_departure: string;
    id_proof_url: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    reviewed_at: string | null;
    created_at: string;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            {/* Dock Navigation */}
            {profile?.role === 'admin' ? (
                <AdminDock currentPage="dashboard" />
            ) : (
                <DashboardDock userName={profile?.full_name} userRole={profile?.role} />
            )}

            <div className="px-4 sm:px-6 py-8 sm:py-12 mr-0 md:mr-20 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="font-heading text-4xl text-white mb-2">Accommodation</h1>
                        <p className="text-white/60">Request accommodation for the event</p>
                    </div>

                    {request ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Status Card */}
                            <div className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-heading text-white">Your Request</h2>
                                    {getStatusBadge(request.status)}
                                </div>

                                {request.status === 'rejected' && request.admin_notes && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <p className="text-red-300 text-sm">
                                            <strong>Reason:</strong> {request.admin_notes}
                                        </p>
                                    </div>
                                )}

                                {request.status === 'approved' && (
                                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                        <p className="text-green-300 text-sm">
                                            ✅ Your accommodation has been confirmed! We'll contact you soon with further details.
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

                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Check-in</p>
                                            <p className="text-white font-medium">
                                                {new Date(request.date_of_arrival).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Check-out</p>
                                            <p className="text-white font-medium">
                                                {new Date(request.date_of_departure).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Gender</p>
                                            <p className="text-white font-medium">{request.gender}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/50 text-xs">Age</p>
                                            <p className="text-white font-medium">{request.age} years</p>
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
