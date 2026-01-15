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

export const INTERNAL_PRICING: PricingTier[] = [
    { min: 1, max: 1, price: 199, label: 'Solo Pass' },
    { min: 2, max: 3, price: 180, label: 'Group Pass (Mini)' },
    { min: 4, max: 9, price: 170, label: 'Group Pass (Mid)' },
    { min: 10, max: null, price: 149, label: 'Group Pass (Mega)' },
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

    return {
        totalAmount: activeTier.price * count,
        pricePerHead: activeTier.price,
        label: activeTier.label,
        isExternal
    };
}
