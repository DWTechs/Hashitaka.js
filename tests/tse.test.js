import { tse, HashLengthMismatchError } from "../dist/hashitaka.js";

// Helper to create buffers
const buf = (str) => Buffer.from(str, "utf8");

describe("tse (timingSafeEqual)", () => {
  it("returns true for identical buffers", () => {
    expect(tse(buf("abc123"), buf("abc123"))).toBe(true);
  });

  it("returns false for different buffers of same length", () => {
    expect(tse(buf("abc123"), buf("abc124"))).toBe(false);
  });

  it("throws HashLengthMismatchError for buffers of different lengths", () => {
    expect(() => tse(buf("abc"), buf("abcdef"))).toThrow(HashLengthMismatchError);
    expect(() => tse(buf("abcdef"), buf("abc"))).toThrow(HashLengthMismatchError);
  });

  it("returns true for empty buffers", () => {
    expect(tse(buf("") , buf("") )).toBe(true);
  });

  it("returns false for same length but different content (binary)", () => {
    expect(tse(Buffer.from([0,1,2]), Buffer.from([0,1,3]))).toBe(false);
  });
});
