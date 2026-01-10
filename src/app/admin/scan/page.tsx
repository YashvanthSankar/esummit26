'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Ticket, Users, Trophy, ScanLine, Volume2 } from 'lucide-react';
import AdminDock from '@/components/AdminDock';

type Event = {
    id: string;
    name: string;
    category: string;
};

type ScanResult = {
    status: 'IDLE' | 'SCANNING' | 'SUCCESS' | 'DUPLICATE' | 'ERROR';
    message: string;
    details?: any;
};

// Audio context for instant sound playback
let audioContext: AudioContext | null = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
}

// Play beep sound using Web Audio API (instant, no loading delay)
function playBeep(frequency: number, duration: number, type: 'success' | 'error') {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type === 'success' ? 'sine' : 'square';
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('[Audio] Could not play sound:', e);
    }
}

// Success sound: ascending two-tone beep
function playSuccessSound() {
    playBeep(880, 0.1, 'success');
    setTimeout(() => playBeep(1320, 0.15, 'success'), 100);
}

// Error sound: descending harsh beep
function playErrorSound() {
    playBeep(400, 0.15, 'error');
    setTimeout(() => playBeep(300, 0.2, 'error'), 150);
}

export default function AdminScanPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [scanResult, setScanResult] = useState<ScanResult>({ status: 'IDLE', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const lastScanRef = useRef<string>('');
    const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchEvents();
        // Initialize audio context on first user interaction
        const initAudio = () => {
            getAudioContext();
            document.removeEventListener('click', initAudio);
        };
        document.addEventListener('click', initAudio);
        return () => document.removeEventListener('click', initAudio);
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('is_active', true)
                .order('category');

            if (error) throw error;
            setEvents(data || []);
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScan = useCallback(async (result: string) => {
        if (!selectedEvent) return;
        
        // Prevent duplicate scans of the same QR within 2 seconds
        if (result === lastScanRef.current) return;
        
        // Prevent scanning while processing or showing result
        if (scanResult.status === 'SCANNING' || scanResult.status === 'SUCCESS' || scanResult.status === 'DUPLICATE') return;

        lastScanRef.current = result;
        
        // Clear previous timeout
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
        }

        // Show scanning state immediately
        setScanResult({ status: 'SCANNING', message: 'Verifying ticket...' });

        try {
            // Parse QR code JSON: { s: "TICKET_...", type: "duo" }
            let qrSecret: string;
            try {
                const qrData = JSON.parse(result);
                qrSecret = qrData.s;
            } catch {
                // If not JSON, assume it's the raw secret
                qrSecret = result;
            }

            const response = await fetch('/api/scan/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrSecret: qrSecret,
                    eventId: selectedEvent.id
                })
            });

            const data = await response.json();

            if (data.status === 'SUCCESS') {
                setScanResult({
                    status: 'SUCCESS',
                    message: `${data.holderName} (${data.ticketType.toUpperCase()})`
                });
                if (soundEnabled) playSuccessSound();
            } else if (data.status === 'DUPLICATE') {
                setScanResult({
                    status: 'DUPLICATE',
                    message: `Already scanned: ${data.scannedAt}`,
                    details: data
                });
                if (soundEnabled) playErrorSound();
            } else {
                setScanResult({
                    status: 'ERROR',
                    message: data.message || 'Invalid Ticket'
                });
                if (soundEnabled) playErrorSound();
            }

            // Auto-reset after 2.5 seconds for faster scanning flow
            scanTimeoutRef.current = setTimeout(() => {
                resetScan();
            }, 2500);

        } catch (error) {
            setScanResult({ status: 'ERROR', message: 'Network or Server Error' });
            if (soundEnabled) playErrorSound();
        }
    }, [selectedEvent, scanResult.status, soundEnabled]);

    const resetScan = () => {
        lastScanRef.current = '';
        setScanResult({ status: 'IDLE', message: '' });
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
        }
    };

    const groupedEvents = events.reduce((acc, event) => {
        if (!acc[event.category]) acc[event.category] = [];
        acc[event.category].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    if (isLoading) return <div className="p-8 text-center text-white">Loading events...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* Admin Dock */}
            <AdminDock currentPage="scan" />

            <AnimatePresence mode="wait">
                {!selectedEvent ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="grid"
                        className="max-w-4xl mx-auto relative z-10"
                    >
                        <h1 className="text-3xl font-heading mb-8 text-white">
                            Event <span className="text-[#a855f7]">Scanner</span>
                        </h1>

                        {Object.entries(groupedEvents).map(([category, categoryEvents]) => (
                            <div key={category} className="mb-8">
                                <h2 className="text-xl font-heading mb-4 text-white/50 uppercase tracking-wider">{category}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-[#a855f7]/50 hover:bg-white/10 transition-all cursor-pointer group backdrop-blur-sm"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold font-heading">{event.name}</h3>
                                                <ScanLine className="w-6 h-6 text-white/30 group-hover:text-[#a855f7] transition-colors" />
                                            </div>
                                            <button className="mt-4 w-full py-2 bg-white/5 rounded-lg text-sm font-medium group-hover:bg-[#a855f7] group-hover:text-white transition-colors">
                                                Scan Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="scanner"
                        className="max-w-md mx-auto relative z-10"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => { setSelectedEvent(null); resetScan(); }}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="flex-1">
                                <p className="text-sm text-white/50 font-mono">Scanning for</p>
                                <h2 className="text-xl font-heading text-[#a855f7]">{selectedEvent.name}</h2>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={`p-2 rounded-full transition-colors ${soundEnabled ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-white/5 text-white/30'}`}
                                title={soundEnabled ? 'Sound On' : 'Sound Off'}
                            >
                                <Volume2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-square">
                            {(scanResult.status === 'IDLE' || scanResult.status === 'SCANNING') && (
                                <Scanner
                                    onScan={(results) => {
                                        if (results && results.length > 0) {
                                            handleScan(results[0].rawValue);
                                        }
                                    }}
                                    scanDelay={100}
                                    styles={{
                                        container: { width: '100%', height: '100%' },
                                        video: { width: '100%', height: '100%', objectFit: 'cover' }
                                    }}
                                />
                            )}

                            {/* Scanning indicator */}
                            {scanResult.status === 'SCANNING' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                                    <div className="w-16 h-16 border-4 border-[#a855f7] border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-white font-mono text-sm">Verifying...</p>
                                </div>
                            )}

                            {/* Overlays */}
                            {(scanResult.status === 'SUCCESS' || scanResult.status === 'DUPLICATE' || scanResult.status === 'ERROR') && (
                                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-md ${scanResult.status === 'SUCCESS' ? 'bg-green-500/90' :
                                    scanResult.status === 'DUPLICATE' ? 'bg-red-500/90' : 'bg-orange-500/90'
                                    }`}>
                                    {scanResult.status === 'SUCCESS' && <CheckCircle className="w-16 h-16 mb-4" />}
                                    {scanResult.status === 'DUPLICATE' && <XCircle className="w-16 h-16 mb-4" />}
                                    {scanResult.status === 'ERROR' && <AlertTriangle className="w-16 h-16 mb-4" />}
                                    
                                    <h3 className="text-2xl font-heading mb-2 uppercase tracking-tighter drop-shadow-lg">
                                        {scanResult.status === 'SUCCESS' ? '✓ VERIFIED' : scanResult.status}
                                    </h3>
                                    <p className="font-medium text-lg mb-6 font-body drop-shadow">{scanResult.message}</p>

                                    <button
                                        onClick={resetScan}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                                    >
                                        Scan Next
                                    </button>
                                    <p className="text-xs mt-3 opacity-70">Auto-reset in 2.5s</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
