'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, User, Mail, Phone, Ticket, Users, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
        <main className="p-4 lg:p-6 space-y-4 min-h-screen bg-[#050505]">
            {/* Admin Dock */}
            <AdminDock currentPage="users" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="font-heading text-2xl text-white">All Users</h1>
                    <p className="text-white/50 text-xs mt-0.5">
                        Registered: {users.filter(u => !u.isPending).length} | 
                        Pending: {users.filter(u => u.isPending).length} |
                        Groups: {bookingGroups.length}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    {/* Filter Buttons */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => { setFilterType('all'); setSelectedGroupId(null); }}
                            className={`px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                                filterType === 'all' && !selectedGroupId 
                                    ? 'bg-[#a855f7] text-white' 
                                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => { setFilterType('groups'); setSelectedGroupId(null); }}
                            className={`px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                                filterType === 'groups' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                            }`}
                        >
                            <Users className="w-3 h-3" /> Groups
                        </button>
                        <button
                            onClick={() => { setFilterType('solo'); setSelectedGroupId(null); }}
                            className={`px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                                filterType === 'solo' 
                                    ? 'bg-purple-500 text-white' 
                                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                            }`}
                        >
                            Solo
                        </button>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#a855f7]/50"
                        />
                    </div>
                </div>
            </div>

            {/* Selected Group Banner */}
            {selectedGroupId && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-bold text-sm">Viewing Group</span>
                        <span className="text-white/50 text-xs font-mono">{selectedGroupId.substring(0, 8)}...</span>
                    </div>
                    <button
                        onClick={clearGroupFilter}
                        className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-2">
                {filteredUsers.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex flex-col lg:flex-row items-start lg:items-center gap-3 group hover:border-[#a855f7]/30 hover:bg-white/[0.04] transition-colors"
                    >
                        {/* User Basic Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-heading text-sm text-white truncate">{user.full_name || 'No Name'}</h3>
                                {user.role === 'admin' && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-500/20 text-red-400 uppercase">
                                        Admin
                                    </span>
                                )}
                                {user.isPending && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-400 uppercase">
                                        Pending
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-white/50">
                                <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-white/30" />
                                    <span className="truncate max-w-[200px]">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-white/30" />
                                        {user.phone}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ticket Status */}
                        <div className="flex items-center gap-3 lg:gap-4">
                            {user.ticket ? (
                                <>
                                    <div className="flex items-center gap-1.5">
                                        <Ticket className="w-3 h-3 text-[#a855f7]" />
                                        <span className="font-bold text-xs text-white uppercase">{user.ticket.type}</span>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.ticket.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                        user.ticket.status === 'pending_verification' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                        {user.ticket.status === 'pending_verification' ? 'pending' : user.ticket.status}
                                    </div>
                                    
                                    {/* Group Partners - Compact */}
                                    {user.groupMembers && user.groupMembers.length > 0 && (
                                        <button
                                            onClick={() => user.ticket?.booking_group_id && handleShowGroup(user.ticket.booking_group_id)}
                                            className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                                            title={user.groupMembers.map(m => m.name).join(', ')}
                                        >
                                            <Users className="w-3 h-3 text-blue-400" />
                                            <span className="text-[10px] text-blue-400 font-bold">+{user.groupMembers.length}</span>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <span className="text-white/30 text-xs italic">No Ticket</span>
                            )}
                        </div>
                    </motion.div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-white/30 text-sm">
                        No users found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </main>
    );
}
