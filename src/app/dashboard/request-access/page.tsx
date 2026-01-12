'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Shield, Key, Check, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { hasAdminAccess } from '@/types/database';

export default function RequestAccessPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState<{
        email: string;
        name: string;
        role: string;
    } | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                router.push('/login');
                return;
            }
            
            const { data: profile } = await supabase
                .from('profiles')
                .select('email, full_name, role')
                .eq('id', user.id)
                .single();
            
            if (!profile) {
                router.push('/onboarding');
                return;
            }
            
            // If already admin, redirect to admin dashboard
            if (hasAdminAccess(profile.role)) {
                router.push('/admin');
                return;
            }
            
            setUserInfo({
                email: profile.email,
                name: profile.full_name || 'User',
                role: profile.role,
            });
            
            setLoading(false);
        };
        
        checkUser();
    }, [supabase, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!password.trim()) {
            toast.error('Please enter the admin password');
            return;
        }
        
        setSubmitting(true);
        
        try {
            const res = await fetch('/api/admin/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password.trim() }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                if (data.notInternal) {
                    toast.error('Only IIITDM students can become admin. Please login with @iiitdm.ac.in email.', {
                        duration: 5000,
                    });
                } else if (data.alreadyAdmin) {
                    toast.success('You already have admin access!');
                    router.push('/admin');
                } else {
                    toast.error(data.error || 'Invalid password');
                }
                setSubmitting(false);
                return;
            }
            
            setSuccess(true);
            toast.success(data.message || 'Admin access granted!');
            
            // Clear profile cache and redirect
            setTimeout(() => {
                router.push('/admin');
            }, 2000);
        } catch (error) {
            console.error('Error verifying password:', error);
            toast.error('Something went wrong. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </div>
        );
    }

    // Not internal user
    if (userInfo && userInfo.role !== 'internal') {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-[#0a0a0a]/90 border border-red-500/20 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-red-400" />
                        </div>
                        
                        <h1 className="text-2xl font-heading text-white mb-2">Access Restricted</h1>
                        <p className="text-white/60 mb-6">
                            Admin access is only available to IIITDM students. Please login with your <span className="text-[#a855f7] font-mono">@iiitdm.ac.in</span> email to request admin access.
                        </p>
                        
                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <p className="text-sm text-white/50">Currently logged in as:</p>
                            <p className="text-white font-medium mt-1">{userInfo.email}</p>
                            <p className="text-xs text-amber-400 mt-1 uppercase">Role: {userInfo.role}</p>
                        </div>
                        
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full px-4 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {success ? (
                    <div className="bg-[#0a0a0a]/90 border border-green-500/20 rounded-2xl p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                        >
                            <Check className="w-10 h-10 text-green-400" />
                        </motion.div>
                        
                        <h1 className="text-2xl font-heading text-white mb-2">Access Granted!</h1>
                        <p className="text-white/60 mb-4">
                            You now have admin access. Redirecting to admin dashboard...
                        </p>
                        
                        <Loader2 className="w-6 h-6 text-[#a855f7] animate-spin mx-auto" />
                    </div>
                ) : (
                    <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-pink-500/10 border border-[#a855f7]/20">
                                <Shield className="w-6 h-6 text-[#a855f7]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading text-white">Request Admin Access</h1>
                                <p className="text-white/50 text-sm">Enter the password provided by super admin</p>
                            </div>
                        </div>
                        
                        {/* User Info */}
                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                                    <span className="text-[#a855f7] font-bold">{userInfo?.name?.charAt(0) || 'U'}</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">{userInfo?.name}</p>
                                    <p className="text-white/50 text-sm">{userInfo?.email}</p>
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-white/70 mb-2">
                                    Admin Password
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="password"
                                        placeholder="Enter the admin password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={submitting || !password.trim()}
                                className="w-full px-4 py-3 bg-[#a855f7] text-white rounded-xl hover:bg-[#9333ea] transition-colors disabled:opacity-50 disabled:hover:bg-[#a855f7] flex items-center justify-center gap-2 font-bold"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Request Access
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-start gap-2 text-sm text-white/50">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p>
                                    Don&apos;t have the password? Contact a super admin or event coordinator to get the admin access password.
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full mt-4 px-4 py-2.5 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors text-sm"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </motion.div>
        </main>
    );
}
