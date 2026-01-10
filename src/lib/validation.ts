/**
 * Phone number validation utilities
 */

export interface PhoneValidationResult {
    isValid: boolean;
    error?: string;
    formatted?: string;
}

/**
 * Validates Indian phone numbers
 * Accepts formats:
 * - 10 digits: 9876543210
 * - With +91: +919876543210
 * - With spaces/dashes: +91 98765 43210, 98765-43210
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
    if (!phone || typeof phone !== 'string') {
        return {
            isValid: false,
            error: 'Phone number is required',
        };
    }

    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[\s\-()]/g, '');

    // Check for valid Indian phone number patterns
    const patterns = [
        /^\+91[6-9]\d{9}$/,  // +91XXXXXXXXXX (starts with 6-9)
        /^91[6-9]\d{9}$/,    // 91XXXXXXXXXX
        /^[6-9]\d{9}$/,      // XXXXXXXXXX (10 digits starting with 6-9)
    ];

    const isValid = patterns.some(pattern => pattern.test(cleaned));

    if (!isValid) {
        return {
            isValid: false,
            error: 'Please enter a valid 10-digit Indian phone number',
        };
    }

    // Extract the 10-digit number
    let digits = cleaned;
    if (cleaned.startsWith('+91')) {
        digits = cleaned.slice(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
        digits = cleaned.slice(2);
    }

    // Format as +91XXXXXXXXXX for storage
    const formatted = `+91${digits}`;

    return {
        isValid: true,
        formatted,
    };
}

/**
 * Format phone number for display
 * Converts +919876543210 to +91 98765 43210
 */
export function formatPhoneForDisplay(phone: string): string {
    if (!phone) return '';

    const cleaned = phone.replace(/[\s\-()]/g, '');

    // If it's already formatted with +91
    if (cleaned.startsWith('+91') && cleaned.length === 13) {
        const digits = cleaned.slice(3);
        return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }

    // If it's 10 digits
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }

    return phone;
}

/**
 * Type guard to check if a string is a valid phone number
 */
export function isValidPhoneNumber(phone: string): phone is string {
    return validatePhoneNumber(phone).isValid;
}
