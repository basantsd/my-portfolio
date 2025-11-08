import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAdminRoute = req.nextUrl.pathname.startsWith("/dashboard") ||
                        req.nextUrl.pathname.startsWith("/(admin)")

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        if (req.nextUrl.pathname === "/login") {
          return true
        }

        // Require token for admin routes
        if (req.nextUrl.pathname.startsWith("/dashboard") ||
            req.nextUrl.pathname.startsWith("/(admin)")) {
          return !!token
        }

        // Allow all other routes
        return true
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/(admin)/:path*",
  ],
}
