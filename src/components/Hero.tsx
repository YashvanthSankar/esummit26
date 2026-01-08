'use client';

import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 grid-pattern overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[var(--accent-secondary)]/10 to-transparent rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[var(--accent-primary)]/5 to-transparent rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-7xl mx-auto">
                {/* Date Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[var(--accent-secondary)]/30 rounded-full bg-[var(--bg-secondary)]/50 backdrop-blur-sm"
                >
                    <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse" />
                    <span className="text-sm text-[var(--text-muted)] font-body">
                        March 2026 • IIITDM Kancheepuram
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-heading font-bold tracking-tighter leading-none mb-6"
                >
                    <span className="block text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] text-[var(--text-primary)] glow-text">
                        E-SUMMIT
                    </span>
                    <span className="block text-7xl sm:text-9xl md:text-[10rem] lg:text-[14rem] text-[var(--accent-primary)] glow-text">
                        &apos;26
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-xl sm:text-2xl md:text-3xl text-[var(--text-muted)] font-body font-light mb-12 tracking-wide"
                >
                    The Premier Entrepreneurship Summit
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <MagneticButton variant="primary" href="#tickets">
                        Get Tickets
                    </MagneticButton>
                    <MagneticButton
                        variant="outline"
                        href="https://unstop.com"
                        external
                    >
                        Register on Unstop
                    </MagneticButton>
                </motion.div>
            </div>

        </section>
    );
}
