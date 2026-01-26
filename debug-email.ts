
import { render } from '@react-email/render';
import EventReminderEmail from './src/lib/emails/event-reminder';
import nodemailer from 'nodemailer';
import React from 'react';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testEmail() {
    console.log('--- Starting Email Test ---');
    try {
        console.log('1. Rendering Email Template...');
        const emailHtml = await render(
            React.createElement(EventReminderEmail, {
                userName: 'Debug User',
                subject: 'Debug Test',
                message: 'This is a debug message to check rendering.',
                eventDetails: {
                    name: "E-Summit '26",
                    dates: 'Jan 30 - Feb 1, 2026',
                    venue: 'IIITDM Kancheepuram',
                    prizePool: '₹2,00,000+',
                    websiteUrl: 'https://esummit26-iiitdm.vercel.app',
                },
                events: [],
                speakers: [],
                sponsors: []
            })
        );
        console.log('✅ Email Rendered Successfully (Length: ' + emailHtml.length + ')');

        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.log('⚠️ No Gmail credentials found in .env.local. Skipping send.');
            return;
        }

        console.log('2. Attempting to send via Gmail...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"${process.env.GMAIL_FROM_NAME || 'Debug'}" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // Send to self
            subject: 'Debug Test Email',
            html: emailHtml,
        });

        console.log('✅ Email Sent! Message ID:', info.messageId);

    } catch (error: any) {
        console.error('❌ ERROR:', error);
    }
}

testEmail();
