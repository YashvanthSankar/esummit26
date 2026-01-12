export const UPI_CONFIG = {
    VPA: 'asmitsd2023@okaxis',
    NAME: 'Asmit Kumar Sahoo',
};

export const TICKET_PRICES: Record<string, { amount: number; pax: number; label: string }> = {
    solo: { amount: 200, pax: 1, label: 'Solo Pass' },
    duo: { amount: 360, pax: 2, label: 'Duo Pass' },
    quad: { amount: 680, pax: 4, label: 'Quad Pass' },
};

export type TicketType = keyof typeof TICKET_PRICES;

// Accommodation pricing
export const ACCOMMODATION_PRICE = 500; // Flat rate in INR

// Merchandise Item Types - 3 individual + 3 combos
export type MerchItemType = 'tshirt1' | 'tshirt2' | 'tshirt3' | 'combo12' | 'combo23' | 'combo31';

// Merchandise Bundle Types
export type MerchBundleType = 'solo' | 'duo' | 'quad';

// Merchandise Items - 3 T-shirts + 3 Combo options
export const MERCH_ITEMS: Record<MerchItemType, { 
    price: number; 
    label: string; 
    description: string; 
    image: string;
    images?: string[]; // For combos with multiple images
}> = {
    tshirt1: { 
        price: 399, 
        label: 'T-Shirt Design 1', 
        description: 'E-Summit Classic Design',
        image: '/merch/tshirt1.png'
    },
    tshirt2: { 
        price: 399, 
        label: 'T-Shirt Design 2', 
        description: 'E-Summit Signature Edition',
        image: '/merch/tshirt2.png'
    },
    tshirt3: { 
        price: 399, 
        label: 'T-Shirt Design 3', 
        description: 'E-Summit Premium Collection',
        image: '/merch/tshirt3.png'
    },
    combo12: { 
        price: 749, 
        label: 'Combo: Design 1 + 2', 
        description: 'Get both designs - Save ₹49!',
        image: '/merch/tshirt1.png',
        images: ['/merch/tshirt1.png', '/merch/tshirt2.png']
    },
    combo23: { 
        price: 749, 
        label: 'Combo: Design 2 + 3', 
        description: 'Get both designs - Save ₹49!',
        image: '/merch/tshirt2.png',
        images: ['/merch/tshirt2.png', '/merch/tshirt3.png']
    },
    combo31: { 
        price: 749, 
        label: 'Combo: Design 3 + 1', 
        description: 'Get both designs - Save ₹49!',
        image: '/merch/tshirt3.png',
        images: ['/merch/tshirt3.png', '/merch/tshirt1.png']
    },
};

// Bundle pricing with discounts (discount applied to total cart)
export const MERCH_BUNDLES: Record<MerchBundleType, { discount: number; label: string; itemCount: number; description: string }> = {
    solo: { discount: 0, label: 'Solo', itemCount: 1, description: 'Select 1 product' },
    duo: { discount: 0.10, label: 'Duo', itemCount: 2, description: 'Select 2 products - Save 10%' },
    quad: { discount: 0.15, label: 'Quad', itemCount: 4, description: 'Select 4 products - Save 15%' },
};

// Bundle item interface for storing item and size selections
export interface BundleItem {
    item: MerchItemType | '';
    size: string;
    index: number;
}

// Calculate total price for all items in bundle with discount
export const calculateBundlePrice = (bundleItems: BundleItem[], bundleType: MerchBundleType): number => {
    // Calculate base price from all selected items
    const basePrice = bundleItems.reduce((total, item) => {
        if (item.item) {
            // If combo, count both t-shirts in the price
            const itemPrice = MERCH_ITEMS[item.item].price;
            return total + itemPrice;
        }
        return total;
    }, 0);
    
    // Apply bundle discount
    const bundle = MERCH_BUNDLES[bundleType];
    const discountAmount = basePrice * bundle.discount;
    return Math.round(basePrice - discountAmount);
};

// Attendee information for multi-ticket booking
export interface AttendeeInfo {
    name: string;
    email: string;
    phone: string;
}
