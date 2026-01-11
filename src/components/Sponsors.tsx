'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const sponsors = [
    { name: 'Unstop', logo: '/sponsors/unstop.png' },
    { name: 'StockGro', logo: '/sponsors/stockgro.png' },
    { name: 'GeeksforGeeks', logo: '/sponsors/gfg.png' },
    { name: 'StartupNews.fyi', logo: '/sponsors/startupnewsfyi.png' },
    { name: '2IIM', logo: '/sponsors/2iim.png' },
    { name: 'RiKun', logo: '/sponsors/rikun.png' },
];

function SponsorCard({ sponsor, index }: { sponsor: typeof sponsors[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isCenter, setIsCenter] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const checkPosition = () => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const viewportCenter = window.innerWidth / 2;
            // Tighter threshold for mobile (15%) and desktop (20%)
            const threshold = window.innerWidth < 768 
                ? window.innerWidth * 0.2 
                : window.innerWidth * 0.15;
            const distance = Math.abs(centerX - viewportCenter);
            setIsCenter(distance < threshold);
        };

        // Check position on animation frame for smooth updates
        let animationId: number;
        const animate = () => {
            checkPosition();
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div
            ref={cardRef}
            key={`${sponsor.name}-${index}`}
            className="mx-4 sm:mx-6 group"
            data-hover="true"
        >
            <div
                className={`glass-card px-6 sm:px-8 py-4 sm:py-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 min-w-[160px] sm:min-w-[200px] h-[100px] sm:h-[120px] justify-center ${
                    isCenter 
                        ? 'grayscale-0 opacity-100 scale-105 shadow-lg shadow-[#a855f7]/10' 
                        : 'grayscale opacity-40 scale-100'
                }`}
            >
                <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-10 sm:h-12 w-auto object-contain"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerText = sponsor.name;
                    }}
                />
            </div>
        </div>
    );
}

export default function Sponsors() {
    return (
        <section id="sponsors" className="py-24">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="font-mono text-xs text-[#a855f7]/70 tracking-[0.3em] mb-4">
                        OUR PARTNERS
                    </p>
                    <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white">
                        Sponsors
                    </h2>
                </motion.div>
            </div>

            {/* Sponsor Marquee */}
            <div className="relative overflow-hidden py-8">
                {/* Gradient masks */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />

                {/* Scrolling Container */}
                <div className="flex whitespace-nowrap">
                    <div className="flex animate-marquee">
                        {[...sponsors, ...sponsors].map((sponsor, index) => (
                            <SponsorCard key={`${sponsor.name}-${index}`} sponsor={sponsor} index={index} />
                        ))}
                    </div>
                    <div className="flex animate-marquee">
                        {[...sponsors, ...sponsors].map((sponsor, index) => (
                            <SponsorCard key={`${sponsor.name}-dup-${index}`} sponsor={sponsor} index={index} />
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12 px-6"
            >
                <p className="font-body text-white/40 mb-4">
                    Interested in sponsoring E-Summit &apos;26?
                </p>
                <a
                    href="mailto:ecell@iiitdm.ac.in"
                    className="btn-outline inline-flex items-center gap-2 font-body text-sm"
                    data-hover="true"
                >
                    Become a Sponsor
                </a>
            </motion.div>
        </section>
    );
}
