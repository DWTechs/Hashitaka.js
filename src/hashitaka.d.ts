
// Error classes
export abstract class HashitakaError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
}

export class HashLengthMismatchError extends HashitakaError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidStringError extends HashitakaError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidBase64SecretError extends HashitakaError {
  readonly code: string;
  readonly statusCode: number;
}

declare function getSaltRounds(): number;
declare function setSaltRounds(rnds: number): boolean;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): boolean;
declare function getDigest(): string;
declare function setDigest(func: string): boolean;
declare function getDigests(): string[];
declare function encrypt(str: string, b64Secret: string): string | false;
declare function compare(str: string, hash: string, b64Secret: string): boolean;
declare function rndB64Secret(len?: number): string;
declare function b64Decode(str: string, urlSafe?: boolean): string;
declare function b64Encode(str: string, urlSafe?: boolean): string;

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
  b64Decode
};
