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
    schedule?: Array<{
        day: string;
        items: Array<{
            time: string;
            title: string;
            venue?: string;
        }>;
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
    schedule = [
        {
            day: 'Day 1 - January 30',
            items: [
                { time: '06:00 PM', title: 'Inauguration Ceremony', venue: 'Auditorium' },
                { time: '06:30 PM', title: 'Presidential Address', venue: 'Auditorium' },
                { time: '06:50 PM', title: 'Keynote: Dr. Mylswamy Annadurai', venue: 'Auditorium' },
                { time: '07:30 PM', title: 'Bid & Build Competition', venue: 'Seminar Hall' },
            ]
        },
        {
            day: 'Day 2 - January 31',
            items: [
                { time: '09:00 AM', title: 'MUN / Startup Expo', venue: 'Multiple Venues' },
                { time: '10:00 AM', title: 'Ideathon / Kala Bazaar', venue: 'Classrooms' },
                { time: '02:00 PM', title: 'BusinessVerse', venue: 'Main Hall' },
                { time: '06:00 PM', title: 'IPL Auction', venue: 'Auditorium' },
            ]
        },
        {
            day: 'Day 3 - February 1',
            items: [
                { time: '09:00 AM', title: 'Case Closed / Ideathon Finals', venue: 'Meeting Rooms' },
                { time: '11:00 AM', title: 'Talk: Nagaraja Prakasam', venue: 'Auditorium' },
                { time: '02:00 PM', title: 'Pitch On Pitch', venue: 'Auditorium' },
                { time: '06:00 PM', title: 'Valedictory Function', venue: 'Auditorium' },
            ]
        },
    ],
    sponsors = [],
}: EventReminderEmailProps) => {
    const previewText = `Complete Guide to ${eventDetails.name} | ${eventDetails.dates} | ${eventDetails.prizePool} in prizes`;

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
                    
                    * { box-sizing: border-box; }
                    
                    .hover-lift:hover { 
                        transform: translateY(-2px) !important; 
                        box-shadow: 0 8px 28px rgba(232, 122, 79, 0.5) !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .card-hover:hover { 
                        transform: translateY(-4px) !important; 
                        box-shadow: 0 8px 24px rgba(212, 165, 116, 0.25) !important;
                    }
                    
                    .chip:hover { 
                        background-color: rgba(212,165,116,0.15) !important; 
                        border-color: #D4A574 !important;
                    }
                    
                    @media only screen and (max-width: 600px) {
                        .mobile-hide { display: none !important; }
                        .mobile-stack { 
                            display: block !important; 
                            width: 100% !important; 
                            margin-bottom: 16px !important; 
                        }
                        .mobile-text-center { text-align: center !important; }
                        .mobile-padding { padding: 16px !important; }
                    }
                `}</style>
            </Head>
            <Preview>{subject || previewText}</Preview>
            <Body style={main}>
                {/* Subtle Background Pattern */}
                <div style={backgroundOverlay} />

                <Container style={container}>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 1. HERO HEADER */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={heroSection}>
                        <Row>
                            <Column style={{ width: '70%', verticalAlign: 'middle' }}>
                                <div style={logoContainer}>
                                    <Img
                                        src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                        alt="E-Summit '26 Logo"
                                        width="100"
                                        style={logo}
                                    />
                                </div>
                            </Column>
                            <Column style={{ width: '30%', textAlign: 'right', verticalAlign: 'top' }}>
                                <div style={{ opacity: 0.15, display: 'inline-block' }}>
                                    <DoodleRocket size={24} style={{ margin: '0 4px', transform: 'rotate(15deg)' }} />
                                    <DoodleRocket size={20} style={{ margin: '0 4px', transform: 'rotate(45deg)' }} />
                                    <DoodleRocket size={18} style={{ margin: '0 4px', transform: 'rotate(-20deg)' }} />
                                </div>
                            </Column>
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: '24px', position: 'relative' }}>
                            <Text style={heroTitle}>{eventDetails.name}</Text>
                            <Text style={heroSubtitle}>{eventDetails.tagline}</Text>
                            <div style={dateBadge}>
                                <span style={{ marginRight: '8px' }}>📅</span>
                                {eventDetails.dates}
                            </div>
                        </div>
                    </Section>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 2. MAIN GREETING CARD */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={cardSection}>
                        <div style={greetingCard}>
                            {/* Corner Doodle Accent */}
                            <div style={{ textAlign: 'right', marginBottom: '-16px', opacity: 0.18 }}>
                                <DoodleLightbulb size={24} />
                            </div>

                            <Text style={greetingTitle}>Hello {userName}!</Text>
                            {message && (
                                <Text style={greetingBody}>
                                    {message}
                                </Text>
                            )}
                            <Text style={greetingBody}>
                                The <strong>Entrepreneurship Cell of IIITDM Kancheepuram</strong> is thrilled to present the complete guide to <strong>{eventDetails.name}</strong> — South India's premier entrepreneurship conclave.
                            </Text>
                            <Text style={greetingBody}>
                                Get ready for <strong>30+ hours</strong> of intensive programming featuring high-stakes competitions, inspiring keynotes from industry leaders, hands-on workshops, and unparalleled networking opportunities with fellow innovators and investors.
                            </Text>

                            {/* Prize Pool Highlight */}
                            <div style={highlightBox}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                                <Text style={highlightText}>Total Prize Pool</Text>
                                <Text style={highlightValue}>{eventDetails.prizePool}</Text>
                            </div>

                            {/* Quick Stats Grid */}
                            <Row style={{ marginTop: '32px', marginBottom: '32px' }}>
                                {[
                                    { icon: '📅', label: 'WHEN', value: 'Jan 30 - Feb 1' },
                                    { icon: '📍', label: 'WHERE', value: 'IIITDM Campus' },
                                    { icon: '🏛️', label: 'MODE', value: 'In-Person' },
                                    { icon: '💰', label: 'PRIZES', value: '₹2,00,000+' },
                                ].map((stat, i) => (
                                    <Column key={i} className="mobile-stack" style={{ width: '25%', padding: '0 6px' }}>
                                        <div style={quickStatCard}>
                                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                                            <Text style={quickStatLabel}>{stat.label}</Text>
                                            <Text style={quickStatValue}>{stat.value}</Text>
                                        </div>
                                    </Column>
                                ))}
                            </Row>

                            {/* Primary CTAs */}
                            <div style={{ textAlign: 'center' }}>
                                <Link
                                    href="https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947"
                                    style={primaryButton}
                                    className="hover-lift"
                                >
                                    <span style={{ marginRight: '8px' }}>🚀</span>
                                    Download Your Pass
                                </Link>
                                <div style={{ height: '16px' }} />
                                <Link href={eventDetails.websiteUrl} style={secondaryButton}>
                                    Visit Official Website
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 3. QUICK ACTION CHIPS */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={{ padding: '0 20px 32px', textAlign: 'center' }}>
                        {['⚡ View Events', '🗓️ Schedule', '🎤 Speakers', '🏆 Prizes', '📍 Venue'].map((chip, i) => (
                            <Link
                                key={i}
                                href={`${eventDetails.websiteUrl}#${chip.split(' ')[1].toLowerCase()}`}
                                style={actionChip}
                                className="chip"
                            >
                                {chip}
                            </Link>
                        ))}
                    </Section>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 4. FEATURED EVENTS */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={sectionContainer}>
                        <div style={sectionHeaderContainer}>
                            <Text style={sectionTitle}>Featured Events</Text>
                            <div style={sectionUnderline} />
                            <Text style={sectionSubtitle}>Compete, Innovate, Win Big</Text>
                        </div>

                        {events.map((event, i) => (
                            <div key={i} style={eventCard} className="card-hover">
                                <Row>
                                    <Column style={{ width: '70%', paddingRight: '16px' }}>
                                        <div style={categoryBadge}>{event.category}</div>
                                        <Text style={eventTitle}>{event.name}</Text>
                                        <Text style={eventDate}>
                                            <span style={{ marginRight: '6px' }}>🕐</span>
                                            {event.date}
                                        </Text>
                                        <Text style={eventDescription}>{event.description}</Text>
                                    </Column>
                                    <Column style={{ width: '30%', textAlign: 'right', verticalAlign: 'middle' }}>
                                        <div style={prizeBadge}>
                                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🏆</div>
                                            <Text style={prizeAmount}>{event.prize}</Text>
                                            <Text style={prizeLabel}>Prize</Text>
                                        </div>
                                    </Column>
                                </Row>
                                {/* Decorative accent */}
                                <div style={{ position: 'absolute', top: '12px', right: '12px', opacity: 0.08 }}>
                                    <DoodleGraphArrow size={32} />
                                </div>
                            </div>
                        ))}
                    </Section>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 5. SPEAKERS SHOWCASE */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={sectionContainer}>
                        <div style={sectionHeaderContainer}>
                            <Text style={sectionTitle}>Meet Our Speakers</Text>
                            <div style={sectionUnderline} />
                            <Text style={sectionSubtitle}>Industry Leaders & Innovators</Text>
                        </div>

                        <Row>
                            {speakers.slice(0, 6).map((speaker, i) => (
                                <Column
                                    key={i}
                                    className="mobile-stack"
                                    style={{
                                        width: '33.33%',
                                        padding: '0 8px',
                                        marginBottom: '20px',
                                        verticalAlign: 'top'
                                    }}
                                >
                                    <div style={speakerCard} className="card-hover">
                                        <div style={speakerImageWrapper}>
                                            <Img
                                                src={speaker.image || 'https://via.placeholder.com/100'}
                                                alt={speaker.name}
                                                style={speakerImage}
                                            />
                                            {/* Speech bubble accent */}
                                            <div style={{ position: 'absolute', top: '-8px', right: '-8px', zIndex: -1, opacity: 0.1 }}>
                                                <DoodleSpeechBubble size={50} />
                                            </div>
                                        </div>
                                        <Text style={speakerName}>{speaker.name}</Text>
                                        <Text style={speakerTitle}>{speaker.title}</Text>
                                        <Text style={speakerCompany}>{speaker.company}</Text>
                                    </div>
                                </Column>
                            ))}
                        </Row>
                    </Section>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 6. EVENT SCHEDULE */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={sectionContainer}>
                        <div style={sectionHeaderContainer}>
                            <Text style={sectionTitle}>Event Schedule</Text>
                            <div style={sectionUnderline} />
                            <Text style={sectionSubtitle}>3 Days of Intense Action</Text>
                        </div>

                        <div style={scheduleContainer}>
                            {schedule.map((day, dayIndex) => (
                                <div key={dayIndex} style={{ marginBottom: '32px' }}>
                                    <div style={dayHeader}>
                                        <span style={{ marginRight: '12px', fontSize: '20px' }}>📅</span>
                                        {day.day}
                                    </div>

                                    {day.items.map((item, itemIndex) => (
                                        <div key={itemIndex} style={scheduleItem}>
                                            <Row>
                                                <Column style={{ width: '25%' }}>
                                                    <div style={timeBadge}>{item.time}</div>
                                                </Column>
                                                <Column style={{ width: '75%', paddingLeft: '16px' }}>
                                                    <Text style={scheduleTitle}>{item.title}</Text>
                                                    {item.venue && (
                                                        <Text style={scheduleVenue}>
                                                            <span style={{ marginRight: '6px' }}>📍</span>
                                                            {item.venue}
                                                        </Text>
                                                    )}
                                                </Column>
                                            </Row>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 7. SPONSORS (if provided) */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    {sponsors.length > 0 && (
                        <Section style={sectionContainer}>
                            <div style={sectionHeaderContainer}>
                                <Text style={sectionTitle}>Our Partners</Text>
                                <div style={sectionUnderline} />
                            </div>

                            <div style={sponsorsGrid}>
                                {sponsors.map((sponsor, i) => (
                                    <div key={i} style={sponsorLogo}>
                                        <Img
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            style={{ maxWidth: '120px', height: 'auto', opacity: 0.75 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 8. FINAL CTA SECTION */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={{ padding: '20px' }}>
                        <div style={finalCTAContainer}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
                            <Text style={finalCTATitle}>Ready to Join E-Summit '26?</Text>
                            <Text style={finalCTASubtext}>
                                Register now and be part of South India's most exciting entrepreneurship event.
                                Limited seats available!
                            </Text>
                            <Link
                                href="https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947"
                                style={{ ...primaryButton, marginTop: '24px' }}
                                className="hover-lift"
                            >
                                <span style={{ marginRight: '8px' }}>✨</span>
                                Register Now
                            </Link>
                            <div style={{ marginTop: '16px' }}>
                                <Link href={`${eventDetails.websiteUrl}#schedule`} style={textLink}>
                                    View Full Schedule →
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ════════════════════════════════════════════════════════════ */}
                    {/* 9. FOOTER */}
                    {/* ════════════════════════════════════════════════════════════ */}
                    <Section style={footer}>
                        {/* Decorative doodles */}
                        <div style={{ textAlign: 'center', marginBottom: '24px', opacity: 0.1 }}>
                            <DoodleHandshake size={28} style={{ margin: '0 12px' }} />
                            <DoodleLightbulb size={28} style={{ margin: '0 12px' }} />
                            <DoodleHandshake size={28} style={{ margin: '0 12px' }} />
                        </div>

                        <Img
                            src="https://esummit26-iiitdm.vercel.app/ecell.png"
                            alt="E-Cell Logo"
                            width="60"
                            style={{ margin: '0 auto 20px', display: 'block', opacity: 0.9 }}
                        />

                        <Text style={footerTagline}>
                            <em>"Empowering Tomorrow's Entrepreneurs Today"</em>
                        </Text>

                        <div style={socialContainer}>
                            {[
                                { icon: '📷', url: 'https://instagram.com/ecell_iiitdm', label: 'Instagram' },
                                { icon: '💼', url: 'https://linkedin.com/company/ecelliiitdm', label: 'LinkedIn' },
                                { icon: '🌐', url: eventDetails.websiteUrl, label: 'Website' },
                            ].map((social, i) => (
                                <Link key={i} href={social.url} style={socialIcon}>
                                    {social.icon}
                                </Link>
                            ))}
                        </div>

                        <div style={footerDivider} />

                        <Text style={footerContact}>
                            📧 <Link href="mailto:ecell@iiitdm.ac.in" style={footerLink}>ecell@iiitdm.ac.in</Link>
                            <span style={{ margin: '0 12px', color: '#E8E3DC' }}>•</span>
                            📞 <Link href="tel:+919876543210" style={footerLink}>+91 98765 43210</Link>
                        </Text>

                        <Text style={footerAddress}>
                            IIITDM Kancheepuram, Vandalur-Kelambakkam Road<br />
                            Chennai - 600127, Tamil Nadu, India
                        </Text>

                        <div style={footerDivider} />

                        <Text style={footerCopyright}>
                            © 2026 E-Summit IIITDM Kancheepuram. All rights reserved.
                        </Text>

                        <Text style={footerUnsubscribe}>
                            <Link href="#unsubscribe" style={footerLink}>Unsubscribe</Link>
                            <span style={{ margin: '0 8px' }}>•</span>
                            <Link href="#preferences" style={footerLink}>Email Preferences</Link>
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// DOODLE COMPONENTS (Inline SVG for email compatibility)
// ════════════════════════════════════════════════════════════════

const DoodleRocket = ({ size = 20, style = {} }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <path d="M12 2L15 8L21 9L16 14L17 20L12 17L7 20L8 14L3 9L9 8L12 2Z"
            stroke="#C4BCB0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoodleLightbulb = ({ size = 20, style = {} }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <circle cx="12" cy="10" r="5" stroke="#D4A574" strokeWidth="1.5" />
        <path d="M9 15h6M10 18h4" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const DoodleHandshake = ({ size = 20, style = {} }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <path d="M4 12L8 8L12 12L16 8L20 12" stroke="#C4BCB0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const DoodleGraphArrow = ({ size = 20, style = {} }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <path d="M4 18L9 13L13 17L20 10M20 10V15M20 10H15"
            stroke="#E87A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoodleSpeechBubble = ({ size = 20, style = {} }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="#D4A574" strokeWidth="1.5" />
        <path d="M12 17L9 21V17" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// ════════════════════════════════════════════════════════════════
// STYLES - Premium Cream Aesthetic
// ════════════════════════════════════════════════════════════════

const colors = {
    creamBase: '#FFF9F0',
    creamCard: '#FFFBF5',
    creamDark: '#F5EFE6',
    white: '#FFFFFF',
    textPrimary: '#3D3935',
    textSecondary: '#9E9589',
    textTertiary: '#716A5F',
    gold: '#D4A574',
    goldLight: '#E8C9A8',
    burntOrange: '#E87A4F',
    orangeLight: '#F5A57A',
    sageGreen: '#9BB89F',
    dustyRose: '#D9A5A0',
    border: '#E8E3DC',
    borderLight: '#C4BCB0',
};

const main: React.CSSProperties = {
    backgroundColor: colors.creamBase,
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: colors.textPrimary,
    padding: '0',
    margin: '0',
};

const backgroundOverlay: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.border} 1px, transparent 0)`,
    backgroundSize: '40px 40px',
    opacity: 0.4,
    pointerEvents: 'none',
    zIndex: 0,
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: colors.creamBase,
    position: 'relative',
    zIndex: 1,
};

const heroSection: React.CSSProperties = {
    padding: '40px 32px 24px',
    textAlign: 'center',
};

const logoContainer: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.white,
    borderRadius: '50%',
    padding: '20px',
    border: `2px solid ${colors.gold}`,
    boxShadow: `0 8px 24px rgba(212,165,116,0.3)`,
};

const logo: React.CSSProperties = {
    display: 'block',
};

const heroTitle: React.CSSProperties = {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '42px',
    fontWeight: '800',
    color: colors.textPrimary,
    margin: '0 0 12px',
    lineHeight: '1.2',
    letterSpacing: '1px',
};

const heroSubtitle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '500',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    margin: '0 0 20px',
};

const dateBadge: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: '50px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

const cardSection: React.CSSProperties = {
    padding: '0 20px 40px',
};

const greetingCard: React.CSSProperties = {
    backgroundColor: colors.creamCard,
    border: `2px solid ${colors.gold}`,
    borderRadius: '24px',
    padding: '36px 32px',
    boxShadow: `0 8px 32px rgba(212,165,116,0.2), inset 0 1px 0 rgba(255,255,255,0.9)`,
    position: 'relative',
};

const greetingTitle: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '26px',
    fontWeight: '700',
    color: colors.textPrimary,
    margin: '0 0 16px',
};

const greetingBody: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.8',
    color: colors.textPrimary,
    margin: '0 0 16px',
};

const highlightBox: React.CSSProperties = {
    backgroundColor: 'rgba(244,164,96,0.12)',
    border: `2px solid rgba(244,164,96,0.3)`,
    borderLeft: `5px solid #F4A460`,
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    marginTop: '24px',
    boxShadow: '0 4px 16px rgba(244,164,96,0.15)',
};

const highlightText: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: colors.textSecondary,
    margin: '0 0 8px',
};

const highlightValue: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '32px',
    fontWeight: '800',
    color: colors.burntOrange,
    margin: '0',
    textShadow: '0 2px 4px rgba(232,122,79,0.2)',
};

const quickStatCard: React.CSSProperties = {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '16px 12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
};

const quickStatLabel: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: colors.gold,
    margin: '0 0 6px',
};

const quickStatValue: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '700',
    color: colors.textPrimary,
    margin: '0',
    lineHeight: '1.3',
};

const primaryButton: React.CSSProperties = {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${colors.burntOrange}, ${colors.gold})`,
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '18px 48px',
    borderRadius: '50px',
    textDecoration: 'none',
    boxShadow: '0 6px 20px rgba(232,122,79,0.4)',
    border: '2px solid rgba(255,255,255,0.3)',
};

const secondaryButton: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: 'transparent',
    border: `2px solid ${colors.gold}`,
    color: colors.gold,
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px 32px',
    borderRadius: '50px',
    textDecoration: 'none',
};

const actionChip: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: '50px',
    padding: '10px 20px',
    margin: '0 6px 10px',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textPrimary,
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const sectionContainer: React.CSSProperties = {
    padding: '32px 20px',
};

const sectionHeaderContainer: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
};

const sectionTitle: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '32px',
    fontWeight: '800',
    color: colors.textPrimary,
    margin: '0 0 12px',
    lineHeight: '1.2',
};

const sectionUnderline: React.CSSProperties = {
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, ${colors.gold}, ${colors.burntOrange})`,
    margin: '0 auto 12px',
    borderRadius: '2px',
    boxShadow: '0 2px 8px rgba(212,165,116,0.4)',
};

const sectionSubtitle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textSecondary,
    margin: '0',
};

const eventCard: React.CSSProperties = {
    backgroundColor: colors.white,
    background: `linear-gradient(to right, ${colors.white}, ${colors.creamBase})`,
    border: `1px solid ${colors.border}`,
    borderLeft: `5px solid ${colors.gold}`,
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px',
    position: 'relative',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
};

const categoryBadge: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: 'rgba(212,165,116,0.15)',
    border: `1px solid ${colors.gold}`,
    borderRadius: '12px',
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.gold,
    marginBottom: '12px',
    letterSpacing: '0.5px',
};

const eventTitle: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '20px',
    fontWeight: '700',
    color: colors.textPrimary,
    margin: '0 0 8px',
};

const eventDate: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '500',
    color: colors.textSecondary,
    margin: '0 0 12px',
};

const eventDescription: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: colors.textTertiary,
    margin: '0',
};

const prizeBadge: React.CSSProperties = {
    backgroundColor: colors.gold,
    borderRadius: '16px',
    padding: '16px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(212,165,116,0.4)',
};

const prizeAmount: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '800',
    color: '#FFFFFF',
    margin: '0 0 4px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const prizeLabel: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
    margin: '0',
    letterSpacing: '1px',
};

const speakerCard: React.CSSProperties = {
    backgroundColor: colors.creamCard,
    border: `1px solid ${colors.border}`,
    borderRadius: '20px',
    padding: '24px 16px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(212,165,116,0.15)',
    position: 'relative',
    height: '100%',
};

const speakerImageWrapper: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px',
};

const speakerImage: React.CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `3px solid ${colors.gold}`,
    boxShadow: '0 4px 16px rgba(212,165,116,0.3)',
};

const speakerName: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '16px',
    fontWeight: '700',
    color: colors.textPrimary,
    margin: '0 0 6px',
};

const speakerTitle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '500',
    color: colors.textSecondary,
    margin: '0 0 4px',
    lineHeight: '1.4',
};

const speakerCompany: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '500',
    color: colors.gold,
    margin: '0',
};

const scheduleContainer: React.CSSProperties = {
    backgroundColor: colors.creamCard,
    border: `1px solid ${colors.border}`,
    borderRadius: '24px',
    padding: '32px 28px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
};

const dayHeader: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '22px',
    fontWeight: '700',
    color: colors.textPrimary,
    backgroundColor: colors.white,
    borderLeft: `5px solid ${colors.burntOrange}`,
    borderRadius: '12px',
    padding: '14px 20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const scheduleItem: React.CSSProperties = {
    borderLeft: `2px dashed ${colors.border}`,
    paddingLeft: '0',
    marginBottom: '16px',
    paddingBottom: '16px',
};

const timeBadge: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    color: colors.gold,
    textAlign: 'center',
};

const scheduleTitle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: '0 0 6px',
};

const scheduleVenue: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '400',
    color: colors.textSecondary,
    margin: '0',
};

const sponsorsGrid: React.CSSProperties = {
    backgroundColor: colors.white,
    borderRadius: '20px',
    padding: '32px 24px',
    border: `1px solid ${colors.border}`,
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
};

const sponsorLogo: React.CSSProperties = {
    display: 'inline-block',
    margin: '16px 20px',
    filter: 'grayscale(100%) opacity(0.7)',
};

const finalCTAContainer: React.CSSProperties = {
    backgroundColor: colors.creamCard,
    background: `linear-gradient(135deg, ${colors.creamCard}, ${colors.creamDark})`,
    border: `2px solid ${colors.border}`,
    borderRadius: '24px',
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(212,165,116,0.15)',
};

const finalCTATitle: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '28px',
    fontWeight: '800',
    color: colors.textPrimary,
    margin: '0 0 16px',
};

const finalCTASubtext: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.7',
    color: colors.textTertiary,
    margin: '0',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
};

const textLink: React.CSSProperties = {
    color: colors.gold,
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'underline',
};

const footer: React.CSSProperties = {
    backgroundColor: colors.creamDark,
    borderTop: `1px solid ${colors.border}`,
    padding: '48px 32px 36px',
    textAlign: 'center',
    marginTop: '32px',
};

const footerTagline: React.CSSProperties = {
    fontFamily: "'Lora', serif",
    fontSize: '16px',
    color: colors.textSecondary,
    margin: '0 0 24px',
};

const socialContainer: React.CSSProperties = {
    marginBottom: '28px',
};

const socialIcon: React.CSSProperties = {
    display: 'inline-block',
    width: '48px',
    height: '48px',
    lineHeight: '48px',
    backgroundColor: 'rgba(212,165,116,0.15)',
    border: `2px solid ${colors.gold}`,
    borderRadius: '50%',
    margin: '0 8px',
    fontSize: '20px',
    textDecoration: 'none',
    textAlign: 'center',
};

const footerDivider: React.CSSProperties = {
    width: '200px',
    height: '1px',
    backgroundColor: colors.border,
    margin: '24px auto',
    opacity: 0.6,
};

const footerContact: React.CSSProperties = {
    fontSize: '13px',
    color: colors.textSecondary,
    margin: '0 0 16px',
};

const footerAddress: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.6',
    color: colors.textSecondary,
    margin: '0 0 24px',
};

const footerLink: React.CSSProperties = {
    color: colors.textSecondary,
    textDecoration: 'none',
};

const footerCopyright: React.CSSProperties = {
    fontSize: '12px',
    color: colors.borderLight,
    margin: '0 0 12px',
};

const footerUnsubscribe: React.CSSProperties = {
    fontSize: '11px',
    color: colors.borderLight,
    margin: '0',
};