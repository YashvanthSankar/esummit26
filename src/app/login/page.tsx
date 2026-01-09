'use client';

import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Chrome, GraduationCap, Users } from 'lucide-react';

export default function LoginPage() {
    const supabase = createClient();

    const handleIIITDMLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    hd: 'iiitdm.ac.in',
                },
            },
        });
    };

    const handleGuestLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo / Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-heading text-5xl sm:text-6xl text-white mb-2"
                    >
                        E-SUMMIT <span className="text-[#a855f7]">&apos;26</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-mono text-xs text-white/50 tracking-[0.3em]"
                    >
                        SIGN IN TO CONTINUE
                    </motion.p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-3xl p-8 space-y-6"
                >
                    {/* IIITDM Login */}
                    <button
                        onClick={handleIIITDMLogin}
                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                    >
                        <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-[#0a0a0a] px-6 py-4 transition-all duration-300 group-hover:bg-[#0a0a0a]/80">
                            <GraduationCap className="w-5 h-5 text-[#a855f7]" />
                            <span className="font-heading text-lg text-white">
                                IIITDM Login
                            </span>
                        </div>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="font-mono text-xs text-white/30">OR</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Guest Login */}
                    <button
                        onClick={handleGuestLogin}
                        className="w-full group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                        <div className="flex items-center justify-center gap-3 px-6 py-4">
                            <Users className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                            <span className="font-body text-white/60 group-hover:text-white transition-colors">
                                Guest Login
                            </span>
                        </div>
                    </button>

                    {/* Info */}
                    <p className="text-center text-xs text-white/30 font-body">
                        Use your <span className="text-[#a855f7]">@iiitdm.ac.in</span> email for internal access
                    </p>
                </motion.div>

                {/* Back to Home */}
                <motion.a
                    href="/"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="block text-center mt-8 font-body text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                    ← Back to Home
                </motion.a>
            </motion.div>
        </main>
    );
}
