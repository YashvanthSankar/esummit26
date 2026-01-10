'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    install: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

// Helper to check standalone mode
function getIsStandalone() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches;
}

export function PWAProvider({ children }: { children: ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check initial state
        setIsInstalled(getIsStandalone());
        console.log('[PWA] Standalone mode:', getIsStandalone());

        // Listen for standalone mode changes
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleModeChange = (e: MediaQueryListEvent) => {
            setIsInstalled(e.matches);
            console.log('[PWA] Display mode changed:', e.matches);
        };
        mediaQuery.addEventListener('change', handleModeChange);


        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('[PWA] beforeinstallprompt event fired!');
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            console.log('[PWA] App installed!');
            setDeferredPrompt(null);
            setIsInstalled(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        console.log('[PWA] Event listeners registered');

        return () => {
            mediaQuery.removeEventListener('change', handleModeChange);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const install = async () => {
        console.log('[PWA] Install button clicked, deferredPrompt:', !!deferredPrompt);
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] User choice:', outcome);

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <PWAContext.Provider value={{ isInstallable: !!deferredPrompt, isInstalled, install }}>
            {children}
        </PWAContext.Provider>
    );
}

export function usePWA() {
    const context = useContext(PWAContext);
    if (context === undefined) {
        throw new Error('usePWA must be used within a PWAProvider');
    }
    return context;
}
