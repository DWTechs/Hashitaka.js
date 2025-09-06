/**
 * Custom error classes for the library
 */

/**
 * Prefix for all Hashitaka error messages
 */
const HASHITAKA_PREFIX = "Hashitaka: ";
  
/**
 * Base class for all Hashitaka errors
 */
export abstract class HashitakaError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintains proper stack trace for where the error was thrown (only available on V8)
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);

  }
}

/**
 * Error thrown when hash buffers have different lengths during comparison
 * 
 * @example
 * ```typescript
 * try {
 *   tse(bufferA, bufferB);
 * } catch (error) {
 *   if (error instanceof HashLengthMismatchError) {
 *     console.log(error.message); // "Hashes must have the same byte length"
 *   }
 * }
 * ```
 */
export class HashLengthMismatchError extends HashitakaError {
  readonly code = "HASH_LENGTH_MISMATCH";
  readonly statusCode = 400;

  constructor(message = `${HASHITAKA_PREFIX}Hashes must have the same byte length to be compared`) {
    super(message);
  }
}

/**
 * Error thrown when a string is not valid base64 format during decoding
 * 
 * @example
 * ```typescript
 * try {
 *   b64Decode(invalidBase64String);
 * } catch (error) {
 *   if (error instanceof InvalidBase64ToDecodeError) {
 *     console.log(error.message); // "Invalid base64 format"
 *   }
 * }
 * ```
 */
export class InvalidBase64ToDecodeError extends HashitakaError {
  readonly code = "INVALID_BASE64_TO_DECODE";
  readonly statusCode = 400;

  constructor(urlSafe: boolean) {
    const message = `${HASHITAKA_PREFIX}Invalid base64 ${urlSafe ? 'URL-safe' : 'non URL-safe'} string to decode`;
    super(message);
  }
}

/**
 * Error thrown when the input string for base64 encoding is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   b64Encode("");
 * } catch (error) {
 *   if (error instanceof InvalidStringToEncodeError) {
 *     console.log(error.message); // "Cannot encode invalid or empty string"
 *   }
 * }
 * ```
 */
export class InvalidStringToEncodeError extends HashitakaError {
  readonly code = "INVALID_STRING_TO_ENCODE";
  readonly statusCode = 400;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Invalid string to encode in base64`;
    super(message);
  }
}

/**
 * Error thrown when the plaintext string for comparison is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   compare("", storedHash, secret);
 * } catch (error) {
 *   if (error instanceof InvalidPlaintextError) {
 *     console.log(error.message); // "Invalid plaintext string for comparison"
 *   }
 * }
 * ```
 */
export class InvalidStringToCompareError extends HashitakaError {
  readonly code = "INVALID_STRING_TO_COMPARE";
  readonly statusCode = 400;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Invalid string for hash comparison`;
    super(message);
  }
}

/**
 * Error thrown when the stored hash for comparison is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   compare("userInput", "", secret);
 * } catch (error) {
 *   if (error instanceof InvalidStoredHashError) {
 *     console.log(error.message); // "Invalid stored hash for comparison"
 *   }
 * }
 * ```
 */
export class InvalidHashToCompareError extends HashitakaError {
  readonly code = "INVALID_HASH_TO_COMPARE";
  readonly statusCode = 400;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Invalid hash for comparison`;
    super(message);
  }
}

/**
 * Error thrown when the salt rounds value is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   setSaltRounds(5);
 * } catch (error) {
 *   if (error instanceof InvalidSaltRoundsError) {
 *     console.log(error.message); // "Invalid salt rounds, must be between 12 and 100"
 *   }
 * }
 * ```
 */
export class InvalidSaltRoundsError extends HashitakaError {
  readonly code = "INVALID_SALT_ROUNDS";
  readonly statusCode = 400;

  constructor(min: number, max: number) {
    const message = `${HASHITAKA_PREFIX}Invalid salt rounds, must be between ${min} and ${max}`;
    super(message);
  }
}

/**
 * Error thrown when the key length value is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   setKeyLen(1);
 * } catch (error) {
 *   if (error instanceof InvalidKeyLengthError) {
 *     console.log(error.message); // "Invalid key length, must be between 2 and 256"
 *   }
 * }
 * ```
 */
export class InvalidKeyLengthError extends HashitakaError {
  readonly code = "INVALID_KEY_LENGTH";
  readonly statusCode = 400;

  constructor(min: number, max: number) {
    const message = `${HASHITAKA_PREFIX}Invalid key length, must be between ${min} and ${max}`;
    super(message);
  }
}

/**
 * Error thrown when the hash digest function is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   setDigest("invalidHash");
 * } catch (error) {
 *   if (error instanceof InvalidDigestFunctionError) {
 *     console.log(error.message); // "Invalid hash digest function"
 *   }
 * }
 * ```
 */
export class InvalidDigestFunctionError extends HashitakaError {
  readonly code = "INVALID_DIGEST_FUNCTION";
  readonly statusCode = 400;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Invalid hash digest function`;
    super(message);
  }
}

/**
 * Error thrown when HMAC creation fails
 * 
 * @example
 * ```typescript
 * try {
 *   hash("data", "secret");
 * } catch (error) {
 *   if (error instanceof HmacCreationError) {
 *     console.log(error.message); // "Failed to create HMAC hash"
 *   }
 * }
 * ```
 */
export class HmacCreationError extends HashitakaError {
  readonly code = "HMAC_CREATION_FAILED";
  readonly statusCode = 500;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Failed to create HMAC hash`;
    super(message);
  }
}

/**
 * Error thrown when PBKDF2 key derivation fails
 * 
 * @example
 * ```typescript
 * try {
 *   pbkdf2("password", "secret", "salt");
 * } catch (error) {
 *   if (error instanceof Pbkdf2DerivationError) {
 *     console.log(error.message); // "Failed to derive key using PBKDF2"
 *   }
 * }
 * ```
 */
export class Pbkdf2DerivationError extends HashitakaError {
  readonly code = "PBKDF2_DERIVATION_FAILED";
  readonly statusCode = 500;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Failed to derive key using PBKDF2`;
    super(message);
  }
}

/**
 * Error thrown when the string to encrypt is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   encrypt("", "validSecret");
 * } catch (error) {
 *   if (error instanceof InvalidStringToEncryptError) {
 *     console.log(error.message); // "Invalid string to encrypt"
 *   }
 * }
 * ```
 */
export class InvalidStringToEncryptError extends HashitakaError {
  readonly code = "INVALID_STRING_TO_ENCRYPT";
  readonly statusCode = 400;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Invalid string to encrypt`;
    super(message);
  }
}

/**
 * Error thrown when the base64 secret for encryption is invalid
 * 
 * @example
 * ```typescript
 * try {
 *   encrypt("validString", "invalidBase64!");
 * } catch (error) {
 *   if (error instanceof InvalidSecretToEncryptError) {
 *     console.log(error.message); // "Invalid base64 secret for encryption"
 *   }
 * }
 * ```
 */
export class InvalidSecretToEncryptError extends HashitakaError {
  readonly code = "INVALID_SECRET_TO_ENCRYPT";
  readonly statusCode = 400;

  constructor() {
    const message = `${HASHITAKA_PREFIX}Invalid base64 secret for encryption`;
    super(message);
  }
}
