'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Lightbulb, Mic, Users, Trophy, Rocket } from 'lucide-react';

const events = [
    // Flagship Events
    {
        id: 1,
        title: 'Pitch',
        description: 'Present your startup idea to top VCs',
        prize: '₹30,000',
        breakdown: '15k, 9k, 6k',
        category: 'Flagship',
        icon: Lightbulb,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-6 row-span-2',
        unstopLink: 'https://unstop.com/competitions/pitch-perfect-30-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-k-1620201',
    },
    {
        id: 2,
        title: 'MUN',
        description: 'Model United Nations - Debate and diplomacy',
        prize: '₹30,000',
        category: 'Flagship',
        icon: Mic,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-6 row-span-2',
        unstopLink: 'https://unstop.com/competitions/mun-g20-summit-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kan-1622132',
    },
    // Formal Events
    {
        id: 3,
        title: 'Ideathon',
        description: 'Innovative problem-solving competition',
        prize: '₹18,000',
        breakdown: '9k, 6k, 3k',
        category: 'Formal',
        icon: Lightbulb,
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
    },
    {
        id: 4,
        title: 'Quiz',
        description: 'Test your knowledge across domains',
        prize: '₹18,000',
        category: 'Formal',
        icon: Trophy,
        image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
        unstopLink: 'https://unstop.com/quiz/business-verse-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepura-1621530',
    },
    {
        id: 5,
        title: 'Case Study',
        description: 'Solve real-world business challenges',
        prize: '₹15,000',
        breakdown: '7.5k, 5k, 2.5k',
        category: 'Formal',
        icon: Code,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
        unstopLink: 'https://unstop.com/competitions/case-closed-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kanche-1621979',
    },
    {
        id: 6,
        title: 'Best Manager',
        description: 'Showcase your management skills',
        prize: '₹12,000',
        breakdown: '6k, 4k, 2k',
        category: 'Formal',
        icon: Users,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-6 row-span-1',
        unstopLink: 'https://unstop.com/competitions/best-manager-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kanch-1620103',
    },
    {
        id: 7,
        title: 'Bid & Build',
        description: 'Strategic bidding and resource management',
        prize: '₹12,000',
        category: 'Formal',
        icon: Rocket,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        span: 'col-span-4 md:col-span-6 row-span-1',
        unstopLink: 'https://unstop.com/competitions/bid-and-build-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kanc-1621434',
    },
    // Informal Events
    {
        id: 8,
        title: 'IPL Auction',
        description: 'Experience the thrill of bidding wars',
        prize: '₹12,000',
        breakdown: '4k × 3',
        category: 'Informal',
        icon: Trophy,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
        unstopLink: 'https://unstop.com/events/ipl-auction-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-1620583',
    },
    {
        id: 9,
        title: 'Geoguessr',
        description: 'Test your geography knowledge',
        prize: '₹4,000',
        category: 'Informal',
        icon: Trophy,
        image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
        unstopLink: 'https://unstop.com/quiz/geoguesser-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-1620597',
    },
    {
        id: 10,
        title: 'Kalabazaar',
        description: 'Cultural marketplace and trading game',
        prize: '₹4,000',
        category: 'Informal',
        icon: Users,
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
        span: 'col-span-4 row-span-1',
        unstopLink: 'https://unstop.com/events/kaala-bazaar-30-e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheep-1620952',
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
                <p className="font-mono text-xs text-[#a855f7]/70 tracking-[0.3em] mb-4">
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
                    const unstopMainLink = 'https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947';

                    return (
                        <motion.div
                            key={event.id}
                            variants={cardVariants}
                            className={`glass-card group relative rounded-3xl overflow-hidden cursor-pointer ${event.span}`}
                            data-hover="true"
                            onClick={() => window.open(event.unstopLink || unstopMainLink, '_blank')}
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
                            <div className="relative h-full p-6 pt-20 flex flex-col justify-end">
                                {/* Icon */}
                                <div className="absolute top-6 left-6">
                                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-[#a855f7]" />
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <div className="mt-20">
                                    <h3 className="font-heading text-2xl sm:text-3xl text-white title-lift mb-2">
                                        {event.title}
                                    </h3>
                                    <p className="font-body text-white/50 text-sm line-clamp-2">
                                        {event.description}
                                    </p>
                                    {/* Prize details temporarily hidden
                                    {event.breakdown && (
                                        <p className="text-xs text-white/40 mt-1">
                                            {event.breakdown}
                                        </p>
                                    )}
                                    
                                    {event.prize && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 mt-3">
                                            <span className="font-heading text-sm text-[#a855f7]">{event.prize}</span>
                                        </div>
                                    )}
                                    */}

                                    {/* Register Button */}
                                    {event.unstopLink && (
                                        <a
                                            href={event.unstopLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-bold transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Register on Unstop
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#a855f7] transition-all duration-300">
                                <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
