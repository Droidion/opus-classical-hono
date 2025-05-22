import Keyv from "keyv";
import QuickLRU from "quick-lru";

type CacheKeys = "composers";

const lru = new QuickLRU({ maxSize: 10 });
const cache = new Keyv({ store: lru });

export function setCache(key: CacheKeys, value: unknown) {
	cache.set(key, value);
}

function getCache(key: CacheKeys) {
	return cache.get(key);
}

export const cacheService = {
	setCache,
	getCache,
};
