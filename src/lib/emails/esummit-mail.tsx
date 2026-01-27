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

// ════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════

interface EventDetails {
    name?: string;
    dates?: string;
    venue?: string;
    prizePool?: string;
    websiteUrl?: string;
    tagline?: string;
    registrationUrl?: string;
    mode?: string;
}

interface EventItem {
    name: string;
    date?: string;
    time?: string;
    prize?: string;
    breakdown?: string;
    category?: 'Flagship' | 'Formal' | 'Informal' | 'Workshop';
    description?: string;
}

interface Speaker {
    name: string;
    title: string;
    image?: string;
    company?: string;
}

interface Sponsor {
    name: string;
    logo: string;
    tier?: 'title' | 'platinum' | 'gold' | 'silver' | 'community';
}

interface ESummitMailProps {
    userName?: string;
    subject?: string;
    message?: string;
    eventDetails?: EventDetails;
    events?: EventItem[];
    speakers?: Speaker[];
    sponsors?: Sponsor[];
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

export const ESummitMail = ({
    userName = 'Fellow Innovator',
    subject,
    message,
    eventDetails = DEFAULT_EVENT_DETAILS,
    events = DEFAULT_EVENTS,
    speakers = DEFAULT_SPEAKERS,
    sponsors = DEFAULT_SPONSORS,
}: ESummitMailProps) => {
    const previewText = subject || `Your Complete Guide to ${eventDetails.name} | ${eventDetails.dates} | Win from ${eventDetails.prizePool}`;

    return (
        <Html>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>{eventDetails.name} - Official Event Guide</title>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* HERO HEADER - HIGH IMPACT                                   */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.heroSection}>
                        <div style={styles.heroCard}>
                            {/* Top Bar: E-Summit Logo (Left) | E-Cell Logo (Right) */}
                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%', marginBottom: '16px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'left', width: '50%', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'inline-block', backgroundColor: '#1E293B', borderRadius: '10px', padding: '8px' }}>
                                                <Img
                                                    src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                                    alt="E-Summit '26"
                                                    width="120"
                                                    height="40"
                                                    style={{ display: 'block' }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right', width: '50%', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'inline-block', backgroundColor: '#1E293B', borderRadius: '10px', padding: '8px', marginLeft: 'auto' }}>
                                                <Img
                                                    src="https://esummit26-iiitdm.vercel.app/ecell.png"
                                                    alt="E-Cell IIITDM"
                                                    width="40"
                                                    height="40"
                                                    style={{ display: 'block' }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Date Badge */}
                            <div style={styles.heroBadge}>{eventDetails.dates} · {eventDetails.venue}</div>

                            {/* Event Name */}
                            <Text style={styles.heroTitle}>{eventDetails.name}</Text>
                            
                            {/* Tagline */}
                            <Text style={styles.heroTagline}>{eventDetails.tagline}</Text>

                            {/* Value Props */}
                            <div style={styles.heroPills}>
                                <span style={styles.heroPill}>₹2,00,000+ prize pool</span>
                                <span style={styles.heroPill}>10+ headline competitions</span>
                                <span style={styles.heroPill}>500+ founders & builders</span>
                            </div>

                            {/* CTAs */}
                            <div style={styles.heroCtas}>
                                <Link href={eventDetails.registrationUrl} style={styles.primaryHeroCta}>
                                    Get Your Pass
                                </Link>
                                <Link href={eventDetails.websiteUrl} style={styles.ghostHeroCta}>
                                    See Full Lineup →
                                </Link>
                            </div>

                            {/* Proof Row */}
                            <div style={styles.heroProofRow}>
                                <div style={styles.heroProofItem}>
                                    <span style={styles.heroProofIcon}>🚀</span>
                                    <span style={styles.heroProofText}>VC eyes on top ideas</span>
                                </div>
                                <div style={styles.heroProofItem}>
                                    <span style={styles.heroProofIcon}>🎤</span>
                                    <span style={styles.heroProofText}>Keynotes from ISRO, YC founders</span>
                                </div>
                                <div style={styles.heroProofItem}>
                                    <span style={styles.heroProofIcon}>🤝</span>
                                    <span style={styles.heroProofText}>Career fair & networking night</span>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* GREETING SECTION                                            */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.greetingSection}>
                        {/* Greeting Header */}
                        <Text style={styles.greetingHello}>Hello,</Text>
                        <Text style={styles.greetingName}>{userName}</Text>
                        
                        {/* Divider */}
                        <div style={styles.greetingDivider} />

                        {/* Custom Message */}
                        {message && (
                            <Text style={styles.customMessage}>{message}</Text>
                        )}

                        {/* Main Message */}
                        <Text style={styles.mainMessage}>
                            You’re invited to join us at <strong>{eventDetails.name}</strong> — 
                            South India’s biggest entrepreneurship summit.
                        </Text>

                        {/* Event Quick Info */}
                        <table cellPadding="0" cellSpacing="0" role="presentation" style={styles.quickInfoTable}>
                            <tbody>
                                <tr>
                                    <td style={styles.quickInfoItem}>
                                        <Text style={styles.quickInfoIcon}>📅</Text>
                                        <Text style={styles.quickInfoText}>Jan 30 – Feb 1</Text>
                                    </td>
                                    <td style={styles.quickInfoItem}>
                                        <Text style={styles.quickInfoIcon}>📍</Text>
                                        <Text style={styles.quickInfoText}>IIITDM Chennai</Text>
                                    </td>
                                    <td style={styles.quickInfoItem}>
                                        <Text style={styles.quickInfoIcon}>🏆</Text>
                                        <Text style={styles.quickInfoText}>₹2L+ Prizes</Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* PRIZE POOL SHOWCASE                                          */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <div style={styles.prizeShowcase}>
                            <div style={styles.prizeIcon}>🏆</div>
                            <Text style={styles.prizeLabel}>TOTAL PRIZE POOL</Text>
                            <Text style={styles.prizeValue}>{eventDetails.prizePool}</Text>
                            <Text style={styles.prizeSubtext}>Cash Prizes Across 10+ Competitions</Text>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* KEY INFO CARDS                                               */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <table cellPadding="0" cellSpacing="0" role="presentation" style={styles.infoGrid}>
                            <tbody>
                                <tr>
                                    <td style={styles.infoCell}>
                                        <div style={styles.infoCard}>
                                            <div style={styles.infoIcon}>📅</div>
                                            <Text style={styles.infoLabel}>WHEN</Text>
                                            <Text style={styles.infoValue}>Jan 30 - Feb 1</Text>
                                        </div>
                                    </td>
                                    <td style={styles.infoCell}>
                                        <div style={styles.infoCard}>
                                            <div style={styles.infoIcon}>📍</div>
                                            <Text style={styles.infoLabel}>WHERE</Text>
                                            <Text style={styles.infoValue}>IIITDM Campus</Text>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={styles.infoCell}>
                                        <div style={styles.infoCard}>
                                            <div style={styles.infoIcon}>🎯</div>
                                            <Text style={styles.infoLabel}>MODE</Text>
                                            <Text style={styles.infoValue}>In-Person Only</Text>
                                        </div>
                                    </td>
                                    <td style={styles.infoCell}>
                                        <div style={styles.infoCard}>
                                            <div style={styles.infoIcon}>🎪</div>
                                            <Text style={styles.infoLabel}>EVENTS</Text>
                                            <Text style={styles.infoValue}>10+ Competitions</Text>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* PRIMARY CTA                                                  */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={{ ...styles.section, textAlign: 'center' }}>
                        <Link href={eventDetails.registrationUrl} style={styles.primaryCta}>
                            Download Your Pass
                        </Link>
                        <div style={{ marginTop: '12px' }}>
                            <Link href={eventDetails.websiteUrl} style={styles.secondaryCta}>
                                Explore Website →
                            </Link>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* EVENTS SECTION - UNIFIED CARDS                               */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.eventsSection}>
                        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%', marginBottom: '28px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center' }}>
                                        <Text style={styles.sectionLabel}>COMPETITIONS</Text>
                                        <Text style={styles.sectionTitle}>Featured Events</Text>
                                        <div style={styles.sectionLine} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* All Events - Same Design */}
                        {events.map((event, i) => (
                            <div key={i} style={styles.eventCard}>
                                <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'top', paddingRight: '16px' }}>
                                                <Text style={styles.eventName}>{event.name}</Text>
                                                <Text style={styles.eventDesc}>{event.description}</Text>
                                            </td>
                                            <td style={{ width: '100px', textAlign: 'right', verticalAlign: 'top' }}>
                                                <div style={styles.prizeTag}>
                                                    <Text style={styles.prizeTagAmount}>{event.prize}</Text>
                                                    {event.breakdown && (
                                                        <Text style={styles.prizeBreakdown}>{event.breakdown}</Text>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* SPEAKERS SECTION                                             */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>KEYNOTES</Text>
                            <Text style={styles.sectionTitle}>Meet Our Speakers</Text>
                            <div style={styles.sectionLine} />
                        </div>

                        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    {speakers.slice(0, 3).map((speaker, i) => (
                                        <td key={i} style={styles.speakerCell}>
                                            <div style={styles.speakerCard}>
                                                <Img
                                                    src={speaker.image || 'https://via.placeholder.com/80'}
                                                    alt={speaker.name}
                                                    width="64"
                                                    height="64"
                                                    style={styles.speakerImg}
                                                />
                                                <Text style={styles.speakerName}>{speaker.name}</Text>
                                                <Text style={styles.speakerRole}>{speaker.title}</Text>
                                                <Text style={styles.speakerCompany}>{speaker.company}</Text>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                {speakers.length > 3 && (
                                    <tr>
                                        {speakers.slice(3, 6).map((speaker, i) => (
                                            <td key={i} style={styles.speakerCell}>
                                                <div style={styles.speakerCard}>
                                                    <Img
                                                        src={speaker.image || 'https://via.placeholder.com/80'}
                                                        alt={speaker.name}
                                                        width="64"
                                                        height="64"
                                                        style={styles.speakerImg}
                                                    />
                                                    <Text style={styles.speakerName}>{speaker.name}</Text>
                                                    <Text style={styles.speakerRole}>{speaker.title}</Text>
                                                    <Text style={styles.speakerCompany}>{speaker.company}</Text>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* SPONSORS - COMPACT HORIZONTAL GRID                          */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {sponsors.length > 0 && (
                        <Section style={styles.section}>
                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%', marginBottom: '16px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'center' }}>
                                            <Text style={styles.sectionLabel}>PARTNERS</Text>
                                            <Text style={{ ...styles.sectionTitle, fontSize: '22px', marginBottom: '12px' }}>Our Sponsors</Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table cellPadding="0" cellSpacing="0" role="presentation" style={styles.sponsorGrid}>
                                <tbody>
                                    <tr>
                                        {sponsors.slice(0, 3).map((sponsor, i) => (
                                            <td key={i} style={styles.sponsorCell}>
                                                <Img
                                                    src={sponsor.logo}
                                                    alt={sponsor.name}
                                                    width="80"
                                                    height="32"
                                                    style={styles.sponsorLogo}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        {sponsors.slice(3, 6).map((sponsor, i) => (
                                            <td key={i} style={styles.sponsorCell}>
                                                <Img
                                                    src={sponsor.logo}
                                                    alt={sponsor.name}
                                                    width="80"
                                                    height="32"
                                                    style={styles.sponsorLogo}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </Section>
                    )}

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* FINAL CTA                                                    */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <div style={styles.finalCta}>
                            <Text style={styles.finalCtaTitle}>
                                Don&apos;t Miss Out!
                            </Text>
                            <Text style={styles.finalCtaText}>
                                Join 500+ participants from across India competing for ₹2,00,000+ in prizes.
                            </Text>
                            <Link href={eventDetails.registrationUrl} style={styles.finalCtaButton}>
                                Secure Your Spot Now
                            </Link>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* FOOTER                                                       */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.footer}>
                        {/* Logos Row: E-Cell & IIITDM */}
                        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%', marginBottom: '16px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center' }}>
                                        <Img
                                            src="https://esummit26-iiitdm.vercel.app/ecell.png"
                                            alt="E-Cell IIITDM"
                                            width="48"
                                            style={{ display: 'inline-block', margin: '0 12px', verticalAlign: 'middle' }}
                                        />
                                        <Img
                                            src="https://esummit26-iiitdm.vercel.app/iiitdm.png"
                                            alt="IIITDM Kancheepuram"
                                            width="48"
                                            style={{ display: 'inline-block', margin: '0 12px', verticalAlign: 'middle' }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Text style={styles.footerBrand}>
                            Entrepreneurship Cell
                        </Text>
                        <Text style={styles.footerCollege}>
                            IIITDM Kancheepuram
                        </Text>

                        {/* Social Icons */}
                        <div style={styles.socialRow}>
                            {SOCIAL_LINKS.map((social, i) => (
                                <Link key={i} href={social.url} style={styles.socialLink}>
                                    {social.icon}
                                </Link>
                            ))}
                        </div>

                        <div style={styles.footerDivider} />

                        {/* Contact */}
                        <Text style={styles.footerContact}>
                            📧 ecell@iiitdm.ac.in &nbsp;•&nbsp; 🌐 esummit26-iiitdm.vercel.app
                        </Text>

                        <Text style={styles.footerAddress}>
                            IIITDM Kancheepuram, Chennai - 600127
                        </Text>

                        <div style={styles.footerDivider} />

                        <Text style={styles.footerLegal}>
                            © 2026 E-Summit IIITDM Kancheepuram. All rights reserved.
                        </Text>

                        <Text style={styles.footerLinks}>
                            <Link href="https://esummit26-iiitdm.vercel.app/privacy" style={styles.footerLink}>Privacy Policy</Link>
                            &nbsp;•&nbsp;
                            <Link href="https://esummit26-iiitdm.vercel.app/terms" style={styles.footerLink}>Terms of Service</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ESummitMail;

// ════════════════════════════════════════════════════════════════════════════
// COLOR PALETTE - LIGHT & ELEGANT
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
    // Base - Cool Light
    background: '#FFFFFF',
    surface: '#F6F8FF',
    surfaceAlt: '#EEF2FF',
    cardBg: '#FFFFFF',
    white: '#FFFFFF',

    // Primary - Indigo Glow
    primary: '#4338CA',
    primaryDark: '#312E81',
    primaryLight: '#A5B4FC',
    primarySoft: '#EEF2FF',
    primaryMuted: '#E0E7FF',

    // Secondary - Bright Aqua
    accent: '#0EA5E9',
    accentLight: '#7DD3FC',
    accentSoft: '#E0F2FE',

    // Tertiary - Warm Coral
    coral: '#F97316',
    coralSoft: '#FFEAD5',

    // Gold Highlight
    gold: '#D97706',
    goldLight: '#FDE68A',
    goldSoft: '#FFFBEB',

    // Text - Crisp Ink
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textLight: '#94A3B8',

    // Borders - Cool Grays
    border: '#E2E8F0',
    borderLight: '#EEF2FF',
    borderAccent: 'rgba(67, 56, 202, 0.15)',
};

// ════════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS
// ════════════════════════════════════════════════════════════════════════════

const SOCIAL_LINKS = [
    { icon: '📷', url: 'https://instagram.com/ecell_iiitdm' },
    { icon: '💼', url: 'https://linkedin.com/company/ecelliiitdm' },
    { icon: '🌐', url: 'https://esummit26-iiitdm.vercel.app' },
];

// ════════════════════════════════════════════════════════════════════════════
// DEFAULT DATA - REAL PRIZES
// ════════════════════════════════════════════════════════════════════════════

const DEFAULT_EVENT_DETAILS: EventDetails = {
    name: "E-Summit '26",
    dates: 'January 30 - February 1, 2026',
    venue: 'IIITDM Kancheepuram, Chennai',
    prizePool: '₹2,00,000+',
    websiteUrl: 'https://esummit26-iiitdm.vercel.app',
    registrationUrl: 'https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947',
    tagline: 'Where Innovation Meets Opportunity',
    mode: 'In-Person',
};

const DEFAULT_EVENTS: EventItem[] = [
    { 
        name: 'Pitch Perfect', 
        prize: '₹30,000', 
        breakdown: '₹15K + ₹10K + ₹5K',
        category: 'Flagship', 
        description: 'Present your startup idea to top VCs and industry experts' 
    },
    { 
        name: 'MUN - G20 Summit', 
        prize: '₹30,000', 
        category: 'Flagship', 
        description: 'Model United Nations — Diplomatic debates on global challenges' 
    },
    { 
        name: 'Ideathon', 
        prize: '₹24,000', 
        breakdown: '3 x ₹8K',
        category: 'Flagship', 
        description: 'Innovative problem-solving for real-world challenges' 
    },
    { 
        name: 'IPL Auction', 
        prize: '₹12,000', 
        breakdown: '₹4K × 3 winners',
        category: 'Flagship', 
        description: 'Experience the thrill of cricket bidding wars' 
    },
];

const DEFAULT_SPEAKERS: Speaker[] = [
    { 
        name: 'Dr. Mylswamy Annadurai', 
        title: 'Moon Man of India', 
        image: 'https://esummit26-iiitdm.vercel.app/speakers/mylswamy.webp', 
        company: 'Ex-Director, ISRO' 
    },
    { 
        name: 'Suresh Narasimha', 
        title: 'Founder', 
        image: 'https://esummit26-iiitdm.vercel.app/speakers/suresh.webp', 
        company: 'CoCreate Ventures' 
    },
    { 
        name: 'Nagaraja Prakasam', 
        title: 'Angel Investor', 
        image: 'https://esummit26-iiitdm.vercel.app/speakers/nagaraja.webp', 
        company: 'Author & Mentor' 
    },
    { 
        name: 'Arunabh Parihar', 
        title: 'Co-Founder', 
        image: 'https://esummit26-iiitdm.vercel.app/speakers/arunabh.webp', 
        company: 'Zoop Money' 
    },
    { 
        name: 'Harsha Vardhan', 
        title: 'Founder', 
        image: 'https://esummit26-iiitdm.vercel.app/speakers/harsha.webp', 
        company: 'Codedale' 
    },
];

const DEFAULT_SPONSORS: Sponsor[] = [
    { name: 'Unstop', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/unstop.png', tier: 'title' },
    { name: 'StockGro', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/stockgro.png', tier: 'platinum' },
    { name: 'GeeksforGeeks', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/gfg.png', tier: 'gold' },
    { name: 'StartupNews.fyi', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/startupnewsfyi.png', tier: 'gold' },
    { name: '2IIM', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/2iim.png', tier: 'silver' },
    { name: 'RiKun', logo: 'https://esummit26-iiitdm.vercel.app/sponsors/rikun.png', tier: 'community' },
];

// ════════════════════════════════════════════════════════════════════════════
// STYLES - LIGHT & ELEGANT
// ════════════════════════════════════════════════════════════════════════════

const styles: { [key: string]: React.CSSProperties } = {
    // Base
    body: {
        backgroundColor: COLORS.surface,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        color: COLORS.textPrimary,
        margin: '0',
        padding: '24px 16px',
        WebkitFontSmoothing: 'antialiased',
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: COLORS.background,
        backgroundImage: `radial-gradient(ellipse at 0% 0%, rgba(67, 56, 202, 0.06) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(14, 165, 233, 0.05) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.04) 0%, transparent 75%)`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9) inset',
        overflow: 'hidden',
    },
    section: {
        padding: '32px 24px',
    },

    // Hero
    heroSection: {
        position: 'relative',
        backgroundColor: 'transparent',
        padding: '36px 24px 16px',
        textAlign: 'center',
        overflow: 'hidden',
    },
    heroCard: {
        position: 'relative',
        background: `linear-gradient(135deg, ${COLORS.cardBg} 0%, ${COLORS.surfaceAlt} 100%)`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '20px',
        padding: '28px 22px 24px',
        boxShadow: '0 18px 40px rgba(28, 25, 23, 0.08)',
        overflow: 'hidden',
    },
    heroBadge: {
        display: 'inline-block',
        padding: '8px 14px',
        borderRadius: '999px',
        backgroundColor: COLORS.primarySoft,
        color: COLORS.primaryDark,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.2px',
        marginBottom: '12px',
    },
    accentLine: {
        width: '60px',
        height: '3px',
        backgroundColor: COLORS.primary,
        margin: '0 auto',
        borderRadius: '2px',
    },
    heroTitle: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '34px',
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        margin: '0 0 6px',
        letterSpacing: '-0.6px',
    },
    heroTagline: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.textSecondary,
        textAlign: 'center',
        letterSpacing: '0.3px',
        margin: '0 0 16px',
    },
    heroPills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        margin: '0 0 20px',
    },
    heroPill: {
        display: 'inline-block',
        padding: '10px 12px',
        borderRadius: '12px',
        backgroundColor: COLORS.surfaceAlt,
        border: `1px solid ${COLORS.border}`,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    heroCtas: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 0 18px',
    },
    primaryHeroCta: {
        display: 'inline-block',
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '700',
        textDecoration: 'none',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(91, 33, 182, 0.25)',
    },
    ghostHeroCta: {
        display: 'inline-block',
        backgroundColor: COLORS.surface,
        color: COLORS.primaryDark,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '13px',
        fontWeight: '700',
        textDecoration: 'none',
        padding: '11px 18px',
        borderRadius: '12px',
        border: `1px solid ${COLORS.border}`,
    },
    heroProofRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
    },
    heroProofItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 10px',
        borderRadius: '10px',
        backgroundColor: COLORS.surfaceAlt,
        border: `1px solid ${COLORS.border}`,
    },
    heroProofIcon: {
        fontSize: '14px',
    },
    heroProofText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.textSecondary,
        margin: '0',
    },

    // Greeting
    // Greeting Section - Clean Minimal
    greetingSection: {
        padding: '40px 32px',
        textAlign: 'left',
    },
    greetingHello: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '500',
        color: COLORS.textMuted,
        margin: '0',
        letterSpacing: '0.5px',
    },
    greetingName: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '28px',
        fontWeight: '700',
        color: COLORS.primary,
        margin: '4px 0 0',
        letterSpacing: '-0.5px',
    },
    greetingDivider: {
        width: '40px',
        height: '3px',
        backgroundColor: COLORS.primary,
        margin: '20px 0',
        borderRadius: '2px',
    },
    customMessage: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        lineHeight: '1.7',
        color: COLORS.textSecondary,
        margin: '0 0 16px',
        padding: '16px',
        backgroundColor: COLORS.primarySoft,
        borderRadius: '12px',
        borderLeft: `3px solid ${COLORS.primary}`,
    },
    mainMessage: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '16px',
        lineHeight: '1.7',
        color: COLORS.textPrimary,
        margin: '0 0 24px',
    },
    quickInfoTable: {
        width: '100%',
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: '12px',
        overflow: 'hidden',
    },
    quickInfoItem: {
        width: '33.33%',
        padding: '16px 8px',
        textAlign: 'center',
        verticalAlign: 'top',
    },
    quickInfoIcon: {
        fontSize: '20px',
        margin: '0 0 6px',
        textAlign: 'center',
    },
    quickInfoText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0',
        textAlign: 'center',
    },
    bodyText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        lineHeight: '1.7',
        color: COLORS.textSecondary,
        margin: '0 0 12px',
    },

    // Prize Showcase - Cinematic
    prizeShowcase: {
        background: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 50%, #7E22CE 100%)`,
        borderRadius: '20px',
        padding: '48px 24px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(91, 33, 182, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    prizeIcon: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    prizeLabel: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '2px',
        color: 'rgba(255,255,255,0.85)',
        margin: '0 0 8px',
        textAlign: 'center',
    },
    prizeValue: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '44px',
        fontWeight: '700',
        color: COLORS.white,
        margin: '0 0 8px',
        letterSpacing: '-1px',
        textAlign: 'center',
    },
    prizeSubtext: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        color: 'rgba(255,255,255,0.9)',
        margin: '0',
        textAlign: 'center',
    },

    // Info Grid
    infoGrid: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '12px',
    },
    infoCell: {
        width: '50%',
        verticalAlign: 'top',
    },
    infoCard: {
        backgroundColor: COLORS.surfaceAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        padding: '20px 16px',
        textAlign: 'center',
    },
    infoIcon: {
        fontSize: '28px',
        marginBottom: '10px',
        textAlign: 'center',
    },
    infoLabel: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '1.5px',
        color: COLORS.primary,
        margin: '0 0 6px',
        textAlign: 'center',
    },
    infoValue: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0',
        textAlign: 'center',
    },

    // CTAs
    primaryCta: {
        display: 'inline-block',
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        fontWeight: '600',
        textDecoration: 'none',
        padding: '14px 40px',
        borderRadius: '10px',
    },
    secondaryCta: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '500',
        color: COLORS.primary,
        textDecoration: 'none',
    },

    // Section Headers
    sectionHeader: {
        textAlign: 'center',
        marginBottom: '28px',
    },
    sectionLabel: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '2px',
        color: COLORS.primary,
        margin: '0 0 8px',
        textAlign: 'center',
    },
    sectionTitle: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '26px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 16px',
        letterSpacing: '-0.5px',
        textAlign: 'center',
    },
    sectionLine: {
        width: '50px',
        height: '3px',
        backgroundColor: COLORS.primary,
        margin: '0 auto',
        borderRadius: '2px',
    },

    // Events Section with glassmorphism
    eventsSection: {
        padding: '32px 24px',
        backgroundColor: 'rgba(241, 245, 249, 0.6)',
        borderTop: `1px solid rgba(124, 58, 237, 0.1)`,
        borderBottom: `1px solid rgba(124, 58, 237, 0.1)`,
    },

    // Event Cards - UNIFIED Style with glass effect
    eventCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: `1px solid rgba(124, 58, 237, 0.12)`,
        borderRadius: '14px',
        padding: '18px 20px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(124, 58, 237, 0.04)',
    },
    eventName: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '17px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0 0 6px',
    },
    eventDesc: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '13px',
        color: COLORS.textSecondary,
        margin: '0',
        lineHeight: '1.5',
    },
    prizeTag: {
        backgroundColor: COLORS.primarySoft,
        borderRadius: '8px',
        padding: '12px 14px',
        textAlign: 'center',
    },
    prizeTagAmount: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '16px',
        fontWeight: '700',
        color: COLORS.primary,
        margin: '0',
        textAlign: 'center',
    },
    prizeBreakdown: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        color: COLORS.textSecondary,
        margin: '4px 0 0',
        textAlign: 'center',
    },

    // Speakers
    speakerCell: {
        width: '33.33%',
        padding: '6px',
        verticalAlign: 'top',
    },
    speakerCard: {
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        padding: '20px 12px',
        textAlign: 'center',
    },
    speakerImg: {
        borderRadius: '50%',
        border: `3px solid ${COLORS.primarySoft}`,
        marginBottom: '12px',
        display: 'block',
        margin: '0 auto 12px',
    },
    speakerName: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0 0 4px',
        lineHeight: '1.3',
        textAlign: 'center',
    },
    speakerRole: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        color: COLORS.textSecondary,
        margin: '0 0 2px',
        textAlign: 'center',
    },
    speakerCompany: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        color: COLORS.primary,
        margin: '0',
        textAlign: 'center',
    },

    // Sponsors - Compact Horizontal Grid
    sponsorGrid: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '8px',
    },
    sponsorCell: {
        width: '33.33%',
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        padding: '12px 8px',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    sponsorLogo: {
        display: 'block',
        margin: '0 auto',
        maxHeight: '32px',
        width: 'auto',
    },

    // Final CTA
    finalCta: {
        backgroundColor: COLORS.primarySoft,
        borderRadius: '16px',
        padding: '40px 24px',
        textAlign: 'center',
    },
    finalCtaTitle: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '24px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 10px',
        textAlign: 'center',
    },
    finalCtaText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        color: COLORS.textSecondary,
        margin: '0 0 24px',
        lineHeight: '1.6',
        textAlign: 'center',
    },
    finalCtaButton: {
        display: 'inline-block',
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        fontWeight: '600',
        textDecoration: 'none',
        padding: '14px 36px',
        borderRadius: '10px',
    },

    // Footer
    footer: {
        backgroundColor: 'rgba(241, 245, 249, 0.7)',
        borderTop: `1px solid rgba(124, 58, 237, 0.1)`,
        padding: '40px 24px',
        textAlign: 'center',
        borderRadius: '0 0 24px 24px',
    },
    footerBrand: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0',
        textAlign: 'center',
    },
    footerCollege: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        color: COLORS.textSecondary,
        margin: '0 0 16px',
        textAlign: 'center',
    },
    socialRow: {
        marginBottom: '16px',
        textAlign: 'center',
    },
    socialLink: {
        display: 'inline-block',
        fontSize: '20px',
        margin: '0 10px',
        textDecoration: 'none',
    },
    footerDivider: {
        width: '80px',
        height: '1px',
        backgroundColor: COLORS.border,
        margin: '16px auto',
    },
    footerContact: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '13px',
        color: COLORS.textSecondary,
        margin: '0 0 6px',
        textAlign: 'center',
    },
    footerAddress: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        color: COLORS.textMuted,
        margin: '0',
        textAlign: 'center',
    },
    footerLegal: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '11px',
        color: COLORS.textMuted,
        margin: '0 0 8px',
        textAlign: 'center',
    },
    footerLinks: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '11px',
        color: COLORS.textMuted,
        margin: '0',
        textAlign: 'center',
    },
    footerLink: {
        color: COLORS.primary,
        textDecoration: 'none',
    },
};
