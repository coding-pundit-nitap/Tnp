import { describe, expect, it } from "vitest";
import { NextResponse } from "next/server";
import { withSecurityHeaders } from "../middleware";

describe("proxy security headers", () => {
  it("adds expected security headers", () => {
    const response = withSecurityHeaders(NextResponse.next());

    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(response.headers.get("Permissions-Policy")).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
  });
});
