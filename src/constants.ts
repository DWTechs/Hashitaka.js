// Hashitaka.js library constants
export const LOGS_PREFIX = "Hashitaka: ";

// PBKDF2 iteration count (linear cost, not bcrypt-style exponential rounds) - OWASP min for HMAC-SHA256 is 600,000
export const DEFAULT_SALT_RNDS = 600000;
export const MIN_SALT_RNDS = 600000;
export const MAX_SALT_RNDS = 2000000;

export const DEFAULT_KEY_LEN = 64;
export const MIN_KEY_LEN = 32;
export const MAX_KEY_LEN = 256;

export const SALT_LEN = 32; // 16 random bytes encoded as hex (16 * 2 = 32 chars)

export const DEFAULT_SECRET_LEN = 32;
export const MIN_SECRET_LEN = 1;
export const MAX_SECRET_LEN = 262144;

// Allowlist of cryptographically strong digests, excludes weak/broken algorithms exposed by node:crypto's getHashes() (e.g. md5, sha1)
export const SECURE_DIGESTS = ["sha256", "sha384", "sha512", "sha512-256", "sha3-256", "sha3-384", "sha3-512"];