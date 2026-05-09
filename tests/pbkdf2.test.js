import { pbkdf2, hash } from "../dist/hashitaka.js";
import crypto from "node:crypto";

describe("pbkdf2", () => {
  const secret = "mySecretKey";
  const salt = "1234567890abcdef";
  const password = "password123";

  it("returns a Buffer", async () => {
    const result = await pbkdf2(password, secret, salt);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("produces the same output for same input, secret, and salt", async () => {
    const k1 = await pbkdf2(password, secret, salt);
    const k2 = await pbkdf2(password, secret, salt);
    expect(k1.equals(k2)).toBe(true);
  });

  it("produces different outputs for different salts", async () => {
    const k1 = await pbkdf2(password, secret, salt);
    const k2 = await pbkdf2(password, secret, "abcdef1234567890");
    expect(k1.equals(k2)).toBe(false);
  });

  it("produces different outputs for different passwords", async () => {
    const k1 = await pbkdf2(password, secret, salt);
    const k2 = await pbkdf2("otherpassword", secret, salt);
    expect(k1.equals(k2)).toBe(false);
  });

  it("matches Node.js pbkdf2Sync with same parameters", async () => {
    // The input to pbkdf2 is hash(password, secret)
    const input = hash(password, secret);
    const expected = crypto.pbkdf2Sync(input, salt, 12, 64, "sha256");
    expect((await pbkdf2(password, secret, salt)).equals(expected)).toBe(true);
  });

  it("produces different outputs for different secrets", async () => {
    const k1 = await pbkdf2(password, "secretA", salt);
    const k2 = await pbkdf2(password, "secretB", salt);
    expect(k1.equals(k2)).toBe(false);
  });

  it("returns a buffer of the configured key length (64 bytes by default)", async () => {
    const result = await pbkdf2(password, secret, salt);
    expect(result.length).toBe(64);
  });

  it("throws for null password", async () => {
    await expect(pbkdf2(null, secret, salt)).rejects.toThrow();
  });

  it("throws for null secret", async () => {
    await expect(pbkdf2(password, null, salt)).rejects.toThrow();
  });
});
