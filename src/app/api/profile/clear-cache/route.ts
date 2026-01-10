import { NextResponse } from 'next/server';

/**
 * POST /api/profile/clear-cache
 * Clears the middleware profile cache cookie
 * Call this after updating profile data to ensure fresh data is fetched
 */
export async function POST() {
    const response = NextResponse.json({ success: true });
    
    // Delete the profile cache cookie
    response.cookies.delete('profile-cache');
    
    return response;
}
