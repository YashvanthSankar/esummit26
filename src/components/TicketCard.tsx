'use client';

import { forwardRef } from 'react';
import QRCode from 'react-qr-code';

interface TicketCardProps {
    userName: string;
    rollNumber?: string | null;
    ticketType: 'solo' | 'duo' | 'quad';
    qrSecret: string;
    ticketId: string;
    paxCount: number;
}

// Using inline styles to avoid Tailwind's oklab colors that html2canvas can't parse
const TicketCard = forwardRef<HTMLDivElement, TicketCardProps>(
    ({ userName, rollNumber, ticketType, qrSecret, ticketId, paxCount }, ref) => {
        const passLabel = ticketType.toUpperCase();
        const ticketIdDisplay = `ES26-${ticketId.substring(0, 4).toUpperCase()}`;

        // Define colors as hex to avoid oklab issues with html2canvas
        const purple = '#a855f7';
        const purpleDark = '#7c3aed';
        const darkBg = '#0a0a0a';
        const darkBg2 = '#1a1a2e';

        return (
            <div
                ref={ref}
                style={{
                    width: '360px',
                    background: `linear-gradient(135deg, ${darkBg} 0%, ${darkBg2} 50%, ${darkBg} 100%)`,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: `linear-gradient(90deg, ${purple}, ${purpleDark})`,
                        padding: '16px 24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                                E-SUMMIT
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>&apos;26</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>IIITDM</p>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>KANCHEEPURAM</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ padding: '24px' }}>
                    {/* Pass Type Badge */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 24px',
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                border: `2px solid ${purple}`,
                            }}
                        >
                            <span style={{ color: purple, fontWeight: 'bold', fontSize: '18px', letterSpacing: '2px' }}>
                                PASS: {passLabel}
                            </span>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div
                            style={{
                                padding: '16px',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            }}
                        >
                            <QRCode
                                value={JSON.stringify({ s: qrSecret, type: ticketType })}
                                size={180}
                                level="H"
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                            {userName}
                        </h2>
                        {rollNumber && (
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontFamily: 'monospace', margin: 0 }}>
                                {rollNumber}
                            </p>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>
                                Ticket ID
                            </p>
                            <p style={{ color: purple, fontFamily: 'monospace', fontWeight: 'bold', margin: 0 }}>
                                {ticketIdDisplay}
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>
                                Pax
                            </p>
                            <p style={{ color: purple, fontFamily: 'monospace', fontWeight: 'bold', margin: 0 }}>
                                {paxCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tear-off Line */}
                <div style={{ position: 'relative', margin: '0 16px 16px 16px' }}>
                    <div style={{ borderTop: '2px dashed rgba(255,255,255,0.2)' }} />
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#050505',
                            borderRadius: '50%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translate(50%, -50%)',
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#050505',
                            borderRadius: '50%',
                        }}
                    />
                </div>

                {/* Footer */}
                <div style={{ padding: '0 24px 24px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                        <span>esummit.iiitdm.ac.in</span>
                        <span>2026</span>
                    </div>
                </div>
            </div>
        );
    }
);

TicketCard.displayName = 'TicketCard';

export default TicketCard;
