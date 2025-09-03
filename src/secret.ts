import { log } from "@dwtechs/winstan";
import { randomBytes } from "node:crypto";
import { isValidInteger } from "@dwtechs/checkard";
import { b64Encode } from "./base64.js";
import { LOGS_PREFIX } from "./constants";

const DEFAULT_KEY_LEN = 32;

/**
 * Generates a random string of the specified length, encoded in base64.
 *
 * @param {number} [len=32] - The length of the random string to generate. Must be a valid integer between 1 and 262144. Defaults to 32 if not specified or invalid.
 * @returns {string} The generated random string encoded in base64.
 */
function create(len: number): string {
	log.debug(`${LOGS_PREFIX}Creating secret of length=${len}`);
	const kl = isValidInteger(len, 1, 262144) ? len : DEFAULT_KEY_LEN;
	return b64Encode(randomBytes(kl).toString("utf8"), false);
}

export { create };
