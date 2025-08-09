import { pbkdf2, hash } from "../dist/hashitaka.js";
import crypto from "node:crypto";

describe("pbkdf2", () => {
  const secret = "mySecretKey";
  const salt = "1234567890abcdef";
  const password = "password123";

  it("returns a Buffer", () => {
    const result = pbkdf2(password, secret, salt);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("produces the same output for same input, secret, and salt", () => {
    const k1 = pbkdf2(password, secret, salt);
    const k2 = pbkdf2(password, secret, salt);
    expect(k1.equals(k2)).toBe(true);
  });

  it("produces different outputs for different salts", () => {
    const k1 = pbkdf2(password, secret, salt);
    const k2 = pbkdf2(password, secret, "abcdef1234567890");
    expect(k1.equals(k2)).toBe(false);
  });

  it("produces different outputs for different passwords", () => {
    const k1 = pbkdf2(password, secret, salt);
    const k2 = pbkdf2("otherpassword", secret, salt);
    expect(k1.equals(k2)).toBe(false);
  });

  it("matches Node.js pbkdf2Sync with same parameters", () => {
    // The input to pbkdf2 is hash(password, secret)
    const input = hash(password, secret);
    const expected = crypto.pbkdf2Sync(input, salt, 12, 64, "sha256");
    expect(pbkdf2(password, secret, salt).equals(expected)).toBe(true);
  });
});
