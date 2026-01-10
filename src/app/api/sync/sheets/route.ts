import { NextResponse } from 'next/server';
import { syncUserToSheet, syncTicketToSheet } from '@/lib/google-sheets';

// POST /api/sync/sheets
// Syncs user or ticket data to Google Sheets
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type || !data) {
            return NextResponse.json(
                { success: false, error: 'Missing type or data' },
                { status: 400 }
            );
        }

        let success = false;

        if (type === 'user') {
            success = await syncUserToSheet(data);
        } else if (type === 'ticket') {
            success = await syncTicketToSheet(
                data.ticket,
                data.userName,
                data.userEmail
            );
        } else {
            return NextResponse.json(
                { success: false, error: 'Invalid type. Use "user" or "ticket"' },
                { status: 400 }
            );
        }

        return NextResponse.json({ success });
    } catch (error: any) {
        console.error('[Sync API] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
