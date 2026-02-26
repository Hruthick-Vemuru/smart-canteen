import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "USER" | "SELLER";
    };
  }

  interface User {
    role: "USER" | "SELLER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "SELLER";
  }
}
