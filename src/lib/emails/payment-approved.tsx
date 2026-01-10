import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Link,
    Heading,
} from '@react-email/components';

interface PaymentApprovedEmailProps {
    userName: string;
    ticketType: string;
    amount: number;
}

export const PaymentApprovedEmail: React.FC<PaymentApprovedEmailProps> = ({
    userName,
    ticketType,
    amount,
}) => (
    <Html>
        <Head />
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <Heading style={logo}>E-SUMMIT '26</Heading>
                    <Text style={subtitle}>IIITDM Kancheepuram</Text>
                </Section>

                {/* Main Card */}
                <Section style={card}>
                    <div style={successBadge}>✓ Payment Approved</div>

                    <Heading style={h1}>
                        <div style={greeting}>Hey {userName}! 👋</div>
                        Your Payment is Confirmed
                    </Heading>

                    <Text style={paragraph}>
                        Great news! Your payment has been verified and approved by our team.
                        <strong> Your ticket is now ready to download from your dashboard.</strong>
                    </Text>

                    {/* Ticket Details */}
                    <Section style={ticketDetails}>
                        <div style={detailRow}>
                            <span style={detailLabel}>Ticket Type</span>
                            <span style={detailValue}>{ticketType.toUpperCase()}</span>
                        </div>
                        <div style={detailRow}>
                            <span style={detailLabel}>Amount Paid</span>
                            <span style={detailValue}>₹{amount}</span>
                        </div>
                    </Section>

                    <Text style={paragraph}>
                        <strong>Next Steps:</strong>
                    </Text>
                    <ol style={list}>
                        <li><strong>Visit your dashboard</strong> to download your ticket</li>
                        <li>Save the QR code - you'll need it for entry</li>
                        <li>Mark your calendar for the event dates</li>
                    </ol>

                    {/* CTA Button */}
                    <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
                        <Link href="https://esummit.iiitdm.ac.in/dashboard" style={button}>
                            Check Dashboard & Download Ticket →
                        </Link>
                    </Section>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Questions? Contact us at support@esummit.iiitdm.ac.in
                    </Text>
                    <Text style={footerText}>
                        © 2026 E-Cell IIITDM Kancheepuram. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default PaymentApprovedEmail;

// Styles
const main = {
    backgroundColor: '#050505',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
};

const header = {
    textAlign: 'center' as const,
    marginBottom: '40px',
};

const logo = {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
};

const subtitle = {
    color: '#666666',
    fontSize: '14px',
    margin: 0,
};

const card = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
};

const successBadge = {
    display: 'inline-block',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10b981',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    marginBottom: '24px',
};

const h1 = {
    fontSize: '28px',
    margin: '0 0 16px 0',
    fontWeight: '700',
    color: '#ffffff',
};

const greeting = {
    color: '#a855f7',
    marginBottom: '8px',
};

const paragraph = {
    lineHeight: '1.6',
    color: '#cccccc',
    margin: '0 0 16px 0',
};

const ticketDetails = {
    background: 'rgba(168, 85, 247, 0.05)',
    borderLeft: '4px solid #a855f7',
    padding: '20px',
    margin: '24px 0',
    borderRadius: '8px',
};

const detailRow = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
};

const detailLabel = {
    color: '#999999',
    fontSize: '14px',
};

const detailValue = {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
};

const list = {
    color: '#cccccc',
    lineHeight: '1.8',
    paddingLeft: '20px',
};

const button = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
};

const footer = {
    textAlign: 'center' as const,
    color: '#666666',
    fontSize: '12px',
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
};

const footerText = {
    margin: '8px 0',
    color: '#666666',
};

