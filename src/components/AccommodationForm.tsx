'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { compressImage } from '@/lib/utils';

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

    // File validation and preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload an image (JPG, PNG, WebP) or PDF.');
            e.target.value = '';
            return;
        }

        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File too large. Maximum size is 2MB.');
            e.target.value = '';
            return;
        }

        setIdProof(file);

        // Create preview for images
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

    // Compress image before upload
    const compressFile = async (file: File): Promise<File> => {
        // If it's a PDF, return as is (no compression needed)
        if (file.type === 'application/pdf') {
            return file;
        }

        // Use the same compression method as payment proof
        try {
            const compressedFile = await compressImage(file);
            console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');
            console.log('Compressed size:', (compressedFile.size / 1024).toFixed(2), 'KB');
            return compressedFile;
        } catch (error) {
            console.error('Compression error:', error);
            // If compression fails, return original file if it's under 2MB
            return file;
        }
    };

    // Upload file to Supabase Storage
    const uploadIdProof = async (file: File): Promise<string> => {
        try {
            setUploadProgress(30);
            
            // Compress the file
            const compressedFile = await compressFile(file);
            setUploadProgress(50);

            // Generate unique filename using user's email and timestamp
            const fileExt = file.type === 'application/pdf' ? 'pdf' : 'jpg';
            const sanitizedEmail = formData.email.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `${sanitizedEmail}/${Date.now()}.${fileExt}`;

            setUploadProgress(70);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('id_proofs')
                .upload(fileName, compressedFile);

            if (error) {
                console.error('Upload error:', error);
                throw new Error('Failed to upload file: ' + error.message);
            }

            setUploadProgress(90);

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from('id_proofs')
                .getPublicUrl(data.path);

            setUploadProgress(100);
            return publicUrlData.publicUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        try {
            // Validate all fields
            if (!formData.name || !formData.phone_number || !formData.age || !formData.gender ||
                !formData.email || !formData.college_name || !formData.date_of_arrival ||
                !formData.date_of_departure) {
                toast.error('Please fill in all fields');
                setLoading(false);
                return;
            }

            if (!idProof) {
                toast.error('Please upload your ID proof');
                setLoading(false);
                return;
            }

            // Validate dates
            const arrival = new Date(formData.date_of_arrival);
            const departure = new Date(formData.date_of_departure);
            if (departure <= arrival) {
                toast.error('Departure date must be after arrival date');
                setLoading(false);
                return;
            }

            // Validate age
            const age = parseInt(formData.age);
            if (age < 10 || age > 100) {
                toast.error('Please enter a valid age between 10 and 100');
                setLoading(false);
                return;
            }

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('You must be logged in to register');
                setLoading(false);
                return;
            }

            // Upload ID proof
            toast.loading('Uploading ID proof...', { id: 'upload' });
            const idProofUrl = await uploadIdProof(idProof);
            toast.dismiss('upload');

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
                    },
                ]);

            toast.dismiss('submit');

            if (insertError) {
                // Check if it's a quota exceeded error
                if (insertError.message.includes('Accommodation quota exceeded')) {
                    toast.error(`Sorry, accommodation spots for ${formData.gender} are fully booked.`, {
                        duration: 5000,
                    });
                } else if (insertError.code === '23505') {
                    // Unique constraint violation (email already exists)
                    toast.error('This email is already registered for accommodation.');
                } else {
                    toast.error('Registration failed: ' + insertError.message);
                }
                setLoading(false);
                return;
            }

            // Success!
            toast.success('🎉 Registration successful! We\'ll contact you soon.', {
                duration: 5000,
            });

            // Reset form
            setFormData({
                name: '',
                phone_number: '',
                age: '',
                gender: '',
                email: '',
                college_name: '',
                date_of_arrival: '',
                date_of_departure: '',
            });
            setIdProof(null);
            setPreviewUrl(null);
            setUploadProgress(0);

            // Reset file input
            const fileInput = document.getElementById('id_proof') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error: unknown) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold text-white mb-2">
                    Accommodation Registration
                </h2>
                <p className="text-white/60 text-sm">
                    Please fill in all details carefully. Limited spots available (60 per gender).
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                        ID Proof (Image/PDF) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            id="id_proof"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
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
                                    {idProof ? idProof.name : 'Click to upload ID proof'}
                                </p>
                                <p className="text-white/40 text-xs mt-1">
                                    Max 2MB • JPG, PNG, WebP or PDF
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Image Preview */}
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

                    {/* Upload Progress */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-3">
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
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-[#a855f7] hover:bg-[#9333ea] disabled:bg-white/10 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#a855f7]/20 hover:shadow-[#a855f7]/40"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Submit Registration
                        </>
                    )}
                </button>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-300 text-sm">
                        Your ID proof will be securely stored. We&apos;ll contact you via email/phone once your request is reviewed.
                    </p>
                </div>
            </form>
        </div>
    );
}
