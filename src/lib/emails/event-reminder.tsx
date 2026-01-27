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
import {
    Rocket,
    Lightbulb,
    Handshake,
    GraphArrow,
    Trophy,
    Gear,
    SpeechBubble,
    Calendar,
    Sparkle,
    Checkmark,
    LocationPin
} from './components/doodles';

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
        date?: string;
        prize?: string;
        type?: string; // 'High Priority', 'Medium Priority', 'Low Priority' logic can be derived or passed
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
    userName = 'Innovator',
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
}: EventReminderEmailProps) => {
    const previewText = `${subject} - ${eventDetails.name}`;

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
                    .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232, 122, 79, 0.45) !important; }
                    .chip:hover { background-color: rgba(212,165,116,0.15) !important; border-color: #D4A574 !important; }
                    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212, 165, 116, 0.15) !important; }
                `}</style>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>

                    {/* ════ BACKGROUND PATTERN LAYER (Simulated with absolute positioned elements if possible, but email support is tricky. 
                        Instead, we place them in relative containers where possible or keep it simpler for email clients) 
                        For this implementation, we will place doodles as decorative elements within flow to ensure compatibility.
                    ════ */}

                    {/* ════ HEADER ════ */}
                    <Section style={header}>
                        <div style={{ position: 'relative' }}>
                            {/* Corner Doodles - Rocket Cluster (Absolute positioning is risky in email, using distinct row/col or background image is better. 
                                We will use a Row with 2 columns to place the logo left and doodles right) */}
                            <Row>
                                <Column>
                                    <Img
                                        src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                        alt="E-Summit Logo"
                                        width="80"
                                        style={logo}
                                    />
                                </Column>
                                <Column style={{ textAlign: 'right', verticalAlign: 'top' }}>
                                    {/* Decorative Rockets */}
                                    <div style={{ display: 'inline-block', opacity: 0.15 }}>
                                        <Rocket size={24} color="#C4BCB0" style={{ transform: 'rotate(15deg)', marginRight: '8px' }} />
                                        <Rocket size={18} color="#C4BCB0" style={{ transform: 'rotate(45deg)' }} />
                                    </div>
                                </Column>
                            </Row>
                        </div>

                        <div style={{ marginTop: '24px', position: 'relative' }}>
                            {/* Scattered Lightbulb */}
                            <div style={{ position: 'absolute', top: '-10px', left: '180px', opacity: 0.1 }}>
                                <Lightbulb size={20} />
                            </div>

                            <Text style={headerTitle}>Event Reminder</Text>
                            <Text style={headerSubtitle}>Your Upcoming Entrepreneurship Event</Text>
                        </div>
                    </Section>

                    {/* ════ GREETING CARD ════ */}
                    <Section style={{ padding: '0 20px 32px' }}>
                        <div style={greetingCard}>
                            {/* Card Decoration */}
                            <div style={{ textAlign: 'right', marginBottom: '-20px', opacity: 0.2 }}>
                                <Lightbulb size={24} color="#D4A574" />
                            </div>

                            <Text style={greetingTitle}>Greetings,</Text>
                            <Text style={greetingBody}>
                                Hello <strong>{userName === 'Test User' ? 'Fellow Innovator' : userName}</strong>! The Entrepreneurship Cell of IIITDM Kancheepuram is thrilled to invite you to <strong>{eventDetails.name}</strong>.
                            </Text>
                            <Text style={greetingBody}>
                                Welcome to South India's Premier Entrepreneurship Conclave. Get ready for <strong>30+ hours</strong> of non-stop innovation, high-stakes competitions, and networking with industry titans.
                            </Text>

                            {/* Stats Grid */}
                            <Row style={{ marginTop: '24px', marginBottom: '24px' }}>
                                {[
                                    { label: 'WHEN', value: 'Jan 30 - Feb 1', icon: <Calendar size={16} color="#D4A574" /> },
                                    { label: 'VENUE', value: 'IIITDM Campus', icon: <LocationPin size={16} color="#D4A574" /> },
                                    { label: 'PRIZE POOL', value: eventDetails.prizePool, icon: <Trophy size={16} color="#D4A574" /> },
                                    { label: 'MODE', value: 'Offline', icon: <Rocket size={16} color="#D4A574" /> }
                                ].map((item, i) => (
                                    <Column key={i} style={{ width: '25%', padding: '0 4px' }}>
                                        <div style={miniDetailCard}>
                                            <div style={{ marginBottom: '8px' }}>{item.icon}</div>
                                            <Text style={miniDetailLabel}>{item.label}</Text>
                                            <Text style={miniDetailValue}>{item.value}</Text>
                                        </div>
                                    </Column>
                                ))}
                            </Row>

                            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                <Link href="https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947" style={primaryButton}>
                                    <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>🚀</span>
                                    <span style={{ verticalAlign: 'middle' }}>Get Your Pass</span>
                                </Link>
                                <div style={{ height: '12px' }}></div>
                                <Link href={eventDetails.websiteUrl} style={secondaryButton}>
                                    Visit Website
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ════ SMART SUGGESTIONS ════ */}
                    <Section style={{ padding: '0 32px 24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            {['View Events', 'Schedule', 'Speakers', 'Register'].map((label, i) => (
                                <Link key={i} href={`${eventDetails.websiteUrl}/#${label.toLowerCase().replace(' ', '-')}`} style={suggestionChip}>
                                    <span style={{ marginRight: '6px', opacity: 0.8 }}><Sparkle size={10} color="#D4A574" /></span>
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </Section>

                    {/* ════ FEATURED EVENTS ════ */}
                    {events.length > 0 && (
                        <Section style={section}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                                <Text style={sectionTitle}>Featured Events</Text>
                                <div style={{ marginLeft: 'auto', opacity: 0.15 }}><GraphArrow size={24} /></div>
                            </div>

                            {events.slice(0, 3).map((event, i) => (
                                <div key={i} style={eventCard}>
                                    <Row>
                                        <Column style={{ paddingLeft: '8px' }}>
                                            <Text style={eventCardTitle}>{event.name}</Text>
                                            <Text style={eventCardDate}>{event.date || 'Jan 30, 2026'}</Text>
                                        </Column>
                                        <Column style={{ textAlign: 'right' }}>
                                            {event.prize && (
                                                <div style={prizeBadge}>
                                                    <span style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}>🏆</span>
                                                    {event.prize}
                                                </div>
                                            )}
                                        </Column>
                                    </Row>
                                    {/* Accent Doodle */}
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', opacity: 0.05 }}>
                                        <TargetIcon size={30} color="#E87A4F" />
                                    </div>
                                </div>
                            ))}
                        </Section>
                    )}

                    {/* ════ SPEAKERS ════ */}
                    {speakers.length > 0 && (
                        <Section style={section}>
                            <div style={{ marginBottom: '24px', position: 'relative' }}>
                                <Text style={sectionTitle}>Speakers</Text>
                                <div style={{ position: 'absolute', top: '-10px', left: '100px', opacity: 0.1 }}>
                                    <SpeechBubble size={20} />
                                </div>
                            </div>

                            <Row>
                                {speakers.slice(0, 3).map((speaker, i) => (
                                    <Column key={i} style={{ width: '33.33%', padding: '0 4px', verticalAlign: 'top' }}>
                                        <div style={speakerCard}>
                                            <div style={speakerImageContainer}>
                                                <Img src={speaker.image} style={speakerImage} />
                                                <div style={{ position: 'absolute', top: '0', right: '-10px', zIndex: -1, opacity: 0.1 }}>
                                                    <SpeechBubble size={40} color="#D4A574" />
                                                </div>
                                            </div>
                                            <Text style={speakerName}>{speaker.name}</Text>
                                            <Text style={speakerTitle}>{speaker.title}</Text>
                                        </div>
                                    </Column>
                                ))}
                            </Row>
                        </Section>
                    )}

                    {/* ════ FOOTER ════ */}
                    <Section style={footer}>
                        <div style={{ marginBottom: '24px', opacity: 0.1, textAlign: 'center' }}>
                            <Handshake size={32} color="#D4A574" style={{ margin: '0 12px' }} />
                            <Handshake size={32} color="#D4A574" style={{ margin: '0 12px' }} />
                        </div>

                        <div style={divider} />

                        <Text style={footerLinks}>
                            <Link href={`${eventDetails.websiteUrl}/#schedule`} style={link}>Schedule</Link> •
                            <Link href={`${eventDetails.websiteUrl}/#events`} style={link}> Events</Link> •
                            <Link href="https://instagram.com/ecell_iiitdm" style={link}> Instagram</Link>
                        </Text>

                        <Text style={footerAddress}>
                            IIITDM Kancheepuram, Vandalur-Kelambakkam Road, Chennai - 600127
                        </Text>
                        <Text style={footerLegal}>
                            © 2026 Entrepreneurship Cell. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Helper for Target Icon since it wasn't in original doodle list but requested in spec
const TargetIcon = ({ size = 20, color = "#C4BCB0", style }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
);

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// STYLES - Premium Cream & Grey Aesthetic
// ════════════════════════════════════════════════════════════════

const colors = {
    creamBase: '#FFF9F0',
    creamCard: '#FFFBF5',
    white: '#FFFFFF',
    textPrimary: '#3D3935',
    textSecondary: '#9E9589',
    gold: '#D4A574',
    burntOrange: '#E87A4F',
    sageGreen: '#9BB89F',
    dustyRose: '#D9A5A0',
    border: '#E8E3DC',
    shadow: 'rgba(212, 165, 116, 0.15)',
};

const main: React.CSSProperties = {
    backgroundColor: colors.creamBase,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: colors.textPrimary,
    padding: '40px 0',
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: colors.creamBase,
    background: `url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="%23E8E3DC" fill-opacity="0.4"/></svg>')`, // Subtle dot pattern
};

const header: React.CSSProperties = {
    padding: '32px 32px 16px',
};

const logo: React.CSSProperties = {
    display: 'block',
    filter: 'drop-shadow(0 4px 6px rgba(212,165,116,0.25))',
};

const headerTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: '800',
    color: colors.textPrimary,
    margin: '16px 0 8px',
    lineHeight: '1.2',
};

const headerSubtitle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0',
};

const greetingCard: React.CSSProperties = {
    backgroundColor: colors.creamCard,
    border: `2px solid ${colors.gold}`, // Fallback
    borderImage: `linear-gradient(to bottom right, ${colors.gold}, ${colors.border}) 1`, // Advanced
    borderRadius: '20px',
    padding: '32px',
    boxShadow: `0 8px 30px ${colors.shadow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
};

const greetingTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    color: colors.textPrimary,
};

const greetingBody: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.7',
    color: colors.textPrimary,
    marginBottom: '16px',
};

const miniDetailCard: React.CSSProperties = {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '12px 8px',
    textAlign: 'center',
    height: '100%',
};

const miniDetailLabel: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '700',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
};

const miniDetailValue: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: '1.2',
};

const primaryButton: React.CSSProperties = {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${colors.burntOrange} 0%, ${colors.gold} 100%)`,
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '16px 40px',
    borderRadius: '50px',
    textDecoration: 'none',
    boxShadow: `0 6px 20px rgba(232, 122, 79, 0.35)`,
};

const secondaryButton: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: 'transparent',
    border: `2px solid ${colors.gold}`,
    color: colors.gold,
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px 28px',
    borderRadius: '50px',
    textDecoration: 'none',
};

const suggestionChip: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.white,
    border: `1.5px solid ${colors.border}`,
    color: colors.textPrimary,
    fontSize: '12px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '50px',
    margin: '0 6px 8px',
    textDecoration: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
};

const section: React.CSSProperties = {
    padding: '24px 32px',
};

const sectionTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: '16px',
};

const eventCard: React.CSSProperties = {
    backgroundColor: colors.white,
    background: `linear-gradient(to right, ${colors.white}, ${colors.creamBase})`,
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid ${colors.gold}`,
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    position: 'relative',
    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
};

const eventCardTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '700',
    color: colors.textPrimary,
    margin: '0 0 4px',
};

const eventCardDate: React.CSSProperties = {
    fontSize: '12px',
    color: colors.textSecondary,
    margin: '0',
};

const prizeBadge: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.gold,
    color: colors.white,
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    boxShadow: `0 2px 8px rgba(212,165,116,0.4)`,
};

const speakerCard: React.CSSProperties = {
    backgroundColor: colors.creamCard,
    border: `1px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '20px 10px',
    textAlign: 'center',
    boxShadow: `0 3px 12px ${colors.shadow}`,
};

const speakerImageContainer: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '12px',
};

const speakerImage: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `3px solid ${colors.gold}`,
};

const speakerName: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '700',
    color: colors.textPrimary,
    margin: '0 0 4px',
};

const speakerTitle: React.CSSProperties = {
    fontSize: '11px',
    color: colors.textSecondary,
    lineHeight: '1.4',
    margin: '0',
};

const footer: React.CSSProperties = {
    backgroundColor: `linear-gradient(to bottom, ${colors.creamBase}, #F5EFE6)`,
    padding: '32px',
    marginTop: '32px',
    borderTop: `1px solid ${colors.border}`,
    textAlign: 'center',
};

const divider: React.CSSProperties = {
    height: '1px',
    backgroundColor: colors.border,
    margin: '24px auto',
    width: '100px',
};

const footerLinks: React.CSSProperties = {
    marginBottom: '16px',
};

const link: React.CSSProperties = {
    color: colors.textSecondary,
    fontSize: '12px',
    textDecoration: 'none',
    margin: '0 6px',
};

const footerAddress: React.CSSProperties = {
    fontSize: '11px',
    color: '#C4BCB0',
    marginBottom: '8px',
};

const footerLegal: React.CSSProperties = {
    fontSize: '11px',
    color: colors.textSecondary,
};