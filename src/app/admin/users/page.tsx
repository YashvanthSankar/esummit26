'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, Mail, Phone, Ticket, Users, X } from 'lucide-react';
import AdminDock from '@/components/AdminDock';

interface GroupMember {
    name: string;
    email: string;
    isRegistered: boolean;
}

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
    groupMembers?: GroupMember[]; // Other members in the same booking group
}

export default function UsersPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'groups' | 'solo'>('all');
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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

            // Build a map of booking_group_id to all members
            const groupMembersMap: Record<string, GroupMember[]> = {};
            (tickets || []).forEach(t => {
                if (t.booking_group_id) {
                    if (!groupMembersMap[t.booking_group_id]) {
                        groupMembersMap[t.booking_group_id] = [];
                    }
                    // Find name from profile or pending info
                    const profile = profiles.find(p => p.id === t.user_id);
                    groupMembersMap[t.booking_group_id].push({
                        name: profile?.full_name || t.pending_name || 'Unknown',
                        email: profile?.email || t.pending_email || '',
                        isRegistered: !!t.user_id
                    });
                }
            });

            // Combine registered users with their tickets
            const combinedData: UserData[] = profiles.map(profile => {
                const userTicket = tickets?.find(t => t.user_id === profile.id);
                const groupId = userTicket?.booking_group_id;
                const allGroupMembers = groupId ? groupMembersMap[groupId] : undefined;
                // Filter out self from group members
                const otherMembers = allGroupMembers?.filter(m => m.email.toLowerCase() !== profile.email.toLowerCase());

                return {
                    ...profile,
                    isPending: false,
                    ticket: userTicket || null,
                    groupMembers: otherMembers && otherMembers.length > 0 ? otherMembers : undefined
                };
            });

            // Add pending attendees (users with tickets but no profile yet)
            const pendingAttendees: UserData[] = (tickets || [])
                .filter(t => t.pending_email && !t.user_id)
                .map(t => {
                    const groupId = t.booking_group_id;
                    const allGroupMembers = groupId ? groupMembersMap[groupId] : undefined;
                    const otherMembers = allGroupMembers?.filter(m => m.email.toLowerCase() !== t.pending_email?.toLowerCase());

                    return {
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
                        },
                        groupMembers: otherMembers && otherMembers.length > 0 ? otherMembers : undefined
                    };
                });

            setUsers([...combinedData, ...pendingAttendees]);
            setLoading(false);
        };

        fetchUsers();
    }, [supabase]);

    const filteredUsers = users.filter(user => {
        // Text search filter
        const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm);

        // Type filter
        let matchesType = true;
        if (filterType === 'groups') {
            matchesType = !!user.ticket?.booking_group_id;
        } else if (filterType === 'solo') {
            matchesType = user.ticket?.type === 'solo' || !user.ticket?.booking_group_id;
        }

        // If a specific group is selected, only show members of that group
        if (selectedGroupId) {
            return user.ticket?.booking_group_id === selectedGroupId;
        }

        return matchesSearch && matchesType;
    });

    // Get unique booking groups for the filter
    const bookingGroups = [...new Set(users
        .filter(u => u.ticket?.booking_group_id)
        .map(u => u.ticket?.booking_group_id)
    )];

    const handleShowGroup = (groupId: string) => {
        setSelectedGroupId(groupId);
        setSearchTerm('');
        setFilterType('all');
    };

    const clearGroupFilter = () => {
        setSelectedGroupId(null);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] relative">
            {/* Background - subtle grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* Gradient overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            {/* Admin Dock */}
            <AdminDock currentPage="users" />

            {/* Content Container - stays left of dock */}
            <div className="p-4 lg:p-8 mr-0 md:mr-20 relative z-10">
                <div className="max-w-7xl mx-auto space-y-6">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-4xl text-white mb-2">All Users</h1>
                            <p className="text-white/60 text-base">
                                Registered: <span className="font-bold text-white">{users.filter(u => !u.isPending).length}</span> |
                                Pending: <span className="font-bold text-amber-400">{users.filter(u => u.isPending).length}</span> |
                                Groups: <span className="font-bold text-blue-400">{bookingGroups.length}</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filter Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setFilterType('all'); setSelectedGroupId(null); }}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold uppercase transition-colors ${filterType === 'all' && !selectedGroupId
                                            ? 'bg-[#a855f7] text-white shadow-lg shadow-[#a855f7]/20'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => { setFilterType('groups'); setSelectedGroupId(null); }}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold uppercase transition-colors flex items-center gap-2 ${filterType === 'groups'
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Users className="w-4 h-4" /> Groups
                                </button>
                                <button
                                    onClick={() => { setFilterType('solo'); setSelectedGroupId(null); }}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold uppercase transition-colors ${filterType === 'solo'
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    Solo
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Selected Group Banner */}
                    {selectedGroupId && (
                        <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Users className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <span className="text-blue-400 font-bold text-base block">Viewing Group</span>
                                    <span className="text-white/50 text-sm font-mono">{selectedGroupId.substring(0, 8)}...</span>
                                </div>
                            </div>
                            <button
                                onClick={clearGroupFilter}
                                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {filteredUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 p-5 rounded-2xl group hover:border-[#a855f7]/40 hover:bg-[#0f0f0f] hover:shadow-xl hover:shadow-[#a855f7]/5 transition-all duration-300"
                            >
                                {/* User Info Section */}
                                <div className="space-y-3">
                                    {/* Name and Badges */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-heading text-lg text-white">{user.full_name || 'No Name'}</h3>
                                        {user.role === 'admin' && (
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 uppercase border border-red-500/20">
                                                Admin
                                            </span>
                                        )}
                                        {user.isPending && (
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 uppercase border border-amber-500/20">
                                                Pending
                                            </span>
                                        )}
                                    </div>

                                    {/* Contact Details */}
                                    <div className="flex flex-col gap-2 text-sm">
                                        <div className="flex items-center gap-2.5 text-white/70">
                                            <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-2.5 text-white/70">
                                                <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
                                                <span>{user.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ticket Status Section */}
                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                                        {user.ticket ? (
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="flex items-center gap-2 bg-[#a855f7]/10 px-3 py-1.5 rounded-lg border border-[#a855f7]/20">
                                                    <Ticket className="w-4 h-4 text-[#a855f7]" />
                                                    <span className="font-bold text-sm text-white uppercase">{user.ticket.type}</span>
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border ${user.ticket.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                        user.ticket.status === 'pending_verification' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                            'bg-red-500/20 text-red-400 border-red-500/30'
                                                    }`}>
                                                    {user.ticket.status === 'pending_verification' ? 'pending' : user.ticket.status}
                                                </div>

                                                {/* Group Members */}
                                                {user.groupMembers && user.groupMembers.length > 0 && (
                                                    <button
                                                        onClick={() => user.ticket?.booking_group_id && handleShowGroup(user.ticket.booking_group_id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                                                        title={user.groupMembers.map(m => m.name).join(', ')}
                                                    >
                                                        <Users className="w-4 h-4 text-blue-400" />
                                                        <span className="text-sm text-blue-400 font-bold">+{user.groupMembers.length}</span>
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-white/40 text-sm italic">No Ticket</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="col-span-full text-center py-16 text-white/40 text-base">
                                No users found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
