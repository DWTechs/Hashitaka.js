import { isString } from "@dwtechs/checkard";
import { tse, pbkdf2 } from "./hash";
import { b64Decode } from "./base64.js";
import { InvalidStringForCompareError, 
         InvalidHashForCompareError } from "./errors";

/**
 * Verifies whether a plaintext string matches a previously hashed value using the same secret and salt extraction logic.
 *
 * This function extracts the salt from the stored hash, decodes the secret (optionally using URL-safe base64),
 * re-derives the hash from the provided plaintext and secret, and performs a timing-safe comparison.
 * It is typically used for password verification or any scenario where you need to check if a user-provided value matches a stored hash.
 *
 * @param {string} str - The plaintext string to verify (e.g., a password).
 * @param {string} hash - The stored hash to compare against (salt + hash, as produced by `encrypt`).
 * @param {string} b64Secret - The base64-encoded secret (pepper) used for hashing.
 * @param {boolean} [urlSafe=false] - If true, decodes the secret using URL-safe base64 encoding.
 * @returns {boolean} `true` if the plaintext matches the hash, `false` otherwise.
 *
 * @throws {InvalidStringForCompareError} If `str` is not a non-empty string.
 * @throws {InvalidHashForCompareError} If `hash` is not a non-empty string.
 * @throws {Error} If `b64Secret` is not a valid base64 encoded string.
 *
 * @example
 * const isValid = compare("userInput", storedHash, secret, true);
 * if (isValid) {
 *   // Password or secret is correct
 * } else {
 *   // Invalid password or secret
 * }
 *
 * @remarks
 * - Always use the same secret and salt extraction logic as when hashing.
 * - Uses timing-safe comparison to prevent timing attacks.
 * - For password verification, always return a boolean (never throw on mismatch).
 */
function compare(
  str: string, 
  hash: string, 
  b64Secret: string, 
  urlSafe: boolean = false
): boolean {

  try {
    isString(str, "!0", null, true);
  } catch (err) {
    const e = new InvalidStringForCompareError();
    e.cause = err;
    throw e;
  }
  
  try {
    isString(hash, "!0", null, true);
  } catch (err) {
    const e = new InvalidHashForCompareError();
    e.cause = err;
    throw e;
  }
  
  const secret = b64Decode(b64Secret, urlSafe);
  const salt = hash.slice(0, 32); // Assuming the salt length is 16 bytes (32 hex characters)
  const hashedStr = pbkdf2(str, secret, salt); 
  const storedHash = Buffer.from(hash.slice(32), "hex");
  return tse(storedHash, hashedStr);
}

export {
	compare,
};
