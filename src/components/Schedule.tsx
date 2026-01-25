'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type EventType = 'ceremony' | 'competition' | 'talk' | 'special';

interface ScheduleEvent {
    time: string;
    title: string;
    description?: string;
    type: EventType;
    speaker?: string;
}

const scheduleData: { day: string; date: string; events: ScheduleEvent[] }[] = [
    {
        day: 'Day 1',
        date: 'January 30, 2026',
        events: [
            { time: '6:00 PM', title: 'Lighting of Lamp by the Honoraries', type: 'ceremony' },
            { time: '6:15 PM', title: 'Greetings & Introduction of the Event by the Club Core', type: 'ceremony' },
            { time: '6:30 PM', title: 'Presidential Address', description: 'Prof. MV Karthikeyan, Director IIITDM Kancheepuram', type: 'talk', speaker: 'Prof. MV Karthikeyan' },
            { time: '6:40 PM', title: 'Chief Guest Introduction', description: 'Prof. Raguraman Munusamy, Professor-in-charge E-Cell IIITDM & HoS SIDI', type: 'talk', speaker: 'Prof. Raguraman Munusamy' },
            { time: '6:50 PM', title: 'Launch of E-Summit 2026', description: 'By Padma Shri Dr. Mylswamy Annadurai, Former Director ISRO Satellite Centre, Project Director - Chandrayaan I & II, Programme Director - Mangalyaan', type: 'ceremony', speaker: 'Dr. Mylswamy Annadurai' },
            { time: '7:20 PM', title: 'Vote of Thanks & End of Inauguration', description: 'By Prof. MD Selvaraj, Dean DII & CE', type: 'ceremony', speaker: 'Prof. MD Selvaraj' },
            { time: '7:30 PM', title: 'Bid and Build (Student Competition)', type: 'competition' },
        ],
    },
    {
        day: 'Day 2',
        date: 'January 31, 2026',
        events: [
            { time: '9:00 AM', title: 'MUN (Student Competition)', type: 'competition' },
            { time: '9:00 AM', title: 'Startup Expo', type: 'special' },
            { time: '9:00 AM', title: 'E-Summit Juniors (For Govt. School Students)', type: 'special' },
            { time: '10:00 AM', title: 'Kala Bazaar (Student Competition)', type: 'competition' },
            { time: '10:00 AM', title: 'Ideathon (Student Competition)', type: 'competition' },
            { time: '11:00 AM', title: 'Invited Talk I', description: 'Related to entrepreneurship - TBC', type: 'talk' },
            { time: '2:00 PM', title: 'BusinessVerse (Student Competition)', type: 'competition' },
            { time: '3:00 PM', title: 'Best Manager (Student Competition)', type: 'competition' },
            { time: '6:00 PM', title: 'IPL Auction (Student Competition)', type: 'competition' },
        ],
    },
    {
        day: 'Day 3',
        date: 'February 1, 2026',
        events: [
            { time: '9:00 AM', title: 'Case Closed (Student Competition)', type: 'competition' },
            { time: '9:00 AM', title: 'Entrepreneur of the Day (Student Competition)', type: 'competition' },
            { time: '9:00 AM', title: 'Ideathon Finals (Student Competition)', type: 'competition' },
            { time: '11:00 AM', title: 'Invited Talk II', description: 'Nagaraja Prakasam - Author, Angel Investor', type: 'talk', speaker: 'Nagaraja Prakasam' },
            { time: '10:00 AM', title: 'Geo-Guesser (Student Competition)', type: 'competition' },
            { time: '2:00 PM', title: 'Pitch On Pitch (Student Competition)', type: 'competition' },
            { time: '6:00 PM', title: 'Valedictory Function', description: 'Prize Distribution, Formal Closure of E-Summit', type: 'ceremony' },
            { time: '7:30 PM', title: 'Fireside Chat / Panel Discussion', type: 'talk' },
            { time: '8:30 PM', title: 'Fireside Chat / Panel Discussion', description: 'Dr. Raja Singh, Brahmos Director', type: 'talk', speaker: 'Dr. Raja Singh' },
        ],
    },
];

const typeColors: Record<EventType, { bg: string; border: string; text: string; badge: string }> = {
    ceremony: {
        bg: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300'
    },
    competition: {
        bg: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-300'
    },
    talk: {
        bg: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300'
    },
    special: {
        bg: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300'
    }
};

const typeLabels: Record<EventType, string> = {
    ceremony: 'Ceremony',
    competition: 'Competition',
    talk: 'Talk / Panel',
    special: 'Special Event'
};

export default function Schedule() {
    const [activeDay, setActiveDay] = useState(0);

    return (
        <section id="schedule" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="font-mono text-xs text-[#a855f7]/70 tracking-[0.3em] mb-4">
                        E-SUMMIT 2026
                    </p>
                    <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mb-6">
                        Event Schedule
                    </h2>
                    <p className="text-white/50 max-w-2xl mx-auto">
                        Three days of inspiring talks, exciting competitions, and networking opportunities
                    </p>
                </motion.div>

                {/* Day Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12"
                >
                    {scheduleData.map((day, index) => (
                        <button
                            key={day.day}
                            onClick={() => setActiveDay(index)}
                            className={`group relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${activeDay === index
                                ? 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white shadow-lg shadow-purple-500/25'
                                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                                }`}
                        >
                            <span className="font-heading text-sm sm:text-base md:text-lg">{day.day}</span>
                            <span className="block font-mono text-[10px] sm:text-xs mt-0.5 sm:mt-1 opacity-70">{day.date}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-10"
                >
                    {(Object.keys(typeColors) as EventType[]).map((type) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${typeColors[type].badge}`} />
                            <span className={`font-mono text-xs ${typeColors[type].text}`}>
                                {typeLabels[type]}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* Events Grid */}
                <motion.div
                    key={activeDay}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-2.5 sm:gap-4 md:gap-5"
                >
                    {scheduleData[activeDay].events.map((event, eventIndex) => {
                        const colors = typeColors[event.type];
                        return (
                            <motion.div
                                key={`${event.title}-${eventIndex}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: eventIndex * 0.05 }}
                                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm p-3 sm:p-4 md:p-5 hover:scale-[1.01] transition-transform duration-300`}
                            >
                                {/* Glow effect */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg}`} />

                                <div className="relative flex items-start sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    {/* Time */}
                                    <div className="flex items-center gap-1.5 sm:gap-2 w-20 sm:w-24 md:w-28 shrink-0">
                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colors.text} animate-pulse`} />
                                        <span className={`font-mono text-xs sm:text-sm ${colors.text} font-medium`}>
                                            {event.time}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                            <h3 className="font-heading text-sm sm:text-base md:text-lg text-white group-hover:text-white transition-colors leading-tight">
                                                {event.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[8px] sm:text-[9px] uppercase tracking-wider ${colors.badge}`}>
                                                {typeLabels[event.type]}
                                            </span>
                                        </div>

                                        {event.description && (
                                            <p className="text-white/50 text-[11px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}

                                        {event.speaker && (
                                            <span className={`font-mono text-[9px] sm:text-[10px] ${colors.text} opacity-80`}>
                                                — {event.speaker}
                                            </span>
                                        )}
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className={`hidden sm:flex w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/5 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 ${colors.text}`}>
                                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 sm:mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                >
                    <div className="text-center p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-white">3</span>
                        <p className="font-mono text-[10px] sm:text-xs text-white/50 mt-1">DAYS</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-purple-400">10+</span>
                        <p className="font-mono text-[10px] sm:text-xs text-white/50 mt-1">COMPETITIONS</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-cyan-400">5+</span>
                        <p className="font-mono text-[10px] sm:text-xs text-white/50 mt-1">SPEAKERS</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-amber-400">25+</span>
                        <p className="font-mono text-[10px] sm:text-xs text-white/50 mt-1">EVENTS</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

