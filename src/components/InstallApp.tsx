'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Check if running in standalone mode (installed PWA)
function getIsStandalone() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches;
}

function subscribeToStandalone(callback: () => void) {
    if (typeof window === 'undefined') return () => { };
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
}

export default function InstallApp() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [installing, setInstalling] = useState(false);

    const isInstalled = useSyncExternalStore(
        subscribeToStandalone,
        getIsStandalone,
        () => false
    );

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        const installHandler = () => {
            setDeferredPrompt(null);
        };
        window.addEventListener('appinstalled', installHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installHandler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setInstalling(true);
        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } catch (err) {
            console.error('Install error:', err);
        } finally {
            setInstalling(false);
        }
    };

    return (
        <section id="install" className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#a855f7]/10 to-[#050505] border border-[#a855f7]/20 p-8 md:p-12"
                >
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#a855f7]/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-[#a855f7]/20 border border-[#a855f7]/30 flex items-center justify-center">
                                <Smartphone className="w-10 h-10 text-[#a855f7]" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-heading text-2xl md:text-3xl text-white mb-3">
                                {isInstalled ? 'App Installed!' : 'Install E-Summit App'}
                            </h3>
                            <p className="text-white/60 text-base md:text-lg max-w-lg">
                                {isInstalled
                                    ? 'You have the E-Summit app installed. Access your tickets and get event updates instantly!'
                                    : 'Get quick access to your tickets, real-time event updates, and notifications. Works offline too!'
                                }
                            </p>
                        </div>

                        {/* Button */}
                        <div className="flex-shrink-0">
                            {isInstalled ? (
                                <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400">
                                    <Check className="w-5 h-5" />
                                    <span className="font-bold">Installed</span>
                                </div>
                            ) : deferredPrompt ? (
                                <motion.button
                                    onClick={handleInstall}
                                    disabled={installing}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold transition-colors disabled:opacity-50"
                                >
                                    <Download className={`w-5 h-5 ${installing ? 'animate-bounce' : ''}`} />
                                    {installing ? 'Installing...' : 'Install App'}
                                </motion.button>
                            ) : (
                                <div className="text-white/40 text-sm text-center">
                                    <p>Open in Chrome on mobile</p>
                                    <p>to install the app</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
