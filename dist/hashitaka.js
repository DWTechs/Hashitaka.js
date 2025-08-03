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

import { getHashes, timingSafeEqual, randomBytes, pbkdf2Sync, createHmac } from 'node:crypto';
import { isString, isValidInteger, isIn, isBase64 } from '@dwtechs/checkard';

const HASHITAKA_PREFIX = "Hashitaka: ";
class HashitakaError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
    }
}
class HashLengthMismatchError extends HashitakaError {
    constructor(message = `${HASHITAKA_PREFIX}Hashes must have the same byte length`) {
        super(message);
        this.code = "HASH_LENGTH_MISMATCH";
        this.statusCode = 400;
    }
}
class InvalidStringError extends HashitakaError {
    constructor(message = `${HASHITAKA_PREFIX}str must be a non-empty string`) {
        super(message);
        this.code = "INVALID_STRING";
        this.statusCode = 400;
    }
}
class InvalidBase64SecretError extends HashitakaError {
    constructor(message = `${HASHITAKA_PREFIX}b64Secret must be a base64 encoded string`) {
        super(message);
        this.code = "INVALID_BASE64_SECRET";
        this.statusCode = 400;
    }
}

function b64Decode(str, urlSafe = true) {
    if (!isString(str, "!0"))
        throw new InvalidStringError();
    if (urlSafe)
        str = str.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(str + pad(str), "base64").toString("utf8");
}
function b64Encode(str, urlSafe = true) {
    if (!isString(str, "!0"))
        throw new InvalidStringError();
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

const digests = getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;
function tse(a, b) {
    if (a.length !== b.length)
        throw new HashLengthMismatchError();
    return timingSafeEqual(a, b);
}
function getSaltRounds() {
    return saltRnds;
}
function setSaltRounds(rnds) {
    if (!isValidInteger(rnds, 12, 100, true))
        return false;
    saltRnds = rnds;
    return true;
}
function getKeyLen() {
    return keyLen;
}
function setKeyLen(len) {
    if (!isValidInteger(len, 2, 256, true))
        return false;
    keyLen = len;
    return true;
}
function getDigest() {
    return digest;
}
function setDigest(func) {
    if (!isIn(digests, func))
        return false;
    digest = func;
    return true;
}
function getDigests() {
    return digests;
}
function hash(str, secret) {
    return createHmac(digest, secret).update(str).digest("base64url");
}
function randomSalt() {
    return randomBytes(16).toString("hex");
}
function pbkdf2(str, secret, salt) {
    return pbkdf2Sync(hash(str, secret), salt, saltRnds, keyLen, digest);
}
function encrypt(str, b64Secret) {
    if (!isString(str, "!0"))
        throw new InvalidStringError();
    if (!isBase64(b64Secret, true))
        throw new InvalidBase64SecretError();
    const secret = b64Decode(b64Secret, true);
    const salt = randomSalt();
    return salt + pbkdf2(str, secret, salt).toString("hex");
}
function compare(str, hash, b64Secret) {
    if (!isString(str, "!0") || !isString(hash, "!0") || !isBase64(b64Secret, true))
        return false;
    const secret = b64Decode(b64Secret, true);
    const salt = hash.slice(0, 32);
    const hashedStr = pbkdf2(str, secret, salt);
    const storedHash = Buffer.from(hash.slice(32), "hex");
    return tse(storedHash, hashedStr);
}

const DEFAULT_KEY_LENGTH = 32;
function create(length) {
    const kl = isValidInteger(length, 1, 262144, false) ? length : DEFAULT_KEY_LENGTH;
    return b64Encode(randomBytes(kl).toString("utf8"), true);
}

export { HashitakaError, InvalidBase64SecretError, InvalidStringError, b64Decode, b64Encode, compare, encrypt, getDigest, getDigests, getKeyLen, getSaltRounds, create as rndB64Secret, setDigest, setKeyLen, setSaltRounds };
