export const UPI_CONFIG = {
    VPA: '8000146235@ybl',
    NAME: 'Vishal Singh',
};

export const TICKET_PRICES: Record<string, { amount: number; pax: number; label: string }> = {
    solo: { amount: 200, pax: 1, label: 'Solo Pass' },
    duo: { amount: 360, pax: 2, label: 'Duo Pass' },
    quad: { amount: 680, pax: 4, label: 'Quad Pass' },
    bumper: { amount: 1499, pax: 10, label: 'Bumper Pass' },
};

export type TicketType = keyof typeof TICKET_PRICES;

// Accommodation pricing - based on number of days
export const ACCOMMODATION_PRICES: Record<1 | 2 | 3, number> = {
    1: 399,
    2: 699,
    3: 999,
};

// Available accommodation dates
export const ACCOMMODATION_DATES = [
    { id: 'day1', date: '2026-01-30', label: '30th Jan 2026 (Day 1)' },
    { id: 'day2', date: '2026-01-31', label: '31st Jan 2026 (Day 2)' },
    { id: 'day3', date: '2026-02-01', label: '1st Feb 2026 (Day 3)' },
];

// Calculate accommodation price based on selected days
export const getAccommodationPrice = (daysSelected: number): number => {
    if (daysSelected === 1) return ACCOMMODATION_PRICES[1];
    if (daysSelected === 2) return ACCOMMODATION_PRICES[2];
    if (daysSelected === 3) return ACCOMMODATION_PRICES[3];
    return 0;
};

// Merchandise Item Types - 3 individual t-shirt designs
export type MerchItemType = 'tshirt1' | 'tshirt2' | 'tshirt3';

// Merchandise Quantity Types (1-4 t-shirts)
export type MerchBundleType = 'solo' | 'duo' | 'triple' | 'quad';

// Merchandise Items - 3 T-shirt designs
export const MERCH_ITEMS: Record<MerchItemType, {
    label: string;
    description: string;
    image: string;
}> = {
    tshirt1: {
        label: 'T-Shirt Design 1',
        description: 'E-Summit Classic Design',
        image: '/merch/tshirt1.png'
    },
    tshirt2: {
        label: 'T-Shirt Design 2',
        description: 'E-Summit Signature Edition',
        image: '/merch/tshirt2.png'
    },
    tshirt3: {
        label: 'T-Shirt Design 3',
        description: 'E-Summit Premium Collection',
        image: '/merch/tshirt3.png'
    },
};

// Early Bird Pricing - quantity based discounts
export const MERCH_BUNDLES: Record<MerchBundleType, {
    quantity: number;
    earlyBirdPrice: number;
    actualPrice: number;
    label: string;
    description: string;
    discount: number;
    itemCount: number;
}> = {
    solo: {
        quantity: 1,
        earlyBirdPrice: 349,
        actualPrice: 399,
        label: 'Solo Bundle',
        description: '1 T-Shirt',
        discount: 0.13,
        itemCount: 1
    },
    duo: {
        quantity: 2,
        earlyBirdPrice: 679,
        actualPrice: 799,
        label: 'Duo Bundle',
        description: '2 T-Shirts',
        discount: 0.15,
        itemCount: 2
    },
    triple: {
        quantity: 3,
        earlyBirdPrice: 999,
        actualPrice: 1199,
        label: 'Triple Bundle',
        description: '3 T-Shirts',
        discount: 0.17,
        itemCount: 3
    },
    quad: {
        quantity: 4,
        earlyBirdPrice: 1299,
        actualPrice: 1499,
        label: 'Quad Bundle',
        description: '4 T-Shirts',
        discount: 0.13,
        itemCount: 4
    },
};

// Bundle item interface for storing item and size selections
export interface BundleItem {
    item: MerchItemType | '';
    size: string;
    index: number;
}

// Calculate total price based on quantity (early bird pricing)
export const calculateBundlePrice = (bundleType: MerchBundleType): number => {
    return MERCH_BUNDLES[bundleType].earlyBirdPrice;
};

// Attendee information for multi-ticket booking
export interface AttendeeInfo {
    name: string;
    email: string;
    phone: string;
}
