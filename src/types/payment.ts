export interface PhonePePayload {
    merchantId: string;
    merchantTransactionId: string;
    merchantUserId: string;
    amount: number; // in paise
    redirectUrl: string;
    redirectMode: 'REDIRECT' | 'POST';
    callbackUrl: string;
    mobileNumber?: string;
    paymentInstrument: {
        type: 'PAY_PAGE';
    };
}

export interface PhonePeResponse {
    success: boolean;
    code: string;
    message: string;
    data?: {
        merchantId: string;
        merchantTransactionId: string;
        instrumentResponse: {
            type: string;
            redirectInfo: {
                url: string;
                method: string;
            };
        };
    };
}

export interface PhonePeStatusResponse {
    success: boolean;
    code: string;
    message: string;
    data?: {
        merchantId: string;
        merchantTransactionId: string;
        transactionId: string;
        amount: number;
        state: string;
        responseCode: string;
        paymentInstrument: {
            type: string;
            utr?: string;
        };
    };
}

export const TICKET_PRICES: Record<string, { amount: number; pax: number; label: string }> = {
    solo: { amount: 499, pax: 1, label: 'Solo Pass' },
    duo: { amount: 899, pax: 2, label: 'Duo Pass' },
    quad: { amount: 1599, pax: 4, label: 'Quad Pass' },
};
