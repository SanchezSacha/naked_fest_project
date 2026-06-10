import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);
        const user = await prisma.user.findUnique({ where: { email } });

        if (
          user &&
          user.emailVerifiedAt &&
          (await bcrypt.compare(password, user.password))
        ) {
          return { id: String(user.id), email: user.email, name: user.name };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name = typeof token.name === "string" ? token.name : null;
        session.user.email = typeof token.email === "string" ? token.email : "";
      }

      return session;
    },
  },
});
