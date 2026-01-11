'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, User, LayoutDashboard, Calendar, Bed, ShoppingBag, Ticket, Search, Award, Users, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SearchRoute {
    name: string;
    description: string;
    href: string;
    icon: React.ElementType;
    keywords: string[];
    external?: boolean;
}

interface DashboardDockProps {
    userName?: string;
    userRole?: string;
    isExternal?: boolean;
    currentPage?: 'dashboard' | 'events' | 'accommodation' | 'merch' | 'pass';
}

export default function DashboardDock({ userName, userRole, isExternal = false, currentPage }: DashboardDockProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const supabase = createClient();

    // Define all available routes based on user type
    const getSearchRoutes = useCallback((): SearchRoute[] => {
        const baseRoutes: SearchRoute[] = [
            { name: 'Dashboard', description: 'Your main dashboard', href: '/dashboard', icon: User, keywords: ['home', 'dashboard', 'main', 'profile'] },
            { name: 'Event Pass', description: 'Get your event pass', href: '/dashboard/pass', icon: Ticket, keywords: ['pass', 'ticket', 'entry', 'qr', 'band', 'buy', 'purchase'] },
            { name: 'Events', description: 'Browse all events', href: '/dashboard/events', icon: Calendar, keywords: ['events', 'schedule', 'sessions', 'workshops'] },
            { name: 'Merchandise', description: 'Buy E-Summit merch', href: '/dashboard/merch', icon: ShoppingBag, keywords: ['merch', 'merchandise', 'tshirt', 'hoodie', 'buy', 'shop'] },
            { name: 'Sponsors', description: 'View our sponsors', href: '/#sponsors', icon: Award, keywords: ['sponsors', 'partners', 'companies'], external: true },
            { name: 'Speakers', description: 'Meet our speakers', href: '/#speakers', icon: Users, keywords: ['speakers', 'guests', 'talks'], external: true },
        ];

        if (isExternal) {
            baseRoutes.push({
                name: 'Accommodation',
                description: 'Book accommodation',
                href: '/dashboard/accommodation',
                icon: Bed,
                keywords: ['accommodation', 'stay', 'hotel', 'room', 'hostel', 'book']
            });
        }

        return baseRoutes;
    }, [isExternal]);

    const filteredRoutes = searchQuery
        ? getSearchRoutes().filter(route =>
            route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.keywords.some(k => k.includes(searchQuery.toLowerCase()))
        )
        : getSearchRoutes();

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
            if (e.key === 'Escape') {
                setShowSearch(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const handleEventsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = '/dashboard/events';
    };

    // Build dock items based on user type (external gets accommodation)
    const dockItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Ticket, label: 'Pass', href: '/dashboard/pass' },
        { icon: Calendar, label: 'Events', href: '/dashboard/events', onClick: handleEventsClick },
        { icon: ShoppingBag, label: 'Merch', href: '/dashboard/merch' },
        ...(isExternal ? [{ icon: Bed, label: 'Accommodation', href: '/dashboard/accommodation' }] : []),
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
                        return (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                onClick={item.onClick}
                                className="dock-item group relative p-3 rounded-xl hover:bg-white/10 transition-colors"
                                whileHover={{ x: -8, scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                data-hover="true"
                            >
                                <Icon className="w-5 h-5 text-white/70 group-hover:text-[#a855f7] transition-colors" />

                                {/* Tooltip on left */}
                                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#a855f7] text-[#050505] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {item.label}
                                </span>
                            </motion.a>
                        );
                    })}

                    {/* Divider */}
                    <div className="w-6 h-px bg-white/10 my-2" />

                    {/* Search Button */}
                    <motion.button
                        onClick={() => setShowSearch(true)}
                        className="dock-item group relative p-3 rounded-xl hover:bg-white/10 transition-colors"
                        whileHover={{ x: -8, scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.95 }}
                        data-hover="true"
                    >
                        <Search className="w-5 h-5 text-white/70 group-hover:text-[#a855f7] transition-colors" />

                        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#a855f7] text-[#050505] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Search ⌘K
                        </span>
                    </motion.button>

                    {/* Sign Out */}
                    <motion.button
                        onClick={handleSignOut}
                        className="dock-item group relative p-3 rounded-xl hover:bg-red-500/20 transition-colors"
                        whileHover={{ x: -8, scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        data-hover="true"
                    >
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />

                        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Sign Out
                        </span>
                    </motion.button>
                </div>
            </motion.nav>

            {/* Floating Search Button - Top on desktop, bottom on mobile */}
            <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                onClick={() => setShowSearch(true)}
                className="fixed bottom-6 md:bottom-auto md:top-6 left-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 shadow-lg shadow-black/30 transition-colors"
            >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-body">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono text-white/50">
                    ⌘K
                </kbd>
            </motion.button>

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
                                            <User className="w-5 h-5 text-[#a855f7]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-heading text-sm">{userName}</p>
                                            <p className="text-xs text-white/50">Dashboard</p>
                                        </div>
                                        {/* Search button */}
                                        <button
                                            onClick={() => {
                                                setShowSearch(true);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
                                        >
                                            <Search className="w-5 h-5 text-white/50" />
                                        </button>
                                    </div>
                                )}

                                <div className="grid gap-3 mb-4 grid-cols-3">
                                    {dockItems.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.a
                                                key={item.label}
                                                href={item.href}
                                                onClick={(e) => {
                                                    if (item.onClick) {
                                                        item.onClick(e);
                                                        setIsMobileMenuOpen(false);
                                                    }
                                                }}
                                                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/5 transition-colors"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-[#a855f7]" />
                                                </div>
                                                <span className="text-xs font-body text-white/70">
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

            {/* Search Modal */}
            <AnimatePresence>
                {showSearch && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSearch(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:top-[20%] sm:w-full sm:max-w-lg z-[10001]"
                        >
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                {/* Search Input */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                                    <Search className="w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search pages, actions..."
                                        className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setShowSearch(false)}
                                        className="p-1 rounded-lg hover:bg-white/5"
                                    >
                                        <X className="w-4 h-4 text-white/40" />
                                    </button>
                                </div>

                                {/* Search Results */}
                                <div className="max-h-[60vh] overflow-y-auto p-2">
                                    {filteredRoutes.length === 0 ? (
                                        <div className="py-8 text-center text-white/40 text-sm">
                                            No results found
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {filteredRoutes.map((route) => (
                                                <a
                                                    key={route.href}
                                                    href={route.href}
                                                    onClick={() => setShowSearch(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 flex items-center justify-center">
                                                        <route.icon className="w-4 h-4 text-[#a855f7]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-white text-sm font-medium">{route.name}</p>
                                                            {route.external && (
                                                                <ExternalLink className="w-3 h-3 text-white/30" />
                                                            )}
                                                        </div>
                                                        <p className="text-white/40 text-xs">{route.description}</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer hint */}
                                <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-white/30 text-xs">
                                    <span>Navigate with ↑↓ Enter</span>
                                    <span>ESC to close</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
