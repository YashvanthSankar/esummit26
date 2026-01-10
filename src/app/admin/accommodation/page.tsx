'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, Calendar, User, Mail, Phone, Building2, FileText, Eye } from 'lucide-react';
import AdminDock from '@/components/AdminDock';
import { toast } from 'sonner';
import Image from 'next/image';

interface AccommodationRequest {
    id: string;
    user_id: string;
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

export default function AdminAccommodationPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<AccommodationRequest[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female'>('all');
    const [selectedRequest, setSelectedRequest] = useState<AccommodationRequest | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    const loadRequests = async () => {
        setLoading(true);
        let query = supabase
            .from('accommodation_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        if (genderFilter !== 'all') {
            query = query.eq('gender', genderFilter);
        }

        const { data, error } = await query;

        if (error) {
            toast.error('Failed to load requests');
            console.error(error);
        } else {
            setRequests(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, [filter, genderFilter]);

    const handleApprove = async (requestId: string) => {
        setProcessing(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
            .from('accommodation_requests')
            .update({
                status: 'approved',
                admin_notes: adminNotes || null,
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', requestId);

        if (error) {
            toast.error('Failed to approve request');
            console.error(error);
        } else {
            toast.success('Request approved successfully');
            setSelectedRequest(null);
            setAdminNotes('');
            loadRequests();
        }
        setProcessing(false);
    };

    const handleReject = async (requestId: string) => {
        if (!adminNotes.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setProcessing(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
            .from('accommodation_requests')
            .update({
                status: 'rejected',
                admin_notes: adminNotes,
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', requestId);

        if (error) {
            toast.error('Failed to reject request');
            console.error(error);
        } else {
            toast.success('Request rejected');
            setSelectedRequest(null);
            setAdminNotes('');
            loadRequests();
        }
        setProcessing(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-xs font-bold">Approved</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-xs font-bold">Rejected</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 text-xs font-bold">Pending</span>
                    </div>
                );
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        male: requests.filter(r => r.gender === 'Male').length,
        female: requests.filter(r => r.gender === 'Female').length,
    };

    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            <AdminDock currentPage="accommodation" />

            <div className="px-4 sm:px-6 py-8 sm:py-12 mr-0 md:mr-20 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="font-heading text-4xl text-white mb-2">Accommodation Requests</h1>
                        <p className="text-white/60">Review and manage accommodation requests</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <div className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1">Total</p>
                            <p className="text-white text-2xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                            <p className="text-amber-300/70 text-xs mb-1">Pending</p>
                            <p className="text-amber-400 text-2xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <p className="text-green-300/70 text-xs mb-1">Approved</p>
                            <p className="text-green-400 text-2xl font-bold">{stats.approved}</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-red-300/70 text-xs mb-1">Rejected</p>
                            <p className="text-red-400 text-2xl font-bold">{stats.rejected}</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <p className="text-blue-300/70 text-xs mb-1">Male</p>
                            <p className="text-blue-400 text-2xl font-bold">{stats.male}/60</p>
                        </div>
                        <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                            <p className="text-pink-300/70 text-xs mb-1">Female</p>
                            <p className="text-pink-400 text-2xl font-bold">{stats.female}/60</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex gap-2">
                            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filter === status
                                            ? 'bg-[#a855f7] text-white'
                                            : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'Male', 'Female'] as const).map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => setGenderFilter(gender)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        genderFilter === gender
                                            ? 'bg-[#a855f7] text-white'
                                            : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                    }`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Requests Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                            No requests found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {requests.map((request) => (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#a855f7]/30 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{request.name}</h3>
                                            <p className="text-white/50 text-sm">{request.email}</p>
                                        </div>
                                        {getStatusBadge(request.status)}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70">{request.phone_number}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Building2 className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70">{request.college_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70">{request.gender}, {request.age} years</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70">
                                                {new Date(request.date_of_arrival).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.date_of_departure).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {request.status === 'pending' && (
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setAdminNotes('');
                                            }}
                                            className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Review Request
                                        </button>
                                    )}

                                    {request.admin_notes && (
                                        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-white/50 text-xs mb-1">Admin Notes:</p>
                                            <p className="text-white/70 text-sm">{request.admin_notes}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedRequest.name}</h2>
                                    <p className="text-white/60">{selectedRequest.email}</p>
                                </div>
                                {getStatusBadge(selectedRequest.status)}
                            </div>

                            {/* ID Proof */}
                            <div className="mb-6">
                                <p className="text-white/60 text-sm mb-2">ID Proof:</p>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                                    <Image
                                        src={selectedRequest.id_proof_url}
                                        alt="ID Proof"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-white/40 text-xs mb-1">Phone Number</p>
                                    <p className="text-white">{selectedRequest.phone_number}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs mb-1">Age</p>
                                    <p className="text-white">{selectedRequest.age} years</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs mb-1">Gender</p>
                                    <p className="text-white">{selectedRequest.gender}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs mb-1">College</p>
                                    <p className="text-white">{selectedRequest.college_name}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs mb-1">Check-in</p>
                                    <p className="text-white">
                                        {new Date(selectedRequest.date_of_arrival).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs mb-1">Check-out</p>
                                    <p className="text-white">
                                        {new Date(selectedRequest.date_of_departure).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div className="mb-6">
                                <label className="text-white/60 text-sm mb-2 block">
                                    Admin Notes {selectedRequest.status === 'pending' && '(Required for rejection)'}
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 min-h-[100px]"
                                    disabled={selectedRequest.status !== 'pending'}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {selectedRequest.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => handleApprove(selectedRequest.id)}
                                            disabled={processing}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {processing ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Approve
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedRequest.id)}
                                            disabled={processing}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {processing ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5" />
                                                    Reject
                                                </>
                                            )}
                                        </button>
                                    </>
                                ) : null}
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className={`${selectedRequest.status === 'pending' ? '' : 'flex-1'} bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    );
}
