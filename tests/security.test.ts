import { describe, expect, it } from "vitest";
import {
  clearLoginAttempts,
  isRateLimited,
  recordLoginAttempt,
  sanitizeInput,
} from "../lib/security";

describe("security helpers", () => {
  it("sanitizes angled brackets from input", () => {
    const value = sanitizeInput("  <script>alert(1)</script>user@x.com  ");
    expect(value).toBe("scriptalert(1)/scriptuser@x.com");
  });

  it("rate limits after 5 failed attempts and clears correctly", () => {
    const key = "test-user";

    clearLoginAttempts(key);
    expect(isRateLimited(key)).toBe(false);

    for (let i = 0; i < 5; i += 1) {
      recordLoginAttempt(key);
    }

    expect(isRateLimited(key)).toBe(true);

    clearLoginAttempts(key);
    expect(isRateLimited(key)).toBe(false);
  });
});
