import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface UserTicket {
    id: string;
    type: 'solo' | 'duo' | 'quad' | 'bumper';
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'pending_verification' | 'rejected';
    qr_secret: string;
    pax_count: number;
    utr?: string;
    pending_name?: string;
    band_issued_at?: string | null;
    booking_group_id?: string | null;
}

export function useTicket(userEmail?: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['ticket', userEmail],
        queryFn: async (): Promise<UserTicket | null> => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const email = userEmail || user.email;

            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .or(`user_id.eq.${user.id},pending_email.eq.${email}`)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return data as UserTicket | null;
        },
        enabled: !!userEmail || true,
        staleTime: 2 * 60 * 1000, // 2 minutes (tickets change more frequently)
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}
