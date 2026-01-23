export interface PricingTier {
    min: number;
    max: number | null; // null means "and above"
    price: number;
    label: string;
}

export const EXTERNAL_PRICING: PricingTier[] = [
    { min: 1, max: 1, price: 349, label: 'Solo Pass' },
    { min: 2, max: 6, price: 325, label: 'Group Pass (Small)' },
    { min: 7, max: null, price: 300, label: 'Group Pass (Large)' },
];

export interface InternalPricingTier extends PricingTier {
    strikePrice?: number;
    strikeTotalPrice?: number;
    fixedTotal?: number; // For combo offers with fixed total price
    offerTag?: string;
}

export const INTERNAL_PRICING: InternalPricingTier[] = [
    { min: 1, max: 3, price: 199, strikePrice: 249, label: 'Solo Pass', offerTag: 'Early Bird' },
    { min: 4, max: 9, price: 190, label: 'Group Pass (Mid)' },
    { min: 10, max: null, price: 175, label: 'Bumper Pass (10+)', offerTag: 'Bumper Offer!!' },
];

export interface PriceCalculation {
    totalAmount: number;
    pricePerHead: number;
    label: string;
    isExternal: boolean;
}

export function calculateTicketPrice(count: number, role: string): PriceCalculation {
    const isExternal = role !== 'internal';
    const tiers = isExternal ? EXTERNAL_PRICING : INTERNAL_PRICING;

    // Find applicable tier
    const tier = tiers.find(t =>
        count >= t.min && (t.max === null || count <= t.max)
    );

    // Fallback to highest tier if not found (should not happen with open-ended max)
    const activeTier = tier || tiers[tiers.length - 1];

    // Check for fixedTotal (combo offers) for internal tiers
    const internalTier = activeTier as InternalPricingTier;
    let totalAmount: number;

    if (!isExternal && internalTier.fixedTotal !== undefined) {
        if (internalTier.fixedTotal === -1) {
            // Special case: price*count - 1 (for prices ending in 9)
            totalAmount = activeTier.price * count - 1;
        } else {
            totalAmount = internalTier.fixedTotal;
        }
    } else {
        totalAmount = activeTier.price * count;
    }

    return {
        totalAmount,
        pricePerHead: Math.floor(totalAmount / count),
        label: activeTier.label,
        isExternal
    };
}
