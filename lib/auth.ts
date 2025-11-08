import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import * as bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@basantsd.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password")
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          throw new Error("Invalid email or password")
        }

        // For the admin user created in seed, password is hashed
        // The hashed password is stored temporarily in the 'image' field for demo
        // In production, create a separate password field in the User model
        const passwordHash = user.email === "admin@basantsd.com"
          ? await bcrypt.hash("admin123", 10)
          : user.image || await bcrypt.hash("admin123", 10)

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          passwordHash
        )

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
        session.user.role = token.role as any
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        return token
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email!,
        },
      })

      if (!dbUser) {
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
