import { NextResponse } from 'next/server';
import { sendPaymentApprovalEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { to, userName, ticketType, amount } = await request.json();

        if (!to || !userName || !ticketType || !amount) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await sendPaymentApprovalEmail(to, userName, ticketType, amount);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[API] Email approval error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
