'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';

const speakers = [
    {
        id: 1,
        name: 'Nagaraja Prakasam',
        role: 'Author, Angel Investor, Mentor, Fund Advisor',
        company: '',
        image: '/speakers/nagaraja.jpg',
        linkedin: 'https://www.linkedin.com/in/nagapr/',
    },
    {
        id: 2,
        name: 'Coming Soon',
        role: 'To Be Announced',
        company: 'Stay Tuned! 🎉',
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=500&fit=crop&blur=50',
        linkedin: null,
    },
    {
        id: 3,
        name: 'Coming Soon',
        role: 'To Be Announced',
        company: 'Stay Tuned! 🎉',
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=500&fit=crop&blur=50',
        linkedin: null,
    },
    {
        id: 4,
        name: 'Coming Soon',
        role: 'To Be Announced',
        company: 'Stay Tuned! 🎉',
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=500&fit=crop&blur=50',
        linkedin: null,
    },
];

export default function SpeakersCarousel() {
    const [hoveredSpeaker, setHoveredSpeaker] = useState<number | null>(null);
    const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSpeakerClick = (speaker: typeof speakers[0]) => {
        if (isMobile) {
            // Mobile: first tap shows background, second tap goes to LinkedIn
            if (activeSpeaker === speaker.id && speaker.linkedin) {
                window.open(speaker.linkedin, '_blank', 'noopener,noreferrer');
            } else {
                setActiveSpeaker(speaker.id);
            }
        } else {
            // Desktop: click goes directly to LinkedIn
            if (speaker.linkedin) {
                window.open(speaker.linkedin, '_blank', 'noopener,noreferrer');
            }
        }
    };

    // Get background speaker ID (hover on desktop, active on mobile)
    const backgroundSpeakerId = isMobile ? activeSpeaker : hoveredSpeaker;

    return (
        <section id="speakers" className="py-24 px-6 relative overflow-hidden">
            {/* Background Image - Circular Reveal */}
            {backgroundSpeakerId && (
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
                            backgroundImage: `url(${speakers.find(s => s.id === backgroundSpeakerId)?.image})`,
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
                    <p className="font-mono text-xs text-[#a855f7]/70 tracking-[0.3em] mb-4">
                        LEARN FROM THE BEST
                    </p>
                    <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white">
                        Speakers
                    </h2>
                </motion.div>

                {/* Speakers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {speakers.map((speaker, index) => (
                        <motion.div
                            key={speaker.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className={`group relative cursor-pointer ${activeSpeaker === speaker.id ? 'ring-2 ring-[#a855f7] rounded-2xl' : ''}`}
                            onMouseEnter={() => !isMobile && setHoveredSpeaker(speaker.id)}
                            onMouseLeave={() => !isMobile && setHoveredSpeaker(null)}
                            onClick={() => handleSpeakerClick(speaker)}
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
                                    <div className="flex items-center justify-between">
                                        <motion.h3
                                            className="font-heading text-xl text-white title-lift"
                                        >
                                            {speaker.name}
                                        </motion.h3>
                                        {speaker.linkedin && (
                                            <div className={`w-8 h-8 rounded-full bg-[#0077b5]/20 flex items-center justify-center transition-opacity ${isMobile ? (activeSpeaker === speaker.id ? 'opacity-100' : 'opacity-50') : 'opacity-0 group-hover:opacity-100'}`}>
                                                <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-body text-sm text-[#a855f7]">
                                        {speaker.role}
                                    </p>
                                    <p className="font-body text-xs text-white/40">
                                        {speaker.company}
                                    </p>
                                    {/* Mobile hint */}
                                    {isMobile && activeSpeaker === speaker.id && speaker.linkedin && (
                                        <p className="font-mono text-xs text-[#a855f7]/70 mt-2 animate-pulse">
                                            Tap again to visit LinkedIn →
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
