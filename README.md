
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/hashitaka.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fhashitaka.svg)](https://www.npmjs.com/package/@dwtechs/hashitaka)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Hashitaka.js)](https://www.npmjs.com/package/@dwtechs/hashitaka)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-100%25-brightgreen.svg)
[![minified size](https://img.shields.io/bundlephobia/min/@dwtechs/hashitaka?color=brightgreen)](https://www.npmjs.com/package/@dwtechs/hashitaka)

- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Express.js](#expressjs)
- [Contributors](#contributors)
- [Stack](#stack)


## Synopsis

**[Hashitaka.js](https://github.com/DWTechs/Hashitaka.js)** is an open source Node.js library for secure hash generation, encryption and comparison.

- 📦 Only 1 dependency to check inputs variables
- 🪶 Very lightweight
- 🧪 Thoroughly tested
- 🚚 Shipped as EcmaScrypt module
- 📝 Written in Typescript


## Support

- Node.js: 22

This is the oldest targeted versions.  
The library uses node:crypto.  


## Installation

```bash
$ npm i @dwtechs/hashitaka
```


## Usage

### ES6 / TypeScript

Example of use with Express.js using ES6 module format

```javascript

import { compare, encrypt } from "@dwtechs/hashitaka";
import { randomPwd } from "@dwtechs/passken";

const { PWD_SECRET } = process.env;

/**
 * This express middleware checks if a user-provided password matches a stored hashed password 
 * in a database.
 * If the password is correct, it calls the next() function to proceed with the request.
 * If the password is incorrect or missing, it calls next() with an error.
 */
function comparePwd(req, res, next) {
  
  const pwd = req.body.pwd; // from request
  const hash = req.user.hash; //from db
  try {
    if (compare(pwd, hash, PWD_SECRET))
      return next();
    return next({statusCode: 401, message: "Invalid password" });
  } catch (err) {
    return next(err);
  }

}


/**
 * This express middleware generates a random password for a user and encrypts it.
 */
function createPwd(req, res, next) {

  const user = req.body.user;
  const options = {
    len: 14,
    num: true,
    ucase: true,
    lcase: true,
    sym: true,
    strict: true,
    similarChars: true,
  };
  user.pwd = randomPwd(options);
  user.pwdHash = encrypt(user.pwd, PWD_SECRET);
  next();

}

export {
  comparePwd,
  createPwd,
};

```


## API Reference

### Hash

```typescript

// Default values
let saltRnds = 12
let digest = "sha256";
let keyLen = 64;

/**
 * Returns the number of salt rounds used for hashing.
 *
 * @returns {number} The number of salt rounds.
 */
function getSaltRounds(): number {}

/**
 * Sets the number of salt rounds for hashing.
 *
 * @param {number} rnds - The number of salt rounds to set. Must be a valid integer 
 * between 12 and 100.
 * @returns {boolean} True if the salt rounds were successfully set, otherwise false.
 */
function setSaltRounds(rnds: number): boolean {} // between 12 and 100

/**
 * Returns the key length used for hashing.
 *
 * @returns {number} The key length.
 */
function getKeyLen(): number {}

/**
 * Sets the key length to the specified value for hashing.
 *
 * @param {number} len - The desired key length. Must be a valid integer 
 * between 2 and 256.
 * @returns {boolean} True if the key length was successfully set; 
 * otherwise false.
 */
function setKeyLen(r: number): boolean {} // between 2 and 256

/**
 * Returns the hash function used for hashing.
 *
 * @returns {string} The hash function.
 */
function getDigest(): string {}

/**
 * Sets the hash function used for hashing.
 * The list of available digests is returned by getDigests()
 *
 * @param {string} func - The hash function. Must be a valid value from the list of 
 * available hash functions.
 * @returns {boolean} True if the hash function was successfully set; otherwise false.
 */
function setDigest(d: string): boolean {}

/**
 * Returns the list of available hash functions.
 *
 * @returns {string[]} The list of available hash functions.
 */
function getDigests(): string[] {}


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
function tse(a: Buffer, b: Buffer): boolean {}


/**
 * Encrypts a password using a base64 encoded secret.
 *
 * @param {string} str - The password to encrypt. Must be a non-empty string.
 * @param {string} b64Secret - The base64 encoded secret used for encryption. 
 * Must be a valid base64 encoded string.
 * @returns {string} The encrypted password as a hex string prefixed with a random salt.
 * @throws {InvalidStringError} If `str` is not a non-empty string.
 * @throws {InvalidBase64SecretError} If `b64Secret` is not a valid base64 encoded string.
 */
function encrypt( str: string, 
                  b64Secret: string
                ): string | false {}


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
 * - Use for password verification, integrity checks, or digital signatures.
 * - For encryption (two-way), use the `encrypt` function instead.
 */
function hash(str: string, secret: string): string {}


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
function pbkdf2(str: string, secret: string, salt: string): Buffer {}


/**
 * Compares a plaintext string with a hashed string using a secret.
 *
 * @param {string} str - The plaintext string to compare.
 * @param {string} hash - The hashed string to compare against.
 * @param {string} b64Secret - The base64 encoded secret used for hashing.
 * @returns {boolean} true if the password matches the hash, false otherwise.
 * @throws {InvalidStringError} If `str` or `hash` is not a non-empty string.
 * @throws {InvalidBase64SecretError} If `b64Secret` is not a valid base64 encoded string.
 */
function compare( str: string, 
                  hash: string,
                  b64Secret: string
                ): boolean {}

```

### Secret

```typescript

/**
 * Generates a random string of the specified length, encoded in base64.
 *
 * @param {number} [length=32] - The length of the random string to generate. 
 * Defaults to 32 if not specified.
 * @returns {string} The generated random string encoded in base64.
 */
rndB64Secret(length = 32): string

```


### Base64

---

```typescript

/**
 * Decodes a base64 encoded string.
 *
 * @param {string} str - The base64 encoded string to decode.
 * @param {boolean} urlSafe - A boolean indicating if the input string is URL safe. 
 * Defaults to true.
 * @returns {string} The decoded string in UTF-8 format.
 * @throws {InvalidStringError} If `str` is not a non-empty string.
 */
function b64Decode(str: string, urlSafe = true): string;

/**
 * Encodes a given string into Base64 format.
 * 
 * @param {string} str - The string to be encoded.
 * @param {boolean} urlSafe - Optional boolean to determine if the output should be URL safe. 
 * Defaults to true.
 * @returns {string} The Base64 encoded string. If `urlSafe` is true, the output will be modified 
 * to be URL safe.
 * @throws {InvalidStringError} If `str` is not a non-empty string.
 */
function b64Encode(str: string, urlSafe = true): string;

```

## Error Handling

Hashitaka uses a structured error system that helps you identify and handle specific error cases. All errors extend from a base `HashitakaError` class.

### Error Classes Hierarchy

```
HashitakaError (abstract base class)
├── HashLengthMismatchError
├── InvalidStringError
└── InvalidBase64SecretError
```

### Common Properties

All error classes share these properties:

- `message`: Human-readable error description
- `code`: Human-readable error code (e.g., "TOKEN_EXPIRED")
- `statusCode`: Suggested HTTP status code (e.g., 401)
- `stack`: Error stack trace

### Using Error Handling

```typescript
import { encrypt, HashitakaError, HashLengthMismatchError } from '@dwtechs/hashitaka';

try {
  const result = encrypt('mySecret', 'invalidBase64Secret');
  // ...use result
} catch (err) {
  if (err instanceof HashLengthMismatchError) {
    // Handle a specific error
    console.error('Hash length mismatch:', err.message);
  } else if (err instanceof HashitakaError) {
    // Handle any library-specific error
    console.error(`Hashitaka error [${err.code}]:`, err.message);
  } else {
    // Handle other/unexpected errors
    console.error('Unknown error:', err);
  }
}
```

### Error Types and HTTP Status Codes

| Error Class | Code | Status Code | Description |
|-------------|------|-------------|-------------|
| HashLengthMismatchError | HASH_LENGTH_MISMATCH | 400 | Hashes must have the same byte length |
| InvalidStringError | INVALID_STRING | 400 | str must be a non-empty string |
| InvalidBase64SecretError | INVALID_BASE64_SECRET | 400 | b64Secret must be a base64 encoded string |


## Express.js

You can use Hashitaka directly as Express.js middlewares using: 
- [@dwtechs/passken-express library](https://www.npmjs.com/package/@dwtechs/passken-express) for password related middlewares.
- [@dwtechs/toker-express library](https://www.npmjs.com/package/@dwtechs/toker-express) for JWT related middlewares.
This way you do not have to write express controllers yourself.


## Contributors

**Hashitaka.js** is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Hashitaka.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                             Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup.js](https://rollupjs.org)       |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
