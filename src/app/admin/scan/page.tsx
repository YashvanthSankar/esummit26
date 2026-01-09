'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    ChevronDown,
    Scan,
    Users,
    Clock,
    User,
    Loader2
} from 'lucide-react';

interface Event {
    id: string;
    name: string;
    is_active: boolean;
}

interface ScanResult {
    status: 'SUCCESS' | 'DUPLICATE' | 'INVALID';
    message: string;
    ticketType?: string;
    paxCount?: number;
    holderName?: string;
    scannedAt?: string;
    scannedBy?: string;
}

interface ScanLog {
    time: string;
    status: 'SUCCESS' | 'DUPLICATE' | 'INVALID';
    message: string;
}

export default function AdminScanPage() {
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            // Check admin role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                window.location.href = '/dashboard';
                return;
            }

            setIsAdmin(true);

            // Fetch events
            const { data: eventsData } = await supabase
                .from('events')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (eventsData && eventsData.length > 0) {
                setEvents(eventsData);
                setSelectedEvent(eventsData[0].id);
            }

            setLoading(false);
        };

        init();
    }, [supabase]);

    const handleScan = useCallback(async (result: any) => {
        if (scanning || !selectedEvent) return;

        const data = result?.[0]?.rawValue;
        if (!data) return;

        setScanning(true);

        try {
            // Parse QR data
            let qrData;
            try {
                qrData = JSON.parse(data);
            } catch {
                setScanResult({
                    status: 'INVALID',
                    message: 'Invalid QR format',
                });
                return;
            }

            const qrSecret = qrData.s;
            if (!qrSecret) {
                setScanResult({
                    status: 'INVALID',
                    message: 'Invalid QR data - no secret',
                });
                return;
            }

            // Call verification API
            const response = await fetch('/api/scan/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrSecret,
                    eventId: selectedEvent,
                }),
            });

            const result = await response.json();

            setScanResult({
                status: result.status,
                message: result.message,
                ticketType: result.ticketType,
                paxCount: result.paxCount,
                holderName: result.holderName,
                scannedAt: result.scannedAt,
                scannedBy: result.scannedBy,
            });

            // Add to logs
            setScanLogs(prev => [{
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                status: result.status,
                message: result.holderName || result.message,
            }, ...prev.slice(0, 2)]);

        } catch (error) {
            console.error('Scan error:', error);
            setScanResult({
                status: 'INVALID',
                message: 'Network error',
            });
        }
    }, [scanning, selectedEvent]);

    const dismissResult = () => {
        setScanResult(null);
        setScanning(false);
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#050505]">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </main>
        );
    }

    if (!isAdmin) {
        return null;
    }

    const selectedEventName = events.find(e => e.id === selectedEvent)?.name || 'Select Event';

    return (
        <main className="min-h-screen bg-[#050505] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h1 className="font-heading text-2xl text-white text-center mb-4">
                    Admin Scanner
                </h1>

                {/* Event Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                    >
                        <span className="font-body">{selectedEventName}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50"
                            >
                                {events.map(event => (
                                    <button
                                        key={event.id}
                                        onClick={() => {
                                            setSelectedEvent(event.id);
                                            setShowDropdown(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left font-body transition-colors ${selectedEvent === event.id
                                                ? 'bg-[#a855f7]/20 text-[#a855f7]'
                                                : 'text-white/70 hover:bg-white/5'
                                            }`}
                                    >
                                        {event.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scanner */}
            <div className="flex-1 relative">
                <div className="absolute inset-0">
                    <Scanner
                        onScan={handleScan}
                        allowMultiple={true}
                        scanDelay={2000}
                        styles={{
                            container: { width: '100%', height: '100%' },
                            video: { objectFit: 'cover' },
                        }}
                        components={{
                            finder: false,
                        }}
                    />
                </div>

                {/* Viewfinder overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                        {/* Cutout */}
                        <div className="absolute inset-0 bg-transparent" style={{
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                        }} />
                        {/* Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#a855f7] rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#a855f7] rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#a855f7] rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#a855f7] rounded-br-lg" />
                        {/* Scan line animation */}
                        <motion.div
                            animate={{ y: [0, 240, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent"
                        />
                    </div>
                </div>

                {/* Scanning indicator */}
                {scanning && !scanResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <Loader2 className="w-12 h-12 text-[#a855f7] animate-spin" />
                    </div>
                )}
            </div>

            {/* Scan Logs */}
            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                <p className="font-mono text-xs text-white/40 mb-3">RECENT SCANS</p>
                {scanLogs.length === 0 ? (
                    <p className="text-white/30 text-sm font-body">No scans yet</p>
                ) : (
                    <div className="space-y-2">
                        {scanLogs.map((log, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                                <span className="font-mono text-white/40 w-12">{log.time}</span>
                                <span className={`w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-green-500' :
                                        log.status === 'DUPLICATE' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                <span className="font-body text-white/70 truncate">{log.message}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Full Screen Result Overlay */}
            <AnimatePresence>
                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={dismissResult}
                        className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 ${scanResult.status === 'SUCCESS'
                                ? 'bg-green-600'
                                : 'bg-red-600'
                            }`}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="text-center"
                        >
                            {scanResult.status === 'SUCCESS' ? (
                                <>
                                    <CheckCircle className="w-24 h-24 text-white mx-auto mb-6" />
                                    <h2 className="font-heading text-5xl text-white mb-4">
                                        ACCESS GRANTED
                                    </h2>
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <Users className="w-6 h-6 text-white/80" />
                                        <span className="font-heading text-3xl text-white">
                                            Pax: {scanResult.paxCount}
                                        </span>
                                    </div>
                                    <p className="font-body text-xl text-white/80">
                                        {scanResult.holderName}
                                    </p>
                                    <p className="font-mono text-sm text-white/60 mt-2 uppercase">
                                        {scanResult.ticketType} Pass
                                    </p>
                                </>
                            ) : scanResult.status === 'DUPLICATE' ? (
                                <>
                                    <AlertTriangle className="w-24 h-24 text-white mx-auto mb-6" />
                                    <h2 className="font-heading text-5xl text-white mb-4">
                                        ALREADY USED
                                    </h2>
                                    <div className="flex items-center justify-center gap-2 text-white/80 mb-2">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-body">Scanned at {scanResult.scannedAt}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-white/80">
                                        <User className="w-5 h-5" />
                                        <span className="font-body">by {scanResult.scannedBy}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-24 h-24 text-white mx-auto mb-6" />
                                    <h2 className="font-heading text-5xl text-white mb-4">
                                        INVALID TICKET
                                    </h2>
                                    <p className="font-body text-xl text-white/80">
                                        {scanResult.message}
                                    </p>
                                </>
                            )}
                        </motion.div>

                        <p className="absolute bottom-8 font-mono text-sm text-white/50">
                            Tap anywhere to continue
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
