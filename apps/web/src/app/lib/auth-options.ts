// src/lib/auth-options.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/app/lib/prisma";
import { LogService } from "@/src/modules/core/services/log-service";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing email or password");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            roles: {
              include: {
                role: { include: { permissions: true } },
              },
            },
          },
        });

        if (!user) throw new Error("User not found");

        const PEPPER = process.env.PASSWORD_PEPPER || "";
        const isValid = await bcrypt.compare(
          credentials.password + PEPPER,
          user.password!
        );
        if (!isValid) throw new Error("Invalid credentials");

        // Logging example
        const logService = new LogService();
        await logService.logUserAction(
          "LOGIN",
          "Auth",
          `User logged in successfully: ${user.email}`,
          user.id
        );

        return {
          id: user.id.toString(),
          name: user.first_name + " " + user.last_name,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: user.roles.map((ur) => ({
            name: ur.role.name,
            permissions: ur.role.permissions.map((p) => p.name),
          })),
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};
