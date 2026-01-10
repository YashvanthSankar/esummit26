'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';
import DashboardDock from '@/components/DashboardDock';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: string;
}

interface AttendedEvent {
    event_id: string;
    event_name: string;
    scanned_at: string;
}

export default function EventsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
    const [ticket, setTicket] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
            }

            // Fetch user's ticket
            const { data: ticketData } = await supabase
                .from('tickets')
                .select('*')
                .or(`user_id.eq.${user.id},pending_email.eq.${profileData.email}`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (ticketData) {
                setTicket(ticketData);

                // Fetch attended events
                const { data: eventLogs } = await supabase
                    .from('event_logs')
                    .select('event_id, event_name, scanned_at')
                    .eq('ticket_id', ticketData.id)
                    .order('scanned_at', { ascending: false });

                if (eventLogs) {
                    setAttendedEvents(eventLogs);
                }
            }

            setLoading(false);
        };

        loadData();
    }, [supabase]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Dock Navigation */}
            <DashboardDock userName={profile?.full_name} userRole={profile?.role} currentPage="events" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white">
                        Attended Events
                    </h1>
                    <p className="font-body text-white/50 mt-2 text-sm sm:text-base">
                        Events you&apos;ve checked into
                    </p>
                </div>

                {/* Events Grid */}
                {ticket?.status === 'paid' ? (
                    attendedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {attendedEvents.map((event) => (
                                <motion.div
                                    key={event.event_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#a855f7]/30 transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-[#a855f7]/10">
                                            <CheckCircle className="w-6 h-6 text-[#a855f7]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-heading text-xl mb-2">
                                                {event.event_name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/50 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(event.scanned_at).toLocaleString('en-IN', {
                                                        timeZone: 'Asia/Kolkata',
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <Calendar className="w-8 h-8 text-white/30" />
                            </div>
                            <p className="text-white/40 text-lg">No events attended yet</p>
                            <p className="text-white/30 text-sm mt-2">
                                Check in at events to see them here
                            </p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-white/30" />
                        </div>
                        <p className="text-white/40 text-lg">Get your ticket verified first</p>
                        <p className="text-white/30 text-sm mt-2">
                            Attend events after your payment is approved
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
