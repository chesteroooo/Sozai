import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

// Auth.js v5：Google provider 會自動讀取 AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET，
// 加密用的 AUTH_SECRET 也會自動從 env 讀取（都放在 .env）。
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
});
