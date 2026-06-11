import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const signInSchema = z.object({
  email: z.email().transform((email) => email.trim().toLowerCase()),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (
          user &&
          user.emailVerifiedAt &&
          (await bcrypt.compare(password, user.password))
        ) {
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.sub = user.id;
        token.role = (user as { role?: string }).role;
      }

      // Les nouvelles valeurs sont passées directement via update({ name, email })
      // et reçues ici dans `session` — pas de round-trip DB nécessaire
      if (trigger === "update" && session) {
        if (typeof (session as { name?: unknown }).name === "string") {
          token.name = (session as { name: string }).name;
        }
        if (typeof (session as { email?: unknown }).email === "string") {
          token.email = (session as { email: string }).email;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : "";
        session.user.name = typeof token.name === "string" ? token.name : null;
        session.user.email = typeof token.email === "string" ? token.email : "";
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      }

      return session;
    },
  },
});
