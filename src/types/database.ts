/**
 * Database schema types with strict validation
 */

/**
 * Valid Indian phone number format: +91XXXXXXXXXX
 * Must be exactly 13 characters starting with +91 followed by 10 digits
 */
export type PhoneNumber = `+91${string}`;

/**
 * User profile from the database
 */
export interface Profile {
    id: string;
    email: string;
    full_name: string;
    phone: PhoneNumber;
    college_name: string;
    roll_number: string | null;
    role: 'user' | 'admin';
    created_at?: string;
    updated_at?: string;
}

/**
 * Form data for onboarding (before validation)
 */
export interface OnboardingFormData {
    full_name: string;
    phone: string; // Unvalidated phone input
    college_name: string;
    roll_number: string;
}

/**
 * Validated onboarding data (ready for database)
 */
export interface ValidatedOnboardingData {
    full_name: string;
    phone: PhoneNumber; // Validated and formatted
    college_name: string;
    roll_number: string | null;
}

/**
 * Type guard to check if a string is a valid PhoneNumber type
 */
export function isPhoneNumber(value: string): value is PhoneNumber {
    return /^\+91[6-9]\d{9}$/.test(value);
}

/**
 * Safely cast a validated phone string to PhoneNumber type
 */
export function toPhoneNumber(value: string): PhoneNumber {
    if (!isPhoneNumber(value)) {
        throw new Error(`Invalid phone number format: ${value}`);
    }
    return value;
}
