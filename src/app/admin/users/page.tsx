'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, User, Mail, Phone, Ticket } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import AdminDock from '@/components/AdminDock';

interface UserData {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    role: string;
    created_at: string;
    isPending?: boolean; // True if this is a pending attendee without a profile
    ticket?: {
        type: string;
        status: string;
        qr_secret: string;
        amount: number;
        booking_group_id?: string;
    } | null;
}

export default function UsersPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            // Fetch profiles
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
                return;
            }

            // Fetch tickets (including pending attendees)
            const { data: tickets } = await supabase
                .from('tickets')
                .select('*');

            // Combine registered users with their tickets
            const combinedData: UserData[] = profiles.map(profile => {
                const userTicket = tickets?.find(t => t.user_id === profile.id);
                return {
                    ...profile,
                    isPending: false,
                    ticket: userTicket || null
                };
            });

            // Add pending attendees (users with tickets but no profile yet)
            const pendingAttendees: UserData[] = (tickets || [])
                .filter(t => t.pending_email && !t.user_id)
                .map(t => ({
                    id: `pending_${t.id}`,
                    email: t.pending_email,
                    full_name: t.pending_name || 'Pending User',
                    phone: t.pending_phone || '',
                    role: 'pending',
                    created_at: t.created_at,
                    isPending: true,
                    ticket: {
                        type: t.type,
                        status: t.status,
                        qr_secret: t.qr_secret,
                        amount: t.amount,
                        booking_group_id: t.booking_group_id
                    }
                }));

            setUsers([...combinedData, ...pendingAttendees]);
            setLoading(false);
        };

        fetchUsers();
    }, [supabase]);

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    return (
        <main className="p-6 lg:p-12 space-y-8 min-h-screen bg-[#050505]">
            {/* Admin Dock */}
            <AdminDock currentPage="users" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl text-white">All Users</h1>
                    <p className="text-white/50 text-sm mt-1">Total Registered: {users.length}</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#a855f7]/50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredUsers.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center gap-6 group hover:border-[#a855f7]/30 transition-colors"
                    >
                        {/* User Basic Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-heading text-lg text-white truncate">{user.full_name || 'No Name'}</h3>
                                {user.role === 'admin' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wider">
                                        Admin
                                    </span>
                                )}
                                {user.isPending && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                                        Pending Signup
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-white/50">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-white/30" />
                                    {user.email}
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-white/30" />
                                        {user.phone}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ticket Status */}
                        <div className="w-full lg:w-auto flex flex-col lg:items-end gap-2 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                            {user.ticket ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-[#a855f7]" />
                                        <span className="font-bold text-white uppercase">{user.ticket.type} Pass</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${user.ticket.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                        user.ticket.status === 'pending_verification' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                            'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}>
                                        {user.ticket.status.replace('_', ' ')}
                                    </div>
                                    {user.ticket.status === 'paid' && (
                                        <p className="text-[10px] font-mono text-white/30">
                                            Secret: {user.ticket.qr_secret?.substring(0, 8)}...
                                        </p>
                                    )}
                                </>
                            ) : (
                                <span className="text-white/30 text-sm italic">No Ticket Purchased</span>
                            )}
                        </div>
                    </motion.div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-white/30">
                        No users found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </main>
    );
}
