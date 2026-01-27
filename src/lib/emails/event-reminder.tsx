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
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                `}</style>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                {/* Enhanced Background with Aura Glows */}
                <div style={auraTopLeft} />
                <div style={auraBottomRight} />
                <div style={backgroundPattern} />

                <Container style={container}>
                    {/* ════ HEADER / HERO with Frosted Icon ════ */}
                    <Section style={heroSection}>
                        {/* 3D Bell Icon Container */}
                        <div style={iconContainer}>
                            <div style={iconGlow} />
                            <div style={iconWrapper}>
                                <Img
                                    src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                    alt="E-Summit Logo"
                                    width="140"
                                    style={logoStyle}
                                />
                            </div>
                        </div>

                        <Text style={heroTitle}>Event Reminder</Text>
                        <Text style={heroSubtitle}>Your upcoming event notification</Text>
                    </Section>

                    {/* ════ GLASSMORPHIC GREETING CARD ════ */}
                    <Section style={cardSection}>
                        <div style={cardContent}>
                            <Text style={greetingText}>Greetings,</Text>
                            <Text style={introText}>
                                Hello <strong>{userName}</strong>! The Entrepreneurship Cell of IIITDM Kancheepuram is thrilled to invite you to <strong>E-Summit '26</strong>, our flagship entrepreneurship conclave.
                            </Text>

                            {/* Priority Badge */}
                            <div style={priorityContainer}>
                                <div style={priorityBadgeHigh}>
                                    <span style={priorityDot} />
                                    <span style={priorityText}>High Priority</span>
                                </div>
                            </div>

                            <Text style={highlightText}>
                                Compete for a massive prize pool of <span style={highlightSpan}>{eventDetails.prizePool}</span> in a high-stakes environment.
                            </Text>

                            {/* Neon Glow CTA Button */}
                            <Link href={`${eventDetails.websiteUrl}/dashboard`} style={ctaButton}>
                                <span style={buttonInner}>Download Your Pass</span>
                            </Link>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Link href={eventDetails.websiteUrl} style={secondaryLink}>
                                    Official Website
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ════ ENHANCED EVENT DETAILS with Glassmorphism ════ */}
                    <Section style={statsSection}>
                        <div style={sectionHeader}>
                            <Text style={sectionTitle}>Event Details</Text>
                            <div style={sectionUnderline} />
                        </div>

                        <div style={detailsGrid}>
                            <div style={detailCard}>
                                <div style={detailIcon}>🗓️</div>
                                <Text style={statLabel}>When</Text>
                                <Text style={statValue}>{eventDetails.dates}</Text>
                            </div>

                            <div style={detailCard}>
                                <div style={detailIcon}>📍</div>
                                <Text style={statLabel}>Mode</Text>
                                <Text style={statValue}>In-person</Text>
                            </div>

                            <div style={detailCard}>
                                <div style={detailIcon}>💰</div>
                                <Text style={statLabel}>Prize Pool</Text>
                                <Text style={statValue}>{eventDetails.prizePool}</Text>
                            </div>

                            <div style={detailCard}>
                                <div style={detailIcon}>🏛️</div>
                                <Text style={statLabel}>Venue</Text>
                                <Text style={statValue}>IIITDM Kancheepuram</Text>
                            </div>
                        </div>
                    </Section>

                    {/* ════ SMART SUGGESTIONS CHIPS ════ */}
                    <Section style={suggestionsSection}>
                        <div style={sectionHeader}>
                            <Text style={sectionTitle}>Quick Actions</Text>
                        </div>

                        <div style={chipsContainer}>
                            <Link href={`${eventDetails.websiteUrl}/events`} style={chip}>
                                ⚡ View Events
                            </Link>
                            <Link href={`${eventDetails.websiteUrl}/schedule`} style={chip}>
                                🕐 Schedule
                            </Link>
                            <Link href={`${eventDetails.websiteUrl}/speakers`} style={chip}>
                                🎤 Speakers
                            </Link>
                            <Link href={`${eventDetails.websiteUrl}/register`} style={chip}>
                                🎯 Register
                            </Link>
                        </div>
                    </Section>

                    {/* ════ FEATURED EVENTS with Enhanced Cards ════ */}
                    {events.length > 0 && (
                        <Section style={eventsSection}>
                            <div style={sectionHeader}>
                                <Text style={sectionTitle}>Featured Events</Text>
                                <div style={sectionUnderline} />
                            </div>

                            {events.map((event, i) => (
                                <div key={i} style={eventCard}>
                                    <div style={eventCardGlow} />
                                    <div style={eventLeft}>
                                        <Text style={eventName}>{event.name}</Text>
                                        <Text style={eventDate}>🕐 {event.date}</Text>
                                    </div>
                                    <div style={eventRight}>
                                        <div style={prizeBadge}>
                                            <Text style={eventPrize}>{event.prize}</Text>
                                            <Text style={eventPrizeLabel}>Prize</Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Section>
                    )}

                    {/* ════ SPEAKERS with Frosted Cards ════ */}
                    {speakers.length > 0 && (
                        <Section style={speakersSection}>
                            <div style={sectionHeader}>
                                <Text style={sectionTitle}>Speakers</Text>
                                <div style={sectionUnderline} />
                            </div>

                            <div style={speakersGrid}>
                                {speakers.map((speaker, i) => (
                                    <div key={i} style={speakerCard}>
                                        <div style={speakerImageWrapper}>
                                            <Img
                                                src={speaker.image}
                                                alt={speaker.name}
                                                style={speakerImage}
                                            />
                                            <div style={speakerImageGlow} />
                                        </div>
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

                    {/* ════ ENHANCED FOOTER ════ */}
                    <Section style={footer}>
                        <div style={footerGlow} />
                        <Img
                            src="https://esummit26-iiitdm.vercel.app/ecell.png"
                            width="60"
                            style={{ margin: '0 auto 20px', opacity: 0.9 }}
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
// ENHANCED STYLES - Cyber-Corporate with Glassmorphism & Neon
// ════════════════════════════════════════════════════════════════

const main: React.CSSProperties = {
    backgroundColor: '#0a0118', // Pitch black with purple tint
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight: '100%',
    position: 'relative',
};

// Aura Glow Effects
const auraTopLeft: React.CSSProperties = {
    position: 'absolute',
    top: '-100px',
    left: '-100px',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
    filter: 'blur(60px)',
    zIndex: 0,
    pointerEvents: 'none',
};

const auraBottomRight: React.CSSProperties = {
    position: 'absolute',
    bottom: '-100px',
    right: '-100px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 70%)',
    filter: 'blur(80px)',
    zIndex: 0,
    pointerEvents: 'none',
};

const backgroundPattern: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 30%),
        radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 30%),
        radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.04) 0%, transparent 40%)
    `,
    zIndex: 0,
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 0',
    position: 'relative',
    zIndex: 1,
};

// Enhanced Hero Section with 3D Icon
const heroSection: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '20px',
};

const iconContainer: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '20px',
};

const iconGlow: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '180px',
    height: '180px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
    filter: 'blur(30px)',
    zIndex: 0,
};

const iconWrapper: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.1))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '50%',
    padding: '30px',
    display: 'inline-block',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
};

const logoStyle: React.CSSProperties = {
    display: 'block',
    filter: 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.6))',
};

const heroTitle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))',
};

const heroSubtitle: React.CSSProperties = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    letterSpacing: '1px',
    textTransform: 'uppercase',
};

// Enhanced Glassmorphic Card
const cardSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const cardContent: React.CSSProperties = {
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(168, 85, 247, 0.08))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    borderRadius: '24px',
    padding: '36px 28px',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
};

const greetingText: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#ffffff',
    letterSpacing: '0.5px',
};

const introText: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: '24px',
    fontWeight: '400',
};

// Priority Badge (High Priority)
const priorityContainer: React.CSSProperties = {
    display: 'inline-block',
    marginBottom: '20px',
};

const priorityBadgeHigh: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(236, 72, 153, 0.15)',
    border: '1px solid rgba(236, 72, 153, 0.5)',
    borderRadius: '50px',
    boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)',
};

const priorityDot: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ec4899',
    boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)',
    animation: 'pulse 2s infinite',
};

const priorityText: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#ec4899',
    textTransform: 'uppercase',
    letterSpacing: '1px',
};

const highlightText: React.CSSProperties = {
    fontSize: '15px',
    textAlign: 'center',
    marginBottom: '28px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
};

const highlightSpan: React.CSSProperties = {
    color: '#fbbf24',
    fontWeight: '800',
    textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
};

// Neon Glow CTA Button
const ctaButton: React.CSSProperties = {
    display: 'block',
    background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)',
    color: '#ffffff',
    padding: '18px 36px',
    borderRadius: '50px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '16px',
    textDecoration: 'none',
    boxShadow: '0 0 30px rgba(168, 85, 247, 0.6), 0 4px 15px rgba(168, 85, 247, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
};

const buttonInner: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
};

const secondaryLink: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 28px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
    letterSpacing: '0.5px',
};

// Section Headers with Neon Underline
const sectionHeader: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
    position: 'relative',
};

const sectionTitle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '26px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #a855f7, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    marginBottom: '12px',
};

const sectionUnderline: React.CSSProperties = {
    width: '60px',
    height: '3px',
    background: 'linear-gradient(90deg, #a855f7, #d946ef)',
    margin: '0 auto',
    borderRadius: '2px',
    boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)',
};

// Enhanced Stats Section with Detail Cards
const statsSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const detailsGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
};

const detailCard: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.05))',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    borderRadius: '20px',
    padding: '24px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.15)',
};

const detailIcon: React.CSSProperties = {
    fontSize: '32px',
    marginBottom: '12px',
    filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))',
};

const statLabel: React.CSSProperties = {
    fontSize: '11px',
    color: 'rgba(168, 85, 247, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '8px',
    fontWeight: '700',
};

const statValue: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.5px',
};

// Smart Suggestions Chips
const suggestionsSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const chipsContainer: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
};

const chip: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 20px',
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#d4c5f9',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
    letterSpacing: '0.5px',
};

// Enhanced Events Section
const eventsSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const eventCard: React.CSSProperties = {
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.05))',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '20px',
    padding: '24px 20px',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)',
    overflow: 'hidden',
};

const eventCardGlow: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
};

const eventLeft: React.CSSProperties = {
    marginBottom: '12px',
};

const eventRight: React.CSSProperties = {
    textAlign: 'right',
};

const eventName: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 8px 0',
    letterSpacing: '0.5px',
};

const eventDate: React.CSSProperties = {
    fontSize: '13px',
    color: 'rgba(168, 85, 247, 0.9)',
    margin: 0,
    fontWeight: '600',
};

const prizeBadge: React.CSSProperties = {
    display: 'inline-block',
    background: 'rgba(251, 191, 36, 0.15)',
    border: '1px solid rgba(251, 191, 36, 0.5)',
    borderRadius: '12px',
    padding: '8px 16px',
    boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
};

const eventPrize: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '800',
    color: '#fbbf24',
    margin: '0 0 2px 0',
    textShadow: '0 0 15px rgba(251, 191, 36, 0.5)',
};

const eventPrizeLabel: React.CSSProperties = {
    fontSize: '10px',
    color: 'rgba(251, 191, 36, 0.7)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '1px',
};

// Enhanced Speakers Section
const speakersSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const speakersGrid: React.CSSProperties = {
    textAlign: 'center',
};

const speakerCard: React.CSSProperties = {
    display: 'inline-block',
    width: '45%',
    verticalAlign: 'top',
    margin: '2%',
    padding: '20px 16px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.05))',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.15)',
};

const speakerImageWrapper: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px',
};

const speakerImage: React.CSSProperties = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '3px solid rgba(168, 85, 247, 0.6)',
    objectFit: 'cover',
    boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
};

const speakerImageGlow: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '110px',
    height: '110px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
    filter: 'blur(15px)',
    zIndex: -1,
};

const speakerName: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 6px 0',
    letterSpacing: '0.5px',
};

const speakerTitle: React.CSSProperties = {
    fontSize: '12px',
    color: 'rgba(168, 85, 247, 0.8)',
    lineHeight: '1.5',
    fontWeight: '500',
};

// Sponsors Section
const sponsorsSection: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
    borderRadius: '24px',
    padding: '32px 24px',
    margin: '0 20px 40px',
    textAlign: 'center',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
};

const logoGrid: React.CSSProperties = {
    textAlign: 'center',
};

const sponsorWrapper: React.CSSProperties = {
    display: 'inline-block',
    margin: '12px 18px',
    verticalAlign: 'middle',
};

const sponsorLogo: React.CSSProperties = {
    height: '28px',
    width: 'auto',
    opacity: 0.75,
    filter: 'grayscale(100%)',
};

// Enhanced Footer
const footer: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px 20px 48px',
    borderTop: '1px solid rgba(168, 85, 247, 0.2)',
    position: 'relative',
};

const footerGlow: React.CSSProperties = {
    position: 'absolute',
    top: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
    filter: 'blur(40px)',
    zIndex: 0,
};

const socialLinks: React.CSSProperties = {
    marginBottom: '24px',
    position: 'relative',
    zIndex: 1,
};

const socialIcon: React.CSSProperties = {
    display: 'inline-block',
    margin: '0 12px',
    padding: '12px',
    background: 'rgba(168, 85, 247, 0.1)',
    borderRadius: '50%',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
};

const iconFilter: React.CSSProperties = {
    filter: 'brightness(0) invert(1)',
    opacity: 0.8,
};

const footerText: React.CSSProperties = {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: '0 0 6px 0',
    fontWeight: '600',
    letterSpacing: '0.5px',
};

const footerSubtext: React.CSSProperties = {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.3)',
    margin: 0,
    fontWeight: '500',
};