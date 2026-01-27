import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface EventReminderEmailProps {
    userName: string;
    subject: string;
    message?: string;
    eventDetails?: {
        name?: string;
        dates?: string;
        venue?: string;
        prizePool?: string;
        websiteUrl?: string;
    };
    events?: Array<{
        name: string;
        logo?: string;
        date?: string;
        prize?: string;
    }>;
    speakers?: Array<{
        name: string;
        title: string;
        image?: string;
    }>;
    sponsors?: Array<{
        name: string;
        logo: string;
        tier?: string;
    }>;
}

export const EventReminderEmail = ({
    userName = 'Attendee',
    subject,
    message,
    eventDetails = {
        name: "E-Summit '26",
        dates: 'Jan 30 - Feb 1, 2026',
        venue: 'IIITDM Kancheepuram',
        prizePool: '₹2,00,000+',
        websiteUrl: 'https://esummit26-iiitdm.vercel.app',
    },
    events = [],
    speakers = [],
    sponsors = [],
}: EventReminderEmailProps) => {
    const previewText = `${subject} - ${eventDetails.name}`;

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
                `}</style>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                {/* Background Pattern */}
                <div style={backgroundPattern} />

                <Container style={container}>
                    {/* ════ HEADER / HERO ════ */}
                    <Section style={heroSection}>
                        <Link href={eventDetails.websiteUrl} target="_blank">
                            <Img
                                src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                alt="E-Summit Logo"
                                width="180"
                                style={logoStyle}
                            />
                        </Link>
                    </Section>

                    {/* ════ GREETING CARD ════ */}
                    <Section style={cardSection}>
                        <div style={cardContent}>
                            <Text style={greetingText}>Greetings,</Text>
                            <Text style={introText}>
                                Hello <strong>{userName}</strong>! The Entrepreneurship Cell of IIITDM Kancheepuram is thrilled to invite you to <strong>E-Summit '26</strong>, our flagship entrepreneurship conclave.
                            </Text>

                            {/* User Message Removed */}

                            <Text style={highlightText}>
                                Compete for a massive prize pool of <span style={highlightSpan}>{eventDetails.prizePool}</span> in a high-stakes environment.
                            </Text>

                            <Link href={`${eventDetails.websiteUrl}/dashboard`} style={ctaButton}>
                                Download Your Pass
                            </Link>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Link href={eventDetails.websiteUrl} style={secondaryLink}>
                                    Official Website
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ════ EVENT DETAILS ════ */}
                    <Section style={statsSection}>
                        <div style={sectionHeader}>
                            <Text style={sectionTitle}>Event Details</Text>
                        </div>

                        <div style={statRow}>
                            <div style={statItem}>
                                <Text style={statLabel}>When</Text>
                                <Text style={statValue}>{eventDetails.dates}</Text>
                            </div>
                        </div>
                        <div style={statRow}>
                            <div style={statItem}>
                                <Text style={statLabel}>Mode</Text>
                                <Text style={statValue}>In-person</Text>
                            </div>
                        </div>
                        <div style={statRow}>
                            <div style={statItem}>
                                <Text style={statLabel}>Total Prize Pool</Text>
                                <Text style={statValue}>{eventDetails.prizePool}</Text>
                            </div>
                        </div>
                        <div style={statRow}>
                            <div style={statItem}>
                                <Text style={statLabel}>Venue</Text>
                                <Text style={statValue}>IIITDM Kancheepuram</Text>
                            </div>
                        </div>
                    </Section>

                    {/* ════ FEATURED EVENTS ════ */}
                    {events.length > 0 && (
                        <Section style={eventsSection}>
                            <div style={sectionHeader}>
                                <Text style={sectionTitle}>Featured Events</Text>
                            </div>

                            {events.map((event, i) => (
                                <div key={i} style={eventRow}>
                                    <div style={eventLeft}>
                                        <Text style={eventName}>{event.name}</Text>
                                        <Text style={eventDate}>{event.date}</Text>
                                    </div>
                                    <div style={eventRight}>
                                        <Text style={eventPrize}>{event.prize}</Text>
                                        <Text style={eventPrizeLabel}>Prize</Text>
                                    </div>
                                </div>
                            ))}
                        </Section>
                    )}

                    {/* ════ SPEAKERS ════ */}
                    {speakers.length > 0 && (
                        <Section style={speakersSection}>
                            <div style={sectionHeader}>
                                <Text style={sectionTitle}>Speakers</Text>
                            </div>

                            <div style={speakersGrid}>
                                {speakers.map((speaker, i) => (
                                    <div key={i} style={speakerCard}>
                                        <Img
                                            src={speaker.image}
                                            alt={speaker.name}
                                            style={speakerImage}
                                        />
                                        <Text style={speakerName}>{speaker.name}</Text>
                                        <Text style={speakerTitle}>{speaker.title}</Text>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ════ SPONSORS ════ */}
                    {sponsors.length > 0 && (
                        <Section style={sponsorsSection}>
                            <div style={logoGrid}>
                                {sponsors.map((sponsor, i) => (
                                    <div key={i} style={sponsorWrapper}>
                                        <Img
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            style={sponsorLogo}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ════ FOOTER ════ */}
                    <Section style={footer}>
                        <Img
                            src="https://esummit26-iiitdm.vercel.app/ecell.png"
                            width="60"
                            style={{ margin: '0 auto 20px', opacity: 0.8 }}
                        />
                        <div style={socialLinks}>
                            <Link href="https://instagram.com/ecell_iiitdm" style={socialIcon}>
                                <Img src="https://cdn-icons-png.flaticon.com/512/87/87390.png" width="24" style={iconFilter} />
                            </Link>
                            <Link href="https://linkedin.com/company/ecelliiitdm" style={socialIcon}>
                                <Img src="https://cdn-icons-png.flaticon.com/512/87/87396.png" width="24" style={iconFilter} />
                            </Link>
                            <Link href="https://esummit26-iiitdm.vercel.app" style={socialIcon}>
                                <Img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" width="24" style={iconFilter} />
                            </Link>
                        </div>
                        <Text style={footerText}>
                            © 2026 E-Summit IIITDM Kancheepuram
                        </Text>
                        <Text style={footerSubtext}>
                            Vandalur - Kelambakkam Road, Chennai - 600127
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// STYLES - "HackByte" Inspired Dark Purple Theme
// ════════════════════════════════════════════════════════════════

const main: React.CSSProperties = {
    backgroundColor: '#1a0b2e', // Deep purple dark background
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    minHeight: '100%',
};

const backgroundPattern: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 20%)
    `,
    zIndex: -1,
};

const container: React.CSSProperties = {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '40px 0',
};

const heroSection: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
};

const logoStyle: React.CSSProperties = {
    margin: '0 auto',
    filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))', // Purple glow
};

// Card Style (Glassmorphism)
const cardSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '32px',
};

const cardContent: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: '32px 24px',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
};

const greetingText: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#ffffff',
};

const introText: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '24px',
};



const highlightText: React.CSSProperties = {
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '24px',
    color: 'rgba(255, 255, 255, 0.8)',
};

const highlightSpan: React.CSSProperties = {
    color: '#facc15', // Yellow/Gold
    fontWeight: '700',
};

const ctaButton: React.CSSProperties = {
    display: 'block',
    backgroundColor: '#facc15', // Bright yellow
    color: '#000000',
    padding: '16px 32px',
    borderRadius: '50px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '16px',
    textDecoration: 'none',
    boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
};

const secondaryLink: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#1a0b2e',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
};

// Section Headers (Neon Style)
const sectionHeader: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '24px',
};

const sectionTitle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #c084fc, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    filter: 'drop-shadow(0 2px 10px rgba(192, 132, 252, 0.3))',
};

// Stats Section
const statsSection: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    padding: '32px 24px',
    margin: '0 20px 32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
};

const statRow: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '12px',
};

const statItem: React.CSSProperties = {
    // Flex-like centering usually needs consistent block in email
};

const statLabel: React.CSSProperties = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
};

const statValue: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
};

// Events Section
const eventsSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '32px',
};

const eventRow: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
};

const eventLeft: React.CSSProperties = {
    marginBottom: '8px',
};

const eventRight: React.CSSProperties = {};

const eventName: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 4px 0',
};

const eventDate: React.CSSProperties = {
    fontSize: '12px',
    color: 'rgba(192, 132, 252, 0.8)',
    margin: 0,
};

const eventPrize: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#facc15',
    margin: 0,
};

const eventPrizeLabel: React.CSSProperties = {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
};

// Speakers
const speakersSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '32px',
};

const speakersGrid: React.CSSProperties = {
    // Grid simulation
    textAlign: 'center',
};

const speakerCard: React.CSSProperties = {
    display: 'inline-block',
    width: '45%', // roughly 2 col
    verticalAlign: 'top',
    margin: '2%',
    textAlign: 'center',
    padding: '16px 0',
};

const speakerImage: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid #d946ef',
    marginBottom: '12px',
    objectFit: 'cover',
};

const speakerName: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 4px 0',
};

const speakerTitle: React.CSSProperties = {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: '1.4',
};

// Sponsors
const sponsorsSection: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    margin: '0 20px 32px',
    textAlign: 'center',
};

const logoGrid: React.CSSProperties = {
    textAlign: 'center',
};

const sponsorWrapper: React.CSSProperties = {
    display: 'inline-block',
    margin: '10px 15px',
    verticalAlign: 'middle',
};

const sponsorLogo: React.CSSProperties = {
    height: '24px',
    width: 'auto',
    opacity: 0.8,
    filter: 'grayscale(100%)',
};

// Footer
const footer: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px 20px 40px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
};

const socialLinks: React.CSSProperties = {
    marginBottom: '20px',
};

const socialIcon: React.CSSProperties = {
    display: 'inline-block',
    margin: '0 8px',
};

const iconFilter: React.CSSProperties = {
    filter: 'invert(1)', // Make white
    opacity: 0.7,
};

const footerText: React.CSSProperties = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: '0 0 4px 0',
};

const footerSubtext: React.CSSProperties = {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.2)',
    margin: 0,
};