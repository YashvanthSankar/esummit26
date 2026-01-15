'use client';

import { useProfile } from '@/lib/hooks/useProfile';
import { useTicket } from '@/lib/hooks/useTicket';
import { motion } from 'framer-motion';
import DashboardDock from '@/components/DashboardDock';
import AdminDock from '@/components/AdminDock';
import AppRating from '@/components/AppRating';
import { User, Loader2, Ticket, ShoppingBag, Bed, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const { data: profile, isLoading: profileLoading } = useProfile();
    const { data: ticket, isLoading: ticketLoading } = useTicket(profile?.email);

    const loading = profileLoading || ticketLoading;
    const isExternal = profile?.role === 'external';
    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

    const getTicketStatusBadge = () => {
        if (!ticket) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 text-white/50 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    No Pass
                </span>
            );
        }
        switch (ticket.status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Pass Active
                    </span>
                );
            case 'pending_verification':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
                        <Clock className="w-3 h-3" />
                        Verifying
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 text-white/50 text-xs">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </main>
        );
    }

    if (!profile) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return null;
    }

    // Quick action cards
    const quickActions = [
        {
            title: 'Event Pass',
            description: ticket?.status === 'paid' ? 'View your pass' : 'Get your entry pass',
            icon: Ticket,
            href: '/dashboard/pass',
            color: 'from-[#a855f7] to-[#7c3aed]',
            status: getTicketStatusBadge()
        },
        {
            title: 'Merchandise',
            description: 'Buy E-Summit merch',
            icon: ShoppingBag,
            href: '/dashboard/merch',
            color: 'from-[#f97316] to-[#ea580c]',
        },
        ...(isExternal ? [{
            title: 'Accommodation',
            description: 'Book your stay',
            icon: Bed,
            href: '/dashboard/accommodation',
            color: 'from-[#06b6d4] to-[#0891b2]',
        }] : []),
    ];

    return (
        <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden pb-24 md:pb-8">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Dock Navigation */}
            {isAdmin ? (
                <AdminDock currentPage="dashboard" userName={profile?.full_name} />
            ) : (
                <DashboardDock
                    userName={profile?.full_name}
                    userRole={profile?.role}
                    isExternal={isExternal}
                    currentPage="dashboard"
                />
            )}

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white">
                        Dashboard
                    </h1>
                    <p className="font-body text-white/50 mt-1 text-sm">
                        Welcome, {profile?.full_name?.split(' ')[0] || 'Participant'}!
                    </p>
                </div>

                {/* Profile Card - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6"
                >
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#a855f7]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="font-heading text-lg sm:text-xl text-white truncate">{profile?.full_name}</h2>
                                <span className="px-2 py-0.5 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] text-xs font-mono uppercase">
                                    {profile?.role}
                                </span>
                            </div>
                            <p className="font-body text-white/50 text-xs sm:text-sm truncate mt-0.5">{profile?.email}</p>
                        </div>
                    </div>

                    {/* Compact Details - Mobile Scroll */}
                    <div className="flex gap-3 sm:gap-4 mt-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                        <div className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5">
                            <p className="font-mono text-[10px] text-white/40 uppercase">Phone</p>
                            <p className="font-body text-white text-xs sm:text-sm">{profile?.phone}</p>
                        </div>
                        <div className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5">
                            <p className="font-mono text-[10px] text-white/40 uppercase">College</p>
                            <p className="font-body text-white text-xs sm:text-sm truncate max-w-[150px]">{profile?.college_name}</p>
                        </div>
                        {profile?.roll_number && (
                            <div className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5">
                                <p className="font-mono text-[10px] text-white/40 uppercase">Roll No</p>
                                <p className="font-body text-white text-xs sm:text-sm">{profile?.roll_number}</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="mb-4 sm:mb-6">
                    <h3 className="font-heading text-base sm:text-lg text-white mb-3">Quick Actions</h3>
                    <div className={`grid gap-3 ${isExternal ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                        {quickActions.map((action, index) => (
                            <motion.a
                                key={action.title}
                                href={action.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-all"
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                <div className="relative flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                                        <action.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-heading text-sm sm:text-base text-white">{action.title}</h4>
                                            {action.status}
                                        </div>
                                        <p className="font-body text-white/50 text-xs mt-0.5">{action.description}</p>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* App Rating - Only for users with paid tickets */}
                {profile && ticket?.status === 'paid' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="font-heading text-base sm:text-lg text-white mb-3">Rate Your Experience</h3>
                        <AppRating userId={profile.id} />
                    </motion.div>
                )}
            </div>
        </main>
    );
}
