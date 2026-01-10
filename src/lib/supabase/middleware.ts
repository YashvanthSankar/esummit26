import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Profile cache configuration
const PROFILE_CACHE_COOKIE = 'profile-cache';
const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedProfile {
    phone: string | null;
    college_name: string | null;
    role: string;
    timestamp: number;
}

/**
 * Get cached profile from cookie
 */
function getCachedProfile(request: NextRequest, userId: string): CachedProfile | null {
    try {
        const cacheCookie = request.cookies.get(PROFILE_CACHE_COOKIE);
        if (!cacheCookie?.value) return null;

        const cached = JSON.parse(cacheCookie.value) as CachedProfile & { userId: string };
        
        // Validate cache belongs to current user and hasn't expired
        if (cached.userId !== userId) return null;
        if (Date.now() - cached.timestamp > PROFILE_CACHE_TTL) return null;

        return cached;
    } catch {
        return null;
    }
}

/**
 * Set profile cache in response cookie
 */
function setCachedProfile(
    response: NextResponse,
    userId: string,
    profile: { phone: string | null; college_name: string | null; role: string }
): void {
    const cacheData = {
        userId,
        phone: profile.phone,
        college_name: profile.college_name,
        role: profile.role,
        timestamp: Date.now(),
    };

    response.cookies.set(PROFILE_CACHE_COOKIE, JSON.stringify(cacheData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: PROFILE_CACHE_TTL / 1000, // Convert to seconds
        path: '/',
    });
}

/**
 * Clear profile cache (call this when profile is updated)
 */
export function clearProfileCache(response: NextResponse): void {
    response.cookies.delete(PROFILE_CACHE_COOKIE);
}

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
    const publicRoutes = ['/', '/login', '/auth/callback', '/privacy', '/terms'];
    const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith('/auth/')
    );

    // If no user and trying to access protected route
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Helper function to get profile (uses cache when possible)
    const getProfile = async (): Promise<CachedProfile | null> => {
        if (!user) return null;

        // Try to get from cache first
        const cached = getCachedProfile(request, user.id);
        if (cached) {
            console.log('[Middleware] Using cached profile', { path: pathname, role: cached.role });
            return cached;
        }

        // Cache miss - fetch from database
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('phone, college_name, role')
            .eq('id', user.id)
            .single();

        if (error || !profile) {
            console.log('[Middleware] Profile fetch failed', { error: error?.message });
            return null;
        }

        // Cache the profile for future requests
        setCachedProfile(supabaseResponse, user.id, profile);
        console.log('[Middleware] Profile cached', { path: pathname, role: profile.role });

        return {
            phone: profile.phone,
            college_name: profile.college_name,
            role: profile.role,
            timestamp: Date.now(),
        };
    };

    // If user exists, check profile completion
    if (user && !isPublicRoute && pathname !== '/onboarding') {
        const profile = await getProfile();

        // If profile doesn't exist OR is incomplete, redirect to onboarding
        // EXCEPTION: Admins can bypass this (they might not need ticket info)
        if ((!profile || !profile.phone || !profile.college_name) && profile?.role !== 'admin') {
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding';
            return NextResponse.redirect(url);
        }
    }

    // If user is on onboarding but profile is complete, redirect to dashboard
    if (user && pathname === '/onboarding') {
        const profile = await getProfile();

        if (profile?.phone && profile?.college_name) {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    // Redirect logged-in users away from login page
    if (user && pathname === '/login') {
        const profile = await getProfile();

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
        const profile = await getProfile();

        console.log('[Middleware] Checking Admin Access:', {
            path: pathname,
            userId: user.id,
            role: profile?.role,
            cached: !!getCachedProfile(request, user.id)
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
