import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface SessionUser {
  id: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SessionUser;
    return decoded;
  } catch (error: any) {
    return null;
  }
}

export async function requireAuth(
  allowedRoles?: string[],
): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error("Forbidden");
  }

  return session;
}
