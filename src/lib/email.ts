import { Resend } from 'resend';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PaymentApprovedEmail from './emails/payment-approved';
import PaymentRejectedEmail from './emails/payment-rejected';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailResult {
    success: boolean;
    error?: string;
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
        const emailHtml = renderToStaticMarkup(
            createElement(PaymentApprovedEmail, { userName, ticketType, amount })
        );

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'E-Summit <noreply@esummit.iiitdm.ac.in>',
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
        const emailHtml = renderToStaticMarkup(
            createElement(PaymentRejectedEmail, { userName, ticketType, amount })
        );

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'E-Summit <noreply@esummit.iiitdm.ac.in>',
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
        return { success: false, error: error.message };
    }
}
