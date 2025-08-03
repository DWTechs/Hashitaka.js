import { isString } from "@dwtechs/checkard";
import { InvalidStringError } from "./errors.js";

/**
 * Decodes a base64 encoded string.
 *
 * @param {string} str - The base64 encoded string to decode.
 * @param {boolean} urlSafe - A boolean indicating if the input string is URL safe. Defaults to true.
 * @returns {string} The decoded string in UTF-8 format.
 */
function b64Decode(str: string, urlSafe = true): string {
  if (!isString(str, "!0")) 
    throw new InvalidStringError();


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
 */
function b64Encode(str: string, urlSafe = true): string {
  if (!isString(str, "!0")) 
    throw new InvalidStringError();

  let b64 = Buffer.from(str).toString("base64");
  if (urlSafe)
    b64 = b64.replace(/\+/g, "-")
             .replace(/\//g, "_")
             .replace(/=+$/, "");

	return b64;
		
}

function pad(str: string): string {
  return "=".repeat((4 - (str.length % 4)) % 4);
}

export { b64Encode, b64Decode };
