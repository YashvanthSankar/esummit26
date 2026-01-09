'use client';

import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Phone, Building2, IdCard, ArrowRight, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
    const supabase = createClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isInternal, setIsInternal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        college_name: '',
        roll_number: '',
    });

    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsInternal(user.email?.endsWith('@iiitdm.ac.in') ?? false);

                // Pre-fill with existing data
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, phone, college_name, roll_number')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setFormData({
                        full_name: profile.full_name || user.user_metadata.full_name || '',
                        phone: profile.phone || '',
                        college_name: profile.college_name || (user.email?.endsWith('@iiitdm.ac.in') ? 'IIITDM Kancheepuram' : ''),
                        roll_number: profile.roll_number || '',
                    });
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: formData.full_name,
                phone: formData.phone,
                college_name: formData.college_name,
                roll_number: isInternal ? formData.roll_number : null,
            })
            .eq('id', user.id);

        if (!error) {
            router.push('/dashboard');
        } else {
            setSubmitting(false);
            alert('Error updating profile. Please try again.');
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-lg"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
                        <span className="font-mono text-xs text-[#a855f7]">
                            {isInternal ? 'INTERNAL MEMBER' : 'EXTERNAL GUEST'}
                        </span>
                    </motion.div>

                    <h1 className="font-heading text-4xl sm:text-5xl text-white mb-2">
                        Complete Your Profile
                    </h1>
                    <p className="font-body text-white/50">
                        We need a few more details to get you started
                    </p>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="glass-card rounded-3xl p-8 space-y-6"
                >
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-mono text-xs text-white/50">
                            <User className="w-4 h-4" />
                            FULL NAME
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body placeholder:text-white/30 focus:outline-none focus:border-[#a855f7] transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-mono text-xs text-white/50">
                            <Phone className="w-4 h-4" />
                            PHONE NUMBER
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body placeholder:text-white/30 focus:outline-none focus:border-[#a855f7] transition-colors"
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    {/* College Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-mono text-xs text-white/50">
                            <Building2 className="w-4 h-4" />
                            COLLEGE / ORGANIZATION
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.college_name}
                            onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                            disabled={isInternal}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body placeholder:text-white/30 focus:outline-none focus:border-[#a855f7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Your college name"
                        />
                    </div>

                    {/* Roll Number (Internal only) */}
                    {isInternal && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                        >
                            <label className="flex items-center gap-2 font-mono text-xs text-white/50">
                                <IdCard className="w-4 h-4" />
                                ROLL NUMBER
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.roll_number}
                                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body placeholder:text-white/30 focus:outline-none focus:border-[#a855f7] transition-colors"
                                placeholder="CS21B1001"
                            />
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-50"
                    >
                        <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-[#0a0a0a] px-6 py-4 transition-all duration-300 group-hover:bg-[#0a0a0a]/80">
                            {submitting ? (
                                <Loader2 className="w-5 h-5 text-[#a855f7] animate-spin" />
                            ) : (
                                <>
                                    <span className="font-heading text-lg text-white">
                                        Continue to Dashboard
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-[#a855f7] group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>
                </motion.form>
            </motion.div>
        </main>
    );
}
