export const UPI_CONFIG = {
    VPA: 'yashvanthsankar-1@okicici',
    NAME: 'Yashvanth S',
};

export const TICKET_PRICES: Record<string, { amount: number; pax: number; label: string }> = {
    solo: { amount: 200, pax: 1, label: 'Solo Pass' },
    duo: { amount: 360, pax: 2, label: 'Duo Pass' },
    quad: { amount: 680, pax: 4, label: 'Quad Pass' },
};

export type TicketType = keyof typeof TICKET_PRICES;

// Attendee information for multi-ticket booking
export interface AttendeeInfo {
    name: string;
    email: string;
    phone: string;
}
