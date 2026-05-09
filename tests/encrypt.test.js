import { encrypt, rndB64Secret } from "../dist/hashitaka.js";

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
});
