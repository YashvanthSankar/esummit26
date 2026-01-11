'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, Calendar, User, Phone, Building2, Eye, CreditCard, IndianRupee, Search, ShieldAlert } from 'lucide-react';
import AdminDock from '@/components/AdminDock';
import { toast } from 'sonner';
import Image from 'next/image';
import { canApprovePayments, type UserRole } from '@/types/database';

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
    // Payment fields
    payment_status: 'pending' | 'pending_verification' | 'paid' | 'rejected' | null;
    payment_amount: number | null;
    payment_utr: string | null;
    payment_owner_name: string | null;
    payment_screenshot_path: string | null;
}

export default function AdminAccommodationPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<AccommodationRequest[]>([]);
    const [allRequests, setAllRequests] = useState<AccommodationRequest[]>([]); // For analytics - unfiltered
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending_verification' | 'paid' | 'rejected'>('all');
    const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female'>('all');
    const [selectedRequest, setSelectedRequest] = useState<AccommodationRequest | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    // Fetch user role on mount
    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (profile) {
                    setUserRole(profile.role as UserRole);
                }
            }
        };
        fetchUserRole();
    }, []);

    // Fetch all requests (for analytics) - only on mount
    const loadAllRequests = async () => {
        const { data, error } = await supabase
            .from('accommodation_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setAllRequests(data);
        }
    };

    const loadRequests = async () => {
        setLoading(true);
        let query = supabase
            .from('accommodation_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        if (paymentFilter !== 'all') {
            query = query.eq('payment_status', paymentFilter);
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

    // Load all requests once on mount (for analytics)
    useEffect(() => {
        loadAllRequests();
    }, []);

    // Load filtered requests when filters change
    useEffect(() => {
        loadRequests();
    }, [filter, paymentFilter, genderFilter]);


    // Generate signed URL for secure image access
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    const fetchImageUrl = async (path: string) => {
        if (!path || imageUrls[path]) return;
        const { data, error } = await supabase.storage
            .from('payment-proofs')
            .createSignedUrl(path, 300);
        if (!error && data) {
            setImageUrls(prev => ({ ...prev, [path]: data.signedUrl }));
        }
    };

    // Prefetch URLs when selectedRequest changes
    useEffect(() => {
        if (selectedRequest?.payment_screenshot_path) {
            fetchImageUrl(selectedRequest.payment_screenshot_path);
        }
        // Also prefetch ID proof if it's a path (not a full URL)
        if (selectedRequest?.id_proof_url && !selectedRequest.id_proof_url.startsWith('http')) {
            fetchIdProofUrl(selectedRequest.id_proof_url);
        }
    }, [selectedRequest]);

    // Signed URL for ID proofs (id_proofs bucket)
    const [idProofUrls, setIdProofUrls] = useState<Record<string, string>>({});

    const fetchIdProofUrl = async (path: string) => {
        if (!path || idProofUrls[path]) return;
        const { data, error } = await supabase.storage
            .from('id_proofs')
            .createSignedUrl(path, 300);
        if (!error && data) {
            setIdProofUrls(prev => ({ ...prev, [path]: data.signedUrl }));
        }
    };

    // Get ID proof URL - handles both legacy full URLs and new paths
    const getIdProofUrl = (urlOrPath: string): string | null => {
        if (urlOrPath.startsWith('http')) {
            return urlOrPath; // Legacy full URL
        }
        return idProofUrls[urlOrPath] || null; // New path-based storage
    };

    // Approve/Reject accommodation request
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

    // Verify/Reject payment
    const handleVerifyPayment = async (requestId: string) => {
        setProcessing(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('accommodation_requests')
            .update({
                payment_status: 'paid',
                payment_verified_at: new Date().toISOString(),
                payment_verified_by: user?.id
            })
            .eq('id', requestId);

        if (error) {
            toast.error('Failed to verify payment');
            console.error(error);
        } else {
            toast.success('Payment verified successfully');
            setSelectedRequest(null);
            loadRequests();
        }
        setProcessing(false);
    };

    const handleRejectPayment = async (requestId: string) => {
        setProcessing(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('accommodation_requests')
            .update({
                payment_status: 'rejected',
                payment_verified_at: new Date().toISOString(),
                payment_verified_by: user?.id
            })
            .eq('id', requestId);

        if (error) {
            toast.error('Failed to reject payment');
            console.error(error);
        } else {
            toast.success('Payment rejected');
            setSelectedRequest(null);
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

    const getPaymentStatusBadge = (status: string | null) => {
        switch (status) {
            case 'paid':
                return (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded">
                        <IndianRupee className="w-3 h-3 text-green-400" />
                        <span className="text-green-400 text-xs font-bold">Paid</span>
                    </div>
                );
            case 'pending_verification':
                return (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400 text-xs font-bold">Verify</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded">
                        <XCircle className="w-3 h-3 text-red-400" />
                        <span className="text-red-400 text-xs font-bold">Failed</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 border border-white/20 rounded">
                        <CreditCard className="w-3 h-3 text-white/40" />
                        <span className="text-white/40 text-xs font-bold">No Pay</span>
                    </div>
                );
        }
    };

    // Get payment screenshot URL (from cached signed URLs)
    const getPaymentScreenshotUrl = (path: string | null): string | null => {
        if (!path) return null;
        return imageUrls[path] || null;
    };

    const stats = {
        total: allRequests.length,
        pending: allRequests.filter(r => r.status === 'pending').length,
        approved: allRequests.filter(r => r.status === 'approved').length,
        rejected: allRequests.filter(r => r.status === 'rejected').length,
        male: allRequests.filter(r => r.gender === 'Male').length,
        female: allRequests.filter(r => r.gender === 'Female').length,
        pendingPayment: allRequests.filter(r => r.payment_status === 'pending_verification').length,
    };

    const filteredRequests = requests.filter(req => {
        const search = searchTerm.toLowerCase();
        return req.name.toLowerCase().includes(search) ||
            req.email.toLowerCase().includes(search) ||
            req.phone_number.includes(search) ||
            req.college_name.toLowerCase().includes(search) ||
            (req.payment_utr && req.payment_utr.includes(search));
    });

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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
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
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                            <p className="text-purple-300/70 text-xs mb-1">Verify Pay</p>
                            <p className="text-purple-400 text-2xl font-bold">{stats.pendingPayment}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex gap-2">
                            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                        ? 'bg-[#a855f7] text-white'
                                        : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'pending_verification', 'paid', 'rejected'] as const).map((pStatus) => (
                                <button
                                    key={pStatus}
                                    onClick={() => setPaymentFilter(pStatus)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${paymentFilter === pStatus
                                        ? 'bg-green-600 text-white'
                                        : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                        }`}
                                >
                                    {pStatus === 'pending_verification' ? 'Verify Pay' : pStatus === 'all' ? 'All Pay' : pStatus.charAt(0).toUpperCase() + pStatus.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'Male', 'Female'] as const).map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => setGenderFilter(gender)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${genderFilter === gender
                                        ? 'bg-[#a855f7] text-white'
                                        : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                        }`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search name, email, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a855f7]/50"
                            />
                        </div>
                    </div>

                    {/* Requests Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                            No requests found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredRequests.map((request) => (
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
                                        <div className="flex flex-col items-end gap-1">
                                            {getStatusBadge(request.status)}
                                            {getPaymentStatusBadge(request.payment_status)}
                                        </div>
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
                                        {request.payment_utr && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <CreditCard className="w-4 h-4 text-white/40" />
                                                <span className="text-white/70 font-mono">UTR: {request.payment_utr}</span>
                                            </div>
                                        )}
                                    </div>

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
                        className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedRequest.name}</h2>
                                    <p className="text-white/60">{selectedRequest.email}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {getStatusBadge(selectedRequest.status)}
                                    {getPaymentStatusBadge(selectedRequest.payment_status)}
                                </div>
                            </div>

                            {/* Payment Info Section */}
                            {(selectedRequest.payment_utr || selectedRequest.payment_screenshot_path) && (
                                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Details (₹{selectedRequest.payment_amount || 500})
                                    </h3>

                                    {selectedRequest.payment_utr && (
                                        <p className="text-white font-mono text-sm mb-3">
                                            UTR: <span className="text-purple-300">{selectedRequest.payment_utr}</span>
                                        </p>
                                    )}

                                    {selectedRequest.payment_owner_name && (
                                        <p className="text-white font-mono text-sm mb-3">
                                            Owner: <span className="text-purple-300">{selectedRequest.payment_owner_name}</span>
                                        </p>
                                    )}

                                    {selectedRequest.payment_screenshot_path && (
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5 mb-3">
                                            <Image
                                                src={getPaymentScreenshotUrl(selectedRequest.payment_screenshot_path) || ''}
                                                alt="Payment Screenshot"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {selectedRequest.payment_status === 'pending_verification' && (
                                        <div className="flex gap-3 mt-4">
                                            {userRole && canApprovePayments(userRole) ? (
                                                <>
                                                    <button
                                                        onClick={() => handleVerifyPayment(selectedRequest.id)}
                                                        disabled={processing}
                                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                        Verify Payment
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectPayment(selectedRequest.id)}
                                                        disabled={processing}
                                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                        Reject Payment
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                                                    <span className="text-amber-400 text-sm font-medium">Only Super Admins can verify payments</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ID Proof */}
                            <div className="mb-6">
                                <p className="text-white/60 text-sm mb-2">ID Proof:</p>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                                    {getIdProofUrl(selectedRequest.id_proof_url) ? (
                                        <Image
                                            src={getIdProofUrl(selectedRequest.id_proof_url)!}
                                            alt="ID Proof"
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                                        </div>
                                    )}
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
                                    userRole && canApprovePayments(userRole) ? (
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
                                                        Approve Request
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
                                                        Reject Request
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                            <ShieldAlert className="w-5 h-5 text-amber-400" />
                                            <span className="text-amber-400 text-sm font-medium">Super Admin Only</span>
                                        </div>
                                    )
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
