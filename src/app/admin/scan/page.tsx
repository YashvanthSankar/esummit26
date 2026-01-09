'use client';

import { Scanner } from '@yudiel/react-qr-scanner';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader2, Volume2, VolumeX, ScanLine } from 'lucide-react';

export default function GateScanner() {
    const supabase = createClient();
    const [scanResult, setScanResult] = useState<{
        status: 'valid' | 'invalid' | 'duplicate' | 'error';
        message: string;
        ticket?: any;
    } | null>(null);
    const [paused, setPaused] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                window.location.href = '/dashboard';
            }
        };
        checkAdmin();
    }, [supabase]);

    // Audio effects
    const playSound = (type: 'success' | 'error') => {
        if (!soundEnabled) return;

        if (navigator.vibrate) {
            if (type === 'success') navigator.vibrate(200);
            else navigator.vibrate([100, 50, 100]);
        }
    };

    const handleScan = async (text: string) => {
        if (paused || !text) return;
        setPaused(true);

        try {
            // 1. Parse JSON
            let secret;
            try {
                if (text.startsWith('TICKET_')) {
                    secret = text;
                } else if (text.startsWith('upi://')) {
                    throw new Error('Payment QR Detected');
                } else {
                    const parsed = JSON.parse(text);
                    secret = parsed.s;
                }
            } catch (e) {
                secret = text;
            }

            if (!secret) throw new Error('Invalid Format');

            // 2. Check Ticket in DB
            const { data: ticket, error } = await supabase
                .from('tickets')
                .select(`
                    id, 
                    status, 
                    type, 
                    user:profiles(full_name, roll_number, phone)
                `)
                .eq('qr_secret', secret)
                .single();

            if (error || !ticket) {
                setScanResult({ status: 'invalid', message: 'Ticket Not Found' });
                playSound('error');
                return;
            }

            if (ticket.status !== 'paid') {
                // Check if it's pending verification
                if (ticket.status === 'pending_verification') {
                    setScanResult({
                        status: 'error',
                        message: 'Payment Verification Pending'
                    });
                } else {
                    setScanResult({
                        status: 'invalid',
                        message: `Status: ${ticket.status.toUpperCase()}`
                    });
                }
                playSound('error');
                return;
            }

            // 3. Check for Duplicate Entry in Event Logs
            const EVENT_NAME = 'ENTRY';

            const { data: logs } = await supabase
                .from('event_logs')
                .select('id, scanned_at')
                .eq('ticket_id', ticket.id)
                .eq('event_name', EVENT_NAME)
                .single();

            if (logs) {
                setScanResult({
                    status: 'duplicate',
                    message: `Already Scanned`,
                    ticket: { ...ticket, scanned_at: logs.scanned_at }
                });
                playSound('error');
                return;
            }

            // 4. Log Success
            const { error: logError } = await supabase
                .from('event_logs')
                .insert({
                    ticket_id: ticket.id,
                    event_name: EVENT_NAME,
                    status: 'success'
                });

            if (logError) throw logError;

            setScanResult({
                status: 'valid',
                message: 'Access Granted',
                ticket
            });
            playSound('success');

        } catch (error: any) {
            console.error(error);
            setScanResult({
                status: 'error',
                message: error.message || 'Scan Failed'
            });
            playSound('error');
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setPaused(false);
    };

    return (
        <div className="h-[calc(100vh-64px)] md:h-screen w-full relative bg-black flex flex-col">
            {/* Camera View */}
            <div className="flex-1 relative overflow-hidden">
                <Scanner
                    onScan={(result) => result?.[0]?.rawValue && handleScan(result[0].rawValue)}
                    styles={{
                        container: { height: '100%', width: '100%' },
                        video: { objectFit: 'cover' }
                    }}
                    components={{
                        finder: false // We use our own custom overlay
                    }}
                />

                {/* Custom Scanning UI Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Darkened Background with Cutout */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Active Scan Area */}
                    <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_0_100px_rgba(168,85,247,0.2)]">
                        {/* Corner Markers */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#a855f7] rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#a855f7] rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#a855f7] rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#a855f7] rounded-br-xl" />

                        {/* Scanning Laser Animation */}
                        <motion.div
                            initial={{ top: '0%', opacity: 0 }}
                            animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent shadow-[0_0_20px_#a855f7]"
                        />

                        {/* Scanner Pulse */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-[#a855f7]/5"
                        />
                    </div>

                    <p className="relative mt-8 text-white/80 font-mono text-sm uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                        Align QR Code to Scan
                    </p>
                </div>

                {/* Visual Header Controls */}
                <div className="absolute top-6 left-0 right-0 z-10 flex justify-between items-center px-6 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Scanner Active</span>
                    </div>

                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="pointer-events-auto p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Result Overlay - Full Screen */}
            <AnimatePresence>
                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center ${scanResult.status === 'valid' ? 'bg-[#10b981]' :
                            scanResult.status === 'duplicate' ? 'bg-[#f59e0b]' :
                                scanResult.status === 'error' ? 'bg-black/95' : 'bg-[#ef4444]'
                            }`}
                    >
                        {/* Large Icon Animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="mb-8"
                        >
                            {scanResult.status === 'valid' ? (
                                <div className="p-6 rounded-full bg-white/20 shadow-2xl backdrop-blur-sm">
                                    <CheckCircle className="w-24 h-24 text-white" strokeWidth={3} />
                                </div>
                            ) : scanResult.status === 'duplicate' ? (
                                <div className="p-6 rounded-full bg-white/20 shadow-2xl backdrop-blur-sm">
                                    <AlertTriangle className="w-24 h-24 text-white" strokeWidth={3} />
                                </div>
                            ) : (
                                <div className="p-6 rounded-full bg-white/20 shadow-2xl backdrop-blur-sm">
                                    <XCircle className="w-24 h-24 text-white" strokeWidth={3} />
                                </div>
                            )}
                        </motion.div>

                        <h2 className="font-heading text-5xl md:text-6xl text-white mb-2 uppercase tracking-tight font-bold drop-shadow-lg">
                            {scanResult.status === 'valid' ? 'Verified' :
                                scanResult.status === 'duplicate' ? 'Duplicate' :
                                    'Denied'}
                        </h2>

                        <p className="font-medium text-xl text-white/90 mb-10 max-w-md drop-shadow-md">
                            {scanResult.message}
                        </p>

                        {/* Ticket Card Details */}
                        {scanResult.ticket && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-3xl p-1 w-full max-w-sm shadow-2xl transform rotate-1"
                            >
                                <div className="bg-[#050505] rounded-[22px] p-6 border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ScanLine className="w-32 h-32 text-white" />
                                    </div>

                                    <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-2">PASS HOLDER</p>
                                    <h3 className="text-2xl font-heading text-white mb-6 truncate">{scanResult.ticket.user?.full_name}</h3>

                                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                                        <div>
                                            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">TYPE</p>
                                            <p className={`text-lg font-bold uppercase ${scanResult.ticket.type === 'quad' ? 'text-purple-400' :
                                                scanResult.ticket.type === 'duo' ? 'text-blue-400' : 'text-white'
                                                }`}>
                                                {scanResult.ticket.type} PASS
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">USER ID</p>
                                            <p className="text-lg font-bold text-white font-mono">{scanResult.ticket.user?.roll_number || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {scanResult.ticket.scanned_at && (
                                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">
                                            <span>First Scanned:</span>
                                            <span className="font-mono">{new Date(scanResult.ticket.scanned_at).toLocaleTimeString()}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        <button
                            onClick={resetScan}
                            className="mt-12 group relative bg-white text-black px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-3 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                                Scan Next
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
