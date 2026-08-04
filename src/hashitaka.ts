export {  getSaltRounds,
          setSaltRounds,
          getKeyLen,
          setKeyLen,
          getDigest,
          setDigest,
          getDigests,
          hash,
          pbkdf2,
          encrypt,
          tse } from './hash';
export {  compare } from './compare';
export {  create as rndB64Secret } from './secret';
export {  b64Encode, 
          b64Decode } from './base64';
export {  HashitakaError,
          HashLengthMismatchError,
          InvalidBase64ToDecodeError,
          InvalidStringToEncodeError,
          InvalidStringToCompareError,
          InvalidHashToCompareError,
          InvalidSaltRoundsError,
          InvalidKeyLengthError,
          InvalidSecretLengthError,
          InvalidDigestFunctionError,
          HmacCreationError,
          Pbkdf2DerivationError,
          InvalidStringToEncryptError,
          InvalidSecretToEncryptError } from './errors';