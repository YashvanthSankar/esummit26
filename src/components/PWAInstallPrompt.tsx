'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Check if running in standalone mode (installed PWA)
function getIsStandalone() {
    if (typeof window === 'undefined') return true; // SSR - assume installed to prevent flash
    return window.matchMedia('(display-mode: standalone)').matches;
}

function subscribeToStandalone(callback: () => void) {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    
    // Use useSyncExternalStore to properly track standalone mode
    const isInstalled = useSyncExternalStore(
        subscribeToStandalone,
        getIsStandalone,
        () => true // SSR fallback
    );

    useEffect(() => {
        if (isInstalled) return;

        // Check if user dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            // Show again after 7 days
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                return;
            }
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show prompt after a short delay
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Also listen for successful install
        const installHandler = () => {
            setShowPrompt(false);
            setDeferredPrompt(null);
        };
        window.addEventListener('appinstalled', installHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installHandler);
        };
    }, [isInstalled]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                // The 'appinstalled' event will fire and handle cleanup
                console.log('PWA install accepted');
            }
        } catch (err) {
            console.error('Install prompt error:', err);
        }

        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
            >
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#a855f7]/30 rounded-2xl p-4 shadow-2xl shadow-purple-500/10">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#a855f7]/20 rounded-xl flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-[#a855f7]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-white text-lg mb-1">Install E-Summit App</h3>
                            <p className="text-white/60 text-sm font-body">
                                Get quick access to your tickets, event updates & more!
                            </p>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="flex-shrink-0 p-1 text-white/40 hover:text-white/70 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 py-2.5 px-4 rounded-xl text-white/70 hover:bg-white/5 transition-colors font-medium text-sm"
                        >
                            Not now
                        </button>
                        <button
                            onClick={handleInstall}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Install
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
