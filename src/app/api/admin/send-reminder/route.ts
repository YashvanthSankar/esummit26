import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { render } from '@react-email/render';
import EventReminderEmail from '@/lib/emails/event-reminder';
import * as React from 'react';

interface TicketHolder {
    email: string;
    name: string;
}

// Use fetch directly instead of Resend SDK for better reliability
async function sendEmailViaResend(
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

            const result = await sendEmailViaResend(testEmail, `[TEST] ${subject}`, emailHtml, fromEmail);

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

        // Send emails in batches
        const BATCH_SIZE = 10;
        const results = {
            sent: 0,
            failed: 0,
            errors: [] as string[],
        };

        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            const batch = recipients.slice(i, i + BATCH_SIZE);

            const batchPromises = batch.map(async (recipient) => {
                try {
                    const emailHtml = await render(
                        React.createElement(EventReminderEmail, {
                            userName: recipient.name,
                            subject,
                            message,
                        })
                    );

                    const result = await sendEmailViaResend(recipient.email, subject, emailHtml, fromEmail);

                    if (!result.success) {
                        results.failed++;
                        results.errors.push(`${recipient.email}: ${result.error}`);
                    } else {
                        results.sent++;
                    }
                } catch (err: any) {
                    results.failed++;
                    results.errors.push(`${recipient.email}: ${err.message}`);
                }
            });

            await Promise.all(batchPromises);

            // Small delay between batches
            if (i + BATCH_SIZE < recipients.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

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
