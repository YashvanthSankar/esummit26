export const UPI_CONFIG = {
    VPA: 'asmitsd2023@okaxis',
    NAME: 'Asmit Kumar Sahoo',
};

export const TICKET_PRICES: Record<string, { amount: number; pax: number; label: string }> = {
    solo: { amount: 200, pax: 1, label: 'Solo Pass' },
    duo: { amount: 360, pax: 2, label: 'Duo Pass' },
    quad: { amount: 680, pax: 4, label: 'Quad Pass' },
    bumper: { amount: 1499, pax: 10, label: 'Bumper Pass' },
};

export type TicketType = keyof typeof TICKET_PRICES;

// Accommodation pricing
export const ACCOMMODATION_PRICE = 500; // Flat rate in INR

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
        earlyBirdPrice: 325,
        actualPrice: 349,
        label: 'Solo Bundle',
        description: '1 T-Shirt',
        discount: 0,
        itemCount: 1
    },
    duo: {
        quantity: 2,
        earlyBirdPrice: 619,
        actualPrice: 699,
        label: 'Duo Bundle',
        description: '2 T-Shirts',
        discount: 0.11,
        itemCount: 2
    },
    triple: {
        quantity: 3,
        earlyBirdPrice: 929,
        actualPrice: 1049,
        label: 'Triple Bundle',
        description: '3 T-Shirts',
        discount: 0.11,
        itemCount: 3
    },
    quad: {
        quantity: 4,
        earlyBirdPrice: 1199,
        actualPrice: 1399,
        label: 'Quad Bundle',
        description: '4 T-Shirts',
        discount: 0.20,
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
