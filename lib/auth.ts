import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import * as bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
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

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.user.findUnique({
          where: {
            email: email,
          },
          include: {
            accounts: true,
          },
        })

        if (!user) {
          throw new Error("Invalid email or password")
        }

        // Check if user only has OAuth accounts
        if (!user.password) {
          const oauthProviders = user.accounts
            .map((acc) => acc.provider)
            .filter((p) => p !== "credentials")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" or ")

          if (oauthProviders) {
            throw new Error(`This email is registered with ${oauthProviders}. Please use that to login.`)
          }
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        // Check if email is verified for credential signups (skip for admin and OAuth users)
        if (!user.emailVerified && user.role !== "ADMIN") {
          throw new Error("Please verify your email before logging in")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, auto-verify email
      if (account?.provider !== "credentials") {
        if (user.email) {
          await db.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() },
          })
        }
        return true
      }

      // For credentials, check email verification (skip for admin users)
      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      })

      // Allow admin users even if email is not verified
      if (existingUser?.role === "ADMIN") {
        return true
      }

      if (!existingUser?.emailVerified) {
        return false // Block login if email not verified
      }

      return true
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
        session.user.role = token.role as any
        session.user.emailVerified = token.emailVerified as Date
      }

      return session
    },
    async jwt({ token, user, account }) {
      // Fetch latest user data from database
      const dbUser = await db.user.findUnique({
        where: { email: token.email! },
      })

      if (dbUser) {
        token.id = dbUser.id
        token.role = dbUser.role
        token.emailVerified = dbUser.emailVerified
      }

      // Store user data in token on initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
})
