import { compare, encrypt } from "../dist/hashitaka.js";

describe("compare", () => {
	const password = "mySecret!/;6(A)Pwd";
	const wrongPassword = "wr0ngPa55word!";
	const secret = "8zYSoxUV36qy8tiIGytsA7qPdFecywiQs0sHBze_Skg";
	let hashedPassword, hashedPassword2, otherHashedPassword, otherHashedPassword2, anotherHashedPassword, anotherHashedPassword2;

	beforeAll(async () => {
		hashedPassword = await encrypt(password, secret);
		hashedPassword2 = await encrypt(password, secret);
		otherHashedPassword = await encrypt(password, secret);
		otherHashedPassword2 = await encrypt(password, secret);
		anotherHashedPassword = await encrypt(password, secret);
		anotherHashedPassword2 = await encrypt(password, secret);
	});

	test("returns true when comparing with the right password with url-safe secret and url-safe comparison", async () => {
		expect(await compare(password, hashedPassword, secret, true)).toBe(true);
	});

  test("Throws error when comparing with the right password with url-safe secret and non url-safe comparison", async () => {
		await expect(compare(password, hashedPassword, secret, false)).rejects.toThrow();

    let caughtError;
		try {
			await compare(password, hashedPassword, secret, false);
		} catch (err) {
			caughtError = err;
		}
		
		// Verify error was thrown
		expect(caughtError).toBeDefined();
		
		// Display the error stack
		console.log('\n=== Error Stack Information ===');
		console.log('Main Error Stack:');
		console.log(caughtError.stack);
		
		console.log('================================\n');
	});

	test("returns true when comparing another hash with the right password with url-safe secret and url-safe comparison", async () => {
		expect(await compare(password, otherHashedPassword, secret, true)).toBe(true);
	});

  test("Throws error when comparing another hash with the right password with url-safe secret and non url-safe comparison", async () => {
		await expect(compare(password, hashedPassword, secret, false)).rejects.toThrow();
	});

	test("returns true when comparing yet another hash with the right password with url-safe secret and url-safe comparison", async () => {
		expect(await compare(password, anotherHashedPassword, secret, true)).toBe(true);
	});

  test("throws error when comparing yet another hash with the right password with url-safe secret and non url-safe comparison", async () => {
		await expect(compare(password, anotherHashedPassword, secret, false)).rejects.toThrow();
	});

	test("Test if two hashes of the same password are different ", () => {
		expect(hashedPassword).not.toBe(otherHashedPassword);
	});

	test("Test if two other hashes of the same password are different ", () => {
		expect(hashedPassword).not.toBe(anotherHashedPassword);
	});

	test("Test if two yet other hashes of the same password are different ", () => {
		expect(otherHashedPassword).not.toBe(anotherHashedPassword);
	});

	test("Returns false when comparing with wrong password with url-safe secret and non url-safe comparison", async () => {
		await expect(compare(wrongPassword, hashedPassword, secret)).rejects.toThrow();
	});

  	test("Returns false when comparing with wrong password with url-safe secret and url-safe comparison", async () => {
		expect(await compare(wrongPassword, hashedPassword, secret, true)).toBe(false);
	});

	test("throws error when comparing with an empty password", async () => {
		await expect(compare("", hashedPassword, secret)).rejects.toThrow();
	});

	test("throws error when secret is empty", async () => {
		await expect(compare(password, hashedPassword, "")).rejects.toThrow();
	});

	test("throws error when hashed password is empty", async () => {
		await expect(compare(password, "", secret)).rejects.toThrow();
	});
});
