'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [textMousePosition, setTextMousePosition] = useState({ x: 0, y: 0 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // For section-level spotlight
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                mouseX.set(x);
                mouseY.set(y);
                setMousePosition({ x, y });
            }

            // For text-level spotlight (relative to text element)
            if (textRef.current) {
                const textRect = textRef.current.getBoundingClientRect();
                const textX = e.clientX - textRect.left;
                const textY = e.clientY - textRect.top;
                setTextMousePosition({ x: textX, y: textY });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
            },
        },
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
        >

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-20 text-center max-w-[95vw]"
            >
                {/* Monospace Subtext - Hidden since logo includes the text */}
                {/* Logo itself contains "IIITDM Kancheepuram's" */}

                {/* Main Logo with Spotlight Reveal */}
                <motion.div
                    ref={textRef}
                    variants={itemVariants}
                    className="relative"
                >
                    {/* Mobile: Fully visible logo (no spotlight needed) */}
                    <div className="md:hidden flex justify-center">
                        <img
                            src="/logo-esummit.png"
                            alt="E-Summit '26"
                            className="w-full max-w-[320px] h-auto select-none"
                            draggable={false}
                        />
                    </div>

                    {/* Desktop: Dim background logo */}
                    <div className="hidden md:flex justify-center">
                        <img
                            src="/logo-esummit.png"
                            alt="E-Summit '26"
                            className="w-full max-w-[700px] h-auto select-none opacity-10"
                            draggable={false}
                        />
                    </div>

                    {/* Desktop: Revealed logo with mask spotlight */}
                    <div
                        className="hidden md:flex absolute inset-0 justify-center items-center"
                        style={{
                            maskImage: `radial-gradient(350px circle at ${textMousePosition.x}px ${textMousePosition.y}px, black 0%, transparent 80%)`,
                            WebkitMaskImage: `radial-gradient(350px circle at ${textMousePosition.x}px ${textMousePosition.y}px, black 0%, transparent 80%)`,
                        }}
                    >
                        <img
                            src="/logo-esummit.png"
                            alt="E-Summit '26"
                            className="w-full max-w-[700px] h-auto select-none"
                            draggable={false}
                        />
                    </div>
                </motion.div>

                {/* Tagline - Already in logo, but keeping for additional emphasis */}
                <motion.p
                    variants={itemVariants}
                    className="font-body text-base sm:text-lg md:text-xl text-white/50 mt-8 max-w-xl mx-auto"
                >
                    The Premier Entrepreneurship Summit of South India
                </motion.p>

                {/* Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
                >
                    <motion.a
                        href="#tickets"
                        className="btn-primary inline-flex items-center gap-2 font-body"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        data-hover="true"
                    >
                        Get Tickets
                    </motion.a>

                    <motion.a
                        href="https://unstop.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline inline-flex items-center gap-2 font-body"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        data-hover="true"
                    >
                        Register on Unstop
                        <ExternalLink className="w-4 h-4" />
                    </motion.a>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16"
                >
                    <CountdownTimer />
                </motion.div>
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
        </section>
    );
}
