'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Users, Award, Mail, Menu, X } from 'lucide-react';

const dockItems = [
    { icon: Home, label: 'Home', href: '#hero' },
    { icon: Calendar, label: 'Events', href: '#events' },
    { icon: Users, label: 'Speakers', href: '#speakers' },
    { icon: Award, label: 'Schedule', href: '#schedule' },
    { icon: Mail, label: 'Contact', href: '#footer' },
];

export default function DockNavigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Desktop: Right side vertical dock */}
            <motion.nav
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[9999]"
            >
                <div className="dock flex flex-col items-center gap-2">
                    {dockItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleClick(e, item.href)}
                                className="dock-item group relative p-3 rounded-xl hover:bg-white/10 transition-colors"
                                whileHover={{ x: -8, scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                                data-hover="true"
                            >
                                <Icon className="w-5 h-5 text-white/70 group-hover:text-[#ccff00] transition-colors" />

                                {/* Tooltip on left */}
                                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#ccff00] text-[#050505] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {item.label}
                                </span>
                            </motion.a>
                        );
                    })}
                </div>
            </motion.nav>

            {/* Mobile: Floating hamburger button */}
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#ccff00] text-[#050505] flex items-center justify-center shadow-lg shadow-[#ccff00]/20"
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
                            <div className="glass-card rounded-3xl p-6">
                                <div className="grid grid-cols-3 gap-4">
                                    {dockItems.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.a
                                                key={item.label}
                                                href={item.href}
                                                onClick={(e) => handleClick(e, item.href)}
                                                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/5 transition-colors"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-[#ccff00]" />
                                                </div>
                                                <span className="text-xs font-body text-white/70">
                                                    {item.label}
                                                </span>
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
