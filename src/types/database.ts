/**
 * Database schema types with strict validation
 */

/**
 * Valid Indian phone number format: +91XXXXXXXXXX
 * Must be exactly 13 characters starting with +91 followed by 10 digits
 */
export type PhoneNumber = `+91${string}`;

/**
 * User roles in the system
 * - internal: College students with @iiitdm.ac.in email
 * - external: External participants  
 * - admin: Volunteers with limited admin access (no payment approval)
 * - super_admin: Full admin access including payment approval
 */
export type UserRole = 'internal' | 'external' | 'admin' | 'super_admin';

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
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

/**
 * Check if user can approve payments (only super_admin)
 */
export function canApprovePayments(role: UserRole | string): boolean {
    return role === 'super_admin';
}

/**
 * Check if user has admin access (admin or super_admin)
 */
export function hasAdminAccess(role: UserRole | string): boolean {
    return role === 'admin' || role === 'super_admin';
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
