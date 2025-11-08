"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Blocks, Shield, Zap } from "lucide-react"
import { BlockchainAnimation } from "./blockchain-animation"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950" />

      {/* Blockchain Animation */}
      <div className="absolute inset-0 -z-10">
        <BlockchainAnimation />
      </div>

      {/* Decorative elements */}
      <div className="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-900/20" />
      <div className="absolute right-0 bottom-0 -z-10 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/20" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces"
                  alt="Basant Singh Dobal"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-2 border-background">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <Badge className="mb-6 animate-pulse">
            ✨ Available for Freelance
          </Badge>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Blockchain Developer &{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Contract Engineer
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Building the future of decentralized applications with Solidity,
            Ethereum, and cutting-edge blockchain technologies. Specialized in
            DeFi protocols, NFT marketplaces, and Web3 integrations.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="group shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105"
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="group border-2 hover:bg-primary/5 transition-all hover:scale-105"
            >
              <Link href="/portfolio">
                <Blocks className="mr-2 h-4 w-4" />
                View Portfolio
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Blocks className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">12+</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Secure</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">5+</div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="https://github.com/basantsd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://linkedin.com/in/basantsd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:contact@basantsd.com"
              className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
