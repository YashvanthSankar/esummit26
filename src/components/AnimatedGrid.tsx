'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function AnimatedGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Animated SVG Grid */}
            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="grid"
                        width="60"
                        height="60"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 60 0 L 0 0 0 60"
                            fill="none"
                            stroke="rgba(204, 255, 0, 0.03)"
                            strokeWidth="0.5"
                            className="grid-line"
                        />
                    </pattern>

                    {/* Animated glowing lines */}
                    <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(204, 255, 0, 0)" />
                        <stop offset="50%" stopColor="rgba(204, 255, 0, 0.5)" />
                        <stop offset="100%" stopColor="rgba(204, 255, 0, 0)" />
                    </linearGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Pulsing accent lines */}
                <motion.line
                    x1="0"
                    y1="180"
                    x2="100%"
                    y2="180"
                    stroke="url(#lineGlow)"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        x1: ['-100%', '100%'],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
                <motion.line
                    x1="0"
                    y1="420"
                    x2="100%"
                    y2="420"
                    stroke="url(#lineGlow)"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.3, 0],
                        x1: ['-100%', '100%'],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: 2,
                    }}
                />
                <motion.line
                    x1="360"
                    y1="0"
                    x2="360"
                    y2="100%"
                    stroke="url(#lineGlow)"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />
            </svg>

            {/* Gradient Orbs */}
            <motion.div
                className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(204, 255, 0, 0.08) 0%, transparent 70%)',
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
                }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}
