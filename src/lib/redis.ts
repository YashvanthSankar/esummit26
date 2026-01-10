import Redis from 'ioredis';

const REDIS_PREFIX = 'esummit26:';

// Initialize Redis Client securely
// It will look for process.env.REDIS_URL or KV_REDIS_URL automatically if passed to constructor, 
// or we can pass it explicitly.
const getClient = () => {
    const url = process.env.KV_REDIS_URL || process.env.REDIS_URL;
    if (!url) {
        console.warn('Redis URL not found in env vars (KV_REDIS_URL or REDIS_URL)');
        return null;
    }
    // Use lazy connection - only connects when needed
    return new Redis(url, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => Math.min(times * 50, 2000)
    });
};

// Singleton usage in Next.js to prevent connection leaks
const globalForRedis = global as unknown as { redis: Redis | null };
const redis = globalForRedis.redis || getClient();

if (process.env.NODE_ENV !== 'production' && redis) {
    globalForRedis.redis = redis;
}

export const CacheKeys = {
    // Cache admin status: admin:{userId} -> "true" | "false"
    ADMIN: (userId: string) => `${REDIS_PREFIX}admin:${userId}`,

    // Cache ticket details: ticket_qr:{secret} -> JSON String
    TICKET_QR: (secret: string) => `${REDIS_PREFIX}ticket_qr:${secret}`,

    // Cache event details: event:{eventId} -> JSON String
    EVENT: (eventId: string) => `${REDIS_PREFIX}event:${eventId}`,
};

export async function getCached<T>(key: string): Promise<T | null> {
    try {
        if (!redis) return null;

        const data = await redis.get(key);
        if (!data) return null;

        try {
            return JSON.parse(data) as T;
        } catch {
            return data as unknown as T; // Return distinct string/number/bool if not JSON
        }
    } catch (error) {
        console.error('Redis Get Error:', error);
        return null;
    }
}

export async function setCached<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    try {
        if (!redis) return;

        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await redis.set(key, stringValue, 'EX', ttlSeconds);
    } catch (error) {
        console.error('Redis Set Error:', error);
    }
}

export async function deleteCached(key: string): Promise<void> {
    try {
        if (!redis) return;
        await redis.del(key);
    } catch (error) {
        console.error('Redis Delete Error:', error);
    }
}
