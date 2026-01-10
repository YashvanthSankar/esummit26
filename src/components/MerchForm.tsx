'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { compressImage } from '@/lib/utils';
import { MERCH_ITEMS, UPI_CONFIG } from '@/types/payment';
import QRCode from 'react-qr-code';

type MerchItemKey = keyof typeof MERCH_ITEMS;

interface FormData {
    name: string;
    email: string;
    phone_number: string;
    item_name: MerchItemKey | '';
    size: string;
    quantity: number;
}

export default function MerchForm() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone_number: '',
        item_name: '',
        size: '',
        quantity: 1,
    });

    // Payment states
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentUtr, setPaymentUtr] = useState('');
    const paymentFileRef = useRef<HTMLInputElement>(null);

    // Fetch user profile data and pre-fill form
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, email, phone')
                .eq('id', user.id)
                .single();

            if (profile) {
                setFormData(prev => ({
                    ...prev,
                    name: profile.full_name || '',
                    email: profile.email || '',
                    phone_number: profile.phone || '',
                }));
            }
        };

        fetchUserData();
    }, [supabase]);

    // Calculate total amount
    const getTotalAmount = () => {
        if (!formData.item_name) return 0;
        return MERCH_ITEMS[formData.item_name].price * formData.quantity;
    };

    // Payment proof file handler
    const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };

    // Upload file to Supabase Storage
    const uploadFile = async (file: File): Promise<string> => {
        const compressedFile = await compressImage(file);
        const sanitizedEmail = formData.email.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${sanitizedEmail}/merch_${Date.now()}.jpg`;

        const { data, error } = await supabase.storage
            .from('payment-proofs')
            .upload(fileName, compressedFile);

        if (error) {
            throw new Error('Failed to upload file: ' + error.message);
        }

        return data.path;
    };

    // Validate step 1 data
    const validateStep1 = (): boolean => {
        if (!formData.name || !formData.email || !formData.phone_number) {
            toast.error('Please fill in all contact details');
            return false;
        }
        if (!formData.item_name) {
            toast.error('Please select an item');
            return false;
        }
        if (!formData.size) {
            toast.error('Please select a size');
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

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('You must be logged in to order');
                setLoading(false);
                return;
            }

            // Upload payment proof if exists
            let paymentScreenshotPath = null;
            if (paymentProof) {
                toast.loading('Uploading payment proof...', { id: 'upload-payment' });
                paymentScreenshotPath = await uploadFile(paymentProof);
                toast.dismiss('upload-payment');
            }

            // Insert into database
            toast.loading('Submitting order...', { id: 'submit' });
            const { error: insertError } = await supabase
                .from('merch_orders')
                .insert([
                    {
                        user_id: user.id,
                        name: formData.name,
                        email: formData.email,
                        phone_number: formData.phone_number,
                        item_name: MERCH_ITEMS[formData.item_name as MerchItemKey].label,
                        size: formData.size,
                        quantity: formData.quantity,
                        amount: getTotalAmount(),
                        payment_status: 'pending_verification',
                        payment_utr: paymentUtr || null,
                        payment_screenshot_path: paymentScreenshotPath,
                    },
                ]);

            toast.dismiss('submit');

            if (insertError) {
                toast.error('Order failed: ' + insertError.message);
                setLoading(false);
                return;
            }

            toast.success('🎉 Order submitted! Your payment will be verified shortly.', {
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
        const value = e.target.type === 'number' ? parseInt(e.target.value) || 1 : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    // Generate UPI payment string
    const getUPIString = () => {
        const amount = getTotalAmount();
        return `upi://pay?pa=${UPI_CONFIG.VPA}&pn=${encodeURIComponent(UPI_CONFIG.NAME)}&am=${amount}&tn=ESummit26_Merch`;
    };

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold text-white mb-2">
                    E-Summit Merchandise
                </h2>
                <p className="text-white/60 text-sm">
                    {step === 1
                        ? 'Step 1: Select your merchandise and size'
                        : `Step 2: Complete payment of ₹${getTotalAmount()}`
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
                /* Step 1: Order Details Form */
                <form onSubmit={(e) => { e.preventDefault(); handleProceedToPayment(); }} className="space-y-5">
                    {/* Contact Details - Read Only */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    {/* Item Selection */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">
                            Select Item <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(MERCH_ITEMS).map(([key, item]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, item_name: key as MerchItemKey })}
                                    className={`p-4 rounded-xl border text-left transition-all ${formData.item_name === key
                                        ? 'border-[#a855f7] bg-[#a855f7]/10'
                                        : 'border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className={`w-8 h-8 ${formData.item_name === key ? 'text-[#a855f7]' : 'text-white/40'}`} />
                                        <div>
                                            <p className="text-white font-bold">{item.label}</p>
                                            <p className="text-[#a855f7] font-heading text-lg">₹{item.price}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">
                            Select Size <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, size })}
                                    className={`px-4 py-2 rounded-lg border font-mono text-sm transition-all ${formData.size === size
                                        ? 'border-[#a855f7] bg-[#a855f7] text-white'
                                        : 'border-white/20 text-white/60 hover:border-white/40'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Quantity
                        </label>
                        <select
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a855f7]/50 transition-all"
                        >
                            {[1, 2, 3, 4, 5].map((q) => (
                                <option key={q} value={q} className="bg-[#0a0a0a]">{q}</option>
                            ))}
                        </select>
                    </div>

                    {/* Total */}
                    {formData.item_name && (
                        <div className="p-4 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-xl">
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">Total Amount</span>
                                <span className="text-[#a855f7] font-heading text-2xl">₹{getTotalAmount()}</span>
                            </div>
                        </div>
                    )}

                    {/* Proceed Button */}
                    <button
                        type="submit"
                        disabled={!formData.item_name || !formData.size}
                        className="w-full py-4 px-6 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
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
                        Back to Selection
                    </button>

                    {/* Order Summary */}
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <h4 className="text-white font-bold mb-2">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                            <p className="text-white/70">Item: <span className="text-white">{formData.item_name && MERCH_ITEMS[formData.item_name].label}</span></p>
                            <p className="text-white/70">Size: <span className="text-white">{formData.size}</span></p>
                            <p className="text-white/70">Quantity: <span className="text-white">{formData.quantity}</span></p>
                            <p className="text-white/70 pt-2 border-t border-white/10">Total: <span className="text-[#a855f7] font-bold">₹{getTotalAmount()}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* QR Code Column */}
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-white">
                            <h3 className="text-black font-heading text-xl mb-4 text-center">
                                Scan to Pay ₹{getTotalAmount()}
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
                                1. Transfer ₹{getTotalAmount()}.<br />
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
                                    </div>
                                )}
                            </div>

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
                                    'Submit Order'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-300 text-sm">
                            Payment will be verified within 24 hours. Merchandise will be available for collection at the event venue.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
