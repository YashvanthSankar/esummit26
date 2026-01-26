import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { render } from '@react-email/render';
import EventReminderEmail from '@/lib/emails/event-reminder';
import * as React from 'react';
import nodemailer from 'nodemailer';

interface TicketHolder {
    email: string;
    name: string;
}

// Check which email provider to use
function getEmailProvider(): 'gmail' | 'resend' {
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return 'gmail';
    }
    return 'resend';
}

// Gmail SMTP transport
function createGmailTransport() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
}

// Send via Gmail SMTP
async function sendViaGmail(
    to: string,
    subject: string,
    html: string,
    from: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const transporter = createGmailTransport();
        await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// Send batch via Gmail (one by one, but fast)
async function sendBatchViaGmail(
    emails: Array<{ to: string; subject: string; html: string; from: string }>
): Promise<{ sent: number; failed: number; errors: string[] }> {
    const transporter = createGmailTransport();
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    // Send all emails in parallel (Gmail handles rate limiting)
    const promises = emails.map(async (email) => {
        try {
            await transporter.sendMail({
                from: email.from,
                to: email.to,
                subject: email.subject,
                html: email.html,
            });
            results.sent++;
        } catch (err: any) {
            results.failed++;
            results.errors.push(`${email.to}: ${err.message}`);
        }
    });

    await Promise.all(promises);
    return results;
}

// Send via Resend (keeping existing functionality)
async function sendViaResend(
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

// Resend Batch API
async function sendBatchViaResend(
    emails: Array<{ from: string; to: string[]; subject: string; html: string }>
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

export async function POST(request: NextRequest) {
    try {
        const provider = getEmailProvider();
        console.log('[SendReminder] Starting... Provider:', provider);

        const supabase = await createClient();

        // Verify admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log('[SendReminder] No user found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            return NextResponse.json({ error: `Admin access required. Your role: ${profile?.role}` }, { status: 403 });
        }

        // Get request body
        const { subject, message, testMode = false, testEmail } = await request.json();

        if (!subject || !message) {
            return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
        }

        const fromEmail = getFromEmail(provider);
        console.log('[SendReminder] From email:', fromEmail);

        // Test mode
        if (testMode && testEmail) {
            console.log('[SendReminder] Test mode - sending to:', testEmail);

            const emailHtml = await render(
                React.createElement(EventReminderEmail, {
                    userName: 'Test User',
                    subject,
                    message,
                })
            );

            if (provider === 'gmail') {
                const result = await sendViaGmail(testEmail, subject, emailHtml, fromEmail);
                if (!result.success) {
                    return NextResponse.json({ error: `Gmail error: ${result.error}` }, { status: 500 });
                }
            } else {
                const result = await sendViaResend(testEmail, subject, emailHtml, fromEmail);
                if (!result.success) {
                    return NextResponse.json({ error: `Resend error: ${result.error}` }, { status: 500 });
                }
            }

            return NextResponse.json({
                success: true,
                message: `Test email sent via ${provider}`,
                provider,
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

        console.log('[SendReminder] Sending to', recipients.length, 'recipients via', provider);

        // Prepare all emails
        const emailPayloads = await Promise.all(
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
                    to: recipient.email,
                    subject,
                    html: emailHtml,
                };
            })
        );

        let results: { sent: number; failed: number; errors: string[] };

        if (provider === 'gmail') {
            // Gmail: Send all in parallel
            results = await sendBatchViaGmail(emailPayloads);
        } else {
            // Resend: Use batch API
            const resendPayloads = emailPayloads.map(e => ({
                from: e.from,
                to: [e.to],
                subject: e.subject,
                html: e.html,
            }));

            // Send in batches of 100
            results = { sent: 0, failed: 0, errors: [] };
            for (let i = 0; i < resendPayloads.length; i += 100) {
                const batch = resendPayloads.slice(i, i + 100);
                const batchResult = await sendBatchViaResend(batch);

                if (batchResult.success) {
                    results.sent += batch.length;
                } else {
                    results.failed += batch.length;
                    results.errors.push(`Batch ${i / 100 + 1}: ${batchResult.error}`);
                }
            }
        }

        console.log('[SendReminder] Complete. Sent:', results.sent, 'Failed:', results.failed);

        return NextResponse.json({
            success: true,
            provider,
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

function getFromEmail(provider: 'gmail' | 'resend'): string {
    if (provider === 'gmail') {
        const gmailUser = process.env.GMAIL_USER || '';
        const fromName = process.env.GMAIL_FROM_NAME || 'E-Summit';
        return `${fromName} <${gmailUser}>`;
    }

    const customFrom = process.env.RESEND_FROM_EMAIL;
    if (customFrom && customFrom.includes('esummit26-iiitdm.vercel.app')) {
        return 'E-Summit <onboarding@resend.dev>';
    }
    return customFrom || 'E-Summit <onboarding@resend.dev>';
}
