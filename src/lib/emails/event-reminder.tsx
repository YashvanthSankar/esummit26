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
    Hr,
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
        <Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            `}</style>
        </Head>
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <Heading style={logo}>E-SUMMIT'26</Heading>
                    <Text style={tagline}>IIITDM Kancheepuram</Text>
                </Section>

                {/* Main Content */}
                <Section style={content}>
                    {/* Badge */}
                    <div style={badgeContainer}>
                        <span style={badge}>📢 EVENT UPDATE</span>
                    </div>

                    {/* Greeting */}
                    <Heading style={greeting}>
                        Hey {userName}! 👋
                    </Heading>

                    {/* Subject */}
                    <Heading style={headline}>{subject}</Heading>

                    {/* Decorative Line */}
                    <div style={decorativeLine}></div>

                    {/* Message */}
                    <div style={messageContainer}>
                        {message.split('\n').map((line, i) => (
                            <Text key={i} style={paragraph}>
                                {line || '\u00A0'}
                            </Text>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <Section style={ctaSection}>
                        <Link href="https://esummit26-iiitdm.vercel.app/dashboard" style={ctaButton}>
                            View Your Pass →
                        </Link>
                    </Section>
                </Section>

                {/* Event Info */}
                <Section style={infoCard}>
                    <table style={infoTable}>
                        <tbody>
                            <tr>
                                <td style={infoCell}>
                                    <Text style={infoIcon}>📅</Text>
                                    <Text style={infoLabel}>DATE</Text>
                                    <Text style={infoValue}>Jan 30 - Feb 1, 2026</Text>
                                </td>
                                <td style={infoCell}>
                                    <Text style={infoIcon}>📍</Text>
                                    <Text style={infoLabel}>VENUE</Text>
                                    <Text style={infoValue}>IIITDM Kancheepuram</Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Section>

                {/* Social Links */}
                <Section style={socialSection}>
                    <Text style={socialTitle}>Connect with us</Text>
                    <Text style={socialLinksText}>
                        <Link href="https://instagram.com/ecell_iiitdm" style={socialLink}>Instagram</Link>
                        {' • '}
                        <Link href="https://linkedin.com/company/ecelliiitdm" style={socialLink}>LinkedIn</Link>
                        {' • '}
                        <Link href="https://esummit26-iiitdm.vercel.app" style={socialLink}>Website</Link>
                    </Text>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Hr style={footerDivider} />
                    <Text style={footerText}>
                        You're receiving this because you're registered for E-Summit '26
                    </Text>
                    <Text style={copyright}>
                        © 2026 E-Cell IIITDM Kancheepuram
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default EventReminderEmail;

// ============================================
// LIGHT THEME STYLES - Clean & Professional
// ============================================

const main: React.CSSProperties = {
    backgroundColor: '#f4f4f5',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 20px',
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.03)',
};

const header: React.CSSProperties = {
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    padding: '36px 32px',
    textAlign: 'center' as const,
};

const logo: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 6px 0',
    letterSpacing: '2px',
};

const tagline: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '13px',
    margin: 0,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
};

const content: React.CSSProperties = {
    padding: '40px 32px',
};

const badgeContainer: React.CSSProperties = {
    marginBottom: '20px',
};

const badge: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#f3e8ff',
    color: '#7c3aed',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
};

const greeting: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#6b7280',
    margin: '0 0 8px 0',
};

const headline: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 20px 0',
    lineHeight: '1.3',
};

const decorativeLine: React.CSSProperties = {
    height: '4px',
    width: '60px',
    background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)',
    borderRadius: '2px',
    marginBottom: '28px',
};

const messageContainer: React.CSSProperties = {
    marginBottom: '28px',
};

const paragraph: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#4b5563',
    margin: '0 0 10px 0',
};

const ctaSection: React.CSSProperties = {
    textAlign: 'center' as const,
    margin: '32px 0 0 0',
};

const ctaButton: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
};

const infoCard: React.CSSProperties = {
    margin: '0 32px 28px 32px',
    padding: '20px',
    backgroundColor: '#faf5ff',
    borderRadius: '12px',
    border: '1px solid #e9d5ff',
};

const infoTable: React.CSSProperties = {
    width: '100%',
};

const infoCell: React.CSSProperties = {
    textAlign: 'center' as const,
    padding: '8px',
    width: '50%',
};

const infoIcon: React.CSSProperties = {
    fontSize: '20px',
    margin: '0 0 4px 0',
};

const infoLabel: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    margin: '0 0 2px 0',
};

const infoValue: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
};

const socialSection: React.CSSProperties = {
    textAlign: 'center' as const,
    padding: '0 32px 24px 32px',
};

const socialTitle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    margin: '0 0 8px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
};

const socialLinksText: React.CSSProperties = {
    margin: 0,
    fontSize: '14px',
};

const socialLink: React.CSSProperties = {
    color: '#7c3aed',
    textDecoration: 'none',
    fontWeight: '500',
};

const footer: React.CSSProperties = {
    padding: '0 32px 28px 32px',
    textAlign: 'center' as const,
};

const footerDivider: React.CSSProperties = {
    borderColor: '#e5e7eb',
    borderWidth: '1px',
    margin: '0 0 20px 0',
};

const footerText: React.CSSProperties = {
    fontSize: '13px',
    color: '#9ca3af',
    margin: '0 0 4px 0',
};

const copyright: React.CSSProperties = {
    fontSize: '12px',
    color: '#d1d5db',
    margin: 0,
};
