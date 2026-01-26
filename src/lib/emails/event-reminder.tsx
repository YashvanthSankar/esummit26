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
            <meta name="color-scheme" content="light dark" />
            <meta name="supported-color-schemes" content="light dark" />
            <style>{`
                :root {
                    color-scheme: light dark;
                }
                
                @media (prefers-color-scheme: light) {
                    .email-body { background-color: #f5f5f7 !important; }
                    .email-container { background-color: #ffffff !important; border-color: rgba(0,0,0,0.08) !important; }
                    .email-header { background: linear-gradient(180deg, rgba(147, 51, 234, 0.05) 0%, transparent 100%) !important; }
                    .email-logo-text { color: #1a1a1a !important; }
                    .email-logo-subtext { color: rgba(0,0,0,0.5) !important; }
                    .email-greeting { color: rgba(0,0,0,0.6) !important; }
                    .email-headline { color: #1a1a1a !important; }
                    .email-message { color: rgba(0,0,0,0.7) !important; }
                    .email-info-section { background-color: rgba(147, 51, 234, 0.04) !important; border-color: rgba(147, 51, 234, 0.12) !important; }
                    .email-info-label { color: rgba(0,0,0,0.5) !important; }
                    .email-info-value { color: #1a1a1a !important; }
                    .email-divider { border-color: rgba(0,0,0,0.08) !important; }
                    .email-footer-note { color: rgba(0,0,0,0.45) !important; }
                    .email-copyright { color: rgba(0,0,0,0.35) !important; }
                }
                
                @media (prefers-color-scheme: dark) {
                    .email-body { background-color: #000000 !important; }
                    .email-container { background-color: #0c0c0c !important; border-color: rgba(255,255,255,0.08) !important; }
                    .email-header { background: linear-gradient(180deg, rgba(147, 51, 234, 0.08) 0%, transparent 100%) !important; }
                    .email-logo-text { color: #ffffff !important; }
                    .email-logo-subtext { color: rgba(255,255,255,0.4) !important; }
                    .email-greeting { color: rgba(255,255,255,0.6) !important; }
                    .email-headline { color: #ffffff !important; }
                    .email-message { color: rgba(255,255,255,0.75) !important; }
                    .email-info-section { background-color: rgba(147, 51, 234, 0.06) !important; border-color: rgba(147, 51, 234, 0.15) !important; }
                    .email-info-label { color: rgba(255,255,255,0.45) !important; }
                    .email-info-value { color: #ffffff !important; }
                    .email-divider { border-color: rgba(255,255,255,0.08) !important; }
                    .email-footer-note { color: rgba(255,255,255,0.35) !important; }
                    .email-copyright { color: rgba(255,255,255,0.25) !important; }
                }
            `}</style>
        </Head>
        <Body className="email-body" style={styles.body}>
            <Container style={styles.wrapper}>
                {/* Outer Glow Container */}
                <div style={styles.glowWrapper}>
                    <Container className="email-container" style={styles.container}>

                        {/* ═══════════════ HEADER ═══════════════ */}
                        <Section className="email-header" style={styles.header}>
                            <table width="100%" cellPadding="0" cellSpacing="0">
                                <tr>
                                    <td align="center">
                                        <div style={styles.logoMark}>E</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <Heading className="email-logo-text" style={styles.logoText}>E-SUMMIT'26</Heading>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <Text className="email-logo-subtext" style={styles.logoSubtext}>IIITDM KANCHEEPURAM</Text>
                                    </td>
                                </tr>
                            </table>
                        </Section>

                        {/* ═══════════════ MAIN CONTENT ═══════════════ */}
                        <Section style={styles.content}>
                            {/* Greeting */}
                            <Text className="email-greeting" style={styles.greeting}>
                                Hello, <span style={styles.userName}>{userName}</span>
                            </Text>

                            {/* Subject Headline */}
                            <Heading className="email-headline" style={styles.headline}>{subject}</Heading>

                            {/* Accent Bar */}
                            <div style={styles.accentBar} />

                            {/* Message Body */}
                            <div style={styles.messageBody}>
                                {message.split('\n').map((line, i) => (
                                    <Text key={i} className="email-message" style={styles.messageLine}>
                                        {line || <>&nbsp;</>}
                                    </Text>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '40px' }}>
                                <tr>
                                    <td align="center">
                                        <Link href="https://esummit26-iiitdm.vercel.app/dashboard" style={styles.ctaButton}>
                                            Open Dashboard →
                                        </Link>
                                    </td>
                                </tr>
                            </table>
                        </Section>

                        {/* ═══════════════ EVENT INFO ═══════════════ */}
                        <Section className="email-info-section" style={styles.infoSection}>
                            <table width="100%" cellPadding="0" cellSpacing="0">
                                <tr>
                                    <td width="50%" style={styles.infoCell}>
                                        <Text className="email-info-label" style={styles.infoLabel}>📅 WHEN</Text>
                                        <Text className="email-info-value" style={styles.infoValue}>Jan 30 – Feb 1, 2026</Text>
                                    </td>
                                    <td width="50%" style={styles.infoCell}>
                                        <Text className="email-info-label" style={styles.infoLabel}>📍 WHERE</Text>
                                        <Text className="email-info-value" style={styles.infoValue}>IIITDM Campus</Text>
                                    </td>
                                </tr>
                            </table>
                        </Section>

                        {/* ═══════════════ FOOTER ═══════════════ */}
                        <Section style={styles.footer}>
                            <Hr className="email-divider" style={styles.divider} />

                            {/* Social Links */}
                            <table width="100%" cellPadding="0" cellSpacing="0">
                                <tr>
                                    <td align="center" style={{ paddingBottom: '20px' }}>
                                        <Link href="https://instagram.com/ecell_iiitdm" style={styles.socialLink}>Instagram</Link>
                                        <span style={styles.socialDot}>·</span>
                                        <Link href="https://linkedin.com/company/ecelliiitdm" style={styles.socialLink}>LinkedIn</Link>
                                        <span style={styles.socialDot}>·</span>
                                        <Link href="https://esummit26-iiitdm.vercel.app" style={styles.socialLink}>Website</Link>
                                    </td>
                                </tr>
                            </table>

                            <Text className="email-footer-note" style={styles.footerNote}>
                                You received this because you're registered for E-Summit '26
                            </Text>
                            <Text className="email-copyright" style={styles.copyright}>
                                © 2026 E-Cell IIITDM · Made with 💜 in Chennai
                            </Text>
                        </Section>

                    </Container>
                </div>
            </Container>
        </Body>
    </Html>
);

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// STYLES - Default Dark Theme (Light mode overrides via CSS media query)
// ════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
    // Base
    body: {
        backgroundColor: '#000000', // Dark default
        margin: 0,
        padding: '48px 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
    },
    wrapper: {
        maxWidth: '560px',
        margin: '0 auto',
    },
    glowWrapper: {
        background: 'linear-gradient(180deg, rgba(147, 51, 234, 0.15) 0%, transparent 40%)',
        borderRadius: '28px',
        padding: '1px',
    },
    container: {
        backgroundColor: '#0c0c0c', // Dark default
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
    },

    // Header
    header: {
        padding: '48px 40px 32px',
        textAlign: 'center' as const,
        background: 'linear-gradient(180deg, rgba(147, 51, 234, 0.08) 0%, transparent 100%)',
    },
    logoMark: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        lineHeight: '56px',
        textAlign: 'center' as const,
        marginBottom: '16px',
        boxShadow: '0 8px 32px rgba(147, 51, 234, 0.4)',
    },
    logoText: {
        color: '#ffffff', // Dark default
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 4px 0',
        letterSpacing: '3px',
    },
    logoSubtext: {
        color: 'rgba(255, 255, 255, 0.4)', // Dark default
        fontSize: '11px',
        fontWeight: '500',
        letterSpacing: '2px',
        margin: 0,
    },

    // Content
    content: {
        padding: '40px 40px 48px',
    },
    greeting: {
        color: 'rgba(255, 255, 255, 0.6)', // Dark default
        fontSize: '15px',
        fontWeight: '400',
        margin: '0 0 8px 0',
    },
    userName: {
        color: '#a78bfa',
        fontWeight: '500',
    },
    headline: {
        color: '#ffffff', // Dark default
        fontSize: '28px',
        fontWeight: '600',
        lineHeight: '1.35',
        margin: '0 0 20px 0',
    },
    accentBar: {
        width: '48px',
        height: '3px',
        background: 'linear-gradient(90deg, #9333ea 0%, #7c3aed 100%)',
        borderRadius: '2px',
        marginBottom: '28px',
    },
    messageBody: {
        marginBottom: '8px',
    },
    messageLine: {
        color: 'rgba(255, 255, 255, 0.75)', // Dark default
        fontSize: '15px',
        lineHeight: '1.7',
        margin: '0 0 8px 0',
    },

    // CTA
    ctaButton: {
        display: 'inline-block',
        backgroundColor: '#9333ea',
        color: '#ffffff',
        padding: '14px 28px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 24px rgba(147, 51, 234, 0.35)',
    },

    // Info Section
    infoSection: {
        margin: '0 40px 40px',
        padding: '24px',
        backgroundColor: 'rgba(147, 51, 234, 0.06)', // Dark default
        border: '1px solid rgba(147, 51, 234, 0.15)',
        borderRadius: '16px',
    },
    infoCell: {
        textAlign: 'center' as const,
        padding: '8px',
    },
    infoLabel: {
        color: 'rgba(255, 255, 255, 0.45)', // Dark default
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '1px',
        margin: '0 0 6px 0',
    },
    infoValue: {
        color: '#ffffff', // Dark default
        fontSize: '14px',
        fontWeight: '500',
        margin: 0,
    },

    // Footer
    footer: {
        padding: '0 40px 40px',
        textAlign: 'center' as const,
    },
    divider: {
        borderColor: 'rgba(255, 255, 255, 0.08)', // Dark default
        margin: '0 0 24px 0',
    },
    socialLink: {
        color: '#a78bfa',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
    },
    socialDot: {
        color: 'rgba(255, 255, 255, 0.2)',
        margin: '0 10px',
        fontSize: '14px',
    },
    footerNote: {
        color: 'rgba(255, 255, 255, 0.35)', // Dark default
        fontSize: '12px',
        margin: '0 0 8px 0',
    },
    copyright: {
        color: 'rgba(255, 255, 255, 0.25)', // Dark default
        fontSize: '11px',
        margin: 0,
    },
};
