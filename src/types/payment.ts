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

// Accommodation pricing
export const ACCOMMODATION_PRICE = 500; // Flat rate in INR

// Merchandise Item Types
export type MerchItemType = 'tshirt1' | 'tshirt2' | 'combo';

// Merchandise Bundle Types
export type MerchBundleType = 'solo' | 'duo' | 'quad';

// Merchandise Items (T-shirts only, no hoodies)
export const MERCH_ITEMS: Record<MerchItemType, { price: number; label: string; description: string }> = {
    tshirt1: { price: 399, label: 'T-Shirt 1', description: 'E-Summit Classic Design' },
    tshirt2: { price: 399, label: 'T-Shirt 2', description: 'E-Summit Signature Edition' },
    combo: { price: 749, label: 'Combo (Both)', description: 'Get both T-shirts - Save ₹49!' },
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
