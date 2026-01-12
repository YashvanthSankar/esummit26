'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Loader2, Plus, Key, Trash2, ToggleLeft, ToggleRight, 
    Clock, Users, Shield, ChevronDown, ChevronUp,
    AlertTriangle, History, Eye, EyeOff, Copy, Check
} from 'lucide-react';
import AdminDock from '@/components/AdminDock';
import { toast } from 'sonner';

interface AdminPassword {
    id: string;
    label: string;
    is_active: boolean;
    max_uses: number | null;
    current_uses: number;
    created_at: string;
    expires_at: string | null;
    plain_password?: string; // Only available right after creation
}

interface AccessLog {
    id: string;
    user_id: string;
    user_email: string;
    password_label: string;
    granted_at: string;
    granted_by_password: boolean;
    user: {
        full_name: string;
        role: string;
    } | null;
}

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [passwords, setPasswords] = useState<AdminPassword[]>([]);
    const [logs, setLogs] = useState<AccessLog[]>([]);
    const [showLogs, setShowLogs] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    
    // Create password form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [newMaxUses, setNewMaxUses] = useState<number | ''>('');
    const [newExpiresAt, setNewExpiresAt] = useState('');
    const [creating, setCreating] = useState(false);
    
    // Password visibility and copy state
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);


    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }
            
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            
            if (profile?.role !== 'super_admin') {
                window.location.href = '/admin';
                return;
            }
            
            setIsSuperAdmin(true);
            fetchData();
        };
        
        checkAccess();
    }, [supabase]);

    const fetchData = async () => {
        setLoading(true);
        
        try {
            // Fetch passwords
            const pwdRes = await fetch('/api/admin/passwords');
            if (pwdRes.ok) {
                const { passwords } = await pwdRes.json();
                setPasswords(passwords || []);
            }
            
            // Fetch logs
            const logsRes = await fetch('/api/admin/access-logs');
            if (logsRes.ok) {
                const { logs } = await logsRes.json();
                setLogs(logs || []);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load settings');
        }
        
        setLoading(false);
    };

    const handleCreatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        if (!newLabel.trim()) {
            toast.error('Label is required');
            return;
        }
        
        setCreating(true);
        
        try {
            const res = await fetch('/api/admin/passwords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: newPassword,
                    label: newLabel.trim(),
                    maxUses: newMaxUses || null,
                    expiresAt: newExpiresAt || null,
                }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to create password');
            }
            
            toast.success('Admin password created! Click the eye icon to view it.');
            // Store the password with the plain password for viewing
            const passwordWithPlain = {
                ...data.password,
                plain_password: data.plainPassword
            };
            setPasswords([passwordWithPlain, ...passwords]);
            // Auto-show the new password
            setVisiblePasswords(new Set([data.password.id]));
            setShowCreateForm(false);
            setNewPassword('');
            setNewLabel('');
            setNewMaxUses('');
            setNewExpiresAt('');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create password');
        }
        
        setCreating(false);
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        try {
            const res = await fetch('/api/admin/passwords', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentState }),
            });
            
            if (!res.ok) {
                throw new Error('Failed to update password');
            }
            
            setPasswords(passwords.map(p => 
                p.id === id ? { ...p, is_active: !currentState } : p
            ));
            toast.success(currentState ? 'Password deactivated' : 'Password activated');
        } catch {
            toast.error('Failed to update password');
        }
    };

    const handleDelete = async (id: string, label: string) => {
        if (!confirm(`Delete password "${label}"? This cannot be undone.`)) {
            return;
        }
        
        try {
            const res = await fetch(`/api/admin/passwords?id=${id}`, {
                method: 'DELETE',
            });
            
            if (!res.ok) {
                throw new Error('Failed to delete password');
            }
            
            setPasswords(passwords.filter(p => p.id !== id));
            toast.success('Password deleted');
        } catch {
            toast.error('Failed to delete password');
        }
    };

    const togglePasswordVisibility = (id: string) => {
        const newVisible = new Set(visiblePasswords);
        if (newVisible.has(id)) {
            newVisible.delete(id);
        } else {
            newVisible.add(id);
        }
        setVisiblePasswords(newVisible);
    };

    const copyPassword = (password: string, id: string) => {
        navigator.clipboard.writeText(password);
        setCopiedId(id);
        toast.success('Password copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const generateRandomPassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(password);
    };

    if (loading || !isSuperAdmin) {
        return (
            <div className="h-full flex items-center justify-center min-h-screen bg-[#050505]">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] relative">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

            <AdminDock currentPage="settings" />

            <div className="p-4 lg:p-8 mr-0 md:mr-20 relative z-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                            <Shield className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="font-heading text-3xl text-white">Super Admin Settings</h1>
                            <p className="text-white/50">Manage admin access passwords</p>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-100/80">
                            <p className="font-semibold text-amber-100 mb-1">How Admin Access Works</p>
                            <p>Create passwords below. Share them with internal users (IIITDM students) who need admin access. They can enter the password at <code className="bg-amber-500/20 px-1 rounded">/dashboard/request-access</code> to become an admin.</p>
                        </div>
                    </div>

                    {/* Create New Password */}
                    <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#a855f7]/20">
                                    <Plus className="w-5 h-5 text-[#a855f7]" />
                                </div>
                                <span className="font-bold text-white">Create New Admin Password</span>
                            </div>
                            {showCreateForm ? (
                                <ChevronUp className="w-5 h-5 text-white/50" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-white/50" />
                            )}
                        </button>

                        <AnimatePresence>
                            {showCreateForm && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 space-y-4 border-t border-white/10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-bold text-white/70 mb-2">
                                                    Label <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., January 2026 Batch"
                                                    value={newLabel}
                                                    onChange={(e) => setNewLabel(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-white/70 mb-2">
                                                    Password <span className="text-red-400">*</span>
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter password (min 6 chars)"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 font-mono"
                                                        style={{ textTransform: 'none' }}
                                                    />
                                                    <button
                                                        onClick={generateRandomPassword}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                                                        title="Generate random password"
                                                    >
                                                        <Key className="w-5 h-5 text-white/60" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-white/70 mb-2">
                                                    Max Uses <span className="text-white/40">(optional)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Unlimited"
                                                    value={newMaxUses}
                                                    onChange={(e) => setNewMaxUses(e.target.value ? parseInt(e.target.value) : '')}
                                                    min="1"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-white/70 mb-2">
                                                    Expires At <span className="text-white/40">(optional)</span>
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={newExpiresAt}
                                                    onChange={(e) => setNewExpiresAt(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                onClick={() => setShowCreateForm(false)}
                                                className="px-4 py-2.5 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCreatePassword}
                                                disabled={creating}
                                                className="px-4 py-2.5 bg-[#a855f7] text-white rounded-xl hover:bg-[#9333ea] transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {creating ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                                Create Password
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Existing Passwords */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Key className="w-5 h-5 text-[#a855f7]" />
                            Active Passwords ({passwords.filter(p => p.is_active).length})
                        </h2>

                        {passwords.length === 0 ? (
                            <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 text-center">
                                <Key className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                <p className="text-white/50">No admin passwords created yet</p>
                                <p className="text-white/30 text-sm mt-1">Create one above to allow internal users to become admin</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {passwords.map((pwd) => (
                                    <motion.div
                                        key={pwd.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`bg-[#0a0a0a]/90 border rounded-xl p-4 ${
                                            pwd.is_active 
                                                ? 'border-white/10 hover:border-[#a855f7]/30' 
                                                : 'border-white/5 opacity-60'
                                        } transition-all`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={`p-2 rounded-lg flex-shrink-0 ${pwd.is_active ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                    <Key className={`w-4 h-4 ${pwd.is_active ? 'text-green-400' : 'text-red-400'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white">{pwd.label}</h3>
                                                    
                                                    {/* Show password if available */}
                                                    {pwd.plain_password && (
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <code className="px-2 py-1 bg-white/10 rounded text-sm font-mono text-[#a855f7]" style={{ textTransform: 'none' }}>
                                                                {visiblePasswords.has(pwd.id) ? pwd.plain_password : '••••••••••••'}
                                                            </code>
                                                            <button
                                                                onClick={() => togglePasswordVisibility(pwd.id)}
                                                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                                                title={visiblePasswords.has(pwd.id) ? 'Hide password' : 'Show password'}
                                                            >
                                                                {visiblePasswords.has(pwd.id) ? (
                                                                    <EyeOff className="w-4 h-4 text-white/50" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4 text-white/50" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => copyPassword(pwd.plain_password!, pwd.id)}
                                                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                                                title="Copy password"
                                                            >
                                                                {copiedId === pwd.id ? (
                                                                    <Check className="w-4 h-4 text-green-400" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-white/50" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {pwd.current_uses}/{pwd.max_uses || '∞'} used
                                                        </span>
                                                        {pwd.expires_at && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Expires {new Date(pwd.expires_at).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleToggleActive(pwd.id, pwd.is_active)}
                                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                    title={pwd.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {pwd.is_active ? (
                                                        <ToggleRight className="w-5 h-5 text-green-400" />
                                                    ) : (
                                                        <ToggleLeft className="w-5 h-5 text-white/40" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pwd.id, pwd.label)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Access Logs */}
                    <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <History className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="font-bold text-white">Admin Access Logs ({logs.length})</span>
                            </div>
                            {showLogs ? (
                                <ChevronUp className="w-5 h-5 text-white/50" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-white/50" />
                            )}
                        </button>

                        <AnimatePresence>
                            {showLogs && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-white/10 max-h-96 overflow-y-auto">
                                        {logs.length === 0 ? (
                                            <div className="p-8 text-center text-white/50">
                                                No admin access grants recorded yet
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-white/5">
                                                {logs.map((log) => (
                                                    <div key={log.id} className="p-4 hover:bg-white/5">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-white font-medium">
                                                                    {log.user?.full_name || 'Unknown User'}
                                                                </p>
                                                                <p className="text-sm text-white/50">
                                                                    {log.user_email}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm text-white/70">
                                                                    via &quot;{log.password_label}&quot;
                                                                </p>
                                                                <p className="text-xs text-white/40">
                                                                    {new Date(log.granted_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
