import { log } from "@dwtechs/winstan";
import { randomBytes, 
         createHmac,
         getHashes,
         pbkdf2Sync,
         timingSafeEqual 
       } from "node:crypto";
import { isValidInteger, 
         isString, 
         isIn,
         isBase64
       } from "@dwtechs/checkard";
import { b64Decode } from "./base64.js";
import { 
  HashLengthMismatchError,
} from "./errors.js";
import { LOGS_PREFIX } from "./constants";

const digests = getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;

/**
 * Timing-Safe Equality (TSE) function for comparing two buffers in constant time.
 * 
 * This function performs a cryptographically secure comparison of two buffers that takes
 * the same amount of time regardless of where the buffers differ. This prevents timing
 * attacks where an attacker could determine the correct value by measuring how long
 * the comparison takes.
 * 
 * Regular string or buffer comparison (===, ==, Buffer.compare) can be vulnerable to
 * timing attacks because they often return early when they find the first differing byte.
 * This function uses Node.js's built-in `timingSafeEqual` which compares every byte
 * regardless of differences found.
 * 
 * @param {Buffer} a - The first buffer to compare
 * @param {Buffer} b - The second buffer to compare
 * @returns {boolean} `true` if the buffers are identical, `false` otherwise
 * @throws {HashLengthMismatchError} Throws when the buffers have different lengths - HTTP 400
 * 
 * // Use case: JWT signature verification (timing-attack resistant)
 * const expectedSignature = Buffer.from(computedSignature);
 * const providedSignature = Buffer.from(tokenSignature);
 * const isValidSignature = tse(expectedSignature, providedSignature);
 * 
 * // Use case: Password hash comparison
 * const storedHash = Buffer.from(hashedPassword, "hex");
 * const computedHash = Buffer.from(newPasswordHash, "hex");
 * const passwordMatches = tse(storedHash, computedHash);
 * 
 * // Example that throws HashLengthMismatchError:
 * const shortBuffer = Buffer.from("abc");
 * const longBuffer = Buffer.from("abcdef");
 * tse(shortBuffer, longBuffer); // Throws HashLengthMismatchError
 * ```
 * 
 * @security
 * **Why timing-safe comparison matters:**
 * - Prevents timing attacks on password verification
 * - Protects JWT signature validation from side-channel attacks
 * - Essential for any cryptographic comparison in security-sensitive contexts
 * - Takes constant time regardless of input differences
 * 
 * **When to use:**
 * - Comparing password hashes
 * - Validating JWT signatures
 * - Comparing any cryptographic values (MACs, tokens, etc.)
 * - Any security-critical buffer comparison
 */
function tse(a: Buffer, b: Buffer): boolean {

  log.debug(`${LOGS_PREFIX}Comparing buffers (lengths: ${a.length}, ${b.length})`);

  if (a.length !== b.length)
    throw new HashLengthMismatchError();  
  return timingSafeEqual(a, b);
}

/**
 * Returns the number of salt rounds used for hashing.
 *
 * @return {number} The number of salt rounds.
 */
function getSaltRounds(): number {
	return saltRnds;
}


/**
 * Sets the number of salt rounds for hashing.
 *
 * @param {number} rnds - The number of salt rounds to set. Must be a valid integer between 12 and 100.
 * @returns {boolean} True if the salt rounds were successfully set, otherwise false.
 */
function setSaltRounds(rnds: number): boolean {
  log.debug(`${LOGS_PREFIX}Setting salt rounds to ${rnds}`);
	isValidInteger(rnds, 12, 100, true, true); 
	saltRnds = rnds;
	return true;
}

/**
 * Returns the key length used for hashing.
 *
 * @return {number} The key length.
 */
function getKeyLen(): number {
	return keyLen;
}


/**
 * Sets the key length to the specified value for hashing.
 *
 * @param {number} len - The desired key length. Must be a valid integer between 2 and 256.
 * @returns {boolean} True if the key length was successfully set; otherwise false.
 */
function setKeyLen(len: number): boolean {
  log.debug(`${LOGS_PREFIX}Setting key length to ${len}`);
	isValidInteger(len, 2, 256, true, true);
	keyLen = len;
	return true;
}

/**
 * Returns the hash function used for hashing.
 *
 * @return {string} The hash function.
 */
function getDigest(): string {
	return digest;
}

/**
 * Sets the hash function used for hashing.
 * The list of available digests is returned by getDigests()
 *
 * @param {string} func - The hash function. Must be a valid value from the list of available hash functions.
 * @returns {boolean} True if the hash function was successfully set; otherwise false.
 */
function setDigest(func: string): boolean {
  log.debug(`${LOGS_PREFIX}Setting hash function to ${func}`);
	isIn(digests, func, undefined, true); 
	digest = func;
	return true;
}

/**
 * Returns the list of available hash functions.
 *
 * @return {string[]} The list of available hash functions.
 */
function getDigests(): string[] {
	return digests;
}


/**
 * Generates a cryptographic hash (HMAC) of a string using a secret (pepper).
 *
 * This function uses the HMAC (Hash-based Message Authentication Code) algorithm
 * with the configured digest (e.g., sha256) to create a fixed-length, irreversible
 * hash of the input string. The secret acts as a pepper, adding an extra layer of
 * security. This is useful for password storage, integrity checks, or any scenario
 * where you need to verify data without revealing the original value.
 *
 * @param {string} str - The input string to hash (e.g., a password).
 * @param {string} secret - The secret (pepper) to use for HMAC. Should be kept private.
 * @returns {string} The base64url-encoded HMAC hash of the input string.
 *
 * @example
 * const hashValue = hash("myPassword", "mySecretKey");
 * // Store hashValue for later verification
 *
 * @remarks
 * - Hashing is one-way: you cannot recover the original string from the hash.
 * - Use for integrity checks and digital signatures.
 * - For encryption (two-way), use the `encrypt` function instead.
 */
function hash(str: string, secret: string): string {
  log.debug(`${LOGS_PREFIX}Hashing str='${str}' using secret='${secret}'`);
  return createHmac(digest, secret).update(str).digest("base64url");
}

/**
 * Generates a cryptographically secure random salt.
 *
 * @returns {string} A 32-character hexadecimal string representing 16 random bytes.
 *
 * @example
 * const salt = randomSalt();
 * // salt might be: '9f86d081884c7d659a2feaa0c55ad015'
 */
function randomSalt(): string {
  log.debug(`${LOGS_PREFIX}Generating random salt`);
  return randomBytes(16).toString("hex");
}


/**
 * Derives a cryptographic key from a string using PBKDF2 (Password-Based Key Derivation Function 2).
 *
 * This function applies the PBKDF2 algorithm to the HMAC hash of the input string, using the provided
 * secret (pepper) and salt. PBKDF2 is designed to be computationally intensive, making brute-force
 * attacks more difficult. The number of iterations (salt rounds), key length, and digest algorithm
 * are configurable in this module.
 *
 * @param {string} str - The input string to hash (e.g., a password).
 * @param {string} secret - The secret (pepper) to use for HMAC.
 * @param {string} salt - The salt to use for key derivation (should be random and unique per hash).
 * @returns {Buffer} The derived key as a Buffer.
 *
 * @example
 * const salt = randomSalt();
 * const derivedKey = pbkdf2("myPassword", "mySecretKey", salt);
 * // Store salt and derivedKey for later verification
 *
 * @remarks
 * - PBKDF2 is recommended for password hashing and key derivation.
 * - Use a unique, random salt for each password.
 * - The output Buffer can be stored as-is or encoded (e.g., hex or base64).
 */
function pbkdf2(str: string, secret: string, salt: string): Buffer {
  log.debug(`${LOGS_PREFIX}Deriving key using PBKDF2 (salt=${salt})`);
  return pbkdf2Sync(
    hash(str, secret),
    salt,
    saltRnds,
    keyLen,
    digest
  );
}


/**
 * Hashes (not true encryption) a string using a base64-encoded secret and PBKDF2.
 *
 * This function generates a salted, one-way hash of the input string using PBKDF2 with HMAC and a secret (pepper).
 * The result is a hex string prefixed with a random salt. This is suitable for securely storing passwords or secrets
 * that you do not need to recover (irreversible). The salt ensures that the same input produces different hashes each time.
 *
 * @param {string} str - The string to hash (e.g., a password). Must be a non-empty string.
 * @param {string} b64Secret - The base64-encoded secret (pepper) used for hashing. Must be a valid base64 string.
 * @returns {string} The salted hash as a hex string, with the salt prepended.
 *
 * @throws {InvalidStringError} If `str` is not a non-empty string.
 * @throws {InvalidBase64SecretError} If `b64Secret` is not a valid base64 encoded string.
 *
 * @example
 * const secret = rndB64Secret();
 * const hash = encrypt("myPassword", secret);
 * // Store hash and secret for later verification
 *
 * @remarks
 * - This is not reversible encryption; you cannot recover the original string.
 * - Use for password storage or verification, not for data you need to decrypt.
 * - For verification, use the `compare` function with the same secret.
 */
function encrypt(str: string, b64Secret: string): string {
  log.debug(`${LOGS_PREFIX}Encrypting str='${str}' using b64Secret='${b64Secret}'`);
  isString(str, "!0", null, true);
  isBase64(b64Secret, false, true);
  const secret = b64Decode(b64Secret, true);
  const salt = randomSalt();
  return salt + pbkdf2(str, secret, salt).toString("hex"); // salt + hashedStr
}

export {
	getSaltRounds,
	setSaltRounds,
	getKeyLen,
	setKeyLen,
	getDigest,
	setDigest,
	getDigests,
	encrypt,
  tse,
  hash,
  pbkdf2,
};
