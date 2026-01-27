import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
} from '@react-email/components';
import * as React from 'react';

interface EventReminderEmailProps {
    userName: string;
    subject?: string;
    message?: string;
    eventDetails?: {
        name?: string;
        dates?: string;
        venue?: string;
        prizePool?: string;
        websiteUrl?: string;
        tagline?: string;
    };
    events?: Array<{
        name: string;
        date?: string;
        prize?: string;
        category?: string;
        description?: string;
    }>;
    speakers?: Array<{
        name: string;
        title: string;
        image?: string;
        company?: string;
    }>;
    sponsors?: Array<{
        name: string;
        logo: string;
        tier?: 'title' | 'gold' | 'silver' | 'community';
    }>;
}

export const EventReminderEmail = ({
    userName = 'Fellow Innovator',
    subject,
    message,
    eventDetails = {
        name: "E-Summit '26",
        dates: 'January 30 - February 1, 2026',
        venue: 'IIITDM Kancheepuram',
        prizePool: '₹2,00,000+',
        websiteUrl: 'https://esummit26-iiitdm.vercel.app',
        tagline: 'Where Innovation Meets Opportunity',
    },
    events = [
        { name: 'Pitch Perfect', date: 'Jan 30 - Feb 1', prize: '₹30,000', category: 'Flagship', description: 'Present your startup idea to top VCs' },
        { name: 'MUN', date: 'Jan 31', prize: '₹30,000', category: 'Flagship', description: 'Model United Nations - Debate and diplomacy' },
        { name: 'Ideathon', date: 'Jan 31', prize: '₹18,000', category: 'Formal', description: 'Innovative problem-solving competition' },
        { name: 'Case Closed', date: 'Feb 1', prize: '₹15,000', category: 'Formal', description: 'Solve real-world business challenges' },
    ],
    speakers = [
        { name: 'Dr. Mylswamy Annadurai', title: 'Moon Man of India', image: 'https://esummit26-iiitdm.vercel.app/speakers/mylswamy.webp', company: 'Ex-Director, ISRO' },
        { name: 'Suresh Narasimha', title: 'Founder', image: 'https://esummit26-iiitdm.vercel.app/speakers/suresh.webp', company: 'CoCreate Ventures' },
        { name: 'Nagaraja Prakasam', title: 'Angel Investor', image: 'https://esummit26-iiitdm.vercel.app/speakers/nagaraja.webp', company: 'Author & Mentor' },
        { name: 'Arunabh Parihar', title: 'Co-Founder', image: 'https://esummit26-iiitdm.vercel.app/speakers/arunabh.webp', company: 'Zoop Money' },
        { name: 'Harsha Vardhan', title: 'Founder', image: 'https://esummit26-iiitdm.vercel.app/speakers/harsha.webp', company: 'Codedale' },
    ],
    sponsors = [],
}: EventReminderEmailProps) => {
    const previewText = subject || `Complete Guide to ${eventDetails.name} | ${eventDetails.dates} | ${eventDetails.prizePool} in prizes`;

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                    
                    * { box-sizing: border-box; }
                    
                    body {
                        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    }
                    
                    .hover-glow:hover {
                        box-shadow: 0 0 20px rgba(168, 85, 247, 0.4) !important;
                        border-color: #a855f7 !important;
                        transform: translateY(-2px) !important;
                    }
                `}</style>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header with Logo */}
                    <Section style={header}>
                        <Img
                            src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                            alt="E-Summit '26"
                            width="60"
                            style={logo}
                        />
                    </Section>

                    {/* Hero Section */}
                    <Section style={{ padding: '0 24px 32px' }}>
                        <Text style={heroTitle}>E-SUMMIT '26</Text>
                        <Text style={heroSubtitle}>{eventDetails.tagline}</Text>

                        <div style={heroStatsContainer}>
                            <Text style={heroStat}>
                                <span style={{ color: colors.accent }}>2 Days</span> To Go
                            </Text>
                            <Text style={heroStatDivider}>|</Text>
                            <Text style={heroStat}>
                                <span style={{ color: colors.accent }}>{eventDetails.prizePool}</span> Prize Pool
                            </Text>
                        </div>
                    </Section>

                    {/* Main Content Card */}
                    <Section style={contentCard}>
                        <Text style={greeting}>Hello {userName},</Text>

                        {message && (
                            <div style={messageBox}>
                                <Text style={messageText}>{message}</Text>
                            </div>
                        )}

                        <Text style={paragraph}>
                            The most awaited entrepreneurship summit of South India is here.
                            Witness innovation, compete with the best, and network with industry leaders at
                            <span style={{ color: colors.accent, fontWeight: 600 }}> IIITDM Kancheepuram</span>.
                        </Text>

                        <div style={{ textAlign: 'center', margin: '32px 0' }}>
                            <Link href={eventDetails.websiteUrl} style={ctaButton}>
                                Visit Official Website
                            </Link>
                        </div>

                        {/* Events Grid */}
                        <Text style={sectionHeader}>Featured Events</Text>
                        <Row>
                            {events.map((event, i) => (
                                <Column key={i} style={{ width: '50%', padding: '0 8px 16px', verticalAlign: 'top' }}>
                                    <div style={eventCard}>
                                        <Text style={eventCategory}>{event.category}</Text>
                                        <Text style={eventTitle}>{event.name}</Text>
                                        <Text style={eventPrize}>Prize: {event.prize}</Text>
                                    </div>
                                </Column>
                            ))}
                        </Row>

                        <div style={{ height: '16px' }} />

                        {/* Speakers Section */}
                        <Text style={sectionHeader}>Keynote Speakers</Text>
                        <div style={speakerContainer}>
                            {speakers.slice(0, 3).map((speaker, i) => (
                                <div key={i} style={speakerItem}>
                                    <Img
                                        src={speaker.image}
                                        alt={speaker.name}
                                        style={speakerImage}
                                    />
                                    <div style={{ paddingLeft: '12px' }}>
                                        <Text style={speakerName}>{speaker.name}</Text>
                                        <Text style={speakerTitle}>{speaker.title}</Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            © 2026 E-Summit IIITDM Kancheepuram. All rights reserved.
                        </Text>
                        <Text style={footerAddress}>
                            IIITDM Kancheepuram, Chennai - 600127
                        </Text>
                        <div style={socialLinks}>
                            <Link href="https://instagram.com/ecell_iiitdm" style={socialLink}>Instagram</Link>
                            <span style={{ margin: '0 8px', color: '#525252' }}>•</span>
                            <Link href="https://linkedin.com/company/ecelliiitdm" style={socialLink}>LinkedIn</Link>
                        </div>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// STYLES - Modern Dark Theme
// ════════════════════════════════════════════════════════════════

const colors = {
    background: '#0a0a0a',
    cardBg: '#171717',
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    accent: '#a855f7', // Purple
    accentGlow: 'rgba(168, 85, 247, 0.15)',
    border: '#262626',
};

const main: React.CSSProperties = {
    backgroundColor: colors.background,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: colors.textPrimary,
    margin: '0',
    padding: '40px 0',
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
};

const header: React.CSSProperties = {
    padding: '0 24px 32px',
    textAlign: 'center',
};

const logo: React.CSSProperties = {
    borderRadius: '12px',
};

const heroTitle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: '800',
    textAlign: 'center',
    margin: '0 0 12px',
    background: 'linear-gradient(to right, #ffffff, #a3a3a3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
};

const heroSubtitle: React.CSSProperties = {
    fontSize: '14px',
    color: colors.textSecondary,
    textAlign: 'center',
    margin: '0 0 24px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
};

const heroStatsContainer: React.CSSProperties = {
    textAlign: 'center',
    padding: '12px 24px',
    backgroundColor: colors.cardBg,
    borderRadius: '50px',
    display: 'inline-block',
    border: `1px solid ${colors.border}`,
    margin: '0 auto',
};

const heroStat: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 8px',
};

const heroStatDivider: React.CSSProperties = {
    display: 'inline-block',
    color: colors.border,
    margin: '0 4px',
};

const contentCard: React.CSSProperties = {
    backgroundColor: colors.cardBg,
    borderRadius: '24px',
    border: `1px solid ${colors.border}`,
    padding: '40px 32px',
    margin: '0 12px',
};

const greeting: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 16px',
};

const messageBox: React.CSSProperties = {
    backgroundColor: colors.accentGlow,
    border: `1px solid ${colors.accent}`,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
};

const messageText: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: colors.textPrimary,
    margin: '0',
};

const paragraph: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: colors.textSecondary,
    margin: '0 0 24px',
};

const ctaButton: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.accent,
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '16px 32px',
    borderRadius: '50px',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
};

const sectionHeader: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 20px',
    color: colors.textPrimary,
    borderLeft: `4px solid ${colors.accent}`,
    paddingLeft: '12px',
};

const eventCard: React.CSSProperties = {
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '16px',
    height: '100%',
};

const eventCategory: React.CSSProperties = {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: '0.05em',
    marginBottom: '8px',
};

const eventTitle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: '0 0 4px',
};

const eventPrize: React.CSSProperties = {
    fontSize: '12px',
    color: colors.textSecondary,
    margin: '0',
};

const speakerContainer: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
};

const speakerItem: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '12px',
};

const speakerImage: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
};

const speakerName: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: '0 0 2px',
};

const speakerTitle: React.CSSProperties = {
    fontSize: '12px',
    color: colors.textSecondary,
    margin: '0',
};

const footer: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px 0 0',
};

const footerText: React.CSSProperties = {
    fontSize: '12px',
    color: '#666666',
    margin: '0 0 8px',
};

const footerAddress: React.CSSProperties = {
    fontSize: '12px',
    color: '#525252',
    margin: '0 0 24px',
};

const socialLinks: React.CSSProperties = {
    fontSize: '12px',
    color: '#525252',
};

const socialLink: React.CSSProperties = {
    color: '#666666',
    textDecoration: 'none',
    fontWeight: '500',
};