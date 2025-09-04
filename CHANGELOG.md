# 0.3.1 (Sep 2nd 2025)

- Added `urlSafe` parameter to the `compare` function to chose from URL-safe base64 secrets or standard base64 secrets
- Updated @dwtechs/checkard to version 3.5.0

# 0.3.0 (Aug 23th 2025)

- Updated all validation functions to use Checkard's new error-throwing behavior with `throwErr: true`
- All functions now throw errors from Checkard library instead of returning false for invalid inputs

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
