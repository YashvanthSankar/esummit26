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

const TicketCard = forwardRef<HTMLDivElement, TicketCardProps>(
    ({ userName, rollNumber, ticketType, qrSecret, ticketId, paxCount }, ref) => {
        const passLabel = ticketType.toUpperCase();
        const ticketIdDisplay = `ES26-${ticketId.substring(0, 4).toUpperCase()}`;

        return (
            <div
                ref={ref}
                className="w-[360px] bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-white text-2xl font-bold tracking-tight">
                                E-SUMMIT
                            </h1>
                            <p className="text-white/80 text-sm font-medium">&apos;26</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-xs">IIITDM</p>
                            <p className="text-white/60 text-xs">KANCHEEPURAM</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 space-y-6">
                    {/* Pass Type Badge */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#a855f7]/20 border-2 border-[#a855f7]">
                            <span className="text-[#a855f7] font-bold text-lg tracking-wider">
                                PASS: {passLabel}
                            </span>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center">
                        <div className="p-4 bg-white rounded-2xl shadow-lg">
                            <QRCode
                                value={JSON.stringify({ s: qrSecret, type: ticketType })}
                                size={180}
                                level="H"
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center space-y-1">
                        <h2 className="text-white text-xl font-bold">{userName}</h2>
                        {rollNumber && (
                            <p className="text-white/50 text-sm font-mono">{rollNumber}</p>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-white/40 text-xs uppercase tracking-wider">Ticket ID</p>
                            <p className="text-[#a855f7] font-mono font-bold">{ticketIdDisplay}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-white/40 text-xs uppercase tracking-wider">Pax</p>
                            <p className="text-[#a855f7] font-mono font-bold">{paxCount}</p>
                        </div>
                    </div>
                </div>

                {/* Tear-off Line */}
                <div className="relative mx-4 mb-4">
                    <div className="border-t-2 border-dashed border-white/20" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#050505] rounded-full" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-[#050505] rounded-full" />
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <div className="flex items-center justify-between text-white/30 text-xs">
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
