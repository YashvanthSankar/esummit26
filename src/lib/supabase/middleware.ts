import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Public routes that don't need auth
    const publicRoutes = ['/', '/login', '/auth/callback'];
    const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith('/auth/')
    );

    // If no user and trying to access protected route
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // If user exists, check profile completion
    if (user && !isPublicRoute && pathname !== '/onboarding') {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('phone, college_name, role')
            .eq('id', user.id)
            .single();

        // LOGGING FOR DEBUGGING
        if (pathname !== '/_next/image') {
            console.log('[Middleware] Profile Check', { path: pathname, role: profile?.role, complete: !!(profile?.phone && profile?.college_name) });
        }

        // If profile doesn't exist OR is incomplete, redirect to onboarding
        // EXCEPTION: Admins can bypass this (they might not need ticket info)
        if ((!profile || error || !profile.phone || !profile.college_name) && profile?.role !== 'admin') {
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding';
            return NextResponse.redirect(url);
        }
    }

    // If user is on onboarding but profile is complete, redirect to dashboard
    if (user && pathname === '/onboarding') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('phone, college_name')
            .eq('id', user.id)
            .single();

        if (profile?.phone && profile?.college_name) {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    // Redirect logged-in users away from login page
    if (user && pathname === '/login') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const url = request.nextUrl.clone();
        if (profile?.role === 'admin') {
            url.pathname = '/admin';
        } else {
            url.pathname = '/dashboard';
        }
        return NextResponse.redirect(url);
    }

    // Admin route protection
    if (user && pathname.startsWith('/admin')) {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        console.log('[Middleware] Checking Admin Access:', {
            path: pathname,
            userId: user.id,
            role: profile?.role,
            error: error?.message
        });

        if (profile?.role !== 'admin') {
            console.log('[Middleware] Access Denied. Redirecting to /dashboard');
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
