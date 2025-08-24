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

  constructor(message = `${HASHITAKA_PREFIX}Hashes must have the same byte length`) {
    super(message);
  }
}
