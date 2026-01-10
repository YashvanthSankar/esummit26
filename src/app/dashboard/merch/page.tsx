'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, ShoppingBag, CreditCard, Package } from 'lucide-react';
import MerchForm from '@/components/MerchForm';
import DashboardDock from '@/components/DashboardDock';
import AdminDock from '@/components/AdminDock';

interface MerchOrder {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    item_name: string;
    size: string;
    quantity: number;
    amount: number;
    payment_status: 'pending' | 'pending_verification' | 'paid' | 'rejected' | null;
    payment_utr: string | null;
    status: 'pending' | 'confirmed' | 'rejected' | 'delivered';
    admin_notes: string | null;
    created_at: string;
}

export default function MerchPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<MerchOrder[]>([]);

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

            // Fetch user's orders
            const { data: ordersData } = await supabase
                .from('merch_orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setOrders(ordersData || []);
            setLoading(false);
        };

        loadData();
    }, [supabase]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-bold">Confirmed</span>
                    </div>
                );
            case 'delivered':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-bold">Delivered</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm font-bold">Rejected</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 text-sm font-bold">Pending</span>
                    </div>
                );
        }
    };

    const getPaymentStatusBadge = (paymentStatus: string | null, orderStatus: string) => {
        switch (paymentStatus) {
            case 'paid':
                return (
                    <span className="text-green-400 text-xs font-bold">Payment Verified</span>
                );
            case 'pending_verification':
                if (orderStatus === 'confirmed' || orderStatus === 'delivered') {
                    return <span className="text-green-400 text-xs font-bold">Payment Verified</span>;
                }
                return (
                    <span className="text-amber-400 text-xs font-bold">Verifying Payment</span>
                );
            case 'rejected':
                return (
                    <span className="text-red-400 text-xs font-bold">Payment Rejected</span>
                );
            default:
                return null;
        }
    };

    const handleTryAgain = async (orderId: string) => {
        try {
            const { error } = await supabase
                .from('merch_orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;
            setOrders(orders.filter(o => o.id !== orderId));
        } catch (error) {
            console.error('Delete error:', error);
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
                        <h1 className="font-heading text-4xl text-white mb-2">Merchandise</h1>
                        <p className="text-white/60">Order E-Summit merchandise</p>
                    </div>

                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-heading text-white">Your Orders</h2>

                            {orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <ShoppingBag className="w-8 h-8 text-[#a855f7]" />
                                            <div>
                                                <h3 className="text-white font-bold text-lg">{order.item_name}</h3>
                                                <p className="text-white/50 text-sm">Size: {order.size} • Qty: {order.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {getStatusBadge(order.status)}
                                            {getPaymentStatusBadge(order.payment_status, order.status)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-white/40" />
                                            <span className="text-[#a855f7] font-heading text-xl">₹{order.amount}</span>
                                        </div>
                                        <p className="text-white/40 text-xs">
                                            Ordered {new Date(order.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {order.payment_status === 'pending_verification' &&
                                        order.status !== 'rejected' &&
                                        order.status !== 'confirmed' &&
                                        order.status !== 'delivered' && (
                                            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                                <p className="text-amber-300 text-sm">
                                                    ⏳ Payment verification in progress...
                                                    {order.payment_utr && <span className="block mt-1 font-mono">UTR: {order.payment_utr}</span>}
                                                </p>
                                            </div>
                                        )}

                                    {order.status === 'confirmed' && (
                                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                            <p className="text-green-300 text-sm">
                                                ✅ Order confirmed! Collect at the event venue.
                                            </p>
                                        </div>
                                    )}

                                    {order.status === 'rejected' && (
                                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <p className="text-red-300 text-sm mb-3">
                                                ❌ Order rejected.
                                                {order.admin_notes && <span className="block mt-1"><strong>Reason:</strong> {order.admin_notes}</span>}
                                            </p>
                                            <button
                                                onClick={() => handleTryAgain(order.id)}
                                                className="px-4 py-2 rounded-lg bg-[#a855f7] text-white font-bold text-sm hover:bg-[#9333ea] transition-all"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Show form for new order */}
                            <div className="mt-12">
                                <h2 className="text-2xl font-heading text-white mb-6">Order More</h2>
                                <MerchForm />
                            </div>
                        </div>
                    ) : (
                        <MerchForm />
                    )}
                </div>
            </div>
        </main>
    );
}
