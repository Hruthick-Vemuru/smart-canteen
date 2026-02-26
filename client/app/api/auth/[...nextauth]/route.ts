import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/* 🔐 Load seller emails from ENV */
const SELLER_EMAILS = process.env.SELLER_EMAILS
  ? process.env.SELLER_EMAILS.split(",")
      .map(email => email.trim().toLowerCase())
  : [];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
        async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase();
        console.log("Logged email:", email);
        console.log("Allowed sellers:", SELLER_EMAILS);

        token.role = SELLER_EMAILS.includes(email)
          ? "SELLER"
          : "USER";
      }
      return token;
    },


    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as
          | "USER"
          | "SELLER";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
