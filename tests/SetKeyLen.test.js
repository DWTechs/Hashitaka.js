import { setKeyLen, getKeyLen } from "../dist/hashitaka.js";

describe("setKeyLen", () => {
	test("sets the key length correctly", () => {
		const keyLen = 24;
		setKeyLen(keyLen);
		expect(getKeyLen()).toBe(keyLen);
	});

	test("sets the key length at the upper limit", () => {
		const keyLen = 256;
		setKeyLen(keyLen);
		expect(getKeyLen()).toBe(keyLen);
	});

	test("sets the key length at the lower limit", () => {
		const keyLen = 2;
		setKeyLen(keyLen);
		expect(getKeyLen()).toBe(keyLen);
	});

		test("throws error when setting an invalid number key length", () => {
			expect(() => setKeyLen(0)).toThrow();
			expect(() => setKeyLen(-1)).toThrow();
			expect(() => setKeyLen(1)).toThrow();
			expect(() => setKeyLen(257)).toThrow();
			expect(() => setKeyLen(3.5)).toThrow();
		});

		test("throws error when setting a null or undefined key length", () => {
			expect(() => setKeyLen(null)).toThrow();
			expect(() => setKeyLen(undefined)).toThrow();
		});

		test("throws error when setting a non-number key length", () => {
			expect(() => setKeyLen("32")).toThrow();
		});

	test("persists the key length after multiple valid set operations", () => {
		setKeyLen(128);
		setKeyLen(192);
		expect(getKeyLen()).toBe(192);
	});

		test("throws error when setting a boolean value", () => {
			expect(() => setKeyLen(true)).toThrow();
			expect(() => setKeyLen(false)).toThrow();
		});

		test("throws error when setting an array or object", () => {
			expect(() => setKeyLen([128])).toThrow();
			expect(() => setKeyLen({ length: 128 })).toThrow();
		});

		test("does not change keyLen to an invalid value after setting a valid value", () => {
			setKeyLen(128); // Set a valid length first
			try { setKeyLen(0); } catch (e) {} // Then try to set an invalid length
			expect(getKeyLen()).toBe(128); // Expect the keyLen to remain at the last valid value
		});

		test("throws error when setting a floating-point number even if in valid range", () => {
			expect(() => setKeyLen(64.5)).toThrow();
		});

	test("allows resetting keyLen to a default or another valid value", () => {
		setKeyLen(128); // Modify first
		setKeyLen(64); // Reset to default or another valid value
		expect(getKeyLen()).toBe(64);
	});
});
