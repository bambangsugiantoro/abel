import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128)
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8
  },

  pages: {
    signIn: "/admin/login"
  },

  callbacks: {
    authorized({ auth, request }) {
      const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        return true;
      }

      if (isAdminPath) {
        return !!auth?.user;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "ADMIN" | "SUPER_ADMIN";
      }

      return session;
    }
  },

  providers: [
    Credentials({
      name: "Admin",

      credentials: {
        email: {
          label: "Email",
          type: "email"
        },

        password: {
          label: "Kata sandi",
          type: "password"
        }
      },

      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: parsed.data.email.toLowerCase()
          }
        });

        if (!user) {
          return null;
        }

        const passwordCorrect = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!passwordCorrect) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ]
});