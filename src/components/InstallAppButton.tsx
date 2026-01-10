'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/context/PWAContext';

export default function InstallAppButton() {
    const { isInstallable, install } = usePWA();

    // Only show if installable
    if (!isInstallable) return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={install}
                className="fixed bottom-6 right-20 md:right-24 z-50 flex items-center gap-3 bg-[#a855f7] text-white px-5 py-3 rounded-full shadow-lg shadow-[#a855f7]/20 border border-white/10 backdrop-blur-md"
            >
                <Download className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Install App</span>
            </motion.button>
        </AnimatePresence>
    );
}
