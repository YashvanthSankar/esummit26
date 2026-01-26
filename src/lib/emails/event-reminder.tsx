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
    Img,
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
                {/* Glowing Header */}
                <Section style={header}>
                    <div style={logoContainer}>
                        <Heading style={logo}>E-SUMMIT'26</Heading>
                        <Text style={tagline}>IIITDM Kancheepuram</Text>
                    </div>
                </Section>

                {/* Main Content Card */}
                <Section style={card}>
                    {/* Floating Badge */}
                    <div style={badgeContainer}>
                        <span style={badge}>📢 EVENT UPDATE</span>
                    </div>

                    {/* Greeting */}
                    <Heading style={greeting}>
                        Hey {userName}! <span style={wave}>👋</span>
                    </Heading>

                    {/* Subject as Main Headline */}
                    <Heading style={headline}>{subject}</Heading>

                    {/* Decorative Line */}
                    <div style={decorativeLine}>
                        <div style={lineGlow}></div>
                    </div>

                    {/* Message Content */}
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
                            <span style={ctaText}>View Your Pass</span>
                            <span style={ctaArrow}>→</span>
                        </Link>
                    </Section>
                </Section>

                {/* Event Info Card */}
                <Section style={infoCard}>
                    <div style={infoGrid}>
                        <div style={infoItem}>
                            <Text style={infoIcon}>📅</Text>
                            <div>
                                <Text style={infoLabel}>DATE</Text>
                                <Text style={infoValue}>Jan 30 - Feb 1, 2026</Text>
                            </div>
                        </div>
                        <div style={infoItem}>
                            <Text style={infoIcon}>📍</Text>
                            <div>
                                <Text style={infoLabel}>VENUE</Text>
                                <Text style={infoValue}>IIITDM Kancheepuram</Text>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Social Links */}
                <Section style={socialSection}>
                    <Text style={socialTitle}>Connect with us</Text>
                    <div style={socialLinks}>
                        <Link href="https://instagram.com/ecell_iiitdm" style={socialLink}>Instagram</Link>
                        <span style={socialDivider}>•</span>
                        <Link href="https://linkedin.com/company/ecelliiitdm" style={socialLink}>LinkedIn</Link>
                        <span style={socialDivider}>•</span>
                        <Link href="https://esummit26-iiitdm.vercel.app" style={socialLink}>Website</Link>
                    </div>
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
// PREMIUM STYLES - Dark Theme with Purple Accents
// ============================================

const main: React.CSSProperties = {
    backgroundColor: '#000000',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 0',
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#0a0a0a',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px rgba(168, 85, 247, 0.1)',
};

const header: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    padding: '40px 32px',
    textAlign: 'center' as const,
    borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
};

const logoContainer: React.CSSProperties = {
    display: 'inline-block',
};

const logo: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: '800',
    color: '#a855f7',
    margin: '0 0 8px 0',
    letterSpacing: '2px',
    textShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
};

const tagline: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    margin: 0,
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
};

const card: React.CSSProperties = {
    padding: '40px 32px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
};

const badgeContainer: React.CSSProperties = {
    marginBottom: '24px',
};

const badge: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    color: '#a855f7',
    padding: '10px 20px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
};

const greeting: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 12px 0',
};

const wave: React.CSSProperties = {
    display: 'inline-block',
};

const headline: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 24px 0',
    lineHeight: '1.3',
};

const decorativeLine: React.CSSProperties = {
    height: '4px',
    width: '80px',
    background: 'linear-gradient(90deg, #a855f7 0%, #7c3aed 50%, transparent 100%)',
    borderRadius: '2px',
    marginBottom: '32px',
};

const lineGlow: React.CSSProperties = {
    // Placeholder for glow effect
};

const messageContainer: React.CSSProperties = {
    marginBottom: '32px',
};

const paragraph: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.75)',
    margin: '0 0 12px 0',
};

const ctaSection: React.CSSProperties = {
    textAlign: 'center' as const,
    margin: '40px 0 16px 0',
};

const ctaButton: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    color: '#ffffff',
    padding: '18px 36px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
};

const ctaText: React.CSSProperties = {
    marginRight: '8px',
};

const ctaArrow: React.CSSProperties = {
    opacity: 0.8,
};

const infoCard: React.CSSProperties = {
    margin: '0 32px 32px 32px',
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '16px',
};

const infoGrid: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
};

const infoItem: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
};

const infoIcon: React.CSSProperties = {
    fontSize: '24px',
    margin: 0,
};

const infoLabel: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    margin: '0 0 4px 0',
};

const infoValue: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
};

const socialSection: React.CSSProperties = {
    textAlign: 'center' as const,
    padding: '0 32px 32px 32px',
};

const socialTitle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: '0 0 12px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
};

const socialLinks: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
};

const socialLink: React.CSSProperties = {
    color: '#a855f7',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
};

const socialDivider: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: '12px',
};

const footer: React.CSSProperties = {
    padding: '0 32px 32px 32px',
    textAlign: 'center' as const,
};

const footerDivider: React.CSSProperties = {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: '1px',
    margin: '0 0 24px 0',
};

const footerText: React.CSSProperties = {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: '0 0 8px 0',
};

const copyright: React.CSSProperties = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.3)',
    margin: 0,
};
