'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

const scheduleData = [
    {
        day: 'Day 1',
        date: 'March 14, 2026',
        events: [
            {
                time: '09:00 AM',
                title: 'Registration & Welcome Kit',
                location: 'Main Entrance',
                duration: '1 hour',
            },
            {
                time: '10:00 AM',
                title: 'Opening Ceremony',
                location: 'Auditorium',
                duration: '1.5 hours',
                highlight: true,
            },
            {
                time: '12:00 PM',
                title: 'Keynote: Future of Indian Startups',
                location: 'Main Stage',
                duration: '1 hour',
            },
            {
                time: '02:00 PM',
                title: 'Hackathon Kickoff',
                location: 'Innovation Hub',
                duration: '48 hours',
                highlight: true,
            },
            {
                time: '04:00 PM',
                title: 'Investor Panel Discussion',
                location: 'Conference Hall A',
                duration: '2 hours',
            },
            {
                time: '07:00 PM',
                title: 'Networking Dinner',
                location: 'Open Ground',
                duration: '3 hours',
            },
        ],
    },
    {
        day: 'Day 2',
        date: 'March 15, 2026',
        events: [
            {
                time: '09:00 AM',
                title: 'Pitch Perfect Prelims',
                location: 'Conference Hall B',
                duration: '3 hours',
            },
            {
                time: '12:00 PM',
                title: 'Startup Expo Opens',
                location: 'Exhibition Hall',
                duration: '6 hours',
                highlight: true,
            },
            {
                time: '02:00 PM',
                title: 'Hackathon Finale & Judging',
                location: 'Innovation Hub',
                duration: '2 hours',
                highlight: true,
            },
            {
                time: '05:00 PM',
                title: 'Pitch Perfect Finals',
                location: 'Main Stage',
                duration: '2 hours',
            },
            {
                time: '07:00 PM',
                title: 'Awards Ceremony & Closing',
                location: 'Auditorium',
                duration: '2 hours',
                highlight: true,
            },
        ],
    },
];

export default function Schedule() {
    return (
        <section id="schedule" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-[var(--text-primary)] mb-4 tracking-tight">
                        Schedule
                    </h2>
                    <p className="text-xl text-[var(--text-muted)] font-body max-w-2xl mx-auto">
                        Two days packed with learning, building, and connecting
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="space-y-16">
                    {scheduleData.map((day, dayIndex) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: dayIndex * 0.2 }}
                        >
                            {/* Day Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="px-6 py-3 rounded-full bg-[var(--accent-primary)] text-[var(--text-dark)] font-heading font-bold text-xl">
                                    {day.day}
                                </div>
                                <span className="text-[var(--text-muted)] font-body text-lg">
                                    {day.date}
                                </span>
                            </div>

                            {/* Events */}
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-secondary)] to-[var(--accent-primary)]" />

                                <div className="space-y-6">
                                    {day.events.map((event, eventIndex) => (
                                        <motion.div
                                            key={event.title}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: eventIndex * 0.1 }}
                                            className="relative flex gap-6 group"
                                        >
                                            {/* Timeline Dot */}
                                            <div
                                                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${event.highlight
                                                        ? 'bg-[var(--accent-primary)] text-[var(--text-dark)]'
                                                        : 'bg-[var(--bg-secondary)] border-2 border-[var(--accent-secondary)]/30'
                                                    }`}
                                            >
                                                <Clock className="w-5 h-5" />
                                            </div>

                                            {/* Event Card */}
                                            <div
                                                className={`flex-1 p-6 rounded-2xl transition-all duration-300 group-hover:translate-x-2 ${event.highlight
                                                        ? 'bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30'
                                                        : 'bg-[var(--bg-secondary)] border border-[var(--accent-secondary)]/10'
                                                    }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                    <span
                                                        className={`font-heading font-bold text-lg ${event.highlight
                                                                ? 'text-[var(--accent-primary)]'
                                                                : 'text-[var(--accent-secondary)]'
                                                            }`}
                                                    >
                                                        {event.time}
                                                    </span>
                                                    <span className="text-sm text-[var(--text-muted)] font-body">
                                                        {event.duration}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-2">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-sm font-body">{event.location}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
