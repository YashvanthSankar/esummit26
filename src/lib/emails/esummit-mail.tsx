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
    category?: 'Flagship' | 'Formal' | 'Informal' | 'Workshop';
    description?: string;
}

interface Speaker {
    name: string;
    title: string;
    image?: string;
    company?: string;
}

interface ScheduleDay {
    day: string;
    date?: string;
    items: Array<{
        time: string;
        title: string;
        venue?: string;
        type?: 'keynote' | 'competition' | 'workshop' | 'networking' | 'ceremony';
    }>;
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
    schedule?: ScheduleDay[];
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
    schedule = DEFAULT_SCHEDULE,
    sponsors = [],
}: ESummitMailProps) => {
    const previewText = subject || `Complete Guide to ${eventDetails.name} | ${eventDetails.dates} | ${eventDetails.prizePool} in prizes`;

    return (
        <Html>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>{eventDetails.name} - Event Guide</title>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* HERO HEADER                                                  */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.heroSection}>
                        {/* Floating Doodles - Top Left */}
                        <div style={{ position: 'absolute', top: '16px', left: '16px', opacity: 0.12 }}>
                            <DoodleRocket size={28} color={COLORS.gold} />
                        </div>
                        {/* Floating Doodles - Top Right */}
                        <div style={{ position: 'absolute', top: '20px', right: '16px', opacity: 0.12 }}>
                            <DoodleLightbulb size={24} color={COLORS.burntOrange} />
                        </div>
                        
                        {/* Logo */}
                        <div style={styles.logoWrapper}>
                            <Img
                                src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                alt={`${eventDetails.name} Logo`}
                                width="90"
                                height="90"
                                style={styles.logo}
                            />
                        </div>

                        {/* Event Name */}
                        <Text style={styles.heroTitle}>{eventDetails.name}</Text>
                        
                        {/* Tagline */}
                        <Text style={styles.heroTagline}>{eventDetails.tagline}</Text>
                        
                        {/* Date Badge */}
                        <div style={styles.datePill}>
                            <span style={{ marginRight: '8px' }}>📅</span>
                            {eventDetails.dates}
                        </div>

                        {/* Floating Doodles - Bottom */}
                        <div style={{ textAlign: 'center', marginTop: '16px', opacity: 0.08 }}>
                            <DoodleSparkle size={16} style={{ margin: '0 8px' }} />
                            <DoodleSparkle size={20} style={{ margin: '0 8px' }} />
                            <DoodleSparkle size={16} style={{ margin: '0 8px' }} />
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* GREETING CARD                                                */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <div style={styles.mainCard}>
                            {/* Decorative Corner */}
                            <div style={{ position: 'absolute', top: '12px', right: '12px', opacity: 0.15 }}>
                                <DoodleLightbulb size={28} color={COLORS.gold} />
                            </div>

                            {/* Greeting */}
                            <Text style={styles.greetingTitle}>
                                Hello, {userName}! 👋
                            </Text>

                            {/* Custom Message */}
                            {message && (
                                <Text style={styles.bodyText}>{message}</Text>
                            )}

                            {/* Intro Text */}
                            <Text style={styles.bodyText}>
                                The <strong style={{ color: COLORS.gold }}>Entrepreneurship Cell of IIITDM Kancheepuram</strong> is 
                                thrilled to present your complete guide to <strong>{eventDetails.name}</strong> — 
                                South India&apos;s premier entrepreneurship conclave.
                            </Text>

                            <Text style={styles.bodyText}>
                                Prepare for <strong>30+ hours</strong> of intensive programming featuring high-stakes 
                                competitions, inspiring keynotes, hands-on workshops, and unparalleled networking 
                                opportunities with fellow innovators and investors.
                            </Text>

                            {/* ─────────────────────────────────────────────────── */}
                            {/* Prize Pool Highlight Box                            */}
                            {/* ─────────────────────────────────────────────────── */}
                            <div style={styles.prizeHighlightBox}>
                                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏆</div>
                                <Text style={styles.prizeLabel}>TOTAL PRIZE POOL</Text>
                                <Text style={styles.prizeValue}>{eventDetails.prizePool}</Text>
                            </div>

                            {/* ─────────────────────────────────────────────────── */}
                            {/* Quick Stats Grid                                     */}
                            {/* ─────────────────────────────────────────────────── */}
                            <table style={styles.statsTable} cellPadding="0" cellSpacing="0" role="presentation">
                                <tbody>
                                    <tr>
                                        <td style={styles.statCell}>
                                            <div style={styles.statCard}>
                                                <div style={{ fontSize: '24px', marginBottom: '6px' }}>📅</div>
                                                <Text style={styles.statLabel}>WHEN</Text>
                                                <Text style={styles.statValue}>Jan 30 - Feb 1</Text>
                                            </div>
                                        </td>
                                        <td style={styles.statCell}>
                                            <div style={styles.statCard}>
                                                <div style={{ fontSize: '24px', marginBottom: '6px' }}>📍</div>
                                                <Text style={styles.statLabel}>WHERE</Text>
                                                <Text style={styles.statValue}>IIITDM Campus</Text>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={styles.statCell}>
                                            <div style={styles.statCard}>
                                                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🏛️</div>
                                                <Text style={styles.statLabel}>MODE</Text>
                                                <Text style={styles.statValue}>{eventDetails.mode || 'In-Person'}</Text>
                                            </div>
                                        </td>
                                        <td style={styles.statCell}>
                                            <div style={styles.statCard}>
                                                <div style={{ fontSize: '24px', marginBottom: '6px' }}>💰</div>
                                                <Text style={styles.statLabel}>PRIZES</Text>
                                                <Text style={styles.statValue}>{eventDetails.prizePool}</Text>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ─────────────────────────────────────────────────── */}
                            {/* Primary CTA                                          */}
                            {/* ─────────────────────────────────────────────────── */}
                            <div style={{ textAlign: 'center', marginTop: '28px' }}>
                                <Link
                                    href={eventDetails.registrationUrl}
                                    style={styles.primaryButton}
                                >
                                    <span style={{ marginRight: '8px' }}>🎟️</span>
                                    Download Your Pass
                                </Link>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Link href={eventDetails.websiteUrl} style={styles.secondaryButton}>
                                    Visit Official Website →
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* QUICK LINKS CHIPS                                            */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={{ ...styles.section, paddingTop: '0' }}>
                        <div style={styles.chipsContainer}>
                            {QUICK_LINKS.map((link, i) => (
                                <Link
                                    key={i}
                                    href={`${eventDetails.websiteUrl}${link.anchor}`}
                                    style={styles.chip}
                                >
                                    <span style={{ marginRight: '6px' }}>{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* FEATURED EVENTS                                              */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <SectionHeader
                            title="Featured Events"
                            subtitle="Compete, Innovate, Win Big"
                            doodle={<DoodleTrophy size={24} color={COLORS.gold} />}
                        />

                        {events.map((event, i) => (
                            <div key={i} style={styles.eventCard}>
                                <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '70%', verticalAlign: 'top', paddingRight: '12px' }}>
                                                {/* Category Badge */}
                                                <span style={{
                                                    ...styles.categoryBadge,
                                                    backgroundColor: event.category === 'Flagship' 
                                                        ? 'rgba(232,122,79,0.15)' 
                                                        : 'rgba(212,165,116,0.15)',
                                                    color: event.category === 'Flagship' 
                                                        ? COLORS.burntOrange 
                                                        : COLORS.gold,
                                                    borderColor: event.category === 'Flagship' 
                                                        ? COLORS.burntOrange 
                                                        : COLORS.gold,
                                                }}>
                                                    {event.category}
                                                </span>

                                                {/* Event Title */}
                                                <Text style={styles.eventTitle}>{event.name}</Text>

                                                {/* Time */}
                                                <Text style={styles.eventTime}>
                                                    <span style={{ marginRight: '6px' }}>🕐</span>
                                                    {event.date}
                                                </Text>

                                                {/* Description */}
                                                <Text style={styles.eventDescription}>{event.description}</Text>
                                            </td>
                                            <td style={{ width: '30%', verticalAlign: 'middle', textAlign: 'right' }}>
                                                <div style={styles.eventPrizeBadge}>
                                                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>🏆</div>
                                                    <Text style={styles.eventPrizeAmount}>{event.prize}</Text>
                                                    <Text style={styles.eventPrizeLabel}>Prize</Text>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Decorative Doodle */}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.06 }}>
                                    <DoodleGraph size={36} color={COLORS.textPrimary} />
                                </div>
                            </div>
                        ))}
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* SPEAKERS SHOWCASE                                            */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <SectionHeader
                            title="Meet Our Speakers"
                            subtitle="Industry Leaders & Innovators"
                            doodle={<DoodleMic size={24} color={COLORS.burntOrange} />}
                        />

                        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                            <tbody>
                                {/* Row 1: First 3 speakers */}
                                <tr>
                                    {speakers.slice(0, 3).map((speaker, i) => (
                                        <td key={i} style={styles.speakerCell}>
                                            <div style={styles.speakerCard}>
                                                {/* Avatar */}
                                                <div style={styles.speakerAvatarWrapper}>
                                                    <Img
                                                        src={speaker.image || 'https://via.placeholder.com/80'}
                                                        alt={speaker.name}
                                                        width="72"
                                                        height="72"
                                                        style={styles.speakerAvatar}
                                                    />
                                                </div>
                                                <Text style={styles.speakerName}>{speaker.name}</Text>
                                                <Text style={styles.speakerTitle}>{speaker.title}</Text>
                                                <Text style={styles.speakerCompany}>{speaker.company}</Text>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                {/* Row 2: Next 3 speakers */}
                                {speakers.length > 3 && (
                                    <tr>
                                        {speakers.slice(3, 6).map((speaker, i) => (
                                            <td key={i} style={styles.speakerCell}>
                                                <div style={styles.speakerCard}>
                                                    <div style={styles.speakerAvatarWrapper}>
                                                        <Img
                                                            src={speaker.image || 'https://via.placeholder.com/80'}
                                                            alt={speaker.name}
                                                            width="72"
                                                            height="72"
                                                            style={styles.speakerAvatar}
                                                        />
                                                    </div>
                                                    <Text style={styles.speakerName}>{speaker.name}</Text>
                                                    <Text style={styles.speakerTitle}>{speaker.title}</Text>
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
                    {/* DETAILED SCHEDULE                                            */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <SectionHeader
                            title="Event Schedule"
                            subtitle="3 Days of Intense Action"
                            doodle={<DoodleCalendar size={24} color={COLORS.gold} />}
                        />

                        <div style={styles.scheduleWrapper}>
                            {schedule.map((day, dayIndex) => (
                                <div key={dayIndex} style={{ marginBottom: dayIndex < schedule.length - 1 ? '28px' : '0' }}>
                                    {/* Day Header */}
                                    <div style={styles.dayHeader}>
                                        <span style={{ marginRight: '10px' }}>📅</span>
                                        {day.day}
                                    </div>

                                    {/* Schedule Items */}
                                    {day.items.map((item, itemIndex) => (
                                        <div key={itemIndex} style={styles.scheduleItem}>
                                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: '70px', verticalAlign: 'top' }}>
                                                            <div style={styles.timeBadge}>{item.time}</div>
                                                        </td>
                                                        <td style={{ paddingLeft: '12px', verticalAlign: 'top' }}>
                                                            <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                                                            {item.venue && (
                                                                <Text style={styles.scheduleItemVenue}>
                                                                    <span style={{ marginRight: '4px' }}>📍</span>
                                                                    {item.venue}
                                                                </Text>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* SPONSORS (Conditional)                                       */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {sponsors.length > 0 && (
                        <Section style={styles.section}>
                            <SectionHeader
                                title="Our Partners"
                                subtitle="Powering Innovation"
                                doodle={<DoodleHandshake size={24} color={COLORS.gold} />}
                            />

                            <div style={styles.sponsorsGrid}>
                                {sponsors.map((sponsor, i) => (
                                    <div key={i} style={styles.sponsorItem}>
                                        <Img
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            style={styles.sponsorLogo}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* FINAL CTA                                                    */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.section}>
                        <div style={styles.finalCtaCard}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
                            <Text style={styles.finalCtaTitle}>Ready to Join {eventDetails.name}?</Text>
                            <Text style={styles.finalCtaText}>
                                Register now and be part of South India&apos;s most exciting entrepreneurship event. 
                                Limited seats available!
                            </Text>
                            <Link href={eventDetails.registrationUrl} style={styles.primaryButton}>
                                <span style={{ marginRight: '8px' }}>✨</span>
                                Register Now
                            </Link>
                            <div style={{ marginTop: '16px' }}>
                                <Link href={`${eventDetails.websiteUrl}#schedule`} style={styles.textLink}>
                                    View Full Schedule →
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* FOOTER                                                       */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    <Section style={styles.footer}>
                        {/* Decorative Doodles */}
                        <div style={{ textAlign: 'center', marginBottom: '20px', opacity: 0.1 }}>
                            <DoodleHandshake size={26} style={{ margin: '0 10px' }} />
                            <DoodleLightbulb size={26} style={{ margin: '0 10px' }} />
                            <DoodleRocket size={26} style={{ margin: '0 10px' }} />
                        </div>

                        {/* E-Cell Logo */}
                        <Img
                            src="https://esummit26-iiitdm.vercel.app/ecell.png"
                            alt="E-Cell Logo"
                            width="56"
                            style={{ margin: '0 auto 16px', display: 'block' }}
                        />

                        {/* Tagline */}
                        <Text style={styles.footerTagline}>
                            <em>&ldquo;Empowering Tomorrow&apos;s Entrepreneurs Today&rdquo;</em>
                        </Text>

                        {/* Social Links */}
                        <div style={styles.socialLinks}>
                            {SOCIAL_LINKS.map((social, i) => (
                                <Link key={i} href={social.url} style={styles.socialIcon}>
                                    {social.icon}
                                </Link>
                            ))}
                        </div>

                        <div style={styles.footerDivider} />

                        {/* Contact Info */}
                        <Text style={styles.footerContact}>
                            📧{' '}
                            <Link href="mailto:ecell@iiitdm.ac.in" style={styles.footerLink}>
                                ecell@iiitdm.ac.in
                            </Link>
                            <span style={{ margin: '0 12px', color: COLORS.border }}>•</span>
                            📞{' '}
                            <Link href="tel:+919876543210" style={styles.footerLink}>
                                +91 98765 43210
                            </Link>
                        </Text>

                        {/* Address */}
                        <Text style={styles.footerAddress}>
                            IIITDM Kancheepuram, Vandalur-Kelambakkam Road<br />
                            Chennai - 600127, Tamil Nadu, India
                        </Text>

                        <div style={styles.footerDivider} />

                        {/* Copyright */}
                        <Text style={styles.footerCopyright}>
                            © 2026 E-Summit IIITDM Kancheepuram. All rights reserved.
                        </Text>

                        {/* Unsubscribe */}
                        <Text style={styles.footerUnsubscribe}>
                            <Link href="#unsubscribe" style={styles.footerLink}>Unsubscribe</Link>
                            <span style={{ margin: '0 8px' }}>•</span>
                            <Link href="#preferences" style={styles.footerLink}>Email Preferences</Link>
                            <span style={{ margin: '0 8px' }}>•</span>
                            <Link href="#privacy" style={styles.footerLink}>Privacy Policy</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ESummitMail;

// ════════════════════════════════════════════════════════════════════════════
// SECTION HEADER COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    doodle?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, doodle }: SectionHeaderProps) => (
    <div style={styles.sectionHeader}>
        {doodle && <div style={{ marginBottom: '8px', opacity: 0.6 }}>{doodle}</div>}
        <Text style={styles.sectionTitle}>{title}</Text>
        <div style={styles.sectionUnderline} />
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </div>
);

// ════════════════════════════════════════════════════════════════════════════
// INLINE SVG DOODLES (Maximum Email Compatibility)
// ════════════════════════════════════════════════════════════════════════════

interface DoodleProps {
    size?: number;
    color?: string;
    style?: React.CSSProperties;
}

const DoodleRocket = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 16.5C3 20.5 2 22 2 22C2 22 3.5 21 7.5 19.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L12 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 17.5L13 18.5C14.38 19.88 16.62 19.88 18 18.5L20.5 16C21.88 14.62 21.88 12.38 20.5 11L13 3.5C11.62 2.12 9.38 2.12 8 3.5L5.5 6C4.12 7.38 4.12 9.62 5.5 11L6.5 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="9" r="1" fill={color} />
    </svg>
);

const DoodleLightbulb = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 1V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.22 4.22L5.64 5.64" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19.78 4.22L18.36 5.64" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 17.4V19C8 19.6 8.4 20 9 20H15C15.6 20 16 19.6 16 19V17.4C18.4 16.2 20 13.9 20 11C20 6.6 16.4 3 12 3C7.6 3 4 6.6 4 11C4 13.9 5.6 16.2 8 17.4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoodleSparkle = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 3V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 3V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 18H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 18H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const DoodleTrophy = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M8 21H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 17V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 4H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 4V8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 4V8C6 9.1 5.1 10 4 10C2.9 10 2 9.1 2 8V6C2 4.9 2.9 4 4 4H6Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 4H20C21.1 4 22 4.9 22 6V8C22 9.1 21.1 10 20 10C18.9 10 18 9.1 18 8V4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoodleGraph = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M4 18L9 13L13 17L20 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 10V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 10H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoodleMic = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth="1.5" />
        <path d="M5 10V11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 22H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoodleCalendar = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M3 10H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <rect x="7" y="14" width="4" height="4" rx="0.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="0.5" />
    </svg>
);

const DoodleHandshake = ({ size = 24, color = COLORS.gold, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M20.42 4.58C19.8341 4.00058 19.0117 3.71517 18.18 3.80003C17.3512 3.71398 16.5308 4.00018 15.95 4.58L13.05 7.47C12.66 7.86 12.66 8.49 13.05 8.88C13.44 9.27 14.07 9.27 14.46 8.88L17.35 5.99C17.68 5.66 18.2 5.66 18.53 5.99C18.86 6.32 18.86 6.84 18.53 7.17L15.64 10.06C15.25 10.45 15.25 11.08 15.64 11.47C16.03 11.86 16.66 11.86 17.05 11.47L19.94 8.58C20.52 8.00005 20.8053 7.18045 20.72 6.35C20.8053 5.51956 20.52 4.69995 19.94 4.12L20.42 4.58Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.58 19.42C4.16584 19.9994 4.98824 20.2848 5.82 20.2C6.64876 20.286 7.46916 20.0002 8.05 19.42L10.95 16.53C11.34 16.14 11.34 15.51 10.95 15.12C10.56 14.73 9.93 14.73 9.54 15.12L6.65 18.01C6.32 18.34 5.8 18.34 5.47 18.01C5.14 17.68 5.14 17.16 5.47 16.83L8.36 13.94C8.75 13.55 8.75 12.92 8.36 12.53C7.97 12.14 7.34 12.14 6.95 12.53L4.06 15.42C3.48 15.9999 3.19469 16.8196 3.28 17.65C3.19469 18.4804 3.48 19.3001 4.06 19.88L3.58 19.42Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 15L9 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ════════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
    // Base Colors
    creamBase: '#FFF9F0',
    creamCard: '#FFFBF5',
    creamDark: '#F5EFE6',
    white: '#FFFFFF',

    // Accent Colors
    gold: '#D4A574',
    goldLight: '#E8C9A8',
    burntOrange: '#E87A4F',
    orangeLight: '#F5A57A',

    // Text Colors
    textPrimary: '#3D3935',
    textSecondary: '#9E9589',
    textTertiary: '#716A5F',

    // Border Colors
    border: '#E8E3DC',
    borderLight: '#C4BCB0',
};

// ════════════════════════════════════════════════════════════════════════════
// QUICK LINKS DATA
// ════════════════════════════════════════════════════════════════════════════

const QUICK_LINKS = [
    { icon: '⚡', label: 'Events', anchor: '#events' },
    { icon: '🗓️', label: 'Schedule', anchor: '#schedule' },
    { icon: '🎤', label: 'Speakers', anchor: '#speakers' },
    { icon: '🏆', label: 'Prizes', anchor: '#prizes' },
    { icon: '📍', label: 'Venue', anchor: '#venue' },
];

// ════════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS DATA
// ════════════════════════════════════════════════════════════════════════════

const SOCIAL_LINKS = [
    { icon: '📷', url: 'https://instagram.com/ecell_iiitdm', label: 'Instagram' },
    { icon: '💼', url: 'https://linkedin.com/company/ecelliiitdm', label: 'LinkedIn' },
    { icon: '🐦', url: 'https://twitter.com/ecell_iiitdm', label: 'Twitter' },
    { icon: '🌐', url: 'https://esummit26-iiitdm.vercel.app', label: 'Website' },
];

// ════════════════════════════════════════════════════════════════════════════
// DEFAULT PROP VALUES
// ════════════════════════════════════════════════════════════════════════════

const DEFAULT_EVENT_DETAILS: EventDetails = {
    name: "E-Summit '26",
    dates: 'January 30 - February 1, 2026',
    venue: 'IIITDM Kancheepuram',
    prizePool: '₹2,00,000+',
    websiteUrl: 'https://esummit26-iiitdm.vercel.app',
    registrationUrl: 'https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947',
    tagline: 'Where Innovation Meets Opportunity',
    mode: 'In-Person',
};

const DEFAULT_EVENTS: EventItem[] = [
    { 
        name: 'Pitch Perfect', 
        date: 'Jan 30 - Feb 1', 
        prize: '₹30,000', 
        category: 'Flagship', 
        description: 'Present your startup idea to top VCs and industry experts in this high-stakes pitch competition.' 
    },
    { 
        name: 'MUN', 
        date: 'Jan 31', 
        prize: '₹30,000', 
        category: 'Flagship', 
        description: 'Model United Nations — Engage in diplomatic debates and solve global challenges.' 
    },
    { 
        name: 'Ideathon', 
        date: 'Jan 31', 
        prize: '₹18,000', 
        category: 'Formal', 
        description: 'Innovative problem-solving competition to build solutions for real-world challenges.' 
    },
    { 
        name: 'Case Closed', 
        date: 'Feb 1', 
        prize: '₹15,000', 
        category: 'Formal', 
        description: 'Solve complex business cases and present strategic recommendations.' 
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

const DEFAULT_SCHEDULE: ScheduleDay[] = [
    {
        day: 'Day 1 - January 30',
        items: [
            { time: '06:00 PM', title: 'Inauguration Ceremony', venue: 'Auditorium', type: 'ceremony' },
            { time: '06:30 PM', title: 'Presidential Address', venue: 'Auditorium', type: 'keynote' },
            { time: '06:50 PM', title: 'Keynote: Dr. Mylswamy Annadurai', venue: 'Auditorium', type: 'keynote' },
            { time: '07:30 PM', title: 'Bid & Build Competition', venue: 'Seminar Hall', type: 'competition' },
        ],
    },
    {
        day: 'Day 2 - January 31',
        items: [
            { time: '09:00 AM', title: 'MUN / Startup Expo', venue: 'Multiple Venues', type: 'competition' },
            { time: '10:00 AM', title: 'Ideathon / Kala Bazaar', venue: 'Classrooms', type: 'competition' },
            { time: '02:00 PM', title: 'BusinessVerse', venue: 'Main Hall', type: 'competition' },
            { time: '06:00 PM', title: 'IPL Auction', venue: 'Auditorium', type: 'competition' },
        ],
    },
    {
        day: 'Day 3 - February 1',
        items: [
            { time: '09:00 AM', title: 'Case Closed / Ideathon Finals', venue: 'Meeting Rooms', type: 'competition' },
            { time: '11:00 AM', title: 'Talk: Nagaraja Prakasam', venue: 'Auditorium', type: 'keynote' },
            { time: '02:00 PM', title: 'Pitch On Pitch', venue: 'Auditorium', type: 'competition' },
            { time: '06:00 PM', title: 'Valedictory Function', venue: 'Auditorium', type: 'ceremony' },
        ],
    },
];

// ════════════════════════════════════════════════════════════════════════════
// STYLES (Inline for Maximum Email Compatibility)
// ════════════════════════════════════════════════════════════════════════════

const styles: { [key: string]: React.CSSProperties } = {
    // ─────────────────────────────────────────────────────────────────────────
    // Base Styles
    // ─────────────────────────────────────────────────────────────────────────
    body: {
        backgroundColor: COLORS.creamBase,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: COLORS.textPrimary,
        margin: '0',
        padding: '0',
        WebkitTextSizeAdjust: '100%',
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: COLORS.creamBase,
    },
    section: {
        padding: '24px 20px',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Hero Section
    // ─────────────────────────────────────────────────────────────────────────
    heroSection: {
        padding: '40px 24px 32px',
        textAlign: 'center',
        position: 'relative',
        backgroundColor: COLORS.creamCard,
        borderBottom: `1px solid ${COLORS.border}`,
    },
    logoWrapper: {
        display: 'inline-block',
        backgroundColor: COLORS.white,
        borderRadius: '50%',
        padding: '16px',
        border: `3px solid ${COLORS.gold}`,
        boxShadow: `0 8px 24px rgba(212,165,116,0.25)`,
    },
    logo: {
        display: 'block',
        borderRadius: '50%',
    },
    heroTitle: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '38px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '20px 0 8px',
        lineHeight: '1.2',
        letterSpacing: '0.5px',
    },
    heroTagline: {
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.gold,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        margin: '0 0 20px',
    },
    datePill: {
        display: 'inline-block',
        backgroundColor: COLORS.white,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: '50px',
        padding: '10px 24px',
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Main Card (Greeting)
    // ─────────────────────────────────────────────────────────────────────────
    mainCard: {
        backgroundColor: COLORS.white,
        border: `2px solid ${COLORS.gold}`,
        borderRadius: '20px',
        padding: '32px 24px',
        boxShadow: `0 8px 32px rgba(212,165,116,0.15)`,
        position: 'relative',
    },
    greetingTitle: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '24px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 16px',
        lineHeight: '1.3',
    },
    bodyText: {
        fontSize: '15px',
        lineHeight: '1.7',
        color: COLORS.textPrimary,
        margin: '0 0 14px',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Prize Highlight Box
    // ─────────────────────────────────────────────────────────────────────────
    prizeHighlightBox: {
        backgroundColor: 'rgba(232,122,79,0.08)',
        border: `2px solid rgba(232,122,79,0.25)`,
        borderLeft: `5px solid ${COLORS.burntOrange}`,
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        margin: '24px 0',
    },
    prizeLabel: {
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: COLORS.textSecondary,
        margin: '0 0 6px',
    },
    prizeValue: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '32px',
        fontWeight: '700',
        color: COLORS.burntOrange,
        margin: '0',
        letterSpacing: '0.5px',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Quick Stats Grid (2x2 Table)
    // ─────────────────────────────────────────────────────────────────────────
    statsTable: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '8px',
        margin: '24px 0',
    },
    statCell: {
        width: '50%',
        padding: '0',
    },
    statCard: {
        backgroundColor: COLORS.creamCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '14px',
        padding: '16px 12px',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: COLORS.gold,
        margin: '0 0 4px',
    },
    statValue: {
        fontSize: '13px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0',
        lineHeight: '1.3',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Buttons
    // ─────────────────────────────────────────────────────────────────────────
    primaryButton: {
        display: 'inline-block',
        backgroundColor: COLORS.burntOrange,
        background: `linear-gradient(135deg, ${COLORS.burntOrange}, ${COLORS.gold})`,
        color: COLORS.white,
        fontSize: '15px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        padding: '16px 40px',
        borderRadius: '50px',
        textDecoration: 'none',
        boxShadow: '0 6px 20px rgba(232,122,79,0.35)',
    },
    secondaryButton: {
        display: 'inline-block',
        backgroundColor: 'transparent',
        border: `2px solid ${COLORS.gold}`,
        color: COLORS.gold,
        fontSize: '13px',
        fontWeight: '600',
        padding: '10px 24px',
        borderRadius: '50px',
        textDecoration: 'none',
    },
    textLink: {
        color: COLORS.gold,
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'underline',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Quick Link Chips
    // ─────────────────────────────────────────────────────────────────────────
    chipsContainer: {
        textAlign: 'center',
    },
    chip: {
        display: 'inline-block',
        backgroundColor: COLORS.white,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: '50px',
        padding: '8px 16px',
        margin: '0 4px 8px',
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        textDecoration: 'none',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Section Headers
    // ─────────────────────────────────────────────────────────────────────────
    sectionHeader: {
        textAlign: 'center',
        marginBottom: '28px',
    },
    sectionTitle: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '28px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 10px',
        lineHeight: '1.2',
    },
    sectionUnderline: {
        width: '60px',
        height: '3px',
        background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.burntOrange})`,
        margin: '0 auto 10px',
        borderRadius: '2px',
    },
    sectionSubtitle: {
        fontSize: '13px',
        fontWeight: '500',
        color: COLORS.textSecondary,
        margin: '0',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Event Cards
    // ─────────────────────────────────────────────────────────────────────────
    eventCard: {
        backgroundColor: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `4px solid ${COLORS.gold}`,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '14px',
        position: 'relative',
    },
    categoryBadge: {
        display: 'inline-block',
        backgroundColor: 'rgba(212,165,116,0.12)',
        border: `1px solid ${COLORS.gold}`,
        borderRadius: '10px',
        padding: '3px 10px',
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '10px',
    },
    eventTitle: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '18px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 6px',
        lineHeight: '1.3',
    },
    eventTime: {
        fontSize: '12px',
        fontWeight: '500',
        color: COLORS.textSecondary,
        margin: '0 0 8px',
    },
    eventDescription: {
        fontSize: '13px',
        lineHeight: '1.5',
        color: COLORS.textTertiary,
        margin: '0',
    },
    eventPrizeBadge: {
        backgroundColor: COLORS.gold,
        borderRadius: '14px',
        padding: '14px 16px',
        textAlign: 'center',
    },
    eventPrizeAmount: {
        fontSize: '18px',
        fontWeight: '800',
        color: COLORS.white,
        margin: '0 0 2px',
    },
    eventPrizeLabel: {
        fontSize: '9px',
        fontWeight: '700',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.85)',
        margin: '0',
        letterSpacing: '0.5px',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Speaker Cards
    // ─────────────────────────────────────────────────────────────────────────
    speakerCell: {
        width: '33.33%',
        padding: '6px',
        verticalAlign: 'top',
    },
    speakerCard: {
        backgroundColor: COLORS.creamCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '16px',
        padding: '18px 12px',
        textAlign: 'center',
    },
    speakerAvatarWrapper: {
        display: 'inline-block',
        marginBottom: '10px',
    },
    speakerAvatar: {
        borderRadius: '50%',
        border: `3px solid ${COLORS.gold}`,
        objectFit: 'cover',
    },
    speakerName: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '13px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 4px',
        lineHeight: '1.3',
    },
    speakerTitle: {
        fontSize: '11px',
        fontWeight: '500',
        color: COLORS.textSecondary,
        margin: '0 0 2px',
        lineHeight: '1.3',
    },
    speakerCompany: {
        fontSize: '10px',
        fontWeight: '600',
        color: COLORS.gold,
        margin: '0',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Schedule Section
    // ─────────────────────────────────────────────────────────────────────────
    scheduleWrapper: {
        backgroundColor: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '20px',
        padding: '24px 20px',
    },
    dayHeader: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '18px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        backgroundColor: COLORS.creamCard,
        borderLeft: `4px solid ${COLORS.burntOrange}`,
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '16px',
    },
    scheduleItem: {
        borderLeft: `2px dashed ${COLORS.border}`,
        marginLeft: '10px',
        paddingLeft: '0',
        marginBottom: '12px',
        paddingBottom: '12px',
    },
    timeBadge: {
        display: 'inline-block',
        backgroundColor: COLORS.creamCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '11px',
        fontWeight: '700',
        color: COLORS.gold,
    },
    scheduleItemTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        margin: '0 0 4px',
    },
    scheduleItemVenue: {
        fontSize: '12px',
        fontWeight: '400',
        color: COLORS.textSecondary,
        margin: '0',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Sponsors
    // ─────────────────────────────────────────────────────────────────────────
    sponsorsGrid: {
        backgroundColor: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${COLORS.border}`,
        textAlign: 'center',
    },
    sponsorItem: {
        display: 'inline-block',
        margin: '12px 16px',
    },
    sponsorLogo: {
        maxWidth: '100px',
        height: 'auto',
        filter: 'grayscale(100%)',
        opacity: 0.7,
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Final CTA
    // ─────────────────────────────────────────────────────────────────────────
    finalCtaCard: {
        backgroundColor: COLORS.creamCard,
        border: `2px solid ${COLORS.border}`,
        borderRadius: '20px',
        padding: '40px 28px',
        textAlign: 'center',
    },
    finalCtaTitle: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '24px',
        fontWeight: '700',
        color: COLORS.textPrimary,
        margin: '0 0 12px',
    },
    finalCtaText: {
        fontSize: '14px',
        lineHeight: '1.6',
        color: COLORS.textTertiary,
        margin: '0 0 24px',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Footer
    // ─────────────────────────────────────────────────────────────────────────
    footer: {
        backgroundColor: COLORS.creamDark,
        borderTop: `1px solid ${COLORS.border}`,
        padding: '40px 24px 32px',
        textAlign: 'center',
    },
    footerTagline: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '14px',
        color: COLORS.textSecondary,
        margin: '0 0 20px',
    },
    socialLinks: {
        marginBottom: '24px',
    },
    socialIcon: {
        display: 'inline-block',
        width: '44px',
        height: '44px',
        lineHeight: '44px',
        backgroundColor: 'rgba(212,165,116,0.12)',
        border: `2px solid ${COLORS.gold}`,
        borderRadius: '50%',
        margin: '0 6px',
        fontSize: '18px',
        textDecoration: 'none',
        textAlign: 'center',
    },
    footerDivider: {
        width: '180px',
        height: '1px',
        backgroundColor: COLORS.border,
        margin: '20px auto',
    },
    footerContact: {
        fontSize: '12px',
        color: COLORS.textSecondary,
        margin: '0 0 12px',
    },
    footerAddress: {
        fontSize: '12px',
        lineHeight: '1.5',
        color: COLORS.textSecondary,
        margin: '0 0 20px',
    },
    footerLink: {
        color: COLORS.textSecondary,
        textDecoration: 'none',
    },
    footerCopyright: {
        fontSize: '11px',
        color: COLORS.borderLight,
        margin: '0 0 10px',
    },
    footerUnsubscribe: {
        fontSize: '10px',
        color: COLORS.borderLight,
        margin: '0',
    },
};
