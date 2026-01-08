'use client';

import { motion } from 'framer-motion';

const scheduleData = [
    {
        day: 'Day 1',
        date: 'March 14, 2026',
        events: [
            { time: '09:00', title: 'Registration & Welcome', highlight: false },
            { time: '10:30', title: 'Opening Ceremony', highlight: true },
            { time: '12:00', title: 'Keynote: Future of Startups', highlight: false },
            { time: '14:00', title: 'Hackathon Kickoff', highlight: true },
            { time: '16:00', title: 'Investor Panel', highlight: false },
            { time: '19:00', title: 'Networking Dinner', highlight: false },
        ],
    },
    {
        day: 'Day 2',
        date: 'March 15, 2026',
        events: [
            { time: '09:00', title: 'Pitch Perfect Prelims', highlight: false },
            { time: '12:00', title: 'Startup Expo Opens', highlight: true },
            { time: '14:00', title: 'Hackathon Finale', highlight: true },
            { time: '17:00', title: 'Pitch Perfect Finals', highlight: false },
            { time: '19:00', title: 'Awards Ceremony', highlight: true },
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
                    className="mb-16"
                >
                    <p className="font-mono text-xs text-[#ccff00]/70 tracking-[0.3em] mb-4">
                        MARK YOUR CALENDAR
                    </p>
                    <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white">
                        Schedule
                    </h2>
                </motion.div>

                {/* Timeline */}
                <div className="space-y-16">
                    {scheduleData.map((day, dayIndex) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: dayIndex * 0.2 }}
                        >
                            {/* Day Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-heading text-2xl text-[#ccff00]">
                                    {day.day}
                                </span>
                                <span className="font-mono text-xs text-white/40 tracking-widest">
                                    {day.date}
                                </span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Events */}
                            <div className="space-y-4">
                                {day.events.map((event, eventIndex) => (
                                    <motion.div
                                        key={event.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: eventIndex * 0.05 }}
                                        className={`group glass-card rounded-xl p-4 flex items-center gap-6 ${event.highlight ? 'border-[#ccff00]/30' : ''
                                            }`}
                                        data-hover="true"
                                    >
                                        {/* Time */}
                                        <span className={`font-mono text-sm w-16 ${event.highlight ? 'text-[#ccff00]' : 'text-white/40'
                                            }`}>
                                            {event.time}
                                        </span>

                                        {/* Dot */}
                                        <div className={`w-3 h-3 rounded-full ${event.highlight
                                                ? 'bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)]'
                                                : 'bg-white/20'
                                            }`} />

                                        {/* Title */}
                                        <h3 className="font-heading text-lg text-white group-hover:text-[#ccff00] transition-colors flex-1">
                                            {event.title}
                                        </h3>

                                        {/* Arrow on hover */}
                                        <motion.div
                                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4 text-[#ccff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
