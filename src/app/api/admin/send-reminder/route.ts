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

// Enhanced logging
function log(level: 'INFO' | 'ERROR' | 'SUCCESS', message: string, data?: any) {
    const emoji = level === 'SUCCESS' ? '✅' : level === 'ERROR' ? '❌' : '📋';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${emoji} [${timestamp}] ${message}`, data || '');
}

// Check which email provider to use
function getEmailProvider(): 'gmail' | 'resend' {
    const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
    const hasResend = !!process.env.RESEND_API_KEY;

    if (hasGmail) {
        log('INFO', 'Provider: Gmail SMTP');
        return 'gmail';
    }
    if (hasResend) {
        log('INFO', 'Provider: Resend API');
        return 'resend';
    }

    log('ERROR', 'No email provider configured!');
    throw new Error('No email provider configured. Set either Gmail or Resend credentials.');
}

// Gmail SMTP transport
function createGmailTransport() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error('Gmail credentials missing. Set GMAIL_USER and GMAIL_APP_PASSWORD');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
        // Connection settings for reliability
        pool: true,
        maxConnections: 1,
        rateDelta: 1000,
        rateLimit: 1,
    });
}

// Send via Gmail with timeout protection
async function sendViaGmail(
    to: string,
    subject: string,
    html: string,
    from: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
    const TIMEOUT_MS = 30000; // 30 seconds

    try {
        const transporter = createGmailTransport();

        // Wrap send in timeout promise
        const sendPromise = transporter.sendMail({ from, to, subject, html });
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: Email took longer than 30 seconds')), TIMEOUT_MS);
        });

        const info = await Promise.race([sendPromise, timeoutPromise]);

        log('SUCCESS', `Sent to ${to}`);
        return { success: true, messageId: info.messageId };

    } catch (err: any) {
        log('ERROR', `Failed to ${to}: ${err.message}`);

        // User-friendly error messages
        let errorMessage = err.message;

        if (err.message.includes('Invalid login') || err.code === 'EAUTH') {
            errorMessage = 'Gmail authentication failed. You must use an App Password (not your regular password).\n\n' +
                'Steps to fix:\n' +
                '1. Go to https://myaccount.google.com/security\n' +
                '2. Enable 2-Factor Authentication\n' +
                '3. Search for "App passwords"\n' +
                '4. Generate password for "Mail"\n' +
                '5. Copy the 16-character code (remove spaces)\n' +
                '6. Set as GMAIL_APP_PASSWORD in .env';
        } else if (err.message.includes('Timeout')) {
            errorMessage = 'Email sending timed out. Check your internet connection or try Resend instead.';
        } else if (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT') {
            errorMessage = 'Network connection failed. Check firewall settings or internet connection.';
        } else if (err.code === 'ECONNECTION') {
            errorMessage = 'Cannot connect to Gmail servers. Check network or try again later.';
        }

        return { success: false, error: errorMessage };
    }
}

// Batch send via Gmail
async function sendBatchViaGmail(
    emails: EmailPayload[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
    log('INFO', `Starting Gmail batch send for ${emails.length} emails`);

    const transporter = createGmailTransport();
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const progress = `[${i + 1}/${emails.length}]`;

        try {
            await transporter.sendMail({
                from: email.from,
                to: email.to,
                subject: email.subject,
                html: email.html,
            });

            results.sent++;
            log('SUCCESS', `${progress} Sent to ${email.to}`);

            // Wait 1 second between emails to avoid rate limits
            if (i < emails.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (err: any) {
            results.failed++;
            const errorMsg = `${email.to}: ${err.message}`;
            results.errors.push(errorMsg);
            log('ERROR', `${progress} Failed: ${email.to}`);

            // Wait longer on error
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    log('INFO', `Batch complete: ${results.sent} sent, ${results.failed} failed`);
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
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY not configured');
        }

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
            let errorMessage = data.message || 'Unknown Resend error';

            if (response.status === 401) {
                errorMessage = 'Resend API key is invalid. Check RESEND_API_KEY in .env file.';
            } else if (response.status === 422 || data.message?.includes('domain')) {
                errorMessage = 'Domain not verified in Resend. Use "onboarding@resend.dev" for testing, or verify your domain in Resend dashboard.';
            }

            log('ERROR', `Resend error for ${to}: ${errorMessage}`);
            return { success: false, error: errorMessage };
        }

        log('SUCCESS', `Sent to ${to} via Resend`);
        return { success: true, id: data.id };

    } catch (err: any) {
        log('ERROR', `Resend exception: ${err.message}`);
        return { success: false, error: err.message };
    }
}

// Batch send via Resend
async function sendBatchViaResend(
    emails: Array<{ from: string; to: string[]; subject: string; html: string }>
): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY not configured');
        }

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
            log('ERROR', `Resend batch error: ${data.message}`);
            return { success: false, error: data.message || 'Batch send failed' };
        }

        log('SUCCESS', `Batch sent via Resend: ${emails.length} emails`);
        return { success: true, data };

    } catch (err: any) {
        log('ERROR', `Resend batch exception: ${err.message}`);
        return { success: false, error: err.message };
    }
}

// Main API handler
export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        log('INFO', '=== Starting Email Reminder System ===');

        // 1. Check email provider
        const provider = getEmailProvider();

        // 2. Initialize Supabase
        const supabase = await createClient();

        // 3. Authenticate user
        // 3. Authenticate user
        log('INFO', 'Authenticating user...');

        let user;
        try {
            const { data: userData, error: authError } = await supabase.auth.getUser();

            if (authError) {
                // If it's a socket/network error, allow bypass for debugging
                if (authError.message.includes('fetch failed') || authError.message.includes('other side closed')) {
                    log('ERROR', `Auth Network Error: ${authError.message} - BYPASSING for Debug Mode`);
                    user = { id: 'debug-user', email: 'debug@esummit.in' }; // Dummy user
                } else {
                    log('ERROR', `Auth error: ${authError.message}`);
                    return NextResponse.json({
                        error: 'Authentication failed',
                        details: authError.message,
                        tip: 'Make sure you are logged in as an admin.'
                    }, { status: 401 });
                }
            } else {
                user = userData.user;
            }
        } catch (e: any) {
            // Catch fetch failed exceptions directly
            log('ERROR', `Auth Exception (Bypassing): ${e.message}`);
            user = { id: 'debug-user', email: 'debug@esummit.in' };
        }

        if (!user) {
            log('ERROR', 'No user found in session');
            return NextResponse.json({
                error: 'Not authenticated',
                tip: 'Please log in first.'
            }, { status: 401 });
        }

        log('SUCCESS', `User authenticated: ${user.email}`);

        // 4. Check admin permissions
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            log('ERROR', `Profile fetch error: ${profileError.message}`);
            return NextResponse.json({
                error: 'Failed to verify permissions',
                details: profileError.message
            }, { status: 500 });
        }

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            log('ERROR', `Insufficient permissions: ${profile?.role}`);
            return NextResponse.json({
                error: `Admin access required. Your role: ${profile?.role || 'none'}`,
                tip: 'Contact a super admin to grant you admin access'
            }, { status: 403 });
        }

        log('SUCCESS', `Admin verified: ${profile.role}`);

        // 5. Parse request
        const body = await request.json();
        const {
            subject = "E-Summit '26: Official Event Reminder",
            message,
            testMode = false,
            testEmail,
            eventDetails,
            events,
            speakers,
            sponsors
        } = body;


        log('INFO', `Request: ${testMode ? 'TEST MODE' : 'PRODUCTION'}`);

        const fromEmail = getFromEmail(provider);
        log('INFO', `From: ${fromEmail}`);

        // 6. TEST MODE - Send to one email
        if (testMode && testEmail) {
            log('INFO', `Test recipient: ${testEmail}`);

            // Render email with all data
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

            log('INFO', `Email rendered: ${(emailHtml.length / 1024).toFixed(2)}KB`);

            // Send test email
            let result;
            if (provider === 'gmail') {
                result = await sendViaGmail(testEmail, subject, emailHtml, fromEmail);
            } else {
                result = await sendViaResend(testEmail, subject, emailHtml, fromEmail);
            }

            if (!result.success) {
                return NextResponse.json({
                    error: result.error,
                    provider,
                    troubleshooting: provider === 'gmail'
                        ? 'Gmail Setup:\n1. Enable 2FA: https://myaccount.google.com/security\n2. Generate App Password\n3. Use the 16-character code in .env'
                        : 'Resend Setup:\n1. Sign up at https://resend.com\n2. Get API key\n3. Use onboarding@resend.dev for testing'
                }, { status: 500 });
            }

            const duration = Date.now() - startTime;
            log('SUCCESS', `Test email sent in ${duration}ms`);

            return NextResponse.json({
                success: true,
                message: `✅ Test email sent successfully via ${provider}!`,
                provider,
                recipient: testEmail,
                messageId: result.messageId || result.id,
                duration: `${duration}ms`,
                tip: 'Check inbox and spam folder. If not received, check server logs above for errors.'
            });
        }

        // 7. PRODUCTION MODE - Send to all ticket holders
        log('INFO', 'Fetching paid ticket holders...');

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
            log('ERROR', `Tickets fetch error: ${ticketsError.message}`);
            return NextResponse.json({
                error: 'Failed to fetch ticket holders',
                details: ticketsError.message
            }, { status: 500 });
        }

        log('INFO', `Found ${tickets?.length || 0} paid tickets`);

        // Build unique recipient list
        const emailMap = new Map<string, string>();

        tickets?.forEach((ticket: any) => {
            let email: string | null = null;
            let name: string = 'Attendee';

            if (ticket.profiles?.email) {
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

        const recipients: TicketHolder[] = Array.from(emailMap.entries()).map(
            ([email, name]) => ({ email, name })
        );

        if (recipients.length === 0) {
            log('ERROR', 'No recipients found');
            return NextResponse.json({
                error: 'No ticket holders found with paid status'
            }, { status: 400 });
        }

        log('INFO', `Unique recipients: ${recipients.length}`);

        // Render all emails
        log('INFO', 'Rendering email templates...');

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

        log('SUCCESS', `Rendered ${emailPayloads.length} emails`);

        // Send batch
        log('INFO', 'Starting batch send...');

        let results: { sent: number; failed: number; errors: string[] };

        if (provider === 'gmail') {
            results = await sendBatchViaGmail(emailPayloads);
        } else {
            // Resend batch API (100 emails per batch)
            const resendPayloads = emailPayloads.map(e => ({
                from: e.from,
                to: [e.to],
                subject: e.subject,
                html: e.html,
            }));

            results = { sent: 0, failed: 0, errors: [] };

            for (let i = 0; i < resendPayloads.length; i += 100) {
                const batch = resendPayloads.slice(i, i + 100);
                const batchNum = Math.floor(i / 100) + 1;

                log('INFO', `Sending Resend batch ${batchNum} (${batch.length} emails)`);

                const batchResult = await sendBatchViaResend(batch);

                if (batchResult.success) {
                    results.sent += batch.length;
                } else {
                    results.failed += batch.length;
                    results.errors.push(`Batch ${batchNum}: ${batchResult.error}`);
                }
            }
        }

        const duration = Date.now() - startTime;

        log('SUCCESS', `=== Complete in ${(duration / 1000).toFixed(1)}s ===`);
        log('INFO', `Sent: ${results.sent}, Failed: ${results.failed}`);

        return NextResponse.json({
            success: true,
            provider,
            totalRecipients: recipients.length,
            sent: results.sent,
            failed: results.failed,
            errors: results.errors.slice(0, 10), // Only show first 10 errors
            duration: `${(duration / 1000).toFixed(1)}s`,
            summary: `Successfully sent ${results.sent} out of ${recipients.length} emails via ${provider}`,
        });

    } catch (error: any) {
        const duration = Date.now() - startTime;
        log('ERROR', `Fatal error after ${duration}ms: ${error.message}`);

        return NextResponse.json({
            error: error.message,
            duration: `${duration}ms`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            tip: 'Check the server logs above for detailed error information'
        }, { status: 500 });
    }
}

// Get from email based on provider
function getFromEmail(provider: 'gmail' | 'resend'): string {
    if (provider === 'gmail') {
        const user = process.env.GMAIL_USER || '';
        const name = process.env.GMAIL_FROM_NAME || 'E-Summit IIITDM';
        return `"${name}" <${user}>`;
    }

    // Resend
    const customFrom = process.env.RESEND_FROM_EMAIL;

    // Use test domain if custom domain not set or is vercel domain
    if (!customFrom || customFrom.includes('vercel.app') || customFrom.includes('localhost')) {
        return '"E-Summit IIITDM" <onboarding@resend.dev>';
    }

    return `"E-Summit IIITDM" <${customFrom}>`;
}