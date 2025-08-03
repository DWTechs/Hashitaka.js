export {  getSaltRounds,
          setSaltRounds,
          getKeyLen,
          setKeyLen,
          getDigest,
          setDigest,
          getDigests,
          encrypt,
          compare } from './hash';
export {  create as rndB64Secret } from './secret';
export {  b64Encode, 
          b64Decode } from './base64';
export {  
          HashitakaError,
          InvalidStringError,
          InvalidBase64SecretError
        } from './errors';