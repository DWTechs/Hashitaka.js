/*
MIT License

Copyright (c) 2022 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Hashitaka.js
*/


export declare abstract class HashitakaError extends Error {
    abstract readonly code: string;
    abstract readonly statusCode: number;
    constructor(message: string);
}
export declare class HashLengthMismatchError extends HashitakaError {
    readonly code = "HASH_LENGTH_MISMATCH";
    readonly statusCode = 400;
    constructor(message?: string);
}
export declare class InvalidBase64ToDecodeError extends HashitakaError {
    readonly code = "INVALID_BASE64_TO_DECODE";
    readonly statusCode = 400;
    constructor(urlSafe: boolean);
}
export declare class InvalidStringToEncodeError extends HashitakaError {
    readonly code = "INVALID_STRING_TO_ENCODE";
    readonly statusCode = 400;
    constructor();
}
export declare class InvalidStringToCompareError extends HashitakaError {
    readonly code = "INVALID_STRING_TO_COMPARE";
    readonly statusCode = 400;
    constructor();
}
export declare class InvalidHashToCompareError extends HashitakaError {
    readonly code = "INVALID_HASH_TO_COMPARE";
    readonly statusCode = 400;
    constructor();
}
export declare class InvalidSaltRoundsError extends HashitakaError {
    readonly code = "INVALID_SALT_ROUNDS";
    readonly statusCode = 400;
    constructor(min: number, max: number);
}
export declare class InvalidKeyLengthError extends HashitakaError {
    readonly code = "INVALID_KEY_LENGTH";
    readonly statusCode = 400;
    constructor(min: number, max: number);
}
export declare class InvalidDigestFunctionError extends HashitakaError {
    readonly code = "INVALID_DIGEST_FUNCTION";
    readonly statusCode = 400;
    constructor();
}
export declare class HmacCreationError extends HashitakaError {
    readonly code = "HMAC_CREATION_FAILED";
    readonly statusCode = 500;
    constructor();
}
export declare class Pbkdf2DerivationError extends HashitakaError {
    readonly code = "PBKDF2_DERIVATION_FAILED";
    readonly statusCode = 500;
    constructor();
}
export declare class InvalidStringToEncryptError extends HashitakaError {
    readonly code = "INVALID_STRING_TO_ENCRYPT";
    readonly statusCode = 400;
    constructor();
}
export declare class InvalidSecretToEncryptError extends HashitakaError {
    readonly code = "INVALID_SECRET_TO_ENCRYPT";
    readonly statusCode = 400;
    constructor();
}

declare function getSaltRounds(): number;
declare function setSaltRounds(rnds: number): boolean;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): boolean;
declare function getDigest(): string;
declare function setDigest(func: string): boolean;
declare function getDigests(): string[];
declare function encrypt(str: string, b64Secret: string): string;
declare function compare(str: string, hash: string, b64Secret: string, urlSafe?: boolean): boolean;
declare function rndB64Secret(len?: number, urlSafe?: boolean): string;
declare function b64Decode(str: string, urlSafe?: boolean): string;
declare function b64Encode(str: string, urlSafe?: boolean): string;
declare function tse(a: Buffer, b: Buffer): boolean;
declare function hash(str: string, secret: string): string;
declare function pbkdf2(str: string, secret: string, salt: string): Buffer;

export { 
  getSaltRounds,
  setSaltRounds,
  getKeyLen,
  setKeyLen,
  getDigest,
  setDigest,
  getDigests,
  encrypt,
  compare,
  rndB64Secret,
  b64Encode,
  b64Decode,
  pbkdf2,
  tse,
  hash,
};
