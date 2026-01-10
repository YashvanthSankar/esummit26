import { Resend } from 'resend';
import { render } from '@react-email/render';
import PaymentApprovedEmail from './emails/payment-approved';
import PaymentRejectedEmail from './emails/payment-rejected';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailResult {
    success: boolean;
    error?: string;
}

/**
 * Get the appropriate "from" email address
 * For development: Uses Resend's onboarding@resend.dev (no verification needed)
 * For production: Uses your verified domain
 */
function getFromEmail(): string {
    // If you have a verified domain, set it in RESEND_FROM_EMAIL
    // Otherwise, use Resend's sandbox domain for testing
    const customFrom = process.env.RESEND_FROM_EMAIL;

    // Check if using unverified domain
    if (customFrom && customFrom.includes('esummit26-iiitdm.vercel.app')) {
        console.warn('[Email] WARNING: Using unverified domain. Falling back to Resend sandbox.');
        console.warn('[Email] To use your domain, verify it at: https://resend.com/domains');
        return 'E-Summit <onboarding@resend.dev>';
    }

    return customFrom || 'E-Summit <onboarding@resend.dev>';
}

/**
 * Send payment approval email to user
 */
export async function sendPaymentApprovalEmail(
    to: string,
    userName: string,
    ticketType: string,
    amount: number
): Promise<EmailResult> {
    try {
        const fromEmail = getFromEmail();

        console.log('[Email] Starting approval email send...');
        console.log('[Email] API Key present:', !!process.env.RESEND_API_KEY);
        console.log('[Email] From email:', fromEmail);
        console.log('[Email] To:', to);

        // Render the React component to HTML
        const emailHtml = await render(PaymentApprovedEmail({ userName, ticketType, amount }));

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [to],
            subject: '✅ Payment Approved - E-Summit \'26',
            html: emailHtml,
        });

        if (error) {
            console.error('[Email] Approval send failed:', error);
            return { success: false, error: error.message };
        }

        console.log('[Email] Approval sent successfully:', data?.id);
        return { success: true };
    } catch (error: any) {
        console.error('[Email] Approval send error:', error);
        console.error('[Email] Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
        return { success: false, error: error.message };
    }
}

/**
 * Send payment rejection email to user
 */
export async function sendPaymentRejectionEmail(
    to: string,
    userName: string,
    ticketType: string,
    amount: number
): Promise<EmailResult> {
    try {
        const fromEmail = getFromEmail();

        console.log('[Email] Starting rejection email send...');
        console.log('[Email] API Key present:', !!process.env.RESEND_API_KEY);
        console.log('[Email] From email:', fromEmail);
        console.log('[Email] To:', to);

        // Render the React component to HTML
        const emailHtml = await render(PaymentRejectedEmail({ userName, ticketType, amount }));

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [to],
            subject: '⚠️ Payment Verification Failed - E-Summit \'26',
            html: emailHtml,
        });

        if (error) {
            console.error('[Email] Rejection send failed:', error);
            return { success: false, error: error.message };
        }

        console.log('[Email] Rejection sent successfully:', data?.id);
        return { success: true };
    } catch (error: any) {
        console.error('[Email] Rejection send error:', error);
        console.error('[Email] Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
        return { success: false, error: error.message };
    }
}
