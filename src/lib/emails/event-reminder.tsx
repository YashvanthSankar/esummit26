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
    LocationPin,
    CoffeeCup,
    StarBurst,
    MoneyBag,
    Notepad,
    Flame,
    BarChart,
    Clock,
    Target
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
        time?: string;
        category?: string;
        prize?: string;
        description?: string;
    }>;
    speakers?: Array<{
        name: string;
        title: string;
        company: string;
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
    subject = "You're Invited: E-Summit '26 🚀",
    message,
    eventDetails = {
        name: "E-Summit '26",
        dates: 'Jan 30 - Feb 1, 2026',
        venue: 'IIITDM Kancheepuram',
        prizePool: '₹2,00,000+',
        websiteUrl: 'https://esummit26-iiitdm.vercel.app',
    },
    events = [
        {
            name: "Pitch Perfect",
            category: "Flagship",
            date: "Jan 31, 2026",
            time: "10:00 AM",
            prize: "₹50,000",
            description: "The ultimate business plan competition. Pitch your startup idea to investors."
        },
        {
            name: "CodeSprint",
            category: "Hackathon",
            date: "Jan 30, 2026",
            time: "06:00 PM",
            prize: "₹30,000",
            description: "24-hour intense hackathon solving real-world problems."
        },
        {
            name: "Startup Showcase",
            category: "Exhibition",
            date: "Feb 1, 2026",
            time: "09:00 AM",
            prize: "Networking",
            description: "Display your product to thousands of attendees and potential customers."
        }
    ],
    speakers = [
        {
            name: "Sridhar Vembu",
            title: "CEO & Founder",
            company: "Zoho Corp",
            image: "https://esummit26-iiitdm.vercel.app/speakers/sridhar.jpg"
        },
        {
            name: "Girish Mathrubootham",
            title: "CEO & Founder",
            company: "Freshworks",
            image: "https://esummit26-iiitdm.vercel.app/speakers/girish.jpg"
        },
        {
            name: "Nithin Kamath",
            title: "CEO & Founder",
            company: "Zerodha",
            image: "https://esummit26-iiitdm.vercel.app/speakers/nithin.jpg"
        }
    ],
}: EventReminderEmailProps) => {
    const previewText = `₹2 Lakh+ Prize Pool, Top Speakers & More inside! - ${eventDetails.name}`;

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap');
                    
                    .hover-lift:hover { transform: translateY(-4px) !important; box-shadow: 0 8px 24px rgba(212,165,116,0.25) !important; }
                    .button-hover:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(232,122,79,0.5) !important; background: linear-gradient(135deg, #F5A57A, #E8C9A8) !important; }
                    .chip-hover:hover { background-color: rgba(212,165,116,0.15) !important; border-color: #D4A574 !important; }
                    .logo-hover:hover { filter: grayscale(0%) opacity(1) !important; }
                    
                    @media only screen and (max-width: 600px) {
                        .mobile-stack {
                            display: block !important;
                            width: 100% !important;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                            margin-bottom: 24px !important;
                        }
                        .mobile-center {
                            text-align: center !important;
                        }
                        .mobile-full-width {
                            width: 100% !important;
                            max-width: 100% !important;
                        }
                        .mobile-hide {
                            display: none !important;
                        }
                    }
                `}</style>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>

                    {/* ════ HEADER ════ */}
                    <Section style={header}>
                        {/* Doodle Cluster Top-Right */}
                        <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.15 }}>
                            <Rocket size={20} color="#C4BCB0" style={{ transform: 'rotate(15deg)', marginBottom: '8px' }} />
                            <StarBurst size={12} color="#C4BCB0" style={{ marginLeft: '15px' }} />
                        </div>

                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                            <div style={logoContainer}>
                                <Img
                                    src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                    alt="E-Summit Logo"
                                    width="100"
                                    style={{ display: 'block', margin: '0 auto' }}
                                />
                            </div>

                            <Text style={headerTitle}>E-SUMMIT '26</Text>
                            <Text style={headerSubtitle}>THE ENTREPRENEURSHIP CONCLAVE</Text>

                            <div style={dateBadge}>
                                Jan 30 - Feb 1, 2026
                            </div>
                        </div>
                    </Section>

                    {/* ════ HERO GREETING CARD ════ */}
                    <Section style={{ padding: '0 20px 32px' }}>
                        <div style={greetingCard}>
                            {/* Corner Accent */}
                            <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.18 }}>
                                <Lightbulb size={14} color="#D4A574" />
                            </div>

                            <Text style={greetingTitle}>Hello Fellow Innovator,</Text>
                            <Text style={greetingBody}>
                                The wait is over. South India's premier entrepreneurship summit is back, bigger and bolder than ever.
                                Join us at IIITDM Kancheepuram for 3 days of groundbreaking sessions, intense competitions, and networking that could change your career trajectory.
                            </Text>

                            <div style={highlightBox}>
                                <Row>
                                    <Column style={{ width: '40px', verticalAlign: 'middle' }}>
                                        <Trophy size={24} color="#E87A4F" />
                                    </Column>
                                    <Column style={{ verticalAlign: 'middle' }}>
                                        <Text style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: 700, color: '#E87A4F' }}>
                                            Total Prize Pool: {eventDetails.prizePool}
                                        </Text>
                                    </Column>
                                </Row>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                <Link href="https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947" style={primaryButton} className="button-hover">
                                    <span style={{ marginRight: '10px' }}>🚀</span>
                                    DOWNLOAD YOUR PASS
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ════ QUICK INFO CHIPS ════ */}
                    <Section style={{ padding: '0 20px 40px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-block' }}>
                            {[
                                { label: 'View Events', icon: <Flame size={12} color="#D4A574" />, href: '#events' },
                                { label: 'Schedule', icon: <Calendar size={12} color="#D4A574" />, href: '#schedule' },
                                { label: 'Speakers', icon: <SpeechBubble size={12} color="#D4A574" />, href: '#speakers' },
                                { label: 'Venue', icon: <LocationPin size={12} color="#D4A574" />, href: '#venue' }
                            ].map((item, i) => (
                                <Link key={i} href={`${eventDetails.websiteUrl}/${item.href}`} style={chip} className="chip-hover">
                                    <span style={{ marginRight: '8px', verticalAlign: 'text-top' }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </Section>

                    {/* ════ EVENT DETAILS SECTION ════ */}
                    <Section style={{ padding: '0 20px 40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Text style={sectionTitle}>Event Details</Text>
                            <div style={sectionUnderline} />
                        </div>

                        <Row>
                            <Column className="mobile-stack" style={{ width: '48%', paddingRight: '1%' }}>
                                <div style={detailCard} className="hover-lift">
                                    <div style={detailIconContainer}><Calendar size={28} color="#D4A574" /></div>
                                    <Text style={detailLabel}>WHEN</Text>
                                    <Text style={detailValue}>{eventDetails.dates}</Text>
                                </div>
                            </Column>
                            <Column className="mobile-stack" style={{ width: '48%', paddingLeft: '1%' }}>
                                <div style={detailCard} className="hover-lift">
                                    <div style={detailIconContainer}><LocationPin size={28} color="#D4A574" /></div>
                                    <Text style={detailLabel}>WHERE</Text>
                                    <Text style={detailValue}>IIITDM Kancheepuram</Text>
                                </div>
                            </Column>
                        </Row>
                        <div style={{ height: '20px' }}></div>
                        <Row>
                            <Column className="mobile-stack" style={{ width: '48%', paddingRight: '1%' }}>
                                <div style={detailCard} className="hover-lift">
                                    <div style={detailIconContainer}><Gear size={28} color="#D4A574" /></div>
                                    <Text style={detailLabel}>MODE</Text>
                                    <Text style={detailValue}>In-Person Event</Text>
                                </div>
                            </Column>
                            <Column className="mobile-stack" style={{ width: '48%', paddingLeft: '1%' }}>
                                <div style={detailCard} className="hover-lift">
                                    <div style={detailIconContainer}><MoneyBag size={28} color="#D4A574" /></div>
                                    <Text style={detailLabel}>PRIZE POOL</Text>
                                    <Text style={{ ...detailValue, color: '#E87A4F' }}>{eventDetails.prizePool}</Text>
                                </div>
                            </Column>
                        </Row>
                    </Section>

                    {/* ════ FEATURED EVENTS ════ */}
                    <Section style={{ padding: '0 20px 40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Text style={sectionTitle}>Featured Events</Text>
                            <Text style={sectionSubtitle}>Compete, Innovate, Win</Text>
                        </div>

                        {events.map((event, i) => (
                            <div key={i} style={eventCard} className="hover-lift">
                                <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                                    <tr>
                                        <td style={{ verticalAlign: 'top' }}>
                                            <Text style={eventCardTitle}>{event.name}</Text>
                                            <div style={categoryBadge}>{event.category}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                                <Clock size={12} color="#9E9589" style={{ marginRight: '6px' }} />
                                                <Text style={eventMeta}>{event.date} • {event.time}</Text>
                                            </div>
                                            <Text style={eventDescription}>{event.description}</Text>
                                        </td>
                                        <td width="100" style={{ verticalAlign: 'top', textAlign: 'right' }}>
                                            <div style={eventPrizeBadge}>
                                                <Trophy size={20} color="#FFF" style={{ marginBottom: '4px' }} />
                                                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>{event.prize?.replace('₹', '')}</div>
                                                <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>PRIZE</div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <div style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.15 }}>
                                    <GraphArrow size={12} color="#D4A574" />
                                </div>
                            </div>
                        ))}
                    </Section>

                    {/* ════ SPEAKERS ════ */}
                    <Section style={{ padding: '0 20px 40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Text style={sectionTitle}>Meet Our Speakers</Text>
                            <Text style={sectionSubtitle}>Industry Leaders & Entrepreneurs</Text>
                        </div>

                        <Row>
                            {speakers.map((speaker, i) => (
                                <Column key={i} className="mobile-stack" style={{ width: '33.33%', padding: '0 6px', verticalAlign: 'top' }}>
                                    <div style={speakerCard} className="hover-lift">
                                        <div style={speakerImageContainer}>
                                            <Img src={speaker.image} style={speakerImage} alt={speaker.name} />
                                            <div style={{ position: 'absolute', zIndex: 0, top: '-5px', right: '-10px', opacity: 0.1 }}>
                                                <SpeechBubble size={40} color="#D4A574" />
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

                    {/* ════ SCHEDULE ════ */}
                    <Section style={{ padding: '0 20px 40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Text style={sectionTitle}>Event Schedule</Text>
                        </div>

                        <div style={timelineContainer}>
                            {/* DAY 1 */}
                            <div style={dayHeader}>
                                DAY 1 - JAN 30
                            </div>
                            <div style={timelineItem}>
                                <div style={timeBadge}>09:00 AM</div>
                                <div style={timelineContent}>
                                    <Text style={timelineEventTitle}>Registration & Breakfast</Text>
                                    <Text style={timelineEventVenue}>Main Auditorium Foyer</Text>
                                </div>
                            </div>
                            <div style={timelineItem}>
                                <div style={timeBadge}>10:30 AM</div>
                                <div style={timelineContent}>
                                    <Text style={timelineEventTitle}>Opening Ceremony</Text>
                                    <Text style={timelineEventVenue}>Main Auditorium</Text>
                                </div>
                            </div>
                            <div style={timelineItem}>
                                <div style={timeBadge}>02:00 PM</div>
                                <div style={timelineContent}>
                                    <Text style={timelineEventTitle}>CodeSprint Hackathon Begins</Text>
                                    <Text style={timelineEventVenue}>Seminar Hall 1</Text>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* ════ SPONSORS ════ */}
                    <Section style={{ padding: '0 20px 40px', textAlign: 'center' }}>
                        <Text style={{ ...sectionTitle, fontSize: '20px', marginBottom: '24px' }}>Our Partners</Text>

                        <div style={partnersContainer}>
                            <Row>
                                <Column style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={sponsorPlaceholder}>Sponsor 1</div>
                                </Column>
                                <Column style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={sponsorPlaceholder}>Sponsor 2</div>
                                </Column>
                                <Column style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={sponsorPlaceholder}>Sponsor 3</div>
                                </Column>
                            </Row>
                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', opacity: 0.1 }}>
                                <Handshake size={24} color="#D4A574" />
                            </div>
                        </div>
                    </Section>

                    {/* ════ CTA SECTION ════ */}
                    <Section style={{ padding: '0 20px 40px' }}>
                        <div style={ctaContainer}>
                            <div style={{ marginBottom: '20px' }}>
                                <Rocket size={48} color="#D4A574" />
                            </div>
                            <Text style={ctaHeadline}>Ready to Join E-Summit '26?</Text>
                            <Text style={ctaSubtext}>Register now and be part of South India's premier entrepreneurship event.</Text>

                            <Link href="https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947" style={primaryButton} className="button-hover">
                                REGISTER NOW
                            </Link>

                            <div style={{ marginTop: '16px' }}>
                                <Link href={eventDetails.websiteUrl} style={ctaSecondaryLink}>
                                    View Full Schedule
                                </Link>
                            </div>
                        </div>
                    </Section>

                    {/* ════ FOOTER ════ */}
                    <Section style={footer}>
                        <Img
                            src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                            width="60"
                            style={{ opacity: 0.9, margin: '0 auto 24px', display: 'block' }}
                        />
                        <Text style={footerTagline}>Where Entrepreneurs Are Made</Text>

                        <div style={{ margin: '24px 0' }}>
                            <Text style={contactInfo}>📧 esummit@iiitdm.ac.in</Text>
                        </div>

                        <div style={footerDivider} />

                        <Text style={footerLegal}>
                            © 2026 E-Summit IIITDM Kancheepuram. All rights reserved.
                        </Text>
                        <Link href="#" style={unsubscribeLink}>Unsubscribe</Link>

                        {/* Random Doodles Background */}
                        <div style={{ position: 'absolute', bottom: '20px', left: '20px', opacity: 0.08 }}>
                            <CoffeeCup size={24} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '40px', right: '30px', opacity: 0.08 }}>
                            <Gear size={24} />
                        </div>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// STYLES SYSTEM
// ════════════════════════════════════════════════════════════════

const colors = {
    creamBackground: '#FFF9F0',
    creamCard: '#FFFBF5',
    creamDark: '#F5EFE6',
    white: '#FFFFFF',
    greyUltraLight: '#E8E3DC',
    greyMedium: '#9E9589',
    greyDark: '#716A5F',
    charcoal: '#3D3935',
    gold: '#D4A574',
    goldLight: '#E8C9A8',
    orangeBurnt: '#E87A4F',
    orangeLight: '#F5A57A',
};

const fonts = {
    display: "'Lora', 'Georgia', serif",
    body: "'Poppins', 'Inter', -apple-system, sans-serif",
};

const main: React.CSSProperties = {
    backgroundColor: colors.creamBackground,
    fontFamily: fonts.body,
    padding: '40px 0',
};

const container: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: colors.creamBackground,
};

const header: React.CSSProperties = {
    padding: '60px 20px 40px',
    backgroundColor: colors.creamBackground,
    textAlign: 'center',
    position: 'relative',
};

const logoContainer: React.CSSProperties = {
    width: '120px',
    height: '120px',
    backgroundColor: colors.white,
    border: `2px solid ${colors.gold}`,
    borderRadius: '50%',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(212,165,116,0.3)',
    overflow: 'hidden',
    padding: '10px',
};

const headerTitle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '36px',
    fontWeight: 700,
    color: colors.charcoal,
    margin: '0 0 8px',
    letterSpacing: '1px',
};

const headerSubtitle: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '14px',
    fontWeight: 600,
    color: colors.gold,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    margin: '0 0 24px',
};

const dateBadge: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.white,
    border: `1.5px solid ${colors.greyUltraLight}`,
    padding: '8px 20px',
    borderRadius: '50px',
    fontFamily: fonts.body,
    fontSize: '14px',
    color: colors.charcoal,
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

const greetingCard: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.creamCard} 0%, ${colors.white} 100%)`,
    border: `2px solid ${colors.gold}`,
    borderImage: `linear-gradient(90deg, ${colors.gold}, ${colors.greyUltraLight}, ${colors.gold}) 1`,
    borderRadius: '24px',
    padding: '40px 36px',
    boxShadow: '0 12px 32px rgba(212,165,116,0.1)',
    position: 'relative',
};

const greetingTitle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '24px',
    fontWeight: 700,
    color: colors.charcoal,
    marginBottom: '20px',
};

const greetingBody: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '15px',
    fontWeight: 400,
    color: colors.charcoal,
    lineHeight: 1.8,
    marginBottom: '24px',
};

const highlightBox: React.CSSProperties = {
    backgroundColor: 'rgba(244,164,96,0.12)',
    borderLeft: `4px solid ${colors.gold}`,
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '32px',
};

const primaryButton: React.CSSProperties = {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${colors.orangeBurnt}, ${colors.gold})`,
    padding: '18px 48px',
    borderRadius: '50px',
    fontFamily: fonts.body,
    fontSize: '16px',
    fontWeight: 700,
    color: colors.white,
    textDecoration: 'none',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    boxShadow: '0 6px 20px rgba(232,122,79,0.4)',
};

const chip: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: colors.white,
    border: `1.5px solid ${colors.greyUltraLight}`,
    padding: '10px 20px',
    borderRadius: '50px',
    fontFamily: fonts.body,
    fontSize: '13px',
    fontWeight: 600,
    color: colors.charcoal,
    textDecoration: 'none',
    margin: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const sectionTitle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '32px',
    fontWeight: 700,
    color: colors.charcoal,
    marginBottom: '10px',
};

const sectionSubtitle: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '14px',
    fontWeight: 500,
    color: colors.greyMedium,
    margin: 0,
};

const sectionUnderline: React.CSSProperties = {
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, ${colors.gold}, ${colors.orangeBurnt})`,
    margin: '10px auto 0',
    borderRadius: '2px',
};

const detailCard: React.CSSProperties = {
    backgroundColor: colors.white,
    border: `1px solid ${colors.greyUltraLight}`,
    borderRadius: '20px',
    padding: '28px 20px',
    textAlign: 'center',
    boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
    height: '100%',
    boxSizing: 'border-box',
};

const detailIconContainer: React.CSSProperties = {
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(212,165,116,0.12)',
    borderRadius: '50%',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const detailLabel: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: colors.greyMedium,
    letterSpacing: '1.5px',
    marginBottom: '8px',
};

const detailValue: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '16px',
    fontWeight: 700,
    color: colors.charcoal,
    lineHeight: 1.4,
};

const eventCard: React.CSSProperties = {
    background: `linear-gradient(to right, ${colors.white} 0%, ${colors.creamBackground} 100%)`,
    border: `1px solid ${colors.greyUltraLight}`,
    borderLeft: `5px solid ${colors.orangeBurnt}`,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    position: 'relative',
};

const eventCardTitle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '20px',
    fontWeight: 700,
    color: colors.charcoal,
    margin: '0 0 8px',
};

const categoryBadge: React.CSSProperties = {
    backgroundColor: 'rgba(212,165,116,0.15)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontFamily: fonts.body,
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: colors.gold,
    display: 'inline-block',
    marginBottom: '8px',
};

const eventMeta: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '13px',
    fontWeight: 500,
    color: colors.greyMedium,
    margin: 0,
};

const eventDescription: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '14px',
    fontWeight: 400,
    color: colors.greyDark,
    lineHeight: 1.6,
    marginTop: '12px',
    maxWidth: '300px',
};

const eventPrizeBadge: React.CSSProperties = {
    background: colors.gold, // Simplified solid color for email compat, avoiding complex gradients on small elements if possible
    backgroundColor: '#F4A460',
    padding: '16px 10px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(244,164,96,0.35)',
    minWidth: '80px',
};

const speakerCard: React.CSSProperties = {
    backgroundColor: colors.creamCard,
    border: `1px solid ${colors.greyUltraLight}`,
    borderRadius: '20px',
    padding: '28px 10px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(212,165,116,0.15)',
    position: 'relative',
};

const speakerImageContainer: React.CSSProperties = {
    position: 'relative',
    margin: '0 auto 16px',
    width: '80px',
    height: '80px',
};

const speakerImage: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: `3px solid ${colors.gold}`,
    objectFit: 'cover',
    boxShadow: '0 4px 16px rgba(212,165,116,0.3)',
    position: 'relative',
    zIndex: 1,
};

const speakerName: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '14px',
    fontWeight: 700,
    color: colors.charcoal,
    margin: '0 0 4px',
};

const speakerTitle: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '11px',
    fontWeight: 500,
    color: colors.greyMedium,
    margin: 0,
};

const speakerCompany: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '11px',
    fontWeight: 600,
    color: colors.gold,
    margin: '2px 0 0',
};

const timelineContainer: React.CSSProperties = {
    backgroundColor: colors.creamBackground,
    border: `1px solid ${colors.greyUltraLight}`,
    borderRadius: '24px',
    padding: '24px 20px',
};

const dayHeader: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '18px',
    fontWeight: 700,
    color: colors.charcoal,
    backgroundColor: colors.white,
    padding: '12px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    borderLeft: `5px solid ${colors.orangeBurnt}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const timelineItem: React.CSSProperties = {
    display: 'flex',
    marginBottom: '16px',
    paddingLeft: '16px',
    borderLeft: `2px dashed ${colors.greyUltraLight}`,
};

const timeBadge: React.CSSProperties = {
    backgroundColor: colors.white,
    padding: '6px 12px',
    borderRadius: '8px',
    fontFamily: fonts.body,
    fontSize: '12px',
    fontWeight: 600,
    color: colors.gold,
    minWidth: '70px',
    textAlign: 'center',
    height: 'fit-content',
};

const timelineContent: React.CSSProperties = {
    marginLeft: '16px',
    paddingBottom: '16px',
};

const timelineEventTitle: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '15px',
    fontWeight: 600,
    color: colors.charcoal,
    margin: '0 0 4px',
};

const timelineEventVenue: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '13px',
    fontWeight: 400,
    color: colors.greyMedium,
    margin: 0,
};

const partnersContainer: React.CSSProperties = {
    backgroundColor: colors.white,
    borderRadius: '20px',
    padding: '24px',
    border: `1px solid ${colors.greyUltraLight}`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    position: 'relative',
};

const sponsorPlaceholder: React.CSSProperties = {
    backgroundColor: '#F8F8F8',
    color: '#CCC',
    padding: '20px 0',
    borderRadius: '8px',
    fontFamily: fonts.body,
    fontSize: '12px',
    fontWeight: 600,
};

const ctaContainer: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.creamBackground} 0%, ${colors.creamDark} 100%)`,
    borderRadius: '24px',
    padding: '48px 32px',
    textAlign: 'center',
    border: `2px solid ${colors.greyUltraLight}`,
    boxShadow: '0 8px 24px rgba(212,165,116,0.15)',
};

const ctaHeadline: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '28px',
    fontWeight: 700,
    color: colors.charcoal,
    margin: '0 0 16px',
};

const ctaSubtext: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '15px',
    fontWeight: 400,
    color: colors.greyDark,
    marginBottom: '28px',
};

const ctaSecondaryLink: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '14px',
    fontWeight: 600,
    color: colors.gold,
    textDecoration: 'underline',
};

const footer: React.CSSProperties = {
    background: `linear-gradient(to bottom, ${colors.creamBackground}, ${colors.creamDark})`,
    borderTop: `1px solid ${colors.greyUltraLight}`,
    padding: '48px 20px 36px',
    textAlign: 'center',
    position: 'relative',
};

const footerTagline: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: '16px',
    fontWeight: 500,
    fontStyle: 'italic',
    color: colors.greyMedium,
    marginBottom: '24px',
    margin: '0 0 24px',
};

const contactInfo: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '14px',
    fontWeight: 500,
    color: colors.greyDark,
    margin: 0,
};

const footerDivider: React.CSSProperties = {
    width: '200px',
    height: '1px',
    backgroundColor: colors.greyUltraLight,
    margin: '24px auto',
    opacity: 0.6,
};

const footerLegal: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '12px',
    fontWeight: 400,
    color: '#C4BCB0',
    margin: '0 0 12px',
};

const unsubscribeLink: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '11px',
    fontWeight: 400,
    color: '#C4BCB0',
    textDecoration: 'underline',
};