import { auth } from "@/lib/auth";
export async function requireAdmin() { const session = await auth(); if (!session?.user?.id || !session.user.role) throw new Error("UNAUTHORIZED"); return session; }
export async function requireSuperAdmin() { const session = await requireAdmin(); if (session.user.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN"); return session; }
