import { hash } from "../dist/hashitaka.js";
import crypto from "node:crypto";

describe("hash", () => {
  const secret = "mySecretKey";

  it("returns a base64url string for a given input and secret", () => {
    const result = hash("hello", secret);
    expect(typeof result).toBe("string");
    // base64url: only [A-Za-z0-9_-]
    expect(result).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("produces different hashes for different inputs", () => {
    const h1 = hash("foo", secret);
    const h2 = hash("bar", secret);
    expect(h1).not.toBe(h2);
  });

  it("produces different hashes for different secrets", () => {
    const h1 = hash("foo", "secret1");
    const h2 = hash("foo", "secret2");
    expect(h1).not.toBe(h2);
  });

  it("produces the same hash for same input and secret", () => {
    const h1 = hash("baz", secret);
    const h2 = hash("baz", secret);
    expect(h1).toBe(h2);
  });

  it("matches Node.js createHmac output (base64url)", () => {
    const input = "test";
    const expected = crypto.createHmac("sha256", secret).update(input).digest("base64url");
    expect(hash(input, secret)).toBe(expected);
  });
});
