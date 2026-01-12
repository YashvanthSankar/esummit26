'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, LayoutDashboard, CheckCircle, QrCode, Users, Shield, Bed, ShoppingBag, Database, Tag, Search, Crown, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { canApprovePayments, type UserRole } from '@/types/database';

interface SearchRoute {
    name: string;
    description: string;
    href: string;
    icon: React.ElementType;
    keywords: string[];
}

interface AdminDockProps {
    userName?: string;
    currentPage?: 'dashboard' | 'admin' | 'verify' | 'scan' | 'users' | 'accommodation' | 'merch' | 'unified' | 'bands' | 'settings';
}

export default function AdminDock({ userName, currentPage }: AdminDockProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const supabase = createClient();

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

    const isSuperAdmin = userRole ? canApprovePayments(userRole) : false;

    // Define all admin routes for search
    const getSearchRoutes = useCallback((): SearchRoute[] => {
        const routes: SearchRoute[] = [
            { name: 'Admin Dashboard', description: 'Main admin panel', href: '/admin', icon: Shield, keywords: ['admin', 'dashboard', 'home', 'main'] },
            { name: 'Unified View', description: 'All data in one view', href: '/admin/unified', icon: Database, keywords: ['unified', 'all', 'data', 'view', 'overview'] },
            { name: 'Pass Verification', description: 'Verify payment proofs', href: '/admin/verify', icon: CheckCircle, keywords: ['verify', 'pass', 'ticket', 'payment', 'approve'] },
            { name: 'Band Issuance', description: 'Issue entry bands', href: '/admin/bands', icon: Tag, keywords: ['bands', 'issue', 'entry', 'wristband'] },
            { name: 'QR Scanner', description: 'Scan event QR codes', href: '/admin/scan', icon: QrCode, keywords: ['scan', 'qr', 'scanner', 'check-in', 'event'] },
            { name: 'User Management', description: 'Manage all users', href: '/admin/users', icon: Users, keywords: ['users', 'manage', 'people', 'participants'] },
            { name: 'Accommodation', description: 'Manage accommodation requests', href: '/admin/accommodation', icon: Bed, keywords: ['accommodation', 'stay', 'hotel', 'room', 'booking'] },
            { name: 'Merchandise', description: 'Manage merch orders', href: '/admin/merch', icon: ShoppingBag, keywords: ['merch', 'merchandise', 'orders', 'tshirt', 'hoodie'] },
            { name: 'User Dashboard', description: 'View as user', href: '/dashboard', icon: LayoutDashboard, keywords: ['user', 'dashboard', 'participant'] },
        ];
        
        // Add settings for super_admin only
        if (isSuperAdmin) {
            routes.push({ 
                name: 'Super Admin Settings', 
                description: 'Manage admin passwords', 
                href: '/admin/settings', 
                icon: Settings, 
                keywords: ['settings', 'password', 'admin', 'access', 'super'] 
            });
        }
        
        return routes;
    }, [isSuperAdmin]);

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

    const dockItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { id: 'admin', icon: Shield, label: 'Admin', href: '/admin' },
        { id: 'unified', icon: Database, label: 'Unified View', href: '/admin/unified' },
        { id: 'accommodation', icon: Bed, label: 'Accommodation', href: '/admin/accommodation' },
        { id: 'merch', icon: ShoppingBag, label: 'Merch', href: '/admin/merch' },
        { id: 'bands', icon: Tag, label: 'Bands', href: '/admin/bands' },
        { id: 'verify', icon: CheckCircle, label: 'Pass', href: '/admin/verify' },
        { id: 'scan', icon: QrCode, label: 'Scanner', href: '/admin/scan' },
        { id: 'users', icon: Users, label: 'Users', href: '/admin/users' },
        // Settings only visible to super_admin
        ...(isSuperAdmin ? [{ id: 'settings', icon: Settings, label: 'Settings', href: '/admin/settings' }] : []),
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
                    {/* Role Badge */}
                    {isSuperAdmin && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center p-2 mb-1"
                            title="Super Admin - Can approve payments"
                        >
                            <Crown className="w-5 h-5 text-amber-400" />
                        </motion.div>
                    )}
                    
                    {dockItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
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
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuperAdmin ? 'bg-amber-500/20' : 'bg-[#a855f7]/20'}`}>
                                            {isSuperAdmin ? (
                                                <Crown className="w-5 h-5 text-amber-400" />
                                            ) : (
                                                <Shield className="w-5 h-5 text-[#a855f7]" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-heading text-sm">{userName}</p>
                                            <p className={`text-xs font-mono ${isSuperAdmin ? 'text-amber-400' : 'text-[#a855f7]'}`}>
                                                {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {dockItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = currentPage === item.id;
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
                                        placeholder="Search admin pages..."
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
                                                        <p className="text-white text-sm font-medium">{route.name}</p>
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
