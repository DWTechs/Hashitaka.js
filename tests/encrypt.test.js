import { encrypt, rndB64Secret, InvalidStringToEncryptError, InvalidSecretToEncryptError } from "../dist/hashitaka.js";

describe("encrypt", () => {
	const password = "mySecret!/;6(A)Pwd";
	const InvalidSecret = {};
	const validSecret = rndB64Secret();
  console.log("validSecret", validSecret);

	test("returns a string when password and secret are encrypted", async () => {
		expect(typeof await encrypt(password, validSecret)).toBe("string");
	});

		test("throws error when password is empty", async () => {
			await expect(encrypt("", validSecret)).rejects.toThrow();
		});

		test("throws error when secret is empty", async () => {
			await expect(encrypt(password, "")).rejects.toThrow();
		});

		test("throws error when secret is invalid", async () => {
			await expect(encrypt(password, InvalidSecret)).rejects.toThrow();
		});

		test("throws error when password is not a string", async () => {
			await expect(encrypt(123, validSecret)).rejects.toThrow();
		});

		test("throws error when secret is not a string", async () => {
			await expect(encrypt(password, 123)).rejects.toThrow();
		});

		test("generates different hashes for the same password and secret", async () => {
			const hash1 = await encrypt(password, validSecret);
			const hash2 = await encrypt(password, validSecret);
			expect(hash1).not.toBe(hash2);
		});

		test("throws error for non-string inputs", async () => {
			await expect(encrypt(null, validSecret)).rejects.toThrow();
			await expect(encrypt(password, null)).rejects.toThrow();
			await expect(encrypt({}, validSecret)).rejects.toThrow();
			await expect(encrypt(password, [])).rejects.toThrow();
		});

		test("throws InvalidStringToEncryptError for invalid password", async () => {
			await expect(encrypt("", validSecret)).rejects.toThrow(InvalidStringToEncryptError);
			await expect(encrypt(null, validSecret)).rejects.toThrow(InvalidStringToEncryptError);
		});

		test("throws InvalidSecretToEncryptError for invalid secret", async () => {
			await expect(encrypt(password, "not-valid-base64!!!")).rejects.toThrow(InvalidSecretToEncryptError);
			await expect(encrypt(password, "")).rejects.toThrow(InvalidSecretToEncryptError);
		});

		test("output starts with 32-char hex salt followed by hex hash", async () => {
			const result = await encrypt(password, validSecret);
			expect(result.length).toBeGreaterThan(32);
			expect(result.slice(0, 32)).toMatch(/^[0-9a-f]{32}$/);
			expect(result.slice(32)).toMatch(/^[0-9a-f]+$/);
		});

		test("handles unicode password", async () => {
			const result = await encrypt("pässwörd🔑", validSecret);
			expect(typeof result).toBe("string");
		});
});
