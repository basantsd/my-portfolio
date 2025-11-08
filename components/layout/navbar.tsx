"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, Sparkles, User, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/courses", label: "Courses" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === ""
    }
    return pathname === href || pathname.includes(href)
  }

  const getUserInitials = () => {
    if (!session?.user?.name) return "U"
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/95"
          : "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg transition-shadow group-hover:shadow-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BasantSD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            ))}
            <div className="ml-2 flex items-center gap-2">
              {status === "loading" ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-courses" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>My Courses</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
                  >
                    <Link href="/signup">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-[600px] pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all rounded-lg",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}

            {session ? (
              <>
                <div className="pt-2 pb-2 border-t mt-2">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>
                <Link
                  href="/my-courses"
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg flex items-center"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Courses
                </Link>
                <Link
                  href="/settings"
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg flex items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="default" size="sm" asChild className="w-full shadow-sm">
                  <Link href="/signup">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
