
import { render } from '@react-email/render';
import EventReminderEmail from './src/lib/emails/event-reminder';
import nodemailer from 'nodemailer';
import React from 'react';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env.local') });

async function verifyEmail() {
    console.log('\n🔍 --- STARTING EMAIL DIAGNOSTIC ---\n');

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        console.error('❌ CRITICAL: Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env.local');
        return;
    }
    console.log(`✅ Credentials Found: ${user}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });

    // TEST 1: PLAIN TEXT (Connection Test)
    try {
        console.log('\n📧 Test 1: Sending PLAIN TEXT email...');
        console.time('PlainTextSend');
        const info = await transporter.sendMail({
            from: `"Debug Bot" <${user}>`,
            to: user, // Send to self
            subject: 'Test 1: Plain Text Connection Check',
            text: 'If you receive this, the SMTP connection is working perfectly.',
        });
        console.timeEnd('PlainTextSend');
        console.log(`✅ Plain Text Sent! ID: ${info.messageId}`);
    } catch (e: any) {
        console.error('❌ Test 1 Failed:', e.message);
        return; // Stop if basic connection fails
    }

    // TEST 2: TEMPLATE RENDER & SEND
    try {
        console.log('\n📧 Test 2: Rendering & Sending HTML Template...');
        console.time('RenderTime');
        const emailHtml = await render(
            React.createElement(EventReminderEmail, {
                userName: 'Debug User',
                subject: 'Test 2: HTML Template',
                message: 'This tests the heavy template rendering.',
                eventDetails: {
                    name: "E-Summit '26",
                    dates: 'Jan 30 - Feb 1',
                    venue: 'IIITDM',
                    prizePool: '₹2 Lakhs',
                    websiteUrl: 'https://esummit26-iiitdm.vercel.app',
                },
                events: [],
                speakers: [],
                sponsors: []
            })
        );
        console.timeEnd('RenderTime');
        console.log(`✅ Render Success. Length: ${emailHtml.length} chars`);

        console.time('HtmlSend');
        const info = await transporter.sendMail({
            from: `"Debug Bot" <${user}>`,
            to: user,
            subject: 'Test 2: HTML Template Check',
            html: emailHtml,
        });
        console.timeEnd('HtmlSend');
        console.log(`✅ HTML Email Sent! ID: ${info.messageId}`);

    } catch (e: any) {
        console.error('❌ Test 2 Failed:', e.message);
        if (e.message.includes('rendering')) {
            console.error('⚠️ Suggestion: The template might be too complex or has broken imports.');
        }
    }
}

verifyEmail();
