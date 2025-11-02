import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Role {
    name: string;
    permissions: string[];
  }

  interface User extends DefaultUser {
    id: number;
    name: string;
    email: string;
    roles: Role[];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      roles: { name: string }[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: import("next-auth").User;
  }
}
