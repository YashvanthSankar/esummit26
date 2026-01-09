'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Event = {
    id: string;
    name: string;
    category: string;
};

type ScanResult = {
    status: 'IDLE' | 'SUCCESS' | 'DUPLICATE' | 'ERROR';
    message: string;
    details?: any;
};

export default function AdminScanPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [scanResult, setScanResult] = useState<ScanResult>({ status: 'IDLE', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchEvents();
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

    const handleScan = async (result: string) => {
        if (!selectedEvent || scanResult.status === 'SUCCESS' || scanResult.status === 'DUPLICATE') return;

        // Basic debounce/lock to prevent multiple hits
        // In a real app we might want a "Scan Next" button to reset state
        // For now, let's just process it.

        try {
            const response = await fetch('/api/scan/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrSecret: result,
                    eventId: selectedEvent.id
                })
            });

            const data = await response.json();

            if (data.status === 'SUCCESS') {
                setScanResult({
                    status: 'SUCCESS',
                    message: `VERIFIED: ${data.holderName} (${data.ticketType})`
                });
                playAudio('success');
            } else if (data.status === 'DUPLICATE') {
                setScanResult({
                    status: 'DUPLICATE',
                    message: `ALREADY SCANNED: ${data.scannedAt} by ${data.scannedBy}`,
                    details: data
                });
                playAudio('error');
            } else {
                setScanResult({
                    status: 'ERROR',
                    message: data.message || 'Invalid Ticket'
                });
                playAudio('error');
            }

            // Auto-reset after 3 seconds for valid/invalid scans to allow next person? 
            // The prompt says "Action: Insert a new row... Show GREEN Overlay".
            // It doesn't specify auto-reset, but usually a button "Scan Next" is better or auto-reset.
            // I'll add a "Scan Next" button for better UX.

        } catch (error) {
            setScanResult({ status: 'ERROR', message: 'Network or Server Error' });
        }
    };

    const playAudio = (type: 'success' | 'error') => {
        // Optional: Implement audio feedback
    };

    const resetScan = () => {
        setScanResult({ status: 'IDLE', message: '' });
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
                            <div>
                                <p className="text-sm text-white/50 font-mono">Scanning for</p>
                                <h2 className="text-xl font-heading text-[#a855f7]">{selectedEvent.name}</h2>
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-square">
                            {scanResult.status === 'IDLE' && (
                                <Scanner
                                    onScan={(results) => {
                                        if (results && results.length > 0) {
                                            handleScan(results[0].rawValue);
                                        }
                                    }}
                                    styles={{
                                        container: { width: '100%', height: '100%' },
                                        video: { width: '100%', height: '100%', objectFit: 'cover' }
                                    }}
                                />
                            )}

                            {/* Overlays */}
                            {scanResult.status !== 'IDLE' && (
                                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-md ${scanResult.status === 'SUCCESS' ? 'bg-green-500/80' :
                                        scanResult.status === 'DUPLICATE' ? 'bg-red-500/80' : 'bg-orange-500/80'
                                    }`}>
                                    <h3 className="text-3xl font-heading mb-2 uppercase tracking-tighter shadow-black drop-shadow-lg">
                                        {scanResult.status === 'SUCCESS' ? 'VERIFIED' : scanResult.status}
                                    </h3>
                                    <p className="font-medium text-lg mb-6 font-body drop-shadow">{scanResult.message}</p>

                                    <button
                                        onClick={resetScan}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                                    >
                                        Scan Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
