//Creates a NextAuth handler for Google authentication

import NextAuth from "next-auth";
import { authOptions } from "@/components/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
