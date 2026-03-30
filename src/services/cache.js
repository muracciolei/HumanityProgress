const MEMORY_CACHE = new Map();
const LOCAL_STORAGE_PREFIX = "humanity-progress::cache::";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 12;

function now() {
  return Date.now();
}

export function getCachedValue(key) {
  const inMemory = MEMORY_CACHE.get(key);
  if (inMemory && inMemory.expiresAt > now()) {
    return inMemory.value;
  }

  try {
    const storedRaw = window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
    if (!storedRaw) {
      return null;
    }

    const stored = JSON.parse(storedRaw);
    if (stored.expiresAt <= now()) {
      window.localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${key}`);
      return null;
    }

    MEMORY_CACHE.set(key, stored);
    return stored.value;
  } catch {
    return null;
  }
}

export function setCachedValue(key, value, ttlMs = DEFAULT_TTL_MS) {
  const entry = {
    value,
    expiresAt: now() + ttlMs
  };

  MEMORY_CACHE.set(key, entry);

  try {
    window.localStorage.setItem(
      `${LOCAL_STORAGE_PREFIX}${key}`,
      JSON.stringify(entry)
    );
  } catch {
    // Failing to persist is safe: in-memory cache still works.
  }
}
