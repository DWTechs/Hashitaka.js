import { randomBytes } from "node:crypto";
import { isValidInteger } from "@dwtechs/checkard";
import { b64Encode } from "./base64.js";
import { DEFAULT_SECRET_LEN, 
		 MIN_SECRET_LEN, 
		 MAX_SECRET_LEN 
	   } from "./constants.js";

/**
 * Generates a random string of the specified length, encoded in base64.
 *
 * @param {number} [len=32] - The length of the random string to generate. Must be a valid integer between 1 and 262144. Defaults to 32 if not specified or invalid.
 * @param {boolean} [urlSafe=true] - If true, uses URL-safe base64 encoding. Defaults to true.
 * @returns {string} The generated random string encoded in base64.
 */
function create(len: number = DEFAULT_SECRET_LEN, urlSafe: boolean = true): string {
	const kl = isValidInteger(len, MIN_SECRET_LEN, MAX_SECRET_LEN) ? len : DEFAULT_SECRET_LEN;
	return b64Encode(randomBytes(kl).toString("utf8"), urlSafe);
}

export { create };
