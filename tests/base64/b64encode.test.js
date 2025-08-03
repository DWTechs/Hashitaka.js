import { b64Encode } from "../../dist/hashitaka";

const estring = "c3RyaW5n"; // string
const e1 = "MQ=="; // 1
const e1s = "MQ";
const e2 = "ODk="; // 89
const e2s = "ODk"; // 89
const e3 = "ODlydA=="; // 89rt
const e3s = "ODlydA"; // 89rt
const e4 = "MS41"; // 1.5
const e5 = "OC45cnQ="; // 8.9rt
const e5s = "OC45cnQ"; // 8.9rt


test("sends string to b64Encode", () => {
  expect(b64Encode("string")).toBe(estring);
});

test("sends figure as string to b64Encode", () => {
  expect(b64Encode("1")).toBe(e1s);
});

test("sends number as string to b64Encode", () => {
  expect(b64Encode("89")).toBe(e2s);
});

test("sends number in string to b64Encode", () => {
  expect(b64Encode("89rt")).toBe(e3s);
});

test("sends figure as string to b64Encode without typeCheck", () => {
  expect(b64Encode("1", false)).toBe(e1);
});

test("sends number as string to b64Encode without typeCheck", () => {
  expect(b64Encode("89", false)).toBe(e2);
});

test("sends number in string to b64Encode without typeCheck", () => {
  expect(b64Encode("89rt", false)).toBe(e3);
});

test("sends float as string to b64Encode", () => {
  expect(b64Encode("1.5")).toBe(e4);
});

test("sends number in string to b64Encode", () => {
  expect(b64Encode("8.9rt")).toBe(e5s);
});

test("sends float as string to b64Encode without typeCheck", () => {
  expect(b64Encode("1.5", false)).toBe(e4);
});

test("sends float in string to b64Encode without typeCheck", () => {
  expect(b64Encode("8.9rt", false)).toBe(e5);
});
