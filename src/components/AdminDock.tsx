'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LogOut, Menu, X, LayoutDashboard, CheckCircle, QrCode, Users, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminDockProps {
    userName?: string;
    currentPage?: 'dashboard' | 'verify' | 'scan' | 'users';
}

export default function AdminDock({ userName, currentPage }: AdminDockProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const dockItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Shield, label: 'Admin', href: '/admin' },
        { icon: CheckCircle, label: 'Verify', href: '/admin/verify' },
        { icon: QrCode, label: 'Scanner', href: '/admin/scan' },
        { icon: Users, label: 'Users', href: '/admin/users' },
    ];

    return (
        <>
            {/* Desktop: Right side vertical dock */}
            <motion.nav
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-[9999]"
            >
                <div className="dock flex flex-col items-center gap-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-2xl shadow-black/60 ring-1 ring-black/50">
                    {dockItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = currentPage && item.href.includes(currentPage);
                        return (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                className={`dock-item group relative p-3 rounded-xl transition-colors ${isActive ? 'bg-[#a855f7]/20' : 'hover:bg-white/10'
                                    }`}
                                whileHover={{ x: -8, scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                data-hover="true"
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#a855f7]' : 'text-white/70 group-hover:text-[#a855f7]'
                                    }`} />

                                {/* Tooltip on left */}
                                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#a855f7] text-[#050505] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {item.label}
                                </span>
                            </motion.a>
                        );
                    })}

                    {/* Divider */}
                    <div className="w-6 h-px bg-white/10 my-2" />

                    {/* Sign Out */}
                    <motion.button
                        onClick={handleSignOut}
                        className="dock-item group relative p-3 rounded-xl hover:bg-red-500/20 transition-colors"
                        whileHover={{ x: -8, scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        data-hover="true"
                    >
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />

                        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Sign Out
                        </span>
                    </motion.button>
                </div>
            </motion.nav>

            {/* Mobile: Floating hamburger button */}
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#a855f7] text-[#050505] flex items-center justify-center shadow-lg shadow-[#a855f7]/20"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>

            {/* Mobile: Full screen menu overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-[#050505]/90 backdrop-blur-md z-[9998]"
                        />

                        {/* Menu Content */}
                        <motion.nav
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden fixed bottom-24 left-0 right-0 z-[9998] px-6"
                        >
                            <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
                                {userName && (
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-[#a855f7]" />
                                        </div>
                                        <div>
                                            <p className="text-white font-heading text-sm">{userName}</p>
                                            <p className="text-[#a855f7] text-xs font-mono">ADMIN</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {dockItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = currentPage && item.href.includes(currentPage);
                                        return (
                                            <motion.a
                                                key={item.label}
                                                href={item.href}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors ${isActive ? 'bg-[#a855f7]/20' : 'hover:bg-white/5'
                                                    }`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#a855f7]/30' : 'bg-[#a855f7]/10'
                                                    }`}>
                                                    <Icon className="w-5 h-5 text-[#a855f7]" />
                                                </div>
                                                <span className="text-xs font-body text-white/70 text-center">
                                                    {item.label}
                                                </span>
                                            </motion.a>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-heading text-sm hover:bg-red-500/30 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
