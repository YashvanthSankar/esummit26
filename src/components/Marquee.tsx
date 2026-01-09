'use client';

import { motion } from 'framer-motion';

interface MarqueeProps {
    className?: string;
}

export default function Marquee({ className = '' }: MarqueeProps) {
    const text = 'INNOVATE • DESIGN • MANUFACTURE • BUILD • CREATE • DISRUPT • ';

    return (
        <section className={`relative py-12 overflow-hidden ${className}`}>
            {/* Forward marquee */}
            <div className="flex whitespace-nowrap mb-4">
                <div className="flex animate-marquee">
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-outline mx-4 hover:text-[#a855f7] transition-all cursor-default"
                            data-hover="true"
                        >
                            {text}
                        </span>
                    ))}
                </div>
                <div className="flex animate-marquee">
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-outline mx-4 hover:text-[#a855f7] transition-all cursor-default"
                            data-hover="true"
                        >
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            {/* Reverse marquee */}
            <div className="flex whitespace-nowrap">
                <div className="flex animate-marquee-reverse">
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white/5 mx-4"
                        >
                            {text}
                        </span>
                    ))}
                </div>
                <div className="flex animate-marquee-reverse">
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white/5 mx-4"
                        >
                            {text}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
