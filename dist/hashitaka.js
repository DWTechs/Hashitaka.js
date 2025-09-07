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

import { getHashes, timingSafeEqual, createHmac, pbkdf2Sync, randomBytes } from 'node:crypto';
import { isBase64, isString, isValidInteger, isIn } from '@dwtechs/checkard';

const HASHITAKA_PREFIX = "Hashitaka - ";
function chainMessage(message, err) {
    return `${message} - caused by: ${err.message}`;
}
class HashitakaError extends Error {
    constructor(message, causedBy) {
        super(causedBy ? chainMessage(message, causedBy) : message);
        this.name = `${HASHITAKA_PREFIX}${this.constructor.name}`;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
    }
}
class HashLengthMismatchError extends HashitakaError {
    constructor(message = "Hashes must have the same byte length to be compared") {
        super(message);
        this.code = "HASH_LENGTH_MISMATCH";
        this.statusCode = 400;
    }
}
class InvalidBase64ToDecodeError extends HashitakaError {
    constructor(urlSafe, causedBy) {
        const message = `Invalid base64 ${urlSafe ? 'URL-safe' : 'non URL-safe'} string to decode`;
        super(message, causedBy);
        this.code = "INVALID_BASE64_TO_DECODE";
        this.statusCode = 400;
    }
}
class InvalidStringToEncodeError extends HashitakaError {
    constructor(causedBy) {
        const message = "Invalid string to encode in base64";
        super(message, causedBy);
        this.code = "INVALID_STRING_TO_ENCODE";
        this.statusCode = 400;
    }
}
class InvalidStringToCompareError extends HashitakaError {
    constructor(causedBy) {
        const message = "Invalid string for hash comparison";
        super(message, causedBy);
        this.code = "INVALID_STRING_TO_COMPARE";
        this.statusCode = 400;
    }
}
class InvalidHashToCompareError extends HashitakaError {
    constructor(causedBy) {
        const message = "Invalid hash for comparison";
        super(message, causedBy);
        this.code = "INVALID_HASH_TO_COMPARE";
        this.statusCode = 400;
    }
}
class InvalidSaltRoundsError extends HashitakaError {
    constructor(min, max, causedBy) {
        const message = `Invalid salt rounds, must be between ${min} and ${max}`;
        super(message, causedBy);
        this.code = "INVALID_SALT_ROUNDS";
        this.statusCode = 400;
    }
}
class InvalidKeyLengthError extends HashitakaError {
    constructor(min, max, causedBy) {
        const message = `Invalid key length, must be between ${min} and ${max}`;
        super(message, causedBy);
        this.code = "INVALID_KEY_LENGTH";
        this.statusCode = 400;
    }
}
class InvalidDigestFunctionError extends HashitakaError {
    constructor(causedBy) {
        const message = "Invalid hash digest function";
        super(message, causedBy);
        this.code = "INVALID_DIGEST_FUNCTION";
        this.statusCode = 400;
    }
}
class HmacCreationError extends HashitakaError {
    constructor(causedBy) {
        const message = "Failed to create HMAC hash";
        super(message, causedBy);
        this.code = "HMAC_CREATION_FAILED";
        this.statusCode = 500;
    }
}
class Pbkdf2DerivationError extends HashitakaError {
    constructor(causedBy) {
        const message = "Failed to derive key using PBKDF2";
        super(message, causedBy);
        this.code = "PBKDF2_DERIVATION_FAILED";
        this.statusCode = 500;
    }
}
class InvalidStringToEncryptError extends HashitakaError {
    constructor(causedBy) {
        const message = "Invalid string to encrypt";
        super(message, causedBy);
        this.code = "INVALID_STRING_TO_ENCRYPT";
        this.statusCode = 400;
    }
}
class InvalidSecretToEncryptError extends HashitakaError {
    constructor(causedBy) {
        const message = "Invalid base64 secret for encryption";
        super(message, causedBy);
        this.code = "INVALID_SECRET_TO_ENCRYPT";
        this.statusCode = 400;
    }
}

function b64Decode(str, urlSafe = true) {
    try {
        isBase64(str, urlSafe, true);
    }
    catch (err) {
        throw new InvalidBase64ToDecodeError(urlSafe, err);
    }
    if (urlSafe)
        str = str.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(str + pad(str), "base64").toString("utf8");
}
function b64Encode(str, urlSafe = true) {
    try {
        isString(str, "!0", null, true);
    }
    catch (err) {
        throw new InvalidStringToEncodeError(err);
    }
    let b64 = Buffer.from(str).toString("base64");
    if (urlSafe)
        b64 = b64.replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    return b64;
}
function pad(str) {
    return "=".repeat((4 - (str.length % 4)) % 4);
}

const DEFAULT_SALT_RNDS = 12;
const MIN_SALT_RNDS = 12;
const MAX_SALT_RNDS = 100;
const DEFAULT_KEY_LEN = 64;
const MIN_KEY_LEN = 2;
const MAX_KEY_LEN = 256;
const DEFAULT_SECRET_LEN = 32;
const MIN_SECRET_LEN = 1;
const MAX_SECRET_LEN = 262144;

const digests = getHashes();
let digest = "sha256";
let keyLen = DEFAULT_KEY_LEN;
let saltRnds = DEFAULT_SALT_RNDS;
function tse(a, b) {
    if (a.length !== b.length)
        throw new HashLengthMismatchError();
    return timingSafeEqual(a, b);
}
function getSaltRounds() {
    return saltRnds;
}
function setSaltRounds(rnds) {
    try {
        isValidInteger(rnds, MIN_SALT_RNDS, MAX_SALT_RNDS, true, true);
    }
    catch (err) {
        throw new InvalidSaltRoundsError(MIN_SALT_RNDS, MAX_SALT_RNDS, err);
    }
    saltRnds = rnds;
    return true;
}
function getKeyLen() {
    return keyLen;
}
function setKeyLen(len) {
    try {
        isValidInteger(len, MIN_KEY_LEN, MAX_KEY_LEN, true, true);
    }
    catch (err) {
        throw new InvalidKeyLengthError(MIN_KEY_LEN, MAX_KEY_LEN, err);
    }
    keyLen = len;
    return true;
}
function getDigest() {
    return digest;
}
function setDigest(func) {
    try {
        isIn(digests, func, undefined, true);
    }
    catch (err) {
        throw new InvalidDigestFunctionError(err);
    }
    digest = func;
    return true;
}
function getDigests() {
    return digests;
}
function hash(str, secret) {
    try {
        return createHmac(digest, secret).update(str).digest("base64url");
    }
    catch (err) {
        throw new HmacCreationError(err);
    }
}
function randomSalt() {
    return randomBytes(16).toString("hex");
}
function pbkdf2(str, secret, salt) {
    try {
        return pbkdf2Sync(hash(str, secret), salt, saltRnds, keyLen, digest);
    }
    catch (err) {
        throw new Pbkdf2DerivationError(err);
    }
}
function encrypt(str, b64Secret) {
    try {
        isString(str, "!0", null, true);
    }
    catch (err) {
        throw new InvalidStringToEncryptError(err);
    }
    let secret;
    try {
        secret = b64Decode(b64Secret, true);
    }
    catch (err) {
        throw new InvalidSecretToEncryptError(err);
    }
    const salt = randomSalt();
    return salt + pbkdf2(str, secret, salt).toString("hex");
}

function compare(str, hash, b64Secret, urlSafe = false) {
    try {
        isString(str, "!0", null, true);
    }
    catch (err) {
        throw new InvalidStringToCompareError(err);
    }
    try {
        isString(hash, "!0", null, true);
    }
    catch (err) {
        throw new InvalidHashToCompareError(err);
    }
    const secret = b64Decode(b64Secret, urlSafe);
    const salt = hash.slice(0, 32);
    const hashedStr = pbkdf2(str, secret, salt);
    const storedHash = Buffer.from(hash.slice(32), "hex");
    return tse(storedHash, hashedStr);
}

function create(len = DEFAULT_SECRET_LEN, urlSafe = true) {
    const kl = isValidInteger(len, MIN_SECRET_LEN, MAX_SECRET_LEN) ? len : DEFAULT_SECRET_LEN;
    return b64Encode(randomBytes(kl).toString("utf8"), urlSafe);
}

export { HashitakaError, b64Decode, b64Encode, compare, encrypt, getDigest, getDigests, getKeyLen, getSaltRounds, hash, pbkdf2, create as rndB64Secret, setDigest, setKeyLen, setSaltRounds, tse };
