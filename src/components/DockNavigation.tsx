'use client';

import { motion } from 'framer-motion';
import { Home, Calendar, Users, Award, Mail } from 'lucide-react';

const dockItems = [
    { icon: Home, label: 'Home', href: '#hero' },
    { icon: Calendar, label: 'Events', href: '#events' },
    { icon: Users, label: 'Speakers', href: '#speakers' },
    { icon: Award, label: 'Schedule', href: '#schedule' },
    { icon: Mail, label: 'Contact', href: '#footer' },
];

export default function DockNavigation() {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
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

            {/* Mobile: Bottom center horizontal dock */}
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]"
            >
                <div className="dock flex items-center gap-1">
                    {dockItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleClick(e, item.href)}
                                className="dock-item p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                                whileHover={{ y: -8, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                                data-hover="true"
                                title={item.label}
                            >
                                <Icon className="w-5 h-5 text-white/70 hover:text-[#ccff00] transition-colors" />
                            </motion.a>
                        );
                    })}
                </div>
            </motion.nav>
        </>
    );
}
