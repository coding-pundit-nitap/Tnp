import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth(allowedRoles?: string[]) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (allowedRoles && !allowedRoles.includes((session.user as any).role || "STUDENT")) {
    throw new Error("Forbidden");
  }

  return session;
}
