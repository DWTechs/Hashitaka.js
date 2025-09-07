import { tse, HashLengthMismatchError } from "../dist/hashitaka.js";

// Helper to create buffers
const buf = (str) => Buffer.from(str, "utf8");
const hexBuf = (hex) => Buffer.from(hex, "hex");
const b64Buf = (b64) => Buffer.from(b64, "base64");

describe("tse (timingSafeEqual)", () => {
  
  describe("Identical buffers", () => {
    it("returns true for identical string buffers", () => {
      expect(tse(buf("abc123"), buf("abc123"))).toBe(true);
    });

    it("returns true for identical hex buffers", () => {
      expect(tse(hexBuf("deadbeef"), hexBuf("deadbeef"))).toBe(true);
    });

    it("returns true for identical base64 buffers", () => {
      expect(tse(b64Buf("SGVsbG8gV29ybGQ="), b64Buf("SGVsbG8gV29ybGQ="))).toBe(true);
    });

    it("returns true for identical binary buffers", () => {
      const buf1 = Buffer.from([0, 1, 2, 3, 255, 128, 64]);
      const buf2 = Buffer.from([0, 1, 2, 3, 255, 128, 64]);
      expect(tse(buf1, buf2)).toBe(true);
    });

    it("returns true for empty buffers", () => {
      expect(tse(buf(""), buf(""))).toBe(true);
      expect(tse(Buffer.alloc(0), Buffer.alloc(0))).toBe(true);
    });

    it("returns true for single byte identical buffers", () => {
      expect(tse(Buffer.from([0]), Buffer.from([0]))).toBe(true);
      expect(tse(Buffer.from([255]), Buffer.from([255]))).toBe(true);
    });
  });

  describe("Different buffers of same length", () => {
    it("returns false for different string buffers", () => {
      expect(tse(buf("abc123"), buf("abc124"))).toBe(false);
    });

    it("returns false for different hex buffers", () => {
      expect(tse(hexBuf("deadbeef"), hexBuf("deadbeff"))).toBe(false);
    });

    it("returns false for different binary buffers", () => {
      expect(tse(Buffer.from([0, 1, 2]), Buffer.from([0, 1, 3]))).toBe(false);
    });

    it("returns false when only first byte differs", () => {
      expect(tse(Buffer.from([0, 1, 2, 3]), Buffer.from([1, 1, 2, 3]))).toBe(false);
    });

    it("returns false when only last byte differs", () => {
      expect(tse(Buffer.from([0, 1, 2, 3]), Buffer.from([0, 1, 2, 4]))).toBe(false);
    });

    it("returns false when middle byte differs", () => {
      expect(tse(Buffer.from([0, 1, 2, 3]), Buffer.from([0, 2, 2, 3]))).toBe(false);
    });

    it("returns false for completely different buffers of same length", () => {
      expect(tse(buf("aaaaa"), buf("bbbbb"))).toBe(false);
    });
  });

  describe("Different length buffers", () => {
    it("throws HashLengthMismatchError for shorter first buffer", () => {
      expect(() => tse(buf("abc"), buf("abcdef"))).toThrow(HashLengthMismatchError);
    });

    it("throws HashLengthMismatchError for shorter second buffer", () => {
      expect(() => tse(buf("abcdef"), buf("abc"))).toThrow(HashLengthMismatchError);
    });

    it("throws HashLengthMismatchError for empty vs non-empty", () => {
      expect(() => tse(buf(""), buf("a"))).toThrow(HashLengthMismatchError);
      expect(() => tse(buf("a"), buf(""))).toThrow(HashLengthMismatchError);
    });

    it("throws HashLengthMismatchError with specific error message", () => {
      expect(() => tse(buf("short"), buf("longer"))).toThrow(
        expect.objectContaining({
          message: expect.stringContaining("length")
        })
      );
    });
  });

  describe("Cryptographic use cases", () => {
    it("handles JWT-like signature comparison", () => {
      // Simulate base64url encoded JWT signatures
      const validSig = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      const invalidSig = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCY5";
      
      expect(tse(buf(validSig), buf(validSig))).toBe(true);
      expect(tse(buf(validSig), buf(invalidSig))).toBe(false);
    });

    it("handles password hash comparison", () => {
      // Simulate hex-encoded password hashes
      const hash1 = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";
      const hash2 = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae4";
      
      expect(tse(hexBuf(hash1), hexBuf(hash1))).toBe(true);
      expect(tse(hexBuf(hash1), hexBuf(hash2))).toBe(false);
    });

    it("handles MAC/HMAC comparison", () => {
      // Simulate HMAC results
      const mac1 = Buffer.from("4f3c8b8e7d6a5f2e1b9c8d7a6e5f4c3b2a1d0e9f", "hex");
      const mac2 = Buffer.from("4f3c8b8e7d6a5f2e1b9c8d7a6e5f4c3b2a1d0e9e", "hex");
      
      expect(tse(mac1, mac1)).toBe(true);
      expect(tse(mac1, mac2)).toBe(false);
    });
  });

  describe("Edge cases and buffer types", () => {
    it("handles large buffers", () => {
      const size = 1024;
      const buf1 = Buffer.alloc(size, 0);
      const buf2 = Buffer.alloc(size, 0);
      const buf3 = Buffer.alloc(size, 1);
      
      expect(tse(buf1, buf2)).toBe(true);
      expect(tse(buf1, buf3)).toBe(false);
    });

    it("handles buffers with null bytes", () => {
      const buf1 = Buffer.from([0, 0, 0, 0]);
      const buf2 = Buffer.from([0, 0, 0, 0]);
      const buf3 = Buffer.from([0, 0, 0, 1]);
      
      expect(tse(buf1, buf2)).toBe(true);
      expect(tse(buf1, buf3)).toBe(false);
    });

    it("handles buffers with high-value bytes", () => {
      const buf1 = Buffer.from([255, 254, 253, 252]);
      const buf2 = Buffer.from([255, 254, 253, 252]);
      const buf3 = Buffer.from([255, 254, 253, 251]);
      
      expect(tse(buf1, buf2)).toBe(true);
      expect(tse(buf1, buf3)).toBe(false);
    });

    it("handles Unicode string buffers", () => {
      const unicode1 = "Hello 🌍 World";
      const unicode2 = "Hello 🌍 World";
      const unicode3 = "Hello 🌎 World";
      
      expect(tse(buf(unicode1), buf(unicode2))).toBe(true);
      expect(tse(buf(unicode1), buf(unicode3))).toBe(false);
    });
  });

  describe("Security properties", () => {
    it("should return boolean for all valid comparisons", () => {
      const testCases = [
        [buf("same"), buf("same")],
        [buf("diff1"), buf("diff2")],
        [Buffer.from([1, 2, 3]), Buffer.from([1, 2, 3])],
        [Buffer.from([1, 2, 3]), Buffer.from([1, 2, 4])],
      ];

      testCases.forEach(([a, b]) => {
        const result = tse(a, b);
        expect(typeof result).toBe("boolean");
      });
    });

    it("should be deterministic for same inputs", () => {
      const buf1 = buf("test123");
      const buf2 = buf("test123");
      const buf3 = buf("test124");
      
      // Multiple calls should return the same result
      expect(tse(buf1, buf2)).toBe(true);
      expect(tse(buf1, buf2)).toBe(true);
      expect(tse(buf1, buf2)).toBe(true);
      
      expect(tse(buf1, buf3)).toBe(false);
      expect(tse(buf1, buf3)).toBe(false);
      expect(tse(buf1, buf3)).toBe(false);
    });
  });

  describe("Performance characteristics", () => {
    it("should handle timing-sensitive comparisons", () => {
      // This test verifies the function works with timing-sensitive data
      // (though we can't easily test the actual timing-safe property in a unit test)
      const secret = "super-secret-key-that-should-not-be-guessable";
      const correct = buf(secret);
      const almostCorrect = buf("super-secret-key-that-should-not-be-guessabl" + "f");
      
      expect(tse(correct, correct)).toBe(true);
      expect(tse(correct, almostCorrect)).toBe(false);
    });
  });
});
