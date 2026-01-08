'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Lightbulb, Mic, Users, Trophy, Rocket } from 'lucide-react';

const events = [
    {
        id: 1,
        title: 'Hackathon',
        description: '48-hour coding marathon to build innovative solutions',
        icon: Code,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-8 row-span-2',
    },
    {
        id: 2,
        title: 'Pitch Perfect',
        description: 'Present your startup idea to top VCs',
        icon: Lightbulb,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
    },
    {
        id: 3,
        title: 'IPL Auction',
        description: 'Experience the thrill of bidding wars',
        icon: Trophy,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
    },
    {
        id: 4,
        title: 'Keynote Sessions',
        description: 'Learn from industry titans',
        icon: Mic,
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-6 row-span-1',
    },
    {
        id: 5,
        title: 'Startup Expo',
        description: 'Showcase your product',
        icon: Rocket,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-3 row-span-1',
    },
    {
        id: 6,
        title: 'Networking',
        description: 'Connect with founders',
        icon: Users,
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-3 row-span-1',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
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
                className="mb-16"
            >
                <p className="font-mono text-xs text-[#ccff00]/70 tracking-[0.3em] mb-4">
                    WHAT WE OFFER
                </p>
                <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white">
                    Events
                </h2>
            </motion.div>

            {/* Bento Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bento-grid auto-rows-[200px]"
            >
                {events.map((event) => {
                    const Icon = event.icon;
                    return (
                        <motion.div
                            key={event.id}
                            variants={cardVariants}
                            className={`glass-card group relative rounded-3xl overflow-hidden ${event.span}`}
                            data-hover="true"
                        >
                            {/* Background Image with Zoom */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover img-zoom opacity-30"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative h-full p-6 flex flex-col justify-end">
                                {/* Icon */}
                                <div className="absolute top-6 left-6">
                                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-[#ccff00]" />
                                    </div>
                                </div>

                                {/* Arrow - appears on hover */}
                                <div className="absolute top-6 right-6 hover-arrow">
                                    <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center">
                                        <ArrowUpRight className="w-5 h-5 text-[#050505]" />
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <div>
                                    <h3 className="font-heading text-2xl sm:text-3xl text-white title-lift mb-2">
                                        {event.title}
                                    </h3>
                                    <p className="font-body text-white/50 text-sm line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
