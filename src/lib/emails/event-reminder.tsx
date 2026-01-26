import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Link,
    Heading,
} from '@react-email/components';

interface EventReminderEmailProps {
    userName: string;
    subject: string;
    message: string;
}

export const EventReminderEmail: React.FC<EventReminderEmailProps> = ({
    userName,
    subject,
    message,
}) => (
    <Html>
        <Head />
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <Heading style={logo}>E-SUMMIT '26</Heading>
                    <Text style={subtitle}>IIITDM Kancheepuram</Text>
                </Section>

                {/* Main Card */}
                <Section style={card}>
                    <div style={reminderBadge}>📢 Event Reminder</div>

                    <Heading style={h1}>
                        <div style={greeting}>Hey {userName}! 👋</div>
                        {subject}
                    </Heading>

                    {/* Message Content - preserves line breaks */}
                    <Text style={paragraph}>
                        {message.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </Text>

                    {/* CTA Button */}
                    <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
                        <Link href="https://esummit26-iiitdm.vercel.app/dashboard" style={button}>
                            View Your Pass →
                        </Link>
                    </Section>
                </Section>

                {/* Event Info */}
                <Section style={eventInfo}>
                    <Text style={eventInfoTitle}>📅 Event Details</Text>
                    <Text style={eventInfoText}>
                        <strong>Dates:</strong> Jan 30 - Feb 1, 2026<br />
                        <strong>Venue:</strong> IIITDM Kancheepuram
                    </Text>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Questions? Contact us at ecell@iiitdm.ac.in
                    </Text>
                    <Text style={footerText}>
                        © 2026 E-Cell IIITDM Kancheepuram. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default EventReminderEmail;

// Styles
const main = {
    backgroundColor: '#050505',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
};

const header = {
    textAlign: 'center' as const,
    marginBottom: '40px',
};

const logo = {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
};

const subtitle = {
    color: '#666666',
    fontSize: '14px',
    margin: 0,
};

const card = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
};

const reminderBadge = {
    display: 'inline-block',
    background: 'rgba(168, 85, 247, 0.1)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    color: '#a855f7',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    marginBottom: '24px',
};

const h1 = {
    fontSize: '28px',
    margin: '0 0 16px 0',
    fontWeight: '700',
    color: '#ffffff',
};

const greeting = {
    color: '#a855f7',
    marginBottom: '8px',
};

const paragraph = {
    lineHeight: '1.8',
    color: '#cccccc',
    margin: '0 0 16px 0',
    whiteSpace: 'pre-wrap' as const,
};

const button = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
};

const eventInfo = {
    background: 'rgba(168, 85, 247, 0.05)',
    borderLeft: '4px solid #a855f7',
    padding: '20px',
    margin: '24px 0',
    borderRadius: '8px',
};

const eventInfoTitle = {
    color: '#a855f7',
    fontWeight: '600',
    margin: '0 0 8px 0',
};

const eventInfoText = {
    color: '#cccccc',
    lineHeight: '1.6',
    margin: 0,
};

const footer = {
    textAlign: 'center' as const,
    color: '#666666',
    fontSize: '12px',
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
};

const footerText = {
    margin: '8px 0',
    color: '#666666',
};
