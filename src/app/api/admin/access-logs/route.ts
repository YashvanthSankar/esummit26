import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - List admin access logs (super_admin only)
export async function GET() {
    try {
        const supabase = await createClient();
        
        // Check if user is super_admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        
        if (profile?.role !== 'super_admin') {
            return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
        }
        
        // Fetch admin access logs with user info
        const { data: logs, error } = await supabase
            .from('admin_access_logs')
            .select(`
                id,
                user_id,
                user_email,
                password_label,
                granted_at,
                granted_by_password,
                user:profiles!admin_access_logs_user_id_fkey(full_name, role)
            `)
            .order('granted_at', { ascending: false })
            .limit(100);
        
        if (error) {
            console.error('[AdminAccessLogs] Fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
        }
        
        return NextResponse.json({ logs });
    } catch (error) {
        console.error('[AdminAccessLogs] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
