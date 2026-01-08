'use client';

import { motion } from 'framer-motion';
import { Code, Lightbulb, Mic, Users, Trophy, Rocket } from 'lucide-react';

const events = [
    {
        id: 1,
        title: 'Hackathon',
        description: '48-hour coding marathon to build innovative solutions',
        icon: Code,
        color: '#ccff00',
        size: 'large',
    },
    {
        id: 2,
        title: 'Pitch Perfect',
        description: 'Present your startup idea to top VCs and investors',
        icon: Lightbulb,
        color: '#6495ED',
        size: 'medium',
    },
    {
        id: 3,
        title: 'Panel Discussion',
        description: 'Industry leaders share insights on entrepreneurship',
        icon: Mic,
        color: '#ff6b6b',
        size: 'medium',
    },
    {
        id: 4,
        title: 'Networking',
        description: 'Connect with founders, mentors, and fellow entrepreneurs',
        icon: Users,
        color: '#4ecdc4',
        size: 'small',
    },
    {
        id: 5,
        title: 'Startup Expo',
        description: 'Showcase your product to thousands of attendees',
        icon: Rocket,
        color: '#f7b731',
        size: 'small',
    },
    {
        id: 6,
        title: 'Awards Ceremony',
        description: 'Recognition for the most innovative ventures',
        icon: Trophy,
        color: '#a55eea',
        size: 'medium',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
        },
    },
};

export default function EventsGrid() {
    return (
        <section id="events" className="py-24 px-6 max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-[var(--text-primary)] mb-4 tracking-tight">
                    Events
                </h2>
                <p className="text-xl text-[var(--text-muted)] font-body max-w-2xl mx-auto">
                    Two days of innovation, inspiration, and incredible opportunities
                </p>
            </motion.div>

            {/* Bento Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {events.map((event) => {
                    const Icon = event.icon;
                    return (
                        <motion.div
                            key={event.id}
                            variants={cardVariants}
                            whileHover={{ scale: 1.03, y: -8 }}
                            className={`
                bento-card relative p-8 rounded-3xl
                bg-[var(--bg-secondary)] border border-[var(--accent-secondary)]/10
                cursor-pointer group overflow-hidden
                ${event.size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''}
              `}
                            style={{
                                boxShadow: `0 0 0 1px ${event.color}10`,
                            }}
                        >
                            {/* Hover Gradient Overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: `radial-gradient(circle at 50% 50%, ${event.color}08, transparent 70%)`,
                                }}
                            />

                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundColor: `${event.color}15` }}
                            >
                                <Icon
                                    className="w-7 h-7 transition-colors duration-300"
                                    style={{ color: event.color }}
                                />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                                {event.title}
                            </h3>
                            <p className="text-[var(--text-muted)] font-body text-lg leading-relaxed">
                                {event.description}
                            </p>

                            {/* Corner Accent */}
                            <div
                                className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(135deg, transparent 50%, ${event.color})`,
                                }}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
