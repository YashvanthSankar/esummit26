'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';

interface TimeUnit {
    value: number;
    label: string;
}

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
        { value: 0, label: 'DAYS' },
        { value: 0, label: 'HRS' },
        { value: 0, label: 'MIN' },
        { value: 0, label: 'SEC' },
    ]);
    const [isClient, setIsClient] = useState(false);

    // Target: January 30, 2026 09:00:00 IST
    const targetDate = new Date('2026-01-30T09:00:00+05:30').getTime();

    useEffect(() => {
        setIsClient(true);

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft([
                    { value: days, label: 'DAYS' },
                    { value: hours, label: 'HRS' },
                    { value: minutes, label: 'MIN' },
                    { value: seconds, label: 'SEC' },
                ]);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Event Info */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/50 font-body text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#a855f7]" />
                    <span>30-31 JAN & 1 FEB 2026</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#a855f7]" />
                    <span>CHENNAI, INDIA</span>
                </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                {timeLeft.map((unit, index) => (
                    <div key={unit.label} className="flex items-center">
                        {/* Time Unit */}
                        <div className="flex flex-col items-center">
                            {/* Number Container */}
                            <div className="relative overflow-hidden glass-card px-2 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl min-w-[48px] sm:min-w-[70px] md:min-w-[80px]">
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={unit.value}
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -30, opacity: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                        className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-white text-center tabular-nums"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    >
                                        {String(unit.value).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>

                            {/* Label */}
                            <span className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] md:text-xs font-heading font-bold tracking-wider sm:tracking-widest text-[#a855f7]/70">
                                {unit.label}
                            </span>
                        </div>

                        {/* Blinking Colon Separator */}
                        {index < timeLeft.length - 1 && (
                            <motion.span
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-[#a855f7] mx-0.5 sm:mx-1 md:mx-2 -mt-4 sm:-mt-6"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                :
                            </motion.span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
