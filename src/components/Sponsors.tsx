'use client';

import { motion } from 'framer-motion';

const sponsors = [
    { name: 'Google', logo: '🔵' },
    { name: 'Microsoft', logo: '🟦' },
    { name: 'Amazon', logo: '🟠' },
    { name: 'Meta', logo: '🔷' },
    { name: 'Apple', logo: '⚪' },
    { name: 'Netflix', logo: '🔴' },
    { name: 'Spotify', logo: '🟢' },
    { name: 'Adobe', logo: '🔺' },
    { name: 'Salesforce', logo: '☁️' },
    { name: 'Oracle', logo: '🔶' },
];

export default function Sponsors() {
    return (
        <section id="sponsors" className="py-24 bg-[var(--bg-secondary)]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-[var(--text-primary)] mb-4 tracking-tight">
                        Sponsors
                    </h2>
                    <p className="text-xl text-[var(--text-muted)] font-body max-w-2xl mx-auto">
                        Backed by industry leaders who believe in innovation
                    </p>
                </motion.div>

                {/* Sponsor Marquee */}
                <div className="relative overflow-hidden py-8">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10" />

                    {/* Scrolling Container */}
                    <div className="flex whitespace-nowrap">
                        <div className="flex animate-marquee-slow">
                            {[...sponsors, ...sponsors].map((sponsor, index) => (
                                <div
                                    key={`${sponsor.name}-${index}`}
                                    className="mx-8 group"
                                >
                                    <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--accent-secondary)]/10 transition-all duration-500 group-hover:border-[var(--accent-primary)]/30 group-hover:bg-[var(--bg-primary)]">
                                        <span className="text-5xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                            {sponsor.logo}
                                        </span>
                                        <span className="text-lg font-heading font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors duration-500">
                                            {sponsor.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex animate-marquee-slow">
                            {[...sponsors, ...sponsors].map((sponsor, index) => (
                                <div
                                    key={`${sponsor.name}-dup-${index}`}
                                    className="mx-8 group"
                                >
                                    <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--accent-secondary)]/10 transition-all duration-500 group-hover:border-[var(--accent-primary)]/30 group-hover:bg-[var(--bg-primary)]">
                                        <span className="text-5xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                            {sponsor.logo}
                                        </span>
                                        <span className="text-lg font-heading font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors duration-500">
                                            {sponsor.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Become a Sponsor CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mt-12"
                >
                    <p className="text-[var(--text-muted)] font-body mb-4">
                        Interested in sponsoring E-Summit &apos;26?
                    </p>
                    <a
                        href="mailto:sponsors@esummit.iiitdm.ac.in"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--accent-primary)] text-[var(--accent-primary)] font-body font-semibold hover:bg-[var(--accent-primary)] hover:text-[var(--text-dark)] transition-all duration-300"
                    >
                        Contact Us
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
