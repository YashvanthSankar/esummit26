'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Loader2, CheckCircle, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface AppRatingProps {
    userId: string;
}

export default function AppRating({ userId }: AppRatingProps) {
    const supabase = createClient();
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [existingRating, setExistingRating] = useState<{ rating: number; review: string | null } | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchExistingRating = async () => {
            const { data } = await supabase
                .from('app_ratings')
                .select('rating, review')
                .eq('user_id', userId)
                .single();

            if (data) {
                setExistingRating(data);
                setRating(data.rating);
                setReview(data.review || '');
            }
        };

        if (userId) {
            fetchExistingRating();
        }
    }, [userId]);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmitting(true);

        try {
            if (existingRating) {
                // Update existing rating
                const { error } = await supabase
                    .from('app_ratings')
                    .update({ rating, review: review || null })
                    .eq('user_id', userId);

                if (error) throw error;
                toast.success('Rating updated!');
            } else {
                // Insert new rating
                const { error } = await supabase
                    .from('app_ratings')
                    .insert({ user_id: userId, rating, review: review || null });

                if (error) throw error;
                toast.success('Thanks for your feedback!');
            }

            setExistingRating({ rating, review });
            setIsEditing(false);
        } catch (error) {
            console.error('Rating error:', error);
            toast.error('Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    const stars = [1, 2, 3, 4, 5];

    // Already submitted view
    if (existingRating && !isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#a855f7]/10 to-[#6366f1]/10 border border-[#a855f7]/20 rounded-2xl p-5"
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Your Rating</span>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                </div>
                <div className="flex items-center gap-1 mb-2">
                    {stars.map((star) => (
                        <Star
                            key={star}
                            className={`w-6 h-6 ${star <= existingRating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`}
                        />
                    ))}
                </div>
                {existingRating.review && (
                    <p className="text-white/60 text-sm italic">&ldquo;{existingRating.review}&rdquo;</p>
                )}
            </motion.div>
        );
    }

    // Rating form view
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-white/10 rounded-2xl p-5"
        >
            <h3 className="text-white font-heading text-lg mb-3">
                {existingRating ? 'Update Your Rating' : 'How was your experience?'}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4">
                {stars.map((star) => (
                    <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                    >
                        <Star
                            className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-white/20 hover:text-white/40'
                                }`}
                        />
                    </motion.button>
                ))}
                <span className="ml-3 text-white/60 text-sm">
                    {rating > 0 && (
                        <>
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Great'}
                            {rating === 5 && 'Amazing!'}
                        </>
                    )}
                </span>
            </div>

            {/* Review Text */}
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts (optional)..."
                maxLength={500}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]/50 resize-none"
            />
            <p className="text-white/30 text-xs mt-1 text-right">{review.length}/500</p>

            {/* Submit Button */}
            <div className="flex items-center gap-3 mt-4">
                {isEditing && (
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setRating(existingRating?.rating || 0);
                            setReview(existingRating?.review || '');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            {existingRating ? 'Update Rating' : 'Submit Rating'}
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
