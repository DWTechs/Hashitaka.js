# 0.4.0 (May 9th 2026)

- Now distributed as a native ES2022 ECMAScript module (ESM)
- **Breaking**: `pbkdf2()`, `encrypt()` and `compare()` are now async and return Promises — callers must `await` them
- **Security**: `rndB64Secret()` now encodes random bytes directly to base64 instead of going through a UTF-8 round-trip, preserving full entropy
- **Security**: `MIN_KEY_LEN` raised from `2` to `32` bytes (OWASP minimum for PBKDF2 output)

# 0.3.1 (Sep 5th 2025)

- Add `urlSafe` parameter to the `compare` and `rndB64Secret` functions to chose from URL-safe base64 secrets or standard base64 secrets
- Delete logs dependency
- Replaced logs by proper custom errors
- Updated @dwtechs/checkard to version 3.5.1
- `setDigest()`, `setKeyLen()`, `setSaltRounds()`, `hash()`, `pbkdf2()`, `tse()`, `encrypt()`, `b64Encode()`, `b64Decode()` and `compare()` functions throws custom errors on top of @dwtechs/Checkard errors

# 0.3.0 (Aug 23th 2025)

- Updated all validation functions to use Checkard's new error-throwing behavior with `throwErr: true`
- All functions now throw errors from @dwtechs/Checkard library instead of returning false for invalid inputs

# 0.2.3 (Aug 18th 2025)

- Base64 secrets sent to encrypt() and compare() functions does not need to be url-safe anymore

# 0.2.2 (Aug 17th 2025)

- Add debug logs for all exported functions

# 0.2.1 (Aug 10th 2025)

- fix Typescript declaration file for **encrypt()**, **hash()**, **pbkdf2()** and **tse()** functions

# 0.2.0 (Aug 9th 2025)

- Exports **hash()**, **pbkdf2()** and **tse()** functions

# 0.1.0 (Aug 8th 2025)

- Initial release
