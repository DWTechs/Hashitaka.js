import { setDigest, getDigest } from "../dist/hashitaka.js";

describe("setDigest", () => {
	test("sets the digest correctly", () => {
		const digest = "sha512";
		setDigest(digest);
		expect(getDigest()).toBe(digest);
	});

	test("throws Error when setting an invalid digest", () => {
		expect(() => setDigest("invalidDigest")).toThrow(Error);
	});

	test("throws Error when setting a null or undefined digest", () => {
		expect(() => setDigest(null)).toThrow(Error);
		expect(() => setDigest(undefined)).toThrow(Error);
	});

	test("throws Error when setting a non-string digest", () => {
		expect(() => setDigest(123)).toThrow(Error);
	});

	test("throws Error when setting an object as digest", () => {
		expect(() => setDigest({})).toThrow(Error);
	});

	test("throws Error when setting an empty string", () => {
		expect(() => setDigest("")).toThrow(Error);
	});

	test("does not change the current digest when an invalid digest is provided", () => {
		const originalDigest = getDigest();
		try {
			setDigest("invalidDigest");
		} catch (error) {
			// Expected error
		}
		expect(getDigest()).toBe(originalDigest);
	});

	test("is case-sensitive when setting a digest", () => {
		const lowerCaseDigest = "sha256";
		const upperCaseDigest = "SHA256";
		expect(() => setDigest(upperCaseDigest)).toThrow(Error);
		expect(setDigest(lowerCaseDigest)).toBe(true);
	});
});
