import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if profile needs completion
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // First check if user already has a role (don't overwrite admin)
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                // Only set role if not already set (new user) - preserve admin role!
                if (!existingProfile?.role || existingProfile.role === 'external' || existingProfile.role === 'internal') {
                    // Don't overwrite if already admin
                    if (existingProfile?.role !== 'admin') {
                        const isInternal = user.email?.endsWith('@iiitdm.ac.in');
                        const role = isInternal ? 'internal' : 'external';
                        await supabase
                            .from('profiles')
                            .update({ role })
                            .eq('id', user.id);
                    }
                }

                // Check if profile is complete
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('phone, college_name')
                    .eq('id', user.id)
                    .single();

                if (!profile?.phone || !profile?.college_name) {
                    return NextResponse.redirect(`${origin}/onboarding`);
                }

                // Check if admin and redirect accordingly
                const { data: roleData } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (roleData?.role === 'admin') {
                    return NextResponse.redirect(`${origin}/admin/scan`);
                }
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
