import { b64Encode, b64Decode } from "../../dist/hashitaka";

const t1 = b64Encode("Hello World!", false);
const t1e = b64Encode("Hello World!", true);
const t2 = b64Encode("Hello People?", false);
const t2e = b64Encode("Hello People?", true);
const t3 = b64Encode("dfhsdjkR(667ER", false);
const t3e = b64Encode("dfhsdjkR(667ER", true);
const t4 = b64Encode("string", false);
const t4e = b64Encode("string", true);
const t5 = b64Encode("1", false);
const t5e = b64Encode("1", true);
const t6 = b64Encode("89", false);
const t6e = b64Encode("89", true);
const t7 = b64Encode("89rt", false);
const t7e = b64Encode("89rt", true);
const t8 = b64Encode("1.5", false);
const t8e = b64Encode("1.5", true);
const t9 = b64Encode("8.9rt", false);
const t9e = b64Encode("8.9rt", true);


test("sends t1 to b64Decode", () => {
  expect(b64Decode(t1, false)).toBe("Hello World!");
});

test("sends t1e to b64Decode", () => {
  expect(b64Decode(t1e, true)).toBe("Hello World!");
});

test("sends t2 to b64Decode", () => {
  expect(b64Decode(t2, false)).toBe("Hello People?");
});

test("sends t2e to b64Decode", () => {
  expect(b64Decode(t2e, true)).toBe("Hello People?");
});

test("sends t3 to b64Decode", () => {
  expect(b64Decode(t3, false)).toBe("dfhsdjkR(667ER");
});

test("sends t3e to b64Decode", () => {
  expect(b64Decode(t3e, true)).toBe("dfhsdjkR(667ER");
});

test("sends string to b64Decode urlsafe", () => {
  expect(b64Decode(t4e, true)).toBe("string");
});

test("sends string to b64Decode", () => {
  expect(b64Decode(t4, false)).toBe("string");
});

test("sends figure as string to b64Decode", () => {
  expect(b64Decode(t5, false)).toBe("1");
});

test("sends figure as string to b64Decode url safe", () => {
  expect(b64Decode(t5e, true)).toBe("1");
});

test("sends encoded number not url safe as string to b64Decode url safe", () => {
  expect(() => b64Decode(t6, true)).toThrow();
});

test("sends number url-safe as string to b64Decode not url-safe", () => {
  expect(() => b64Decode(t6e, false)).toThrow();
});

test("sends encoded string not url safe as string to b64Decode url safe", () => {
  expect(() => b64Decode(t7, true)).toThrow();
});

test("sends string url-safe in string to b64Decode not url-safe", () => {
  expect(() => b64Decode(t7e, false)).toThrow();
});

test("sends float as string to b64Decode url safe", () => {
  expect(b64Decode(t8, true)).toBe("1.5");
});

test("sends float as string to b64Decode", () => {
  expect(b64Decode(t8e, false)).toBe("1.5");
});

test("sends float string not url safe in string to b64Decode urlsafe", () => {
  expect(() => b64Decode(t9, true)).toThrow();
});

test("sends float string url-safe in string to b64Decode not url-safe", () => {
  expect(() => b64Decode(t9e, false)).toThrow();
});
