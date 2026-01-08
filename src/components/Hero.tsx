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
            {/* Spotlight Effect - follows mouse across entire section */}
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(204, 255, 0, 0.06), transparent 40%)`,
                }}
            />

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-20 text-center max-w-[95vw]"
            >
                {/* Monospace Subtext */}
                <motion.p
                    variants={itemVariants}
                    className="font-mono text-xs sm:text-sm text-[#ccff00]/70 mb-6 tracking-[0.3em]"
                >
                    IIITDM KANCHEEPURAM PRESENTS
                </motion.p>

                {/* Main Headline with Spotlight Reveal */}
                <motion.div
                    ref={textRef}
                    variants={itemVariants}
                    className="relative"
                >
                    {/* Background grey text */}
                    <h1 className="font-heading text-[clamp(3rem,12vw,14rem)] leading-[0.85] tracking-[-0.05em] text-white/10 select-none">
                        E-SUMMIT
                    </h1>

                    {/* Revealed text with gradient - NOW RELATIVE TO TEXT */}
                    <h1
                        className="absolute inset-0 font-heading text-[clamp(3rem,12vw,14rem)] leading-[0.85] tracking-[-0.05em] bg-clip-text text-transparent select-none"
                        style={{
                            backgroundImage: `radial-gradient(300px circle at ${textMousePosition.x}px ${textMousePosition.y}px, #ffffff, rgba(204, 255, 0, 0.8), transparent)`,
                            WebkitBackgroundClip: 'text',
                        }}
                    >
                        E-SUMMIT
                    </h1>
                </motion.div>

                {/* Year with glow */}
                <motion.div variants={itemVariants} className="relative mt-[-1rem]">
                    <h2 className="font-heading text-[clamp(4rem,15vw,18rem)] leading-[0.85] tracking-[-0.05em] text-[#ccff00] text-glow select-none">
                        &apos;26
                    </h2>
                </motion.div>

                {/* Tagline */}
                <motion.p
                    variants={itemVariants}
                    className="font-body text-lg sm:text-xl text-white/50 mt-8 max-w-xl mx-auto"
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
