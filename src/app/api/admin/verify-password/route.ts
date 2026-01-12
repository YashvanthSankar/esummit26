import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// POST - Verify password and grant admin access (internal users only)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, role')
            .eq('id', user.id)
            .single();
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        
        // Check if user is already admin
        if (profile.role === 'admin' || profile.role === 'super_admin') {
            return NextResponse.json({ 
                error: 'You already have admin access',
                alreadyAdmin: true 
            }, { status: 400 });
        }
        
        // Only internal users can become admin
        if (profile.role !== 'internal') {
            return NextResponse.json({ 
                error: 'Only IIITDM students (internal users) can become admin. Please login with your @iiitdm.ac.in email.',
                notInternal: true
            }, { status: 403 });
        }
        
        const body = await request.json();
        const { password } = body;
        
        if (!password) {
            return NextResponse.json({ error: 'Password is required' }, { status: 400 });
        }
        
        // Fetch all active admin passwords
        // Note: We need to use a service role or security definer function to bypass RLS
        // For now, we'll query without RLS check using a custom function
        const { data: passwords, error: fetchError } = await supabase
            .rpc('get_active_admin_passwords');
        
        if (fetchError) {
            console.error('[AdminVerify] Fetch passwords error:', fetchError);
            // If function doesn't exist, return appropriate error
            if (fetchError.code === '42883') {
                return NextResponse.json({ 
                    error: 'Admin password system not yet configured' 
                }, { status: 500 });
            }
            return NextResponse.json({ error: 'Failed to verify password' }, { status: 500 });
        }
        
        if (!passwords || passwords.length === 0) {
            return NextResponse.json({ 
                error: 'No admin passwords are currently active. Contact a super admin.' 
            }, { status: 400 });
        }
        
        // Try to match the password against any active password
        let matchedPassword = null;
        for (const pwd of passwords) {
            // Check expiry
            if (pwd.expires_at && new Date(pwd.expires_at) < new Date()) {
                continue;
            }
            
            // Check max uses
            if (pwd.max_uses !== null && pwd.current_uses >= pwd.max_uses) {
                continue;
            }
            
            // Compare password
            const isMatch = await bcrypt.compare(password, pwd.password_hash);
            if (isMatch) {
                matchedPassword = pwd;
                break;
            }
        }
        
        if (!matchedPassword) {
            return NextResponse.json({ 
                error: 'Invalid password. Please check with a super admin for the correct password.' 
            }, { status: 400 });
        }
        
        // Grant admin access using the database function
        const { data: result, error: grantError } = await supabase
            .rpc('grant_admin_access', {
                p_user_id: profile.id,
                p_password_id: matchedPassword.id
            });
        
        if (grantError) {
            console.error('[AdminVerify] Grant error:', grantError);
            return NextResponse.json({ error: 'Failed to grant admin access' }, { status: 500 });
        }
        
        if (!result?.success) {
            return NextResponse.json({ error: result?.error || 'Unknown error' }, { status: 400 });
        }
        
        return NextResponse.json({ 
            success: true, 
            message: 'Admin access granted! Redirecting to admin dashboard...',
            passwordLabel: matchedPassword.label
        });
    } catch (error) {
        console.error('[AdminVerify] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
