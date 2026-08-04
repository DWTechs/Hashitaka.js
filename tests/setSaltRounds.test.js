import { setSaltRounds, getSaltRounds } from "../dist/hashitaka.js";

describe("setSaltRounds", () => {
	test("sets the salt rounds correctly", () => {
		const saltRounds = 700000;
		setSaltRounds(saltRounds);
		expect(getSaltRounds()).toBe(saltRounds);
	});

	test("sets the salt rounds at the upper limit", () => {
		const saltRounds = 2000000;
		setSaltRounds(saltRounds);
		expect(getSaltRounds()).toBe(saltRounds);
	});

	test("sets the salt rounds at the lower limit", () => {
		const saltRounds = 600000;
		setSaltRounds(saltRounds);
		expect(getSaltRounds()).toBe(saltRounds);
	});

		test("throws error when setting an invalid number salt rounds", () => {
			expect(() => setSaltRounds(0)).toThrow();
			expect(() => setSaltRounds(-1)).toThrow();
			expect(() => setSaltRounds(1)).toThrow();
			expect(() => setSaltRounds(2000001)).toThrow();
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
			expect(() => setSaltRounds([600000])).toThrow();
		});

		test("throws error for a value just below the minimum limit", () => {
			expect(() => setSaltRounds(599999)).toThrow();
		});

		test("throws error for a value just above the maximum limit", () => {
			expect(() => setSaltRounds(2000001)).toThrow();
		});

		test("does not change saltRnds to an invalid value after setting a valid value", () => {
			setSaltRounds(700000); // Set a valid value first
			try { setSaltRounds(2000001); } catch (e) {} // Then try to set an invalid value
			expect(getSaltRounds()).toBe(700000); // Expect the saltRnds to remain at the last valid value
		});

		test("throws error when setting with a floating-point number", () => {
			expect(() => setSaltRounds(700000.5)).toThrow();
		});

	test("persists the salt rounds value after multiple valid set operations", () => {
		setSaltRounds(750000);
		setSaltRounds(800000);
		expect(getSaltRounds()).toBe(800000);
	});
});
