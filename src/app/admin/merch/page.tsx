'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, ShoppingBag, CreditCard, Eye, Package, Search, ShieldAlert } from 'lucide-react';
import AdminDock from '@/components/AdminDock';
import { toast } from 'sonner';
import Image from 'next/image';
import { canApprovePayments, type UserRole } from '@/types/database';
import { MERCH_ITEMS, MerchItemType } from '@/types/payment';

// Helper to get item label safely
const getItemLabel = (itemKey: string): string => {
    if (itemKey in MERCH_ITEMS) {
        return MERCH_ITEMS[itemKey as MerchItemType].label;
    }
    return itemKey; // Fallback to raw key for legacy orders
};

// Helper to get item image safely
const getItemImage = (itemKey: string): string | null => {
    if (itemKey in MERCH_ITEMS) {
        return MERCH_ITEMS[itemKey as MerchItemType].image;
    }
    return null;
};

// Bundle Item Interface
interface BundleItem {
    item: string;
    size: string;
    index: number;
}

// Order Interface matching the new Schema
interface MerchOrder {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone_number: string;

    // Bundle fields
    bundle_type: 'solo' | 'duo' | 'triple' | 'quad';
    item_type: string;
    bundle_items: BundleItem[];
    total_items: number;

    // Payment fields
    amount: number;
    payment_status: 'pending' | 'pending_verification' | 'paid' | 'rejected' | null;
    payment_utr: string | null;
    payment_owner_name: string | null;
    payment_screenshot_path: string | null;

    // Status fields
    status: 'pending' | 'confirmed' | 'rejected' | 'delivered';
    admin_notes: string | null;
    created_at: string;
}

// Bundle Display Helpers
const BUNDLE_LABELS = {
    solo: { label: 'Solo Bundle', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    duo: { label: 'Duo Bundle', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    triple: { label: 'Triple Bundle', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    quad: { label: 'Quad Bundle', color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export default function AdminMerchPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<MerchOrder[]>([]);
    const [allOrders, setAllOrders] = useState<MerchOrder[]>([]); // For analytics - unfiltered
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected' | 'delivered'>('pending');
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending_verification' | 'paid'>('all');
    const [selectedOrder, setSelectedOrder] = useState<MerchOrder | null>(null);
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

    // Fetch all orders (for analytics) - only on mount
    const loadAllOrders = async () => {
        const { data, error } = await supabase
            .from('merch_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setAllOrders(data);
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        let query = supabase
            .from('merch_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        if (paymentFilter !== 'all') {
            query = query.eq('payment_status', paymentFilter);
        }

        const { data, error } = await query;

        if (error) {
            toast.error('Failed to load orders');
            console.error(error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    // Load all orders once on mount (for analytics)
    useEffect(() => {
        loadAllOrders();
    }, []);

    // Load filtered orders when filters change
    useEffect(() => {
        loadOrders();
    }, [filter, paymentFilter]);

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

    // Prefetch URLs when selectedOrder changes
    useEffect(() => {
        if (selectedOrder?.payment_screenshot_path) {
            fetchImageUrl(selectedOrder.payment_screenshot_path);
        }
    }, [selectedOrder]);

    const handleVerifyPayment = async (orderId: string) => {
        setProcessing(true);
        const { data: { user } } = await supabase.auth.getUser();

        // Verify payment AND auto-confirm the order in one step
        const { error } = await supabase
            .from('merch_orders')
            .update({
                payment_status: 'paid',
                status: 'confirmed',  // Auto-confirm when payment verified
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', orderId);

        if (error) {
            toast.error('Failed to verify payment');
        } else {
            toast.success('Payment verified & order confirmed');
            setSelectedOrder(null);
            loadOrders();
        }
        setProcessing(false);
    };

    const handleMarkDelivered = async (orderId: string) => {
        setProcessing(true);

        const { error } = await supabase
            .from('merch_orders')
            .update({ status: 'delivered' })
            .eq('id', orderId);

        if (error) {
            toast.error('Failed to update');
        } else {
            toast.success('Marked as delivered');
            setSelectedOrder(null);
            loadOrders();
        }
        setProcessing(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">Confirmed</span>;
            case 'delivered':
                return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">Delivered</span>;
            case 'rejected':
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">Rejected</span>;
            default:
                return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">Pending</span>;
        }
    };

    const getPaymentScreenshotUrl = (path: string | null): string | null => {
        if (!path) return null;
        return imageUrls[path] || null;
    };

    const stats = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        confirmed: allOrders.filter(o => o.status === 'confirmed').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        pendingPayment: allOrders.filter(o => o.payment_status === 'pending_verification').length,
        totalRevenue: allOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.amount, 0),
    };

    const filteredOrders = orders.filter(order => {
        const search = searchTerm.toLowerCase();
        return order.name.toLowerCase().includes(search) ||
            order.email.toLowerCase().includes(search) ||
            order.phone_number.includes(search) ||
            (order.payment_utr && order.payment_utr.includes(search));
    });

    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden">
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            <AdminDock currentPage="merch" />

            <div className="px-4 sm:px-6 py-8 sm:py-12 mr-0 md:mr-20 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="font-heading text-4xl text-white mb-2">Merchandise Orders</h1>
                        <p className="text-white/60">Manage merchandise orders and payments</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1">Total Orders</p>
                            <p className="text-white text-2xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                            <p className="text-amber-300/70 text-xs mb-1">Pending</p>
                            <p className="text-amber-400 text-2xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <p className="text-green-300/70 text-xs mb-1">Confirmed</p>
                            <p className="text-green-400 text-2xl font-bold">{stats.confirmed}</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <p className="text-blue-300/70 text-xs mb-1">Delivered</p>
                            <p className="text-blue-400 text-2xl font-bold">{stats.delivered}</p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                            <p className="text-purple-300/70 text-xs mb-1">Verify Pay</p>
                            <p className="text-purple-400 text-2xl font-bold">{stats.pendingPayment}</p>
                        </div>
                        <div className="bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-xl p-4">
                            <p className="text-[#a855f7]/70 text-xs mb-1">Revenue</p>
                            <p className="text-[#a855f7] text-2xl font-bold">₹{stats.totalRevenue}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex gap-2">
                            {(['all', 'pending', 'confirmed', 'delivered', 'rejected'] as const).map((status) => (
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
                            {(['all', 'pending_verification', 'paid'] as const).map((pStatus) => (
                                <button
                                    key={pStatus}
                                    onClick={() => setPaymentFilter(pStatus)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${paymentFilter === pStatus
                                        ? 'bg-green-600 text-white'
                                        : 'bg-[#0a0a0a]/90 text-white/60 hover:text-white border border-white/10'
                                        }`}
                                >
                                    {pStatus === 'pending_verification' ? 'Verify Pay' : pStatus === 'all' ? 'All Pay' : 'Paid'}
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

                    {/* Orders Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-white/40">No orders found</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredOrders.map((order) => {
                                const bundleInfo = BUNDLE_LABELS[order.bundle_type] || BUNDLE_LABELS['solo'];
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-[#0a0a0a]/90 border border-white/10 rounded-xl p-5 hover:border-[#a855f7]/30 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-white font-bold">{order.name}</h3>
                                                <p className="text-white/50 text-xs font-mono">{order.email}</p>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <div className={`flex items-center gap-3 mb-3 p-3 rounded-lg ${bundleInfo.bg}`}>
                                            <ShoppingBag className={`w-6 h-6 ${bundleInfo.color}`} />
                                            <div>
                                                <p className="text-white font-medium">{bundleInfo.label}</p>
                                                <p className="text-white/50 text-xs">
                                                    {order.bundle_items.length} items • {order.total_items} total
                                                </p>
                                            </div>
                                            <p className="text-[#a855f7] font-bold ml-auto">₹{order.amount}</p>
                                        </div>

                                        <div className="space-y-1 mb-3 pl-2 border-l-2 border-white/10">
                                            {order.bundle_items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-white/60 text-xs">
                                                    {getItemImage(item.item) && (
                                                        <div className="relative w-6 h-6 rounded overflow-hidden bg-white/5 flex-shrink-0">
                                                            <Image
                                                                src={getItemImage(item.item)!}
                                                                alt={getItemLabel(item.item)}
                                                                fill
                                                                className="object-contain"
                                                                sizes="24px"
                                                            />
                                                        </div>
                                                    )}
                                                    <span>• {getItemLabel(item.item)} ({item.size})</span>
                                                </div>
                                            ))}
                                            {order.bundle_items.length > 2 && (
                                                <p className="text-white/40 text-xs italic">
                                                    + {order.bundle_items.length - 2} more...
                                                </p>
                                            )}
                                        </div>

                                        {order.payment_utr && (
                                            <p className="text-white/50 text-xs font-mono mb-3">UTR: {order.payment_utr}</p>
                                        )}

                                        {/* Quick Issue Toggle for confirmed orders OR paid pending orders */}
                                        {(order.status === 'confirmed' || (order.status === 'pending' && order.payment_status === 'paid')) && (
                                            <div className="flex items-center justify-between mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-green-400" />
                                                    <span className="text-green-400 text-sm font-medium">Ready to Issue</span>
                                                </div>
                                                <button
                                                    onClick={() => handleMarkDelivered(order.id)}
                                                    disabled={processing}
                                                    className="px-4 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
                                                >
                                                    {processing ? 'Issuing...' : 'Mark Issued'}
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Review Order
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedOrder.name}</h2>
                                    <p className="text-white/60">{selectedOrder.email}</p>
                                    <p className="text-white/50 text-sm">{selectedOrder.phone_number}</p>
                                    <p className="text-white/40 text-xs font-mono mt-1">Order ID: {selectedOrder.id}</p>
                                </div>
                                {getStatusBadge(selectedOrder.status)}
                            </div>

                            {/* Order Details */}
                            <div className={`p-4 rounded-xl mb-6 ${BUNDLE_LABELS[selectedOrder.bundle_type]?.bg || BUNDLE_LABELS.solo.bg}`}>
                                <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                                    <ShoppingBag className={`w-10 h-10 ${BUNDLE_LABELS[selectedOrder.bundle_type]?.color || BUNDLE_LABELS.solo.color}`} />
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-lg">
                                            {BUNDLE_LABELS[selectedOrder.bundle_type]?.label || 'Bundle'}
                                        </p>
                                        <p className="text-white/60">
                                            Contains {selectedOrder.total_items} items
                                        </p>
                                    </div>
                                    <p className="text-[#a855f7] font-heading text-2xl">₹{selectedOrder.amount}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-white/50 text-xs uppercase font-bold tracking-wider">Items included:</p>
                                    {selectedOrder.bundle_items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                                            {getItemImage(item.item) && (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                    <Image
                                                        src={getItemImage(item.item)!}
                                                        alt={getItemLabel(item.item)}
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="48px"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <span className="text-white text-sm font-medium">
                                                    {index + 1}. {getItemLabel(item.item)}
                                                </span>
                                            </div>
                                            <span className="text-white font-mono bg-white/10 px-3 py-1 rounded text-sm">
                                                {item.size}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Info */}
                            {(selectedOrder.payment_utr || selectedOrder.payment_screenshot_path) && (
                                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Details
                                    </h3>

                                    {selectedOrder.payment_utr && (
                                        <p className="text-white font-mono text-sm mb-3">
                                            UTR: <span className="text-purple-300">{selectedOrder.payment_utr}</span>
                                        </p>
                                    )}

                                    {selectedOrder.payment_owner_name && (
                                        <p className="text-white font-mono text-sm mb-3">
                                            Owner: <span className="text-purple-300">{selectedOrder.payment_owner_name}</span>
                                        </p>
                                    )}

                                    {selectedOrder.payment_screenshot_path && (
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5 mb-3">
                                            <Image
                                                src={getPaymentScreenshotUrl(selectedOrder.payment_screenshot_path) || ''}
                                                alt="Payment Screenshot"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {selectedOrder.payment_status === 'pending_verification' && (
                                        userRole && canApprovePayments(userRole) ? (
                                            <button
                                                onClick={() => handleVerifyPayment(selectedOrder.id)}
                                                disabled={processing}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Verify Payment
                                            </button>
                                        ) : (
                                            <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                                <ShieldAlert className="w-5 h-5 text-amber-400" />
                                                <span className="text-amber-400 text-sm font-medium">Only Super Admins can verify payments</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}



                            {/* Actions */}
                            <div className="flex gap-3">
                                {selectedOrder.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleMarkDelivered(selectedOrder.id)}
                                        disabled={processing}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
                                        Mark Delivered
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all"
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
