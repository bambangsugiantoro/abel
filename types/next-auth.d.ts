import "next-auth";
declare module "next-auth" { interface User { role: "ADMIN" | "SUPER_ADMIN" } interface Session { user: { id: string; name?: string | null; email?: string | null; role: "ADMIN" | "SUPER_ADMIN" } } }
declare module "next-auth/jwt" { interface JWT { role?: "ADMIN" | "SUPER_ADMIN" } }
