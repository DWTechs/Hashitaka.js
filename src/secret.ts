import { randomBytes } from "node:crypto";
import { isValidInteger } from "@dwtechs/checkard";
import { b64Encode } from "./base64.js";

const DEFAULT_KEY_LENGTH = 32;

/**
 * Generates a random string of the specified length, encoded in base64.
 *
 * @param {number} [len=32] - The length of the random string to generate. Defaults to 32 if not specified.
 * @returns {string} The generated random string encoded in base64.
 */
function create(len: number): string {
	const kl = isValidInteger(len, 1, 262144, false) ? len : DEFAULT_KEY_LENGTH;
	return b64Encode(randomBytes(kl).toString("utf8"), true);
}

export { create };
