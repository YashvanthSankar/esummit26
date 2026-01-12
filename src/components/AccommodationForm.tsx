'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { compressImage, validateFile } from '@/lib/utils';
import { ACCOMMODATION_PRICE, UPI_CONFIG } from '@/types/payment';
import QRCode from 'react-qr-code';

interface FormData {
    name: string;
    phone_number: string;
    age: string;
    gender: 'Male' | 'Female' | '';
    email: string;
    college_name: string;
    date_of_arrival: string;
    date_of_departure: string;
}

export default function AccommodationForm() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [step, setStep] = useState<1 | 2>(1); // Step 1: Details, Step 2: Payment
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone_number: '',
        age: '',
        gender: '',
        email: '',
        college_name: '',
        date_of_arrival: '',
        date_of_departure: '',
    });
    const [idProof, setIdProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Payment states
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentUtr, setPaymentUtr] = useState('');
    const [paymentOwnerName, setPaymentOwnerName] = useState('');
    const paymentFileRef = useRef<HTMLInputElement>(null);

    // Fetch user profile data and pre-fill form
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, email, phone, college_name')
                .eq('id', user.id)
                .single();

            if (profile) {
                setFormData(prev => ({
                    ...prev,
                    name: profile.full_name || '',
                    email: profile.email || '',
                    phone_number: profile.phone || '',
                    college_name: profile.college_name || '',
                }));
            }
        };

        fetchUserData();
    }, [supabase]);

    // ID Proof file validation and preview (images or PDF)
    const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file, {
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        });

        if (!validation.valid) {
            toast.error(validation.error);
            e.target.value = '';
            return;
        }

        setIdProof(file);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    // Payment proof file handler with validation (images only)
    const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file, {
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        });

        if (!validation.valid) {
            toast.error(validation.error);
            e.target.value = '';
            return;
        }

        setPaymentProof(file);
    };

    // Compress image before upload
    const compressFile = async (file: File): Promise<File> => {
        if (file.type === 'application/pdf') {
            return file;
        }
        try {
            const compressedFile = await compressImage(file);
            return compressedFile;
        } catch (error) {
            console.error('Compression error:', error);
            return file;
        }
    };

    // Upload file to Supabase Storage
    const uploadFile = async (file: File, bucket: string, folder: string): Promise<string> => {
        const compressedFile = await compressFile(file);
        const fileExt = file.type === 'application/pdf' ? 'pdf' : 'jpg';
        const sanitizedEmail = formData.email.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${sanitizedEmail}/${folder}_${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, compressedFile);

        if (error) {
            throw new Error('Failed to upload file: ' + error.message);
        }

        // Return only the path - admin pages will generate signed URLs
        return data.path;
    };

    // Validate step 1 data
    const validateStep1 = (): boolean => {
        if (!formData.name || !formData.phone_number || !formData.age || !formData.gender ||
            !formData.email || !formData.college_name || !formData.date_of_arrival ||
            !formData.date_of_departure) {
            toast.error('Please fill in all fields');
            return false;
        }

        if (!idProof) {
            toast.error('Please upload your ID proof');
            return false;
        }

        const arrival = new Date(formData.date_of_arrival);
        const departure = new Date(formData.date_of_departure);
        if (departure <= arrival) {
            toast.error('Departure date must be after arrival date');
            return false;
        }

        const age = parseInt(formData.age);
        if (age < 10 || age > 100) {
            toast.error('Please enter a valid age between 10 and 100');
            return false;
        }

        return true;
    };

    // Handle proceeding to payment step
    const handleProceedToPayment = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    // Handle final submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentUtr && !paymentProof) {
            toast.error('Please provide EITHER a Transaction UTR OR a Payment Screenshot to verify.');
            return;
        }

        if (paymentUtr && !paymentOwnerName) {
            toast.error('Please enter the Account Owner Name for UTR verification.');
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('You must be logged in to register');
                setLoading(false);
                return;
            }

            // Upload ID proof
            toast.loading('Uploading ID proof...', { id: 'upload-id' });
            setUploadProgress(30);
            const idProofUrl = await uploadFile(idProof!, 'id_proofs', 'id');
            toast.dismiss('upload-id');

            // Upload payment proof if exists
            let paymentScreenshotPath = null;
            if (paymentProof) {
                toast.loading('Uploading payment proof...', { id: 'upload-payment' });
                setUploadProgress(60);
                paymentScreenshotPath = await uploadFile(paymentProof, 'payment-proofs', 'accommodation');
                toast.dismiss('upload-payment');
            }

            setUploadProgress(80);

            // Insert into database
            toast.loading('Submitting registration...', { id: 'submit' });
            const { error: insertError } = await supabase
                .from('accommodation_requests')
                .insert([
                    {
                        user_id: user.id,
                        name: formData.name,
                        phone_number: formData.phone_number,
                        age: parseInt(formData.age),
                        gender: formData.gender,
                        email: formData.email,
                        college_name: formData.college_name,
                        date_of_arrival: formData.date_of_arrival,
                        date_of_departure: formData.date_of_departure,
                        id_proof_url: idProofUrl,
                        payment_status: 'pending_verification',
                        payment_amount: ACCOMMODATION_PRICE,
                        payment_utr: paymentUtr || null,
                        payment_owner_name: paymentUtr ? paymentOwnerName : null,
                        payment_screenshot_path: paymentScreenshotPath,
                    },
                ]);

            toast.dismiss('submit');
            setUploadProgress(100);

            if (insertError) {
                if (insertError.message.includes('Accommodation quota exceeded')) {
                    toast.error(`Sorry, accommodation spots for ${formData.gender} are fully booked.`, {
                        duration: 5000,
                    });
                } else if (insertError.code === '23505') {
                    toast.error('This email is already registered for accommodation.');
                } else {
                    toast.error('Registration failed: ' + insertError.message);
                }
                setLoading(false);
                return;
            }

            toast.success('🎉 Registration submitted! Your payment will be verified shortly.', {
                duration: 5000,
            });

            // Reload the page to show submitted status
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error: unknown) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Generate UPI payment string
    const getUPIString = () => {
        return `upi://pay?pa=${UPI_CONFIG.VPA}&pn=${encodeURIComponent(UPI_CONFIG.NAME)}&am=${ACCOMMODATION_PRICE}&tn=ESummit26_Accommodation`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold text-white mb-2">
                    Accommodation Registration
                </h2>
                <p className="text-white/60 text-sm">
                    {step === 1
                        ? 'Step 1: Fill in your details. Limited spots available (60 per gender).'
                        : `Step 2: Complete payment of ₹${ACCOMMODATION_PRICE}`
                    }
                </p>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mt-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-[#a855f7] text-white' : 'bg-green-500 text-white'}`}>
                        {step === 1 ? '1' : '✓'}
                    </div>
                    <div className="h-1 w-12 bg-white/20 rounded">
                        <div className={`h-full rounded transition-all ${step === 2 ? 'bg-[#a855f7] w-full' : 'w-0'}`} />
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-[#a855f7] text-white' : 'bg-white/20 text-white/40'}`}>
                        2
                    </div>
                </div>
            </div>

            {step === 1 ? (
                /* Step 1: Details Form */
                <form onSubmit={(e) => { e.preventDefault(); handleProceedToPayment(); }} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                            Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Phone and Age Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-white/80 mb-2">
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                pattern="[0-9+\-\s()]+"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-white/80 mb-2">
                                Age <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                min="10"
                                max="100"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                                placeholder="21"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-white/80 mb-2">
                            Gender <span className="text-red-400">*</span>
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                        >
                            <option value="" className="bg-[#0a0a0a] text-white/50">Select Gender</option>
                            <option value="Male" className="bg-[#0a0a0a] text-white">Male</option>
                            <option value="Female" className="bg-[#0a0a0a] text-white">Female</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                            Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                            placeholder="your.email@college.edu"
                        />
                    </div>

                    {/* College Name */}
                    <div>
                        <label htmlFor="college_name" className="block text-sm font-medium text-white/80 mb-2">
                            College Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="college_name"
                            name="college_name"
                            value={formData.college_name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                            placeholder="Your College/University Name"
                        />
                    </div>

                    {/* Arrival and Departure Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date_of_arrival" className="block text-sm font-medium text-white/80 mb-2">
                                Date of Arrival <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                id="date_of_arrival"
                                name="date_of_arrival"
                                value={formData.date_of_arrival}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="date_of_departure" className="block text-sm font-medium text-white/80 mb-2">
                                Date of Departure <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                id="date_of_departure"
                                name="date_of_departure"
                                value={formData.date_of_departure}
                                onChange={handleChange}
                                required
                                min={formData.date_of_arrival || new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* ID Proof Upload */}
                    <div>
                        <label htmlFor="id_proof" className="block text-sm font-medium text-white/80 mb-2">
                            Government ID Proof <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/50 text-xs mb-3">Aadhaar Card, PAN Card, Driving License, or Passport</p>
                        <div className="relative">
                            <input
                                type="file"
                                id="id_proof"
                                accept="image/*,.pdf"
                                onChange={handleIdProofChange}
                                required
                                className="hidden"
                            />
                            <label
                                htmlFor="id_proof"
                                className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#a855f7]/50 hover:bg-white/10 transition-all"
                            >
                                <Upload className="w-6 h-6 text-white/50" />
                                <div className="text-center">
                                    <p className="text-white/70 text-sm">
                                        {idProof ? idProof.name : 'Click to upload Government ID'}
                                    </p>
                                    <p className="text-white/40 text-xs mt-1">
                                        Images: Max 500KB • PDF: Max 500KB
                                    </p>
                                </div>
                            </label>
                        </div>

                        {previewUrl && (
                            <div className="mt-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={previewUrl}
                                    alt="ID Proof Preview"
                                    className="max-h-48 rounded-lg border border-white/10"
                                />
                            </div>
                        )}
                    </div>

                    {/* Proceed Button */}
                    <button
                        type="submit"
                        className="w-full py-4 px-6 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#a855f7]/20 hover:shadow-[#a855f7]/40"
                    >
                        <span>Proceed to Payment</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            ) : (
                /* Step 2: Payment */
                <div className="space-y-6">
                    <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Details
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* QR Code Column */}
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-white">
                            <h3 className="text-black font-heading text-xl mb-4 text-center">
                                Scan to Pay ₹{ACCOMMODATION_PRICE}
                            </h3>
                            <div className="p-2 border-2 border-black rounded-lg mb-4 bg-white">
                                <QRCode value={getUPIString()} size={200} />
                            </div>
                            <p className="font-mono text-xs text-black/60 text-center break-all max-w-[200px]">
                                {UPI_CONFIG.VPA}
                            </p>
                        </div>

                        {/* Upload Column */}
                        <div>
                            <h3 className="font-heading text-2xl text-white mb-2">Confirm Payment</h3>
                            <p className="font-body text-white/50 text-sm mb-6">
                                1. Transfer ₹{ACCOMMODATION_PRICE}.<br />
                                2. Enter UTR/Reference ID.<br />
                                3. Upload screenshot.
                            </p>

                            {/* UTR Input */}
                            <div className="mb-4">
                                <label className="block font-mono text-xs text-white/40 mb-2">UTR / REFERENCE NO.</label>
                                <input
                                    type="text"
                                    value={paymentUtr}
                                    onChange={(e) => setPaymentUtr(e.target.value)}
                                    placeholder="e.g. 432189012345"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-[#a855f7]"
                                />
                            </div>

                            {paymentUtr && (
                                <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                                    <label className="block font-mono text-xs text-white/40 mb-2">ACCOUNT OWNER NAME <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={paymentOwnerName}
                                        onChange={(e) => setPaymentOwnerName(e.target.value)}
                                        placeholder="Name on Bank Account / UPI"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#a855f7]"
                                    />
                                    <p className="text-white/30 text-xs mt-1">Required for verifying the UTR</p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-white/40 text-xs font-mono">OR</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            {/* File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={paymentFileRef}
                                onChange={handlePaymentProofChange}
                                className="hidden"
                            />
                            <div
                                onClick={() => paymentFileRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${paymentProof
                                    ? 'border-[#a855f7] bg-[#a855f7]/5'
                                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                    }`}
                            >
                                {paymentProof ? (
                                    <div className="text-center">
                                        <CheckCircle className="w-8 h-8 text-[#a855f7] mx-auto mb-2" />
                                        <p className="font-body text-white text-sm truncate max-w-[200px]">{paymentProof.name}</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                                        <p className="font-body text-white/70 text-sm">Upload Screenshot</p>
                                        <p className="font-body text-white/30 text-xs mt-1">Max 500KB • JPG, PNG, WebP</p>
                                    </div>
                                )}
                            </div>

                            {/* Upload Progress */}
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#a855f7] transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={(!paymentProof && !paymentUtr) || loading}
                                className="w-full py-4 rounded-xl bg-[#a855f7] text-white font-heading text-lg font-bold hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    'Submit Registration'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-300 text-sm">
                            Your payment will be verified by our team. Once approved, your accommodation will be confirmed.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
