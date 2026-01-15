import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    college_name: string;
    roll_number: string | null;
    role: string;
}

export function useProfile() {
    const supabase = createClient();

    return useQuery({
        queryKey: ['profile'],
        queryFn: async (): Promise<Profile> => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return data as Profile;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}
