import { rndB64Secret } from "../dist/hashitaka.js";

describe("rndB64Secret", () => {
	it("should generate a secret of the default length (32 bytes)", () => {
		const secret = rndB64Secret();
		expect(secret.length).toBeGreaterThan(56);
	});

	it("should generate a secret of the specified length (16 bytes)", () => {
		const secret = rndB64Secret(16);
		expect(secret.length).toBeGreaterThan(29);
	});

	it("should generate a secret of the specified length (64 bytes)", () => {
		const secret = rndB64Secret(64);
		expect(secret.length).toBeGreaterThan(123);
	});

	// it('should not contain "+" characters', () => {
	// 	const secret = rndB64Secret();
	// 	expect(secret).not.toContain("+");
	// });

	// it('should not contain "/" characters', () => {
	// 	const secret = rndB64Secret();
	// 	expect(secret).not.toContain("/");
	// });

	// it('should not contain "=" characters', () => {
	// 	const secret = rndB64Secret();
	// 	expect(secret).not.toContain("=");
	// });

	it("should generate unique secrets 1", () => {
		const secret1 = rndB64Secret();
		const secret2 = rndB64Secret();
		expect(secret1).not.toEqual(secret2);
	});

	it("should generate unique secrets 2", () => {
		const secret1 = rndB64Secret(64);
		const secret2 = rndB64Secret(64);
		expect(secret1).not.toEqual(secret2);
	});

	it("should generate unique secrets 3", () => {
		const secret1 = rndB64Secret(128);
		const secret2 = rndB64Secret(128);
		expect(secret1).not.toEqual(secret2);
	});

	it("should handle a length of 0 without throwing an error", () => {
		const secret = rndB64Secret(0);
		expect(secret.length).toBeGreaterThan(56);
	});

	it("should handle a length of -1 without throwing an error", () => {
		const secret = rndB64Secret(-1);
		expect(secret.length).toBeGreaterThan(56);
	});

	it("should handle very large lengths", () => {
		const largeLength = 262144; // 256 KB
		const secret = rndB64Secret(largeLength);
		expect(secret.length).toBeGreaterThan(262144);
	});

	it("should handle very large lengths 2", () => {
		const largeLength = 262145;
		const secret = rndB64Secret(largeLength);
		expect(secret.length).toBeGreaterThan(56);
	});

	// it("should only contain URL-friendly characters", () => {
	// 	const secret = rndB64Secret();
	// 	expect(secret).toMatch(/^[A-Za-z0-9_-]*$/);
	// });
});
