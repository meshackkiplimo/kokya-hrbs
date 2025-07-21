// Simple in-memory cache for frequently accessed data
interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number; // time to live in milliseconds
}

class SimpleCache {
    private cache = new Map<string, CacheItem<any>>();

    set<T>(key: string, data: T, ttlMs: number = 30000): void { // default 30 seconds
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        const now = Date.now();
        if (now - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Clean expired entries
    cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];
        
        this.cache.forEach((item, key) => {
            if (now - item.timestamp > item.ttl) {
                keysToDelete.push(key);
            }
        });
        
        keysToDelete.forEach(key => this.cache.delete(key));
    }
}

export const cache = new SimpleCache();

// Auto-cleanup every 5 minutes
setInterval(() => {
    cache.cleanup();
}, 5 * 60 * 1000);