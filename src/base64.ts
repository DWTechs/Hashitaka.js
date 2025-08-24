import { log } from "@dwtechs/winstan";
import { isString } from "@dwtechs/checkard";
import { LOGS_PREFIX } from "./constants";

/**
 * Decodes a base64 encoded string.
 *
 * @param {string} str - The base64 encoded string to decode.
 * @param {boolean} urlSafe - A boolean indicating if the input string is URL safe. Defaults to true.
 * @returns {string} The decoded string in UTF-8 format.
 * @throws {InvalidStringError} If `str` is not a non-empty string.
 */
function b64Decode(str: string, urlSafe = true): string {
  log.debug(`${LOGS_PREFIX}Decoding base64 string (urlSafe=${urlSafe})`);
  isString(str, "!0", null, true);
  if (urlSafe)
    str = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(str + pad(str), "base64").toString("utf8");
}


/**
 * Encodes a given string into Base64 format.
 * 
 * @param {string} str - The string to be encoded.
 * @param {boolean} urlSafe - Optional boolean to determine if the output should be URL safe. Defaults to true.
 * @returns {string} The Base64 encoded string. If `urlSafe` is true, the output will be modified to be URL safe.
 * @throws {InvalidStringError} If `str` is not a non-empty string.
 */
function b64Encode(str: string, urlSafe = true): string {
  log.debug(`${LOGS_PREFIX}Encoding string (urlSafe=${urlSafe})`);
  isString(str, "!0", null, true);
  let b64 = Buffer.from(str).toString("base64");
  if (urlSafe)
    b64 = b64.replace(/\+/g, "-")
             .replace(/\//g, "_")
             .replace(/=+$/, "");

	return b64;
		
}

/**
 * Adds padding characters to a base64 string to ensure proper length.
 * 
 * Base64 encoding requires the string length to be a multiple of 4 characters.
 * This function calculates how many padding characters ('=') are needed and
 * returns the appropriate padding string.
 * 
 * @param {string} str - The base64 string that may need padding.
 * @returns {string} The padding string consisting of '=' characters, or empty string if no padding needed.
 * 
 * @example
 * pad("YWJj");     // returns "=" (3 chars, needs 1 padding)
 * pad("YWJjZA");   // returns "==" (6 chars, needs 2 padding)  
 * pad("YWJjZGU");  // returns "=" (7 chars, needs 1 padding)
 * pad("YWJjZGVm"); // returns "" (8 chars, no padding needed)
 */
function pad(str: string): string {
  return "=".repeat((4 - (str.length % 4)) % 4);
}

export { b64Encode, b64Decode };
