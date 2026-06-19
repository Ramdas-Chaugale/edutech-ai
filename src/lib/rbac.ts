import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

/**
 * Gets the current user's role from the database based on their Clerk ID.
 */
export async function getCurrentUserRole(): Promise<Role | null> {
  const { userId } = await auth();
  
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return user?.role || null;
}

/**
 * Higher-order check to see if a user has a specific role.
 */
export async function hasRole(requiredRole: Role | Role[]): Promise<boolean> {
  const role = await getCurrentUserRole();
  
  if (!role) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(role);
  }

  return role === requiredRole;
}

/**
 * Throws an error or redirects if the user doesn't have the required role.
 * Useful for Server Actions and Server Components.
 */
export async function protectWithRole(requiredRole: Role | Role[]) {
  const authorized = await hasRole(requiredRole);
  
  if (!authorized) {
    throw new Error("Unauthorized: Insufficient permissions for this role.");
  }
}
