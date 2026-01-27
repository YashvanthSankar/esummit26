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
        type?: string;
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
    sponsors = [],
}: EventReminderEmailProps) => {
    const previewText = `${subject} - ${eventDetails.name}`;

    // Helper to chunk events for 2-column layout (if we wanted grid, but list is safer for 10 items)
    // For 10 items, a dense list is better than a massive grid.

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
                    .event-row:hover { background-color: rgba(255,255,255,0.03) !important; }
                `}</style>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* ════ HEADER ════ */}
                    <Section style={header}>
                        <Row>
                            <Column>
                                <Img
                                    src="https://esummit26-iiitdm.vercel.app/esummit26-logo.png"
                                    alt="E-Summit Logo"
                                    width="70"
                                    style={logo}
                                />
                            </Column>
                            <Column style={{ textAlign: 'right' }}>
                                <Img
                                    src="https://esummit26-iiitdm.vercel.app/ecell.png"
                                    alt="E-Cell Logo"
                                    width="70"
                                    style={{ display: 'inline-block' }}
                                />
                            </Column>
                        </Row>
                        <div style={divider} />
                    </Section>

                    {/* ════ GREETING & INFO ════ */}
                    <Section style={introSection}>
                        <Text style={heading}>Hello {userName === 'Test User' ? 'Innovator' : userName},</Text>
                        <Text style={paragraph}>
                            E-Summit '26 is here. We are bringing together the brightest minds for 3 days of innovation, competition, and networking at IIITDM Kancheepuram.
                        </Text>

                        {/* Stats Grid using Tables for Compatibility */}
                        <Section style={statsContainer}>
                            <Row>
                                <Column style={statItem}>
                                    <Text style={statLabel}>VENUE</Text>
                                    <Text style={statValue}>IIITDM Kancheepuram</Text>
                                </Column>
                                <Column style={statItem}>
                                    <Text style={statLabel}>PRIZE POOL</Text>
                                    <Text style={statValue}>{eventDetails.prizePool}</Text>
                                </Column>
                                <Column style={statItem}>
                                    <Text style={statLabel}>MODE</Text>
                                    <Text style={statValue}>Offline</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Link href={`${eventDetails.websiteUrl}/dashboard`} style={primaryButton}>
                            Download Pass ➞
                        </Link>
                    </Section>

                    {/* ════ COMPACT EVENT SCHEDULE ════ */}
                    {events.length > 0 && (
                        <Section style={section}>
                            <Text style={sectionTitle}>Event Schedule</Text>
                            <div style={tableContainer}>
                                {events.map((event, i) => (
                                    <div key={i} style={{
                                        ...eventRow,
                                        borderBottom: i === events.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={timeCell}>
                                            <Text style={eventDateText}>{event.date?.split('•')[0] || ''}</Text>
                                            <Text style={eventTimeText}>{event.date?.split('•')[1] || ''}</Text>
                                        </div>
                                        <div style={nameCell}>
                                            <Text style={eventNameText}>{event.name}</Text>
                                        </div>
                                        <div style={prizeCell}>
                                            <Text style={eventPrizeText}>{event.prize}</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ════ SPEAKERS ════ */}
                    {speakers.length > 0 && (
                        <Section style={section}>
                            <Text style={sectionTitle}>Speakers</Text>
                            <Section>
                                {Array.from({ length: Math.ceil(speakers.length / 2) }).map((_, rowIndex) => (
                                    <Row key={rowIndex} style={{ marginBottom: '12px' }}>
                                        {speakers.slice(rowIndex * 2, rowIndex * 2 + 2).map((speaker, i) => (
                                            <Column key={i} style={{ width: '50%', paddingRight: i % 2 === 0 ? '6px' : '0', paddingLeft: i % 2 === 1 ? '6px' : '0' }}>
                                                <div style={speakerCompact}>
                                                    <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                                                        <tr>
                                                            <td width="40">
                                                                <Img src={speaker.image} style={speakerAvatar} />
                                                            </td>
                                                            <td style={{ paddingLeft: '10px' }}>
                                                                <Text style={speakerName}>{speaker.name}</Text>
                                                                <Text style={speakerTitle}>{speaker.title}</Text>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </Column>
                                        ))}
                                        {speakers.slice(rowIndex * 2, rowIndex * 2 + 2).length === 1 && (
                                            <Column style={{ width: '50%' }} />
                                        )}
                                    </Row>
                                ))}
                            </Section>
                        </Section>
                    )}

                    {/* ════ SPONSORS ════ */}
                    {sponsors.length > 0 && (
                        <Section style={{ ...section, borderBottom: 'none' }}>
                            <Text style={sectionTitle}>Partners</Text>
                            <Row>
                                {sponsors.map((sponsor, i) => (
                                    <Column key={i} style={{ textAlign: 'center', padding: '10px' }}>
                                        <Img src={sponsor.logo} style={sponsorLogo} />
                                    </Column>
                                ))}
                            </Row>
                        </Section>
                    )}

                    {/* ════ FOOTER ════ */}
                    <Section style={footer}>
                        <div style={divider} />
                        <Text style={footerLinks}>
                            <Link href={`${eventDetails.websiteUrl}/schedule`} style={link}>Schedule</Link> •
                            <Link href={`${eventDetails.websiteUrl}/events`} style={link}> Events</Link> •
                            <Link href={`${eventDetails.websiteUrl}/speakers`} style={link}> Speakers</Link> •
                            <Link href="https://instagram.com/ecell_iiitdm" style={link}> Instagram</Link>
                        </Text>
                        <Text style={footerLegal}>
                            © 2026 E-Summit IIITDM Kancheepuram. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EventReminderEmail;

// ════════════════════════════════════════════════════════════════
// STYLES - Compact, High-Density, Premium
// ════════════════════════════════════════════════════════════════

const main: React.CSSProperties = {
    backgroundColor: '#050505',
    fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#ffffff',
    padding: '20px 0',
};

const container: React.CSSProperties = {
    maxWidth: '560px', // Slightly narrower for better readability
    margin: '0 auto',
    backgroundColor: '#0a0a0a',
    borderRadius: '12px',
    border: '1px solid #1f1f1f',
    overflow: 'hidden',
};

const header: React.CSSProperties = {
    padding: '24px 32px 16px',
    backgroundColor: '#0f0f0f',
};

const logo: React.CSSProperties = {
    display: 'block',
};

const headerDate: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: 0,
};

const divider: React.CSSProperties = {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.6), transparent)',
    marginTop: '24px',
    marginBottom: '24px',
    border: 'none',
};

const introSection: React.CSSProperties = {
    padding: '32px 32px',
};

const heading: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 12px',
    letterSpacing: '-0.3px',
};

const paragraph: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#aaa',
    margin: '0 0 24px',
};

const statsContainer: React.CSSProperties = {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#111',
    borderRadius: '8px',
    border: '1px solid #1f1f1f',
};

const statsGrid: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#111',
    borderRadius: '8px',
    border: '1px solid #1f1f1f',
};

const statItem: React.CSSProperties = {
    flex: 1,
};

const statLabel: React.CSSProperties = {
    fontSize: '10px',
    color: '#555',
    fontWeight: '700',
    margin: '0 0 4px',
    letterSpacing: '0.5px',
};

const statValue: React.CSSProperties = {
    fontSize: '13px',
    color: '#fff',
    fontWeight: '600',
    margin: 0,
};

const primaryButton: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: '13px',
    fontWeight: '600',
    padding: '10px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
};

const section: React.CSSProperties = {
    padding: '24px 32px',
    borderTop: '1px solid #161616',
};

const sectionTitle: React.CSSProperties = {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#666',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '16px',
};

// Compact Event List
const tableContainer: React.CSSProperties = {
    border: '1px solid #1f1f1f',
    borderRadius: '8px',
    backgroundColor: '#0e0e0e',
};

const eventRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
};

const timeCell: React.CSSProperties = {
    width: '100px',
    flexShrink: 0,
};

const eventDateText: React.CSSProperties = {
    fontSize: '11px',
    color: '#888',
    margin: 0,
    fontWeight: '500',
};

const eventTimeText: React.CSSProperties = {
    fontSize: '11px',
    color: '#555',
    margin: 0,
};

const nameCell: React.CSSProperties = {
    flex: 1,
    paddingRight: '12px',
};

const eventNameText: React.CSSProperties = {
    fontSize: '13px',
    color: '#fff',
    fontWeight: '600',
    margin: 0,
};

const prizeCell: React.CSSProperties = {
    textAlign: 'right',
    flexShrink: 0,
};

const eventPrizeText: React.CSSProperties = {
    fontSize: '11px',
    color: '#a855f7', // Purple accent
    fontWeight: '600',
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    margin: 0,
};

// Speakers Compact
const speakersContainer: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
};

const speakerCompact: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#111',
    border: '1px solid #1f1f1f',
    borderRadius: '8px',
};

const speakerAvatar: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
};

const speakerInfo: React.CSSProperties = {
    flex: 1,
    overflow: 'hidden',
};

const speakerName: React.CSSProperties = {
    fontSize: '12px',
    color: '#fff',
    fontWeight: '600',
    margin: '0 0 2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const speakerTitle: React.CSSProperties = {
    fontSize: '10px',
    color: '#666',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

// Sponsors
const sponsorLogo: React.CSSProperties = {
    height: '20px',
    opacity: 0.5,
    filter: 'grayscale(100%)',
};

// Footer
const footer: React.CSSProperties = {
    padding: '0 32px 32px',
    textAlign: 'center',
};

const footerLinks: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '12px',
};

const link: React.CSSProperties = {
    color: '#888',
    textDecoration: 'none',
    margin: '0 4px',
};

const footerLegal: React.CSSProperties = {
    fontSize: '11px',
    color: '#444',
    margin: 0,
};