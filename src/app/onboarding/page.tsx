'use client';

import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { User, Phone, Building2, IdCard, ArrowRight, Loader2, AlertCircle, Upload, FileCheck, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { validatePhoneNumber, formatPhoneForDisplay } from '@/lib/validation';
import { compressImage } from '@/lib/utils';
import type { OnboardingFormData, PhoneNumber } from '@/types/database';

export default function OnboardingPage() {
    const supabase = createClient();
    const router = useRouter();
    const collegeIdRef = useRef<HTMLInputElement>(null);
    const govtIdRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isInternal, setIsInternal] = useState(false);
    const [phoneError, setPhoneError] = useState<string>('');
    const [collegeIdProof, setCollegeIdProof] = useState<File | null>(null);
    const [govtIdProof, setGovtIdProof] = useState<File | null>(null);
    const [formData, setFormData] = useState<OnboardingFormData>({
        full_name: '',
        phone: '',
        college_name: '',
        roll_number: '',
    });

    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const isIIITDM = user.email?.endsWith('@iiitdm.ac.in') ?? false;
                setIsInternal(isIIITDM);

                // Extract roll number from IIITDM email (e.g., cs24i1029@iiitdm.ac.in -> CS24I1029)
                let extractedRollNo = '';
                if (isIIITDM && user.email) {
                    const emailPrefix = user.email.split('@')[0];
                    extractedRollNo = emailPrefix.toUpperCase();
                }

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
                        college_name: profile.college_name || (isIIITDM ? 'IIITDM Kancheepuram' : ''),
                        roll_number: profile.roll_number || extractedRollNo || '',
                    });
                } else if (isIIITDM) {
                    // No profile yet, but IIITDM user - pre-fill roll number
                    setFormData(prev => ({
                        ...prev,
                        full_name: user.user_metadata.full_name || '',
                        college_name: 'IIITDM Kancheepuram',
                        roll_number: extractedRollNo,
                    }));
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Validate phone number
        const phoneValidation = validatePhoneNumber(formData.phone);
        if (!phoneValidation.isValid) {
            setPhoneError(phoneValidation.error || 'Invalid phone number');
            setSubmitting(false);
            toast.error('Please enter a valid phone number');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = '/login';
            return;
        }

        // Force internal role for IIITDM emails
        const isIIITDMEmail = user.email?.endsWith('@iiitdm.ac.in') ?? false;
        const userRole = isIIITDMEmail ? 'internal' : 'external';
        const collegeName = isIIITDMEmail ? 'IIITDM Kancheepuram' : formData.college_name;

        // For external users, validate and upload ID proofs
        let collegeIdPath: string | null = null;
        let govtIdPath: string | null = null;

        if (!isIIITDMEmail) {
            // Validate that both IDs are provided
            if (!collegeIdProof || !govtIdProof) {
                toast.error('Please upload both College ID and Government ID proofs');
                setSubmitting(false);
                return;
            }

            try {
                // Compress and upload College ID
                const compressedCollegeId = await compressImage(collegeIdProof);
                const collegeIdFileName = `${user.id}/college_id_${Date.now()}.jpg`;
                const { error: collegeUploadError, data: collegeData } = await supabase
                    .storage
                    .from('id_proofs')
                    .upload(collegeIdFileName, compressedCollegeId);

                if (collegeUploadError) throw new Error('Failed to upload College ID');
                collegeIdPath = collegeData.path;

                // Compress and upload Government ID
                const compressedGovtId = await compressImage(govtIdProof);
                const govtIdFileName = `${user.id}/govt_id_${Date.now()}.jpg`;
                const { error: govtUploadError, data: govtData } = await supabase
                    .storage
                    .from('id_proofs')
                    .upload(govtIdFileName, compressedGovtId);

                if (govtUploadError) throw new Error('Failed to upload Government ID');
                govtIdPath = govtData.path;
            } catch (uploadError: any) {
                toast.error(uploadError.message || 'Failed to upload ID proofs');
                setSubmitting(false);
                return;
            }
        }

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email!, // Email is required for new rows
                full_name: formData.full_name,
                phone: phoneValidation.formatted!, // Use validated and formatted phone
                college_name: collegeName, // Auto-set for internal users
                roll_number: isIIITDMEmail ? formData.roll_number : null,
                role: userRole, // Set role based on email domain
                college_id_proof: collegeIdPath,
                govt_id_proof: govtIdPath,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id'
            });

        if (!error) {
            // Sync to Google Sheets (fire and forget - don't block redirect)
            fetch('/api/sync/sheets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'user',
                    data: {
                        id: user.id,
                        email: user.email!,
                        full_name: formData.full_name,
                        phone: phoneValidation.formatted!,
                        college_name: collegeName,
                        roll_number: isIIITDMEmail ? formData.roll_number : null,
                        role: userRole,
                        created_at: new Date().toISOString(),
                    }
                })
            }).catch(err => console.log('[Sheets Sync] Background sync error:', err));

            // Clear middleware profile cache before redirecting
            await fetch('/api/profile/clear-cache', { method: 'POST' }).catch(() => { });

            // Force reload to clear any cached middleware states
            window.location.href = '/dashboard';
        } else {
            console.error('Profile update error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            setSubmitting(false);
            toast.error(error?.message || 'Error updating profile. Please try again.');
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
                        <div className="relative">
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({ ...formData, phone: value });

                                    // Clear error when user starts typing
                                    if (phoneError) {
                                        setPhoneError('');
                                    }
                                }}
                                onBlur={() => {
                                    // Validate on blur
                                    if (formData.phone) {
                                        const validation = validatePhoneNumber(formData.phone);
                                        if (!validation.isValid) {
                                            setPhoneError(validation.error || 'Invalid phone number');
                                        } else {
                                            setPhoneError('');
                                        }
                                    }
                                }}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white font-body placeholder:text-white/30 focus:outline-none transition-colors ${phoneError
                                    ? 'border-red-500/50 focus:border-red-500'
                                    : 'border-white/10 focus:border-[#a855f7]'
                                    }`}
                                placeholder="+91 98765 43210"
                            />
                            {phoneError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                </motion.div>
                            )}
                        </div>
                        {phoneError && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-xs text-red-400 font-body flex items-center gap-1"
                            >
                                <AlertCircle className="w-3 h-3" />
                                {phoneError}
                            </motion.p>
                        )}
                        <p className="text-xs text-white/30 font-body">
                            Enter a valid 10-digit Indian phone number
                        </p>
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

                    {/* ID Proofs (External only) */}
                    {!isInternal && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                        >
                            <div className="p-3 rounded-xl bg-[#a855f7]/5 border border-[#a855f7]/20">
                                <p className="text-xs text-[#a855f7] font-body">
                                    As an external participant, please upload your ID proofs for verification.
                                </p>
                            </div>

                            {/* College ID Proof */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 font-mono text-xs text-white/50">
                                    <IdCard className="w-4 h-4" />
                                    COLLEGE ID PROOF
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={collegeIdRef}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setCollegeIdProof(e.target.files[0]);
                                        }
                                    }}
                                    className="hidden"
                                />
                                <div
                                    onClick={() => collegeIdRef.current?.click()}
                                    className={`cursor-pointer border-2 border-dashed rounded-xl p-4 flex items-center gap-3 transition-colors ${collegeIdProof
                                        ? 'border-[#a855f7] bg-[#a855f7]/5'
                                        : 'border-white/20 hover:border-white/40'
                                        }`}
                                >
                                    {collegeIdProof ? (
                                        <>
                                            <FileCheck className="w-5 h-5 text-[#a855f7]" />
                                            <span className="text-white text-sm truncate flex-1">{collegeIdProof.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-white/40" />
                                            <span className="text-white/50 text-sm">Upload College ID</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Government ID Proof */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 font-mono text-xs text-white/50">
                                    <FileImage className="w-4 h-4" />
                                    GOVERNMENT ID PROOF
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={govtIdRef}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setGovtIdProof(e.target.files[0]);
                                        }
                                    }}
                                    className="hidden"
                                />
                                <div
                                    onClick={() => govtIdRef.current?.click()}
                                    className={`cursor-pointer border-2 border-dashed rounded-xl p-4 flex items-center gap-3 transition-colors ${govtIdProof
                                        ? 'border-[#a855f7] bg-[#a855f7]/5'
                                        : 'border-white/20 hover:border-white/40'
                                        }`}
                                >
                                    {govtIdProof ? (
                                        <>
                                            <FileCheck className="w-5 h-5 text-[#a855f7]" />
                                            <span className="text-white text-sm truncate flex-1">{govtIdProof.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-white/40" />
                                            <span className="text-white/50 text-sm">Upload Aadhar / PAN / Driver&apos;s License</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-white/30 font-body">
                                    Aadhar Card, PAN Card, or Driver&apos;s License accepted
                                </p>
                            </div>
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
