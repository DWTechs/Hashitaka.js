import { compare, encrypt } from "../dist/hashitaka.js";

describe("compare", () => {
	const password = "mySecret!/;6(A)Pwd";
	const wrongPassword = "wr0ngPa55word!";
	const secret = "8zYSoxUV36qy8tiIGytsA7qPdFecywiQs0sHBze_Skg";
	const hashedPassword = encrypt(password, secret);
  const hashedPassword2 = encrypt(password, secret);
	const otherHashedPassword = encrypt(password, secret);
  const otherHashedPassword2 = encrypt(password, secret);
	const anotherHashedPassword = encrypt(password, secret);
  const anotherHashedPassword2 = encrypt(password, secret);
  console.log("hashedPassword", hashedPassword);
  console.log("hashedPassword2", hashedPassword2);
  console.log("otherHashedPassword", otherHashedPassword);
  console.log("otherHashedPassword2", otherHashedPassword2);
  console.log("anotherHashedPassword", anotherHashedPassword);
  console.log("anotherHashedPassword2", anotherHashedPassword2);

	test("returns true when comparing with the right password with url-safe secret and url-safe comparison", () => {
		expect(compare(password, hashedPassword, secret, true)).toBe(true);
	});

  test("Throws error when comparing with the right password with url-safe secret and non url-safe comparison", () => {
		expect(() => compare(password, hashedPassword, secret, false)).toThrow();
	});

	test("returns true when comparing another hash with the right password with url-safe secret and url-safe comparison", () => {
		expect(compare(password, otherHashedPassword, secret, true)).toBe(true);
	});

  test("Throws error when comparing another hash with the right password with url-safe secret and non url-safe comparison", () => {
		expect(() => compare(password, hashedPassword, secret, false)).toThrow();
	});

	test("returns true when comparing yet another hash with the right password with url-safe secret and url-safe comparison", () => {
		expect(compare(password, anotherHashedPassword, secret, true)).toBe(true);
	});

  test("throws error when comparing yet another hash with the right password with url-safe secret and non url-safe comparison", () => {
		expect(() => compare(password, anotherHashedPassword, secret, false)).toThrow();
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

	test("Returns false when comparing with wrong password with url-safe secret and non url-safe comparison", () => {
		expect(() => compare(wrongPassword, hashedPassword, secret)).toThrow();
	});

  	test("Returns false when comparing with wrong password with url-safe secret and url-safe comparison", () => {
		expect(compare(wrongPassword, hashedPassword, secret, true)).toBe(false);
	});

	test("throws error when comparing with an empty password", () => {
		expect(() => compare("", hashedPassword, secret)).toThrow();
	});

	test("throws error when secret is empty", () => {
		expect(() => compare(password, hashedPassword, "")).toThrow();
	});

	test("throws error when hashed password is empty", () => {
		expect(() => compare(password, "", secret)).toThrow();
	});
});
