'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const speakers = [
    {
        id: 1,
        name: 'Priya Sharma',
        role: 'CEO & Founder',
        company: 'TechVentures India',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    },
    {
        id: 2,
        name: 'Rahul Mehta',
        role: 'Partner',
        company: 'Sequoia Capital',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    },
    {
        id: 3,
        name: 'Ananya Krishnan',
        role: 'CTO',
        company: 'Flipkart',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
    },
    {
        id: 4,
        name: 'Vikram Singh',
        role: 'Founder',
        company: 'ZestMoney',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    },
    {
        id: 5,
        name: 'Deepa Nair',
        role: 'Managing Director',
        company: 'Accel Partners',
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
    },
];

export default function SpeakersCarousel() {
    const [hoveredSpeaker, setHoveredSpeaker] = useState<number | null>(null);

    return (
        <section id="speakers" className="py-24 px-6 relative overflow-hidden">
            {/* Background Image - Circular Reveal */}
            {hoveredSpeaker && (
                <motion.div
                    className="fixed inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div
                        className="absolute inset-0 circular-reveal"
                        style={{
                            backgroundImage: `url(${speakers.find(s => s.id === hoveredSpeaker)?.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.15,
                            clipPath: 'circle(50% at 50% 50%)',
                        }}
                    />
                </motion.div>
            )}

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <p className="font-mono text-xs text-[#ccff00]/70 tracking-[0.3em] mb-4">
                        LEARN FROM THE BEST
                    </p>
                    <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white">
                        Speakers
                    </h2>
                </motion.div>

                {/* Speakers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {speakers.map((speaker, index) => (
                        <motion.div
                            key={speaker.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group relative"
                            onMouseEnter={() => setHoveredSpeaker(speaker.id)}
                            onMouseLeave={() => setHoveredSpeaker(null)}
                            data-hover="true"
                        >
                            <div className="glass-card rounded-2xl overflow-hidden aspect-[3/4]">
                                {/* Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={speaker.image}
                                        alt={speaker.name}
                                        className="w-full h-full object-cover grayscale-hover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                                </div>

                                {/* Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <motion.h3
                                        className="font-heading text-xl text-white title-lift"
                                    >
                                        {speaker.name}
                                    </motion.h3>
                                    <p className="font-body text-sm text-[#ccff00]">
                                        {speaker.role}
                                    </p>
                                    <p className="font-body text-xs text-white/40">
                                        {speaker.company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
