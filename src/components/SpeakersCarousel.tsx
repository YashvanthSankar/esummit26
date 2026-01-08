'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';

const speakers = [
    {
        id: 1,
        name: 'Priya Sharma',
        role: 'CEO & Founder',
        company: 'TechVentures India',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        linkedin: '#',
        twitter: '#',
    },
    {
        id: 2,
        name: 'Rahul Mehta',
        role: 'Partner',
        company: 'Sequoia Capital',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        linkedin: '#',
        twitter: '#',
    },
    {
        id: 3,
        name: 'Ananya Krishnan',
        role: 'CTO',
        company: 'Flipkart',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        linkedin: '#',
        twitter: '#',
    },
    {
        id: 4,
        name: 'Vikram Singh',
        role: 'Founder',
        company: 'ZestMoney',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        linkedin: '#',
        twitter: '#',
    },
    {
        id: 5,
        name: 'Deepa Nair',
        role: 'Managing Director',
        company: 'Accel Partners',
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
        linkedin: '#',
        twitter: '#',
    },
];

export default function SpeakersCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCards = 3;

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % speakers.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + speakers.length) % speakers.length);
    };

    const getVisibleSpeakers = () => {
        const result = [];
        for (let i = 0; i < visibleCards; i++) {
            result.push(speakers[(currentIndex + i) % speakers.length]);
        }
        return result;
    };

    return (
        <section id="speakers" className="py-24 px-6 bg-[var(--bg-secondary)]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-[var(--text-primary)] mb-4 tracking-tight">
                        Speakers
                    </h2>
                    <p className="text-xl text-[var(--text-muted)] font-body max-w-2xl mx-auto">
                        Learn from industry titans and visionary entrepreneurs
                    </p>
                </motion.div>

                {/* Carousel */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-[var(--accent-primary)] text-[var(--text-dark)] flex items-center justify-center hover:scale-110 transition-transform hidden lg:flex"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-[var(--accent-primary)] text-[var(--text-dark)] flex items-center justify-center hover:scale-110 transition-transform hidden lg:flex"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Cards Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                        {getVisibleSpeakers().map((speaker, index) => (
                            <motion.div
                                key={`${speaker.id}-${currentIndex}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-primary)] border border-[var(--accent-secondary)]/10">
                                    {/* Image Container */}
                                    <div className="aspect-[4/5] overflow-hidden">
                                        <img
                                            src={speaker.image}
                                            alt={speaker.name}
                                            className="w-full h-full object-cover grayscale-hover"
                                        />
                                    </div>

                                    {/* Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent">
                                        <h3 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-1">
                                            {speaker.name}
                                        </h3>
                                        <p className="text-[var(--accent-primary)] font-body font-medium mb-1">
                                            {speaker.role}
                                        </p>
                                        <p className="text-[var(--text-muted)] font-body text-sm mb-4">
                                            {speaker.company}
                                        </p>

                                        {/* Social Links */}
                                        <div className="flex gap-3">
                                            <a
                                                href={speaker.linkedin}
                                                className="w-10 h-10 rounded-full bg-[var(--accent-secondary)]/10 flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--text-dark)] transition-all"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                            <a
                                                href={speaker.twitter}
                                                className="w-10 h-10 rounded-full bg-[var(--accent-secondary)]/10 flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--text-dark)] transition-all"
                                            >
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex justify-center gap-4 mt-8 lg:hidden">
                        <button
                            onClick={prev}
                            className="w-12 h-12 rounded-full bg-[var(--accent-primary)] text-[var(--text-dark)] flex items-center justify-center"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={next}
                            className="w-12 h-12 rounded-full bg-[var(--accent-primary)] text-[var(--text-dark)] flex items-center justify-center"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {speakers.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'w-8 bg-[var(--accent-primary)]'
                                        : 'bg-[var(--accent-secondary)]/30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
