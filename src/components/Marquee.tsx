'use client';

import { motion } from 'framer-motion';

interface MarqueeProps {
    text?: string;
    speed?: 'normal' | 'slow';
    className?: string;
}

export default function Marquee({
    text = 'INNOVATE • INCUBATE • ELEVATE',
    speed = 'normal',
    className = '',
}: MarqueeProps) {
    const animationClass = speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee';

    return (
        <section className={`relative py-8 overflow-hidden border-y border-[var(--accent-secondary)]/20 bg-[var(--bg-secondary)] ${className}`}>
            <div className="flex whitespace-nowrap">
                <div className={`flex ${animationClass}`}>
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-[var(--accent-primary)] mx-8 tracking-tight"
                        >
                            {text}
                        </span>
                    ))}
                </div>
                <div className={`flex ${animationClass}`}>
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-[var(--accent-primary)] mx-8 tracking-tight"
                        >
                            {text}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
