import { randomBytes } from "node:crypto";
import { isValidInteger } from "@dwtechs/checkard";
import { InvalidSecretLengthError } from "./errors.js";
import { DEFAULT_SECRET_LEN, 
		 MIN_SECRET_LEN, 
		 MAX_SECRET_LEN 
	   } from "./constants.js";

/**
 * Generates a random string of the specified length, encoded in base64.
 *
 * @param {number} [len=32] - The length of the random string to generate. Must be a valid integer between 1 and 262144.
 * @param {boolean} [urlSafe=true] - If true, uses URL-safe base64 encoding. Defaults to true.
 * @returns {string} The generated random string encoded in base64.
 * @throws {InvalidSecretLengthError} If `len` is not a valid integer between 1 and 262144.
 */
function create(len: number = DEFAULT_SECRET_LEN, urlSafe: boolean = true): string {
  try {
    isValidInteger(len, MIN_SECRET_LEN, MAX_SECRET_LEN, true, true);
  } catch (err) {
    throw new InvalidSecretLengthError(MIN_SECRET_LEN, MAX_SECRET_LEN, err instanceof Error ? err : new Error(String(err)));
  }

	const bytes = randomBytes(len);
	if (urlSafe)
		return bytes.toString("base64url");
	return bytes.toString("base64");
}

export { create };
