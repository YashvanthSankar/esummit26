import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET - List all admin passwords (super_admin only)
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
        
        // Fetch admin passwords
        const { data: passwords, error } = await supabase
            .from('admin_passwords')
            .select('id, label, is_active, max_uses, current_uses, created_at, expires_at')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('[AdminPasswords] Fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch passwords' }, { status: 500 });
        }
        
        return NextResponse.json({ passwords });
    } catch (error) {
        console.error('[AdminPasswords] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create a new admin password (super_admin only)
export async function POST(request: NextRequest) {
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
        
        const body = await request.json();
        const { password, label, maxUses, expiresAt } = body;
        
        // Validate password
        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }
        
        if (!label || label.trim().length === 0) {
            return NextResponse.json({ error: 'Label is required' }, { status: 400 });
        }
        
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Create the admin password entry
        const { data: newPassword, error } = await supabase
            .from('admin_passwords')
            .insert({
                password_hash: passwordHash,
                label: label.trim(),
                max_uses: maxUses && maxUses > 0 ? maxUses : null,
                expires_at: expiresAt || null,
                created_by: user.id,
            })
            .select('id, label, is_active, max_uses, current_uses, created_at, expires_at')
            .single();
        
        if (error) {
            console.error('[AdminPasswords] Create error:', error);
            return NextResponse.json({ error: 'Failed to create password' }, { status: 500 });
        }
        
        return NextResponse.json({ 
            success: true, 
            password: newPassword,
            plainPassword: password, // Return the plain password so super admin can see/share it
            message: 'Admin password created successfully'
        });
    } catch (error) {
        console.error('[AdminPasswords] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update admin password (toggle active, update settings)
export async function PATCH(request: NextRequest) {
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
        
        const body = await request.json();
        const { id, isActive, maxUses, expiresAt } = body;
        
        if (!id) {
            return NextResponse.json({ error: 'Password ID is required' }, { status: 400 });
        }
        
        // Build update object
        const updates: Record<string, unknown> = {};
        if (typeof isActive === 'boolean') updates.is_active = isActive;
        if (maxUses !== undefined) updates.max_uses = maxUses > 0 ? maxUses : null;
        if (expiresAt !== undefined) updates.expires_at = expiresAt || null;
        
        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
        }
        
        const { data: updated, error } = await supabase
            .from('admin_passwords')
            .update(updates)
            .eq('id', id)
            .select('id, label, is_active, max_uses, current_uses, created_at, expires_at')
            .single();
        
        if (error) {
            console.error('[AdminPasswords] Update error:', error);
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }
        
        return NextResponse.json({ success: true, password: updated });
    } catch (error) {
        console.error('[AdminPasswords] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete admin password
export async function DELETE(request: NextRequest) {
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
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'Password ID is required' }, { status: 400 });
        }
        
        const { error } = await supabase
            .from('admin_passwords')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('[AdminPasswords] Delete error:', error);
            return NextResponse.json({ error: 'Failed to delete password' }, { status: 500 });
        }
        
        return NextResponse.json({ success: true, message: 'Password deleted' });
    } catch (error) {
        console.error('[AdminPasswords] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
