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
                    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
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

                        <Text style={heroTitle}>E-SUMMIT '26</Text>
                        <Text style={heroSubtitle}>THE FUTURE IS HERE</Text>
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
                                    <span style={priorityText}>Official Update</span>
                                </div>
                            </div>

                            <Text style={highlightText}>
                                Compete for a massive prize pool of <span style={highlightSpan}>{eventDetails.prizePool}</span> in a high-stakes environment.
                            </Text>

                            {/* Neon Glow CTA Button */}
                            <Link href={`${eventDetails.websiteUrl}/dashboard`} style={ctaButton}>
                                <span style={buttonInner}>Download Your Pass ➞</span>
                            </Link>

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Link href={eventDetails.websiteUrl} style={secondaryLink}>
                                    Visit Official Website
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
                                <Text style={sectionTitle}>Keynote Speakers</Text>
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
                        <Text style={footerSubtextUnsubscribe}>
                            You received this email because you registered for E-Summit '26.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// ENHANCED STYLES - Premium Dark Aesthetics
// ════════════════════════════════════════════════════════════════

const main: React.CSSProperties = {
    backgroundColor: '#050505', // Deep black
    fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight: '100%',
    position: 'relative',
};

// Aura Glow Effects
const auraTopLeft: React.CSSProperties = {
    position: 'absolute',
    top: '-100px',
    left: '-100px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
    filter: 'blur(80px)',
    zIndex: 0,
    pointerEvents: 'none',
};

const auraBottomRight: React.CSSProperties = {
    position: 'absolute',
    bottom: '-100px',
    right: '-100px',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
    filter: 'blur(100px)',
    zIndex: 0,
    pointerEvents: 'none',
};

const backgroundPattern: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    zIndex: 0,
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 0',
    position: 'relative',
    zIndex: 1,
};

// Enhanced Hero Section
const heroSection: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '48px',
    padding: '20px',
};

const iconContainer: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '24px',
};

const iconGlow: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
    filter: 'blur(40px)',
    zIndex: 0,
};

const iconWrapper: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    padding: '30px',
    display: 'inline-block',
};

const logoStyle: React.CSSProperties = {
    display: 'block',
    filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
};

const heroTitle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(180deg, #ffffff 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '-2px',
    lineHeight: '1',
};

const heroSubtitle: React.CSSProperties = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: '4px',
    textTransform: 'uppercase',
};

// Enhanced Glassmorphic Card
const cardSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const cardContent: React.CSSProperties = {
    position: 'relative',
    background: 'rgba(20, 20, 20, 0.6)',
    backdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '32px',
    padding: '40px 32px',
    color: '#ffffff',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
};

const greetingText: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#ffffff',
    letterSpacing: '-0.5px',
};

const introText: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#a1a1aa',
    marginBottom: '32px',
    fontWeight: '400',
};

// Priority Badge
const priorityContainer: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
};

const priorityBadgeHigh: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(168, 85, 247, 0.1)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '100px',
};

const priorityDot: React.CSSProperties = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#a855f7',
    boxShadow: '0 0 10px #a855f7',
};

const priorityText: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '700',
    color: '#a855f7',
    textTransform: 'uppercase',
    letterSpacing: '1px',
};

const highlightText: React.CSSProperties = {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '32px',
    color: '#ffffff',
    lineHeight: '1.6',
    fontWeight: '500',
};

const highlightSpan: React.CSSProperties = {
    color: '#fbbf24',
    textShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
};

// CTA Button
const ctaButton: React.CSSProperties = {
    display: 'block',
    background: '#ffffff',
    color: '#000000',
    padding: '20px 40px',
    borderRadius: '100px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '16px',
    textDecoration: 'none',
    boxShadow: '0 10px 30px rgba(255, 255, 255, 0.15)',
    border: '1px solid #ffffff',
};

const buttonInner: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
};

const secondaryLink: React.CSSProperties = {
    display: 'inline-block',
    color: '#a1a1aa',
    fontSize: '14px',
    textDecoration: 'underline',
    textDecorationColor: '#52525b',
    textUnderlineOffset: '4px',
};

// Section Headers
const sectionHeader: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
    position: 'relative',
};

const sectionTitle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-1px',
    marginBottom: '12px',
};

const sectionUnderline: React.CSSProperties = {
    width: '40px',
    height: '4px',
    background: '#a855f7',
    margin: '0 auto',
    borderRadius: '2px',
};

// Details Grid
const statsSection: React.CSSProperties = {
    padding: '0 10px',
    marginBottom: '40px',
};

const detailsGrid: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
};

const detailCard: React.CSSProperties = {
    flex: '1 1 40%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '24px 20px',
    textAlign: 'center',
};

const detailIcon: React.CSSProperties = {
    fontSize: '24px',
    marginBottom: '12px',
};

const statLabel: React.CSSProperties = {
    fontSize: '10px',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '4px',
    fontWeight: '700',
};

const statValue: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
};

// Chips
const suggestionsSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const chipsContainer: React.CSSProperties = {
    textAlign: 'center',
};

const chip: React.CSSProperties = {
    display: 'inline-block',
    margin: '6px',
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    textDecoration: 'none',
};

// Events List
const eventsSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const eventCard: React.CSSProperties = {
    position: 'relative',
    background: 'rgba(20, 20, 20, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '16px',
    overflow: 'hidden',
};

const eventCardGlow: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03))',
    pointerEvents: 'none',
};

const eventLeft: React.CSSProperties = {
    marginBottom: '16px',
};

const eventRight: React.CSSProperties = {
    textAlign: 'left',
};

const eventName: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 8px 0',
};

const eventDate: React.CSSProperties = {
    fontSize: '13px',
    color: '#a1a1aa',
    margin: 0,
    fontWeight: '500',
};

const prizeBadge: React.CSSProperties = {
    display: 'inline-block',
};

const eventPrize: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fbbf24',
    margin: '0',
    display: 'inline-block',
    marginRight: '8px',
};

const eventPrizeLabel: React.CSSProperties = {
    fontSize: '11px',
    color: '#71717a',
    textTransform: 'uppercase',
    fontWeight: '700',
};

// Speakers
const speakersSection: React.CSSProperties = {
    padding: '0 20px',
    marginBottom: '40px',
};

const speakersGrid: React.CSSProperties = {
    textAlign: 'center',
};

const speakerCard: React.CSSProperties = {
    display: 'inline-block',
    width: '140px',
    verticalAlign: 'top',
    margin: '10px',
    padding: '20px 10px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
};

const speakerImageWrapper: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px',
};

const speakerImage: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255, 255, 255, 0.1)',
};

const speakerImageGlow: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '1px solid rgba(168, 85, 247, 0.5)',
    opacity: 0.5,
};

const speakerName: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 4px 0',
    lineHeight: '1.2',
};

const speakerTitle: React.CSSProperties = {
    fontSize: '10px',
    color: '#a1a1aa',
    lineHeight: '1.4',
};

// Sponsors
const sponsorsSection: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '32px 24px',
    margin: '0 20px 60px',
    textAlign: 'center',
};

const logoGrid: React.CSSProperties = {
    textAlign: 'center',
};

const sponsorWrapper: React.CSSProperties = {
    display: 'inline-block',
    margin: '12px 20px',
    verticalAlign: 'middle',
};

const sponsorLogo: React.CSSProperties = {
    height: '24px',
    width: 'auto',
    opacity: 0.6,
    filter: 'grayscale(100%)',
};

// Footer
const footer: React.CSSProperties = {
    position: 'relative',
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#000000',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
};

const footerGlow: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
    boxShadow: '0 0 20px #a855f7',
};

const socialLinks: React.CSSProperties = {
    marginBottom: '24px',
};

const socialIcon: React.CSSProperties = {
    display: 'inline-block',
    margin: '0 12px',
    opacity: 0.6,
};

const iconFilter: React.CSSProperties = {
    filter: 'invert(1)',
};

const footerText: React.CSSProperties = {
    fontSize: '12px',
    color: '#52525b',
    margin: '0 0 8px 0',
    fontWeight: '500',
};

const footerSubtext: React.CSSProperties = {
    fontSize: '12px',
    color: '#3f3f46',
    margin: 0,
};

const footerSubtextUnsubscribe: React.CSSProperties = {
    fontSize: '10px',
    color: '#27272a',
    marginTop: '20px',
};