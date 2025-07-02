// lib/auth.js (or wherever you define your NextAuth options)

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db"; // ✅ make sure this exists
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database", // or 'jwt' if you're not using the Prisma DB session store
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
};