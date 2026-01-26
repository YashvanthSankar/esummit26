import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { render } from '@react-email/render';
import EventReminderEmail from '@/lib/emails/event-reminder';
import * as React from 'react';

interface TicketHolder {
    email: string;
    name: string;
}

interface EmailPayload {
    from: string;
    to: string[];
    subject: string;
    html: string;
}

// Use Resend Batch API for faster sending (up to 100 emails per request)
async function sendBatchEmails(
    emails: EmailPayload[]
): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const response = await fetch('https://api.resend.com/emails/batch', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emails),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Batch send failed' };
        }

        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// Single email send (for test mode)
async function sendSingleEmail(
    to: string,
    subject: string,
    html: string,
    from: string
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [to],
                subject,
                html,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Unknown error' };
        }

        return { success: true, id: data.id };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('[SendReminder] Starting...');
        console.log('[SendReminder] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);

        const supabase = await createClient();

        // Verify admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log('[SendReminder] No user found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[SendReminder] User ID:', user.id);

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        console.log('[SendReminder] User role:', profile?.role);

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            console.log('[SendReminder] Access denied - role is not admin/super_admin');
            return NextResponse.json({ error: `Admin access required. Your role: ${profile?.role}` }, { status: 403 });
        }

        // Get request body
        const { subject, message, testMode = false, testEmail } = await request.json();

        if (!subject || !message) {
            return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
        }

        const fromEmail = getFromEmail();
        console.log('[SendReminder] From email:', fromEmail);

        // Test mode - send only to specified email
        if (testMode && testEmail) {
            console.log('[SendReminder] Test mode - sending to:', testEmail);

            const emailHtml = await render(
                React.createElement(EventReminderEmail, {
                    userName: 'Test User',
                    subject,
                    message,
                })
            );

            const result = await sendSingleEmail(testEmail, `[TEST] ${subject}`, emailHtml, fromEmail);

            if (!result.success) {
                console.error('[SendReminder] Resend error:', result.error);
                return NextResponse.json({ error: `Resend API error: ${result.error}` }, { status: 500 });
            }

            console.log('[SendReminder] Test email sent, ID:', result.id);
            return NextResponse.json({
                success: true,
                message: 'Test email sent',
                emailId: result.id,
            });
        }

        // Get all paid ticket holders
        const { data: tickets, error: ticketsError } = await supabase
            .from('tickets')
            .select(`
                pending_email,
                pending_name,
                user_id,
                profiles!tickets_user_id_fkey (
                    email,
                    full_name
                )
            `)
            .eq('status', 'paid');

        if (ticketsError) {
            console.error('Error fetching tickets:', ticketsError);
            return NextResponse.json({ error: 'Failed to fetch ticket holders' }, { status: 500 });
        }

        // Build unique email list
        const emailMap = new Map<string, string>();

        tickets?.forEach((ticket: any) => {
            let email: string | null = null;
            let name: string = 'Attendee';

            if (ticket.profiles) {
                email = ticket.profiles.email;
                name = ticket.profiles.full_name || 'Attendee';
            } else if (ticket.pending_email) {
                email = ticket.pending_email;
                name = ticket.pending_name || 'Attendee';
            }

            if (email && !emailMap.has(email)) {
                emailMap.set(email, name);
            }
        });

        const recipients: TicketHolder[] = Array.from(emailMap.entries()).map(([email, name]) => ({
            email,
            name,
        }));

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'No ticket holders found' }, { status: 400 });
        }

        console.log('[SendReminder] Sending to', recipients.length, 'recipients');

        // Prepare all emails with personalized content
        const emailPayloads: EmailPayload[] = await Promise.all(
            recipients.map(async (recipient) => {
                const emailHtml = await render(
                    React.createElement(EventReminderEmail, {
                        userName: recipient.name,
                        subject,
                        message,
                    })
                );

                return {
                    from: fromEmail,
                    to: [recipient.email],
                    subject,
                    html: emailHtml,
                };
            })
        );

        // Send in batches of 100 (Resend batch limit)
        const BATCH_SIZE = 100;
        const results = {
            sent: 0,
            failed: 0,
            errors: [] as string[],
        };

        for (let i = 0; i < emailPayloads.length; i += BATCH_SIZE) {
            const batch = emailPayloads.slice(i, i + BATCH_SIZE);
            console.log(`[SendReminder] Sending batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(emailPayloads.length / BATCH_SIZE)}`);

            const batchResult = await sendBatchEmails(batch);

            if (batchResult.success) {
                results.sent += batch.length;
                console.log(`[SendReminder] Batch sent successfully:`, batchResult.data?.data?.length || batch.length);
            } else {
                results.failed += batch.length;
                results.errors.push(`Batch ${i / BATCH_SIZE + 1}: ${batchResult.error}`);
                console.error(`[SendReminder] Batch failed:`, batchResult.error);
            }

            // Tiny delay between batches if there are more
            if (i + BATCH_SIZE < emailPayloads.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log('[SendReminder] Complete. Sent:', results.sent, 'Failed:', results.failed);

        return NextResponse.json({
            success: true,
            totalRecipients: recipients.length,
            sent: results.sent,
            failed: results.failed,
            errors: results.errors.slice(0, 10),
        });
    } catch (error: any) {
        console.error('Send reminder error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getFromEmail(): string {
    const customFrom = process.env.RESEND_FROM_EMAIL;

    // Check if using unverified domain
    if (customFrom && customFrom.includes('esummit26-iiitdm.vercel.app')) {
        return 'E-Summit <onboarding@resend.dev>';
    }

    return customFrom || 'E-Summit <onboarding@resend.dev>';
}
