'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Linkedin } from 'lucide-react';

const speakers = [
    {
        id: 2,
        name: 'Dr. Mylswamy Annadurai',
        role: 'Moon Man of India',
        company: '',
        image: '/speakers/mylswamy.webp',
        linkedin: 'https://www.linkedin.com/in/mylswamy-annadurai-63aab431/',
    },
    {
        id: 1,
        name: 'Suresh Narasimha',
        role: 'CoCreate Ventures',
        company: '',
        image: '/speakers/suresh.webp',
        linkedin: 'https://www.linkedin.com/in/cocreator/',
    },
    {
        id: 3,
        name: 'Nagaraja Prakasam',
        role: 'Angel Investor | Author',
        company: '',
        image: '/speakers/nagaraja.webp',
        linkedin: 'https://www.linkedin.com/in/nagapr/',
    },
    {
        id: 4,
        name: 'Arunabh Parihar',
        role: 'Co Founder - Zoop Money',
        company: '',
        image: '/speakers/arunabh.webp',
        linkedin: 'https://www.linkedin.com/in/arunabhparihar/',
    },
    {
        id: 5,
        name: 'Harsha Vardhan',
        role: 'Founder, Codedale | HarshaVerse',
        company: '',
        image: '/speakers/harsha.webp',
        linkedin: '',
    },
];

export default function SpeakersCarousel() {
    const [hoveredSpeaker, setHoveredSpeaker] = useState<number | null>(null);

    const handleSpeakerClick = (speaker: typeof speakers[0]) => {
        // Click goes directly to LinkedIn on all devices
        if (speaker.linkedin) {
            window.open(speaker.linkedin, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section id="speakers" className="py-24 px-6 relative overflow-hidden">
            {/* Background Image - Circular Reveal (Desktop only) */}
            {hoveredSpeaker && (
                <motion.div
                    className="hidden md:block fixed inset-0 z-0 pointer-events-none"
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

            <div className="max-w-full mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <p className="font-mono text-xs text-[#a855f7]/70 tracking-[0.3em] mb-4">
                        LEARN FROM THE BEST
                    </p>
                    <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white">
                        Speakers
                    </h2>
                </motion.div>

                {/* Speakers Horizontal Scroll Container */}
                <div className="flex flex-col md:flex-row md:overflow-x-auto pb-12 gap-6 px-4 md:px-12 md:snap-x md:snap-mandatory scrollbar-hide md:mask-fade-sides">
                    {speakers.map((speaker, index) => (
                        <motion.div
                            key={speaker.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group relative cursor-pointer flex-shrink-0 w-full md:w-[320px] md:snap-center"
                            onMouseEnter={() => setHoveredSpeaker(speaker.id)}
                            onMouseLeave={() => setHoveredSpeaker(null)}
                            onClick={() => handleSpeakerClick(speaker)}
                            data-hover="true"
                        >
                            <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[3/4]">
                                {/* Professional Gradient Background - sleek charcoal that blends with photos */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a]" />

                                {/* Subtle purple accent glow at edges */}
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />

                                {/* Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={speaker.image}
                                        alt={speaker.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                    {/* Gradient overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                                </div>

                                {/* Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 md:p-4">
                                    <div className="flex items-center justify-between gap-1">
                                        <motion.h3
                                            className="font-heading text-sm sm:text-base md:text-xl text-white title-lift leading-tight"
                                        >
                                            {speaker.name}
                                        </motion.h3>
                                        {speaker.linkedin && (
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#0077b5]/20 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                                                <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#0077b5]" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-body text-[10px] sm:text-xs md:text-sm text-[#a855f7] line-clamp-1">
                                        {speaker.role}
                                    </p>
                                    {speaker.company && (
                                        <p className="font-body text-[9px] sm:text-[10px] md:text-xs text-white/40 line-clamp-1">
                                            {speaker.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
