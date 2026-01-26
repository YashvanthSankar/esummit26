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

interface EmailPayload {
    from: string;
    to: string;
    subject: string;
    html: string;
}

// Check which email provider to use
function getEmailProvider(): 'gmail' | 'resend' {
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return 'gmail';
    }
    return 'resend';
}

// Gmail SMTP transport with connection pool and timeout
function createGmailTransport() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
        pool: true, // Use connection pool
        maxConnections: 1, // Limit connections
        maxMessages: 100, // Max messages per connection
        rateDelta: 1000, // 1 second between messages
        rateLimit: 1, // 1 message per rateDelta
    });
}

// Send via Gmail SMTP with timeout
async function sendViaGmail(
    to: string,
    subject: string,
    html: string,
    from: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
    const timeoutMs = 30000; // 30 second timeout

    try {
        const transporter = createGmailTransport();

        // Create a promise that times out
        const sendPromise = transporter.sendMail({
            from,
            to,
            subject,
            html,
        });

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), timeoutMs);
        });

        const info = await Promise.race([sendPromise, timeoutPromise]) as any;

        console.log(`✅ Gmail sent to ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        console.error(`❌ Gmail failed to ${to}:`, err.message);

        let errorMessage = err.message;

        if (err.message.includes('Invalid login') || err.code === 'EAUTH') {
            errorMessage = '⚠️ Gmail authentication failed. Make sure you are using an App Password (not your regular password). Enable 2FA and generate an App Password at https://myaccount.google.com/security';
        } else if (err.message.includes('timeout')) {
            errorMessage = '⏱️ Email send timed out. Your Gmail settings might be blocking the connection, or your network is slow.';
        } else if (err.code === 'ESOCKET' || err.message.includes('ETIMEDOUT')) {
            errorMessage = '🔌 Network connection issue. Check your internet connection or firewall settings.';
        } else if (err.code === 'ECONNECTION') {
            errorMessage = '🚫 Cannot connect to Gmail servers. Check your network or try again later.';
        }

        return { success: false, error: errorMessage };
    }
}

// Send batch via Gmail
async function sendBatchViaGmail(
    emails: EmailPayload[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
    const transporter = createGmailTransport();
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (const email of emails) {
        try {
            await transporter.sendMail({
                from: email.from,
                to: email.to,
                subject: email.subject,
                html: email.html,
            });
            results.sent++;
            console.log(`✅ Sent ${results.sent}/${emails.length}`);

            // Wait 1s between emails
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err: any) {
            results.failed++;
            results.errors.push(`${email.to}: ${err.message}`);
            console.error(`❌ Failed ${results.failed}/${emails.length}`);

            // Wait longer on error
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return results;
}

// Send via Resend
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
            let errorMessage = data.message || 'Unknown error';

            if (response.status === 401) {
                errorMessage = '⚠️ Resend API key is invalid. Check RESEND_API_KEY in .env';
            } else if (response.status === 422 || data.message?.includes('domain')) {
                errorMessage = '⚠️ Domain not verified. Use "onboarding@resend.dev" for testing or verify your domain in Resend dashboard.';
            }

            return { success: false, error: errorMessage };
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

        // Create Supabase client - FIXED: Proper async handling
        const supabase = await createClient();

        // Verify admin - FIXED: Better error handling
        console.log('[SendReminder] Checking authentication...');

        let user;
        try {
            const { data: userData, error: authError } = await supabase.auth.getUser();

            if (authError) {
                console.error('[SendReminder] Auth error:', authError.message);
                return NextResponse.json({
                    error: 'Authentication failed',
                    details: authError.message,
                    tip: 'Make sure you are logged in as an admin'
                }, { status: 401 });
            }

            user = userData.user;
        } catch (authException: any) {
            console.error('[SendReminder] Auth exception:', authException);
            return NextResponse.json({
                error: 'Authentication system error',
                details: authException.message
            }, { status: 401 });
        }

        if (!user) {
            console.log('[SendReminder] No user found in session');
            return NextResponse.json({
                error: 'No authenticated user',
                tip: 'Please log in first'
            }, { status: 401 });
        }

        console.log('[SendReminder] User authenticated:', user.email);

        // Check admin role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('[SendReminder] Profile error:', profileError);
            return NextResponse.json({
                error: 'Failed to check permissions',
                details: profileError.message
            }, { status: 500 });
        }

        console.log('[SendReminder] User role:', profile?.role);

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            return NextResponse.json({
                error: `Admin access required. Your role: ${profile?.role}`,
                tip: 'Contact an administrator to grant you admin access'
            }, { status: 403 });
        }

        // Get request body
        const { subject, message, testMode = false, testEmail, eventDetails, events, speakers, sponsors } = await request.json();

        if (!subject || !message) {
            return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
        }

        const fromEmail = getFromEmail(provider);
        console.log('[SendReminder] From email:', fromEmail);

        // Test mode
        if (testMode && testEmail) {
            console.log('[SendReminder] TEST MODE - Sending to:', testEmail);

            const emailHtml = await render(
                React.createElement(EventReminderEmail, {
                    userName: 'Test User',
                    subject,
                    message,
                    eventDetails: eventDetails || {
                        name: "E-Summit '26",
                        dates: 'Jan 30 - Feb 1, 2026',
                        venue: 'IIITDM Kancheepuram',
                        prizePool: '₹2,00,000+',
                        websiteUrl: 'https://esummit26-iiitdm.vercel.app',
                    },
                    events: events || [
                        { name: 'Startup Pitch', date: 'Jan 31', prize: '₹30,000' },
                        { name: 'Model United Nations', date: 'Jan 30-31', prize: '₹30,000' },
                        { name: 'Ideathon', date: 'Jan 31', prize: '₹18,000' },
                        { name: 'Mock IPL Auction', date: 'Feb 1', prize: '₹12,000' },
                    ],
                    speakers: speakers || [
                        {
                            name: 'Harsha Vardhan',
                            title: 'Founder, Codedale | HarshaVerse',
                            image: 'https://yt3.googleusercontent.com/ytc/AIdro_k4k-Gf1X4yHwNjjX4NqJ_1_4X4_4X4_4X4_4X4=s900-c-k-c0x00ffffff-no-rj',
                        },
                        {
                            name: 'Dr. Mylswamy Annadurai',
                            title: 'Moon Man of India',
                            image: 'https://esummit26-iiitdm.vercel.app/speakers/mylswamy.webp',
                        },
                        {
                            name: 'Suresh Narasimha',
                            title: 'CoCreate Ventures',
                            image: 'https://esummit26-iiitdm.vercel.app/speakers/suresh.webp',
                        },
                        {
                            name: 'Nagaraja Prakasam',
                            title: 'Angel Investor | Author',
                            image: 'https://esummit26-iiitdm.vercel.app/speakers/nagaraja.webp',
                        },
                        {
                            name: 'Arunabh Parihar',
                            title: 'Co-Founder, Zoop Money',
                            image: 'https://esummit26-iiitdm.vercel.app/speakers/arunabh.webp',
                        }
                    ],
                    sponsors: sponsors || [
                        { name: 'Unstop', logo: 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/branding-guide/logos/Unstop-Logo-White-min.png' },
                        { name: 'StockGro', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/stockgro.png' },
                        { name: 'GeeksforGeeks', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/gfg.png' },
                        { name: 'StartupNews.fyi', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/startupnewsfyi.png' },
                    ],
                })
            );

            console.log('[SendReminder] Email rendered, size:', emailHtml.length, 'bytes');

            let result;
            if (provider === 'gmail') {
                console.log('[SendReminder] Attempting Gmail send...');
                result = await sendViaGmail(testEmail, subject, emailHtml, fromEmail);
            } else {
                console.log('[SendReminder] Attempting Resend send...');
                result = await sendViaResend(testEmail, subject, emailHtml, fromEmail);
            }

            if (!result.success) {
                console.error('[SendReminder] Test send failed:', result.error);
                return NextResponse.json({
                    error: result.error,
                    provider,
                    troubleshooting: provider === 'gmail'
                        ? 'For Gmail: Ensure you are using an App Password (not regular password). Generate one at https://myaccount.google.com/security'
                        : 'For Resend: Verify your API key and domain settings'
                }, { status: 500 });
            }

            console.log('[SendReminder] Test email sent successfully!');
            return NextResponse.json({
                success: true,
                message: `✅ Test email sent successfully via ${provider}!`,
                provider,
                recipient: testEmail,
                messageId: result.messageId || result.id,
            });
        }

        // Get all paid ticket holders
        console.log('[SendReminder] Fetching ticket holders...');

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
            console.error('[SendReminder] Tickets error:', ticketsError);
            return NextResponse.json({ error: 'Failed to fetch ticket holders' }, { status: 500 });
        }

        console.log('[SendReminder] Found', tickets?.length || 0, 'paid tickets');

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

        console.log('[SendReminder] Unique recipients:', recipients.length);

        // Prepare all emails
        const emailPayloads = await Promise.all(
            recipients.map(async (recipient) => {
                const emailHtml = await render(
                    React.createElement(EventReminderEmail, {
                        userName: recipient.name,
                        subject,
                        message,
                        eventDetails: eventDetails || {
                            name: "E-Summit '26",
                            dates: 'Jan 30 - Feb 1, 2026',
                            venue: 'IIITDM Kancheepuram',
                            prizePool: '₹2,00,000+',
                            websiteUrl: 'https://esummit26-iiitdm.vercel.app',
                        },
                        events: events || [
                            { name: 'Startup Pitch', date: 'Jan 31', prize: '₹30,000' },
                            { name: 'Model United Nations', date: 'Jan 30-31', prize: '₹30,000' },
                            { name: 'Ideathon', date: 'Jan 31', prize: '₹18,000' },
                            { name: 'Mock IPL Auction', date: 'Feb 1', prize: '₹12,000' },
                        ],
                        speakers: speakers || [
                            {
                                name: 'Harsha Vardhan',
                                title: 'Founder, Codedale | HarshaVerse',
                                image: 'https://yt3.googleusercontent.com/ytc/AIdro_k4k-Gf1X4yHwNjjX4NqJ_1_4X4_4X4_4X4_4X4=s900-c-k-c0x00ffffff-no-rj',
                            },
                            {
                                name: 'Dr. Mylswamy Annadurai',
                                title: 'Moon Man of India',
                                image: 'https://esummit26-iiitdm.vercel.app/speakers/mylswamy.webp',
                            },
                            {
                                name: 'Suresh Narasimha',
                                title: 'CoCreate Ventures',
                                image: 'https://esummit26-iiitdm.vercel.app/speakers/suresh.webp',
                            },
                            {
                                name: 'Nagaraja Prakasam',
                                title: 'Angel Investor | Author',
                                image: 'https://esummit26-iiitdm.vercel.app/speakers/nagaraja.webp',
                            },
                            {
                                name: 'Arunabh Parihar',
                                title: 'Co-Founder, Zoop Money',
                                image: 'https://esummit26-iiitdm.vercel.app/speakers/arunabh.webp',
                            }
                        ],
                        sponsors: sponsors || [
                            { name: 'Unstop', logo: 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/branding-guide/logos/Unstop-Logo-White-min.png' },
                            { name: 'StockGro', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/stockgro.png' },
                            { name: 'GeeksforGeeks', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/gfg.png' },
                            { name: 'StartupNews.fyi', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/startupnewsfyi.png' },
                        ],
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

        console.log('[SendReminder] Starting batch send via', provider);

        let results: { sent: number; failed: number; errors: string[] };

        if (provider === 'gmail') {
            results = await sendBatchViaGmail(emailPayloads);
        } else {
            const resendPayloads = emailPayloads.map(e => ({
                from: e.from,
                to: [e.to],
                subject: e.subject,
                html: e.html,
            }));

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
        console.error('[SendReminder] Fatal error:', error);
        return NextResponse.json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

function getFromEmail(provider: 'gmail' | 'resend'): string {
    if (provider === 'gmail') {
        const gmailUser = process.env.GMAIL_USER || '';
        const fromName = process.env.GMAIL_FROM_NAME || 'E-Summit IIITDM';
        return `"${fromName}" <${gmailUser}>`;
    }

    const customFrom = process.env.RESEND_FROM_EMAIL;

    // For testing, always use Resend's onboarding domain
    if (!customFrom || customFrom.includes('vercel.app')) {
        return '"E-Summit IIITDM" <onboarding@resend.dev>';
    }

    return `"E-Summit IIITDM" <${customFrom}>`;
}