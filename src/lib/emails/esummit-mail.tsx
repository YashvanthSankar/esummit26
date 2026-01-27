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
                    {/* PREMIUM HERO HEADER                                          */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.heroSection}>
                        {/* Top Bar with E-Summit & E-Cell Logos */}
                        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%', marginBottom: '24px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'left', width: '50%', verticalAlign: 'middle' }}>
                                        <Img
                                            src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                            alt="E-Summit '26"
                                            width="40"
                                            height="40"
                                            style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}
                                        />
                                        <Text style={{ ...styles.topBrandText, display: 'inline', verticalAlign: 'middle' }}>E-SUMMIT</Text>
                                    </td>
                                    <td style={{ textAlign: 'right', width: '50%', verticalAlign: 'middle' }}>
                                        <Text style={{ ...styles.topBrandText, display: 'inline', verticalAlign: 'middle', marginRight: '8px' }}>E-CELL</Text>
                                        <Img
                                            src="https://esummit26-iiitdm.vercel.app/ecell.png"
                                            alt="E-Cell IIITDM"
                                            width="40"
                                            height="40"
                                            style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Decorative Purple Line */}
                        <div style={styles.goldLine} />

                        {/* Main Logo - Clean, No Circle */}
                        <div style={{ textAlign: 'center', margin: '32px 0' }}>
                            <Img
                                src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                alt={`${eventDetails.name} Logo`}
                                width="140"
                                height="140"
                                style={styles.logo}
                            />
                        </div>

                        {/* Event Name - Premium Typography */}
                        <Text style={styles.heroTitle}>{eventDetails.name}</Text>
                        
                        {/* Decorative Divider */}
                        <div style={styles.decorativeDivider}>
                            <span style={styles.dividerDot}>◆</span>
                        </div>
                        
                        {/* Tagline */}
                        <Text style={styles.heroTagline}>{eventDetails.tagline}</Text>
                        
                        {/* Date & Venue */}
                        <div style={styles.heroMeta}>
                            <Text style={styles.heroDate}>
                                {eventDetails.dates}
                            </Text>
                            <Text style={styles.heroVenue}>
                                {eventDetails.venue}
                            </Text>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* GREETING SECTION                                             */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <div style={styles.greetingCard}>
                            {/* Greeting */}
                            <Text style={styles.greetingText}>
                                Dear <strong style={{ color: COLORS.purple }}>{userName}</strong>,
                            </Text>

                            {/* Custom Message */}
                            {message && (
                                <Text style={styles.bodyText}>{message}</Text>
                            )}

                            {/* Intro */}
                            <Text style={styles.bodyText}>
                                The <strong style={{ color: COLORS.textPrimary }}>Entrepreneurship Cell of IIITDM Kancheepuram</strong> welcomes you to 
                                <strong style={{ color: COLORS.purple }}> {eventDetails.name}</strong> — 
                                South India&apos;s most prestigious entrepreneurship conclave.
                            </Text>

                            <Text style={styles.bodyText}>
                                Experience <strong style={{ color: COLORS.textPrimary }}>3 power-packed days</strong> of intense competitions, visionary keynotes, 
                                startup showcases, and networking with industry titans.
                            </Text>
                        </div>
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
                    {/* EVENTS SECTION                                               */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>COMPETITIONS</Text>
                            <Text style={styles.sectionTitle}>Featured Events</Text>
                            <div style={styles.sectionLine} />
                        </div>

                        {/* Flagship Events */}
                        <Text style={styles.categoryLabel}>⭐ FLAGSHIP EVENTS</Text>
                        {events.filter(e => e.category === 'Flagship').map((event, i) => (
                            <div key={i} style={styles.eventCardPremium}>
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

                        {/* Formal Events */}
                        <Text style={{ ...styles.categoryLabel, marginTop: '24px' }}>🎯 FORMAL EVENTS</Text>
                        {events.filter(e => e.category === 'Formal').map((event, i) => (
                            <div key={i} style={styles.eventCardStandard}>
                                <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'middle' }}>
                                                <Text style={styles.eventNameSmall}>{event.name}</Text>
                                                <Text style={styles.eventDescSmall}>{event.description}</Text>
                                            </td>
                                            <td style={{ width: '90px', textAlign: 'right', verticalAlign: 'middle' }}>
                                                <Text style={styles.prizeSmall}>{event.prize}</Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}

                        {/* Informal Events */}
                        <Text style={{ ...styles.categoryLabel, marginTop: '24px' }}>🎉 INFORMAL EVENTS</Text>
                        {events.filter(e => e.category === 'Informal').map((event, i) => (
                            <div key={i} style={styles.eventCardLight}>
                                <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'middle' }}>
                                                <Text style={styles.eventNameSmall}>{event.name}</Text>
                                            </td>
                                            <td style={{ width: '80px', textAlign: 'right', verticalAlign: 'middle' }}>
                                                <Text style={styles.prizeLight}>{event.prize}</Text>
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
                    {/* SPONSORS (Conditional)                                       */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {sponsors.length > 0 && (
                        <Section style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <Text style={styles.sectionLabel}>PARTNERS</Text>
                                <Text style={styles.sectionTitle}>Our Sponsors</Text>
                                <div style={styles.sectionLine} />
                            </div>

                            <div style={styles.sponsorGrid}>
                                {sponsors.map((sponsor, i) => (
                                    <Img
                                        key={i}
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        style={styles.sponsorLogo}
                                    />
                                ))}
                            </div>
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
// COLOR PALETTE - DARK LUXURY WITH PURPLE ACCENT
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
    // Base - Dark Theme
    darkBase: '#0A0A0F',
    darkCard: '#12121A',
    darkElevated: '#1A1A25',
    darkSurface: '#0F0F14',
    white: '#FFFFFF',

    // Accents - Purple Gradient
    purple: '#A855F7',
    purpleDark: '#9333EA',
    purpleLight: '#C084FC',
    purpleGlow: 'rgba(168, 85, 247, 0.3)',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #6366F1 100%)',

    // Gold for Premium
    gold: '#F59E0B',
    goldLight: '#FBBF24',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.4)',

    // Borders
    border: 'rgba(255, 255, 255, 0.1)',
    borderPurple: 'rgba(168, 85, 247, 0.3)',
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
    // Flagship Events
    { 
        name: 'Pitch Perfect', 
        prize: '₹30,000', 
        breakdown: '₹15K + ₹9K + ₹6K',
        category: 'Flagship', 
        description: 'Present your startup idea to top VCs and industry experts' 
    },
    { 
        name: 'MUN - G20 Summit', 
        prize: '₹30,000', 
        category: 'Flagship', 
        description: 'Model United Nations — Diplomatic debates on global challenges' 
    },
    // Formal Events
    { 
        name: 'Ideathon', 
        prize: '₹18,000', 
        breakdown: '₹9K + ₹6K + ₹3K',
        category: 'Formal', 
        description: 'Innovative problem-solving for real-world challenges' 
    },
    { 
        name: 'BusinessVerse Quiz', 
        prize: '₹18,000', 
        category: 'Formal', 
        description: 'Test your business and general knowledge' 
    },
    { 
        name: 'Case Closed', 
        prize: '₹15,000', 
        breakdown: '₹7.5K + ₹5K + ₹2.5K',
        category: 'Formal', 
        description: 'Solve real-world business case studies' 
    },
    { 
        name: 'Best Manager', 
        prize: '₹12,000', 
        breakdown: '₹6K + ₹4K + ₹2K',
        category: 'Formal', 
        description: 'Showcase your leadership and management skills' 
    },
    { 
        name: 'Bid & Build', 
        prize: '₹12,000', 
        category: 'Formal', 
        description: 'Strategic bidding and resource management' 
    },
    // Informal Events
    { 
        name: 'IPL Auction', 
        prize: '₹12,000', 
        breakdown: '₹4K × 3 winners',
        category: 'Informal', 
        description: 'Experience the thrill of cricket bidding wars' 
    },
    { 
        name: 'Geoguessr', 
        prize: '₹4,000', 
        category: 'Informal', 
        description: 'Test your geography knowledge' 
    },
    { 
        name: 'Kala Bazaar', 
        prize: '₹4,000', 
        category: 'Informal', 
        description: 'Cultural marketplace trading game' 
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
// STYLES - DARK LUXURY AESTHETIC
// ════════════════════════════════════════════════════════════════════════════

const styles: { [key: string]: React.CSSProperties } = {
    // Base
    body: {
        backgroundColor: COLORS.darkBase,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: COLORS.textPrimary,
        margin: '0',
        padding: '0',
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: COLORS.darkBase,
    },
    section: {
        padding: '28px 24px',
    },

    // Hero
    heroSection: {
        backgroundColor: COLORS.darkSurface,
        padding: '32px 24px 40px',
        borderBottom: `2px solid ${COLORS.borderPurple}`,
        backgroundImage: `linear-gradient(180deg, rgba(168, 85, 247, 0.05) 0%, transparent 50%)`,
    },
    topBrandText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '3px',
        color: COLORS.purple,
        margin: '0',
        textTransform: 'uppercase',
    },
    goldLine: {
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${COLORS.purple}, transparent)`,
        margin: '0',
    },
    logo: {
        display: 'block',
        margin: '0 auto',
    },
    heroTitle: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '42px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        margin: '0',
        letterSpacing: '-1px',
    },
    decorativeDivider: {
        textAlign: 'center',
        margin: '16px 0',
    },
    dividerDot: {
        color: COLORS.purple,
        fontSize: '12px',
    },
    heroTagline: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.purple,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        margin: '0 0 20px',
    },
    heroMeta: {
        textAlign: 'center',
    },
    heroDate: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0 0 4px',
    },
    heroVenue: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '13px',
        color: COLORS.textSecondary,
        margin: '0',
    },

    // Greeting
    greetingCard: {
        backgroundColor: COLORS.darkCard,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `4px solid ${COLORS.purple}`,
        borderRadius: '8px',
        padding: '24px',
    },
    greetingText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '18px',
        color: COLORS.textPrimary,
        margin: '0 0 16px',
    },
    bodyText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        lineHeight: '1.7',
        color: COLORS.textSecondary,
        margin: '0 0 12px',
    },

    // Prize Showcase
    prizeShowcase: {
        background: `linear-gradient(135deg, ${COLORS.purple} 0%, ${COLORS.purpleDark} 100%)`,
        borderRadius: '12px',
        padding: '36px 24px',
        textAlign: 'center',
        boxShadow: '0 4px 30px rgba(168, 85, 247, 0.25)',
    },
    prizeIcon: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    prizeLabel: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '3px',
        color: 'rgba(255,255,255,0.85)',
        margin: '0 0 8px',
    },
    prizeValue: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '42px',
        fontWeight: '800',
        color: COLORS.white,
        margin: '0 0 8px',
        letterSpacing: '-1px',
    },
    prizeSubtext: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        color: 'rgba(255,255,255,0.9)',
        margin: '0',
    },

    // Info Grid
    infoGrid: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '8px',
    },
    infoCell: {
        width: '50%',
    },
    infoCard: {
        backgroundColor: COLORS.darkCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        padding: '18px',
        textAlign: 'center',
    },
    infoIcon: {
        fontSize: '24px',
        marginBottom: '8px',
    },
    infoLabel: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '2px',
        color: COLORS.purple,
        margin: '0 0 4px',
    },
    infoValue: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0',
    },

    // CTAs
    primaryCta: {
        display: 'inline-block',
        backgroundColor: COLORS.purple,
        color: COLORS.white,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        fontWeight: '600',
        textDecoration: 'none',
        padding: '14px 40px',
        borderRadius: '8px',
    },
    secondaryCta: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '500',
        color: COLORS.purpleLight,
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
        fontWeight: '700',
        letterSpacing: '3px',
        color: COLORS.purple,
        margin: '0 0 8px',
    },
    sectionTitle: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '28px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 12px',
        letterSpacing: '-0.5px',
    },
    sectionLine: {
        width: '50px',
        height: '3px',
        backgroundColor: COLORS.purple,
        margin: '0 auto',
        borderRadius: '2px',
    },

    // Category Labels
    categoryLabel: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '2px',
        color: COLORS.textSecondary,
        margin: '0 0 12px',
    },

    // Event Cards - Premium (Flagship)
    eventCardPremium: {
        backgroundColor: COLORS.darkCard,
        border: `2px solid ${COLORS.purple}`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '12px',
        boxShadow: '0 2px 20px rgba(168, 85, 247, 0.15)',
    },
    eventName: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '18px',
        fontWeight: '700',
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
        backgroundColor: COLORS.purple,
        borderRadius: '8px',
        padding: '12px 14px',
        textAlign: 'center',
    },
    prizeTagAmount: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '16px',
        fontWeight: '700',
        color: COLORS.white,
        margin: '0',
    },
    prizeBreakdown: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '9px',
        color: 'rgba(255,255,255,0.85)',
        margin: '4px 0 0',
    },

    // Event Cards - Standard (Formal)
    eventCardStandard: {
        backgroundColor: COLORS.darkCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        padding: '16px 18px',
        marginBottom: '8px',
    },
    eventNameSmall: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0 0 2px',
    },
    eventDescSmall: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        color: COLORS.textMuted,
        margin: '0',
    },
    prizeSmall: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '700',
        color: COLORS.gold,
        margin: '0',
    },

    // Event Cards - Light (Informal)
    eventCardLight: {
        backgroundColor: COLORS.darkElevated,
        borderRadius: '6px',
        padding: '14px 16px',
        marginBottom: '6px',
    },
    prizeLight: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '13px',
        fontWeight: '600',
        color: COLORS.purpleLight,
        margin: '0',
    },

    // Speakers
    speakerCell: {
        width: '33.33%',
        padding: '4px',
        verticalAlign: 'top',
    },
    speakerCard: {
        backgroundColor: COLORS.darkCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        padding: '18px 10px',
        textAlign: 'center',
    },
    speakerImg: {
        borderRadius: '50%',
        border: `3px solid ${COLORS.purple}`,
        marginBottom: '12px',
    },
    speakerName: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0 0 3px',
        lineHeight: '1.3',
    },
    speakerRole: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        color: COLORS.textSecondary,
        margin: '0 0 2px',
    },
    speakerCompany: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '9px',
        color: COLORS.purple,
        margin: '0',
    },

    // Sponsors
    sponsorGrid: {
        textAlign: 'center',
        backgroundColor: COLORS.darkCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        padding: '24px',
    },
    sponsorLogo: {
        maxWidth: '80px',
        maxHeight: '40px',
        height: 'auto',
        margin: '10px 14px',
    },

    // Final CTA
    finalCta: {
        backgroundColor: COLORS.darkCard,
        borderRadius: '12px',
        padding: '36px 24px',
        textAlign: 'center',
        border: `1px solid ${COLORS.borderPurple}`,
    },
    finalCtaTitle: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '26px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 10px',
    },
    finalCtaText: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        color: COLORS.textSecondary,
        margin: '0 0 24px',
        lineHeight: '1.6',
    },
    finalCtaButton: {
        display: 'inline-block',
        backgroundColor: COLORS.purple,
        color: COLORS.white,
        fontFamily: "-apple-system, sans-serif",
        fontSize: '15px',
        fontWeight: '600',
        textDecoration: 'none',
        padding: '14px 36px',
        borderRadius: '8px',
    },

    // Footer
    footer: {
        backgroundColor: COLORS.darkSurface,
        borderTop: `1px solid ${COLORS.border}`,
        padding: '36px 24px',
        textAlign: 'center',
    },
    footerBrand: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0',
    },
    footerCollege: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        color: COLORS.textSecondary,
        margin: '0 0 16px',
    },
    socialRow: {
        marginBottom: '16px',
    },
    socialLink: {
        display: 'inline-block',
        fontSize: '20px',
        margin: '0 10px',
        textDecoration: 'none',
    },
    footerDivider: {
        width: '100px',
        height: '1px',
        backgroundColor: COLORS.border,
        margin: '16px auto',
    },
    footerContact: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12px',
        color: COLORS.textSecondary,
        margin: '0 0 6px',
    },
    footerAddress: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '11px',
        color: COLORS.textMuted,
        margin: '0',
    },
    footerLegal: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        color: COLORS.textMuted,
        margin: '0 0 8px',
    },
    footerLinks: {
        fontFamily: "-apple-system, sans-serif",
        fontSize: '10px',
        color: COLORS.textMuted,
        margin: '0',
    },
    footerLink: {
        color: COLORS.purpleLight,
        textDecoration: 'none',
    },
};
