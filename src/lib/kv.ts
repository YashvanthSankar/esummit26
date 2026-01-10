import { kv } from '@vercel/kv';

const KV_PREFIX = 'esummit26:';

export const CacheKeys = {
    // Cache admin status: admin:{userId} -> boolean
    ADMIN: (userId: string) => `${KV_PREFIX}admin:${userId}`,

    // Cache ticket details: ticket:{qrSecret} -> TicketData
    TICKET_QR: (secret: string) => `${KV_PREFIX}ticket_qr:${secret}`,

    // Cache event details: event:{eventId} -> EventData
    EVENT: (eventId: string) => `${KV_PREFIX}event:${eventId}`,
};

export async function getCached<T>(key: string): Promise<T | null> {
    try {
        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
            console.warn('Vercel KV env vars not set, skipping cache');
            return null;
        }
        return await kv.get<T>(key);
    } catch (error) {
        console.error('KV Get Error:', error);
        return null;
    }
}

export async function setCached<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    try {
        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return;

        await kv.set(key, value, { ex: ttlSeconds });
    } catch (error) {
        console.error('KV Set Error:', error);
    }
}

export async function deleteCached(key: string): Promise<void> {
    try {
        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return;
        await kv.del(key);
    } catch (error) {
        console.error('KV Delete Error:', error);
    }
}
