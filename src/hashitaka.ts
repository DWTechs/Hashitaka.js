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
export {  
          HashitakaError
        } from './errors';