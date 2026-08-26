import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({ email: z.string().email(), password: z.string().min(12).max(128) });
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [Credentials({
    name: "Admin", credentials: { email: { label: "Email", type: "email" }, password: { label: "Kata sandi", type: "password" } },
    async authorize(raw) {
      const parsed = schema.safeParse(raw); if (!parsed.success) return null;
      const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
      if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    }
  })],
  callbacks: {
    async jwt({ token, user }) { if (user) token.role = user.role; return token; },
    async session({ session, token }) { if (session.user) { session.user.id = token.sub as string; session.user.role = token.role as "ADMIN" | "SUPER_ADMIN"; } return session; }
  },
  pages: { signIn: "/admin/login" }
});
