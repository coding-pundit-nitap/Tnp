import { headers } from "next/headers";
import { auth } from "./auth";

export interface SessionUser {
  id: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";
  name: string;
  email: string;
}

/**
 * Get current session user.
 * Returns a flat object with { id, role, name, email } or null if not authenticated.
 * This maintains backward compatibility with the old auth pattern.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result || !result.user) {
      return null;
    }

    return {
      id: result.user.id,
      role: ((result.user as any).role || "STUDENT") as SessionUser["role"],
      name: result.user.name,
      email: result.user.email,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication, optionally with specific roles.
 */
export async function requireAuth(allowedRoles?: string[]): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error("Forbidden");
  }

  return session;
}
