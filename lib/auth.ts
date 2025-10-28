// src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDatabase } from "@/config/database"; // ✅ তোমার db config
import { User } from "@/models/User";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongo-client";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        // ✅ connectDatabase() ফাংশন সঠিকভাবে কল করো
        await connectDatabase();

        const user = await User.findOne({ email: creds?.email });
        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Use Google login");

        const valid = await bcrypt.compare(creds!.password!, user.password);
        if (!valid) throw new Error("Invalid credentials");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          plan: user.plan,
          subscriptionStatus: user.subscriptionStatus,
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
  secret: process.env.AUTH_SECRET!,
};
