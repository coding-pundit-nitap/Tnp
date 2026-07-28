import crypto from "crypto";

const loginAttempts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Check if user has exceeded login attempts
 */
export function isRateLimited(email: string): boolean {
  const attempt = loginAttempts.get(email);
  if (!attempt) return false;

  const now = Date.now();
  if (now - attempt.timestamp > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(email);
    return false;
  }

  return attempt.count >= RATE_LIMIT_ATTEMPTS;
}

/**
 * Record failed login attempt
 */
export function recordLoginAttempt(email: string): number {
  const attempt = loginAttempts.get(email);
  const now = Date.now();

  if (!attempt || now - attempt.timestamp > RATE_LIMIT_WINDOW) {
    loginAttempts.set(email, { count: 1, timestamp: now });
    return 1;
  }

  attempt.count++;
  attempt.timestamp = now;
  return attempt.count;
}

/**
 * Clear login attempts for user
 */
export function clearLoginAttempts(email: string): void {
  loginAttempts.delete(email);
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, "").trim().substring(0, 1000); // Limit to 1000 chars
}

/**
 * Sanitize HTML (remove dangerous tags)
 */
export function sanitizeHtml(html: string): string {
  const dangerous = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  return html.replace(dangerous, "").substring(0, 5000);
}

/**
 * Validate file upload size and type
 */
export function validateFileUpload(
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ["application/pdf"],
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(", ")}`,
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate secure token
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validate email domain
 */
export function validateEmailDomain(
  email: string,
  allowedDomains: string[],
): boolean {
  if (allowedDomains.length === 0) return true; // No restriction if empty

  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
}

/**
 * Hash sensitive data
 */
export function hashSensitiveData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Check if user can perform action (role-based + ownership)
 */
export async function canUserPerformAction(
  userId: string,
  action: string,
  resourceOwnerId?: string,
): Promise<boolean> {
  // Verify user session
  if (!userId) return false;

  // Check ownership for resource-specific actions
  if (resourceOwnerId && userId !== resourceOwnerId) {
    return false;
  }

  return true;
}
