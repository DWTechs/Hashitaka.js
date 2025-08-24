import { setSaltRounds, getSaltRounds } from "../dist/hashitaka.js";

describe("setSaltRounds", () => {
	test("sets the salt rounds correctly", () => {
		const saltRounds = 14;
		setSaltRounds(saltRounds);
		expect(getSaltRounds()).toBe(saltRounds);
	});

	test("sets the salt rounds at the upper limit", () => {
		const saltRounds = 100;
		setSaltRounds(saltRounds);
		expect(getSaltRounds()).toBe(saltRounds);
	});

	test("sets the salt rounds at the lower limit", () => {
		const saltRounds = 12;
		setSaltRounds(saltRounds);
		expect(getSaltRounds()).toBe(saltRounds);
	});

		test("throws error when setting an invalid number salt rounds", () => {
			expect(() => setSaltRounds(0)).toThrow();
			expect(() => setSaltRounds(-1)).toThrow();
			expect(() => setSaltRounds(1)).toThrow();
			expect(() => setSaltRounds(101)).toThrow();
			expect(() => setSaltRounds(3, 5)).toThrow();
		});

		test("throws error when setting a null or undefined salt rounds", () => {
			expect(() => setSaltRounds(null)).toThrow();
			expect(() => setSaltRounds(undefined)).toThrow();
		});

		test("throws error when setting a non-number salt rounds", () => {
			expect(() => setSaltRounds("32")).toThrow();
		});

		test("throws error when setting with an array", () => {
			expect(() => setSaltRounds([12])).toThrow();
		});

		test("throws error for a value just below the minimum limit", () => {
			expect(() => setSaltRounds(11)).toThrow();
		});

		test("throws error for a value just above the maximum limit", () => {
			expect(() => setSaltRounds(101)).toThrow();
		});

		test("does not change saltRnds to an invalid value after setting a valid value", () => {
			setSaltRounds(14); // Set a valid value first
			try { setSaltRounds(101); } catch (e) {} // Then try to set an invalid value
			expect(getSaltRounds()).toBe(14); // Expect the saltRnds to remain at the last valid value
		});

		test("throws error when setting with a floating-point number", () => {
			expect(() => setSaltRounds(13.5)).toThrow();
		});

	test("persists the salt rounds value after multiple valid set operations", () => {
		setSaltRounds(15);
		setSaltRounds(20);
		expect(getSaltRounds()).toBe(20);
	});
});
