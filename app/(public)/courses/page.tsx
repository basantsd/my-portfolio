"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star, Play, CheckCircle, BookOpen } from "lucide-react"

const courses = [
  {
    id: "1",
    title: "Complete Solidity & Smart Contracts Course",
    slug: "solidity-smart-contracts",
    description: "Master Solidity development from basics to advanced concepts. Build real-world DeFi protocols and NFT projects.",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    price: 99,
    isPremium: true,
    published: true,
    level: "BEGINNER" as const,
    duration: 1200, // in minutes
    students: 1234,
    rating: 4.8,
    modules: 12,
    lessons: 85,
    features: [
      "Smart contract development from scratch",
      "Security best practices",
      "DeFi protocol building",
      "NFT marketplace creation",
      "Testing with Hardhat",
      "Real-world projects",
    ],
  },
  {
    id: "2",
    title: "DeFi Development Masterclass",
    slug: "defi-development",
    description: "Build production-ready DeFi protocols including DEXs, lending platforms, and yield farming systems.",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
    price: 149,
    isPremium: true,
    published: true,
    level: "INTERMEDIATE" as const,
    duration: 1800,
    students: 856,
    rating: 4.9,
    modules: 15,
    lessons: 102,
    features: [
      "Advanced DeFi concepts",
      "AMM implementation",
      "Lending protocols",
      "Flash loans",
      "Yield optimization",
      "Security auditing",
    ],
  },
  {
    id: "3",
    title: "NFT Development & Marketplace",
    slug: "nft-marketplace",
    description: "Create your own NFT collection and build a fully functional NFT marketplace with minting and trading.",
    thumbnail: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=600&h=400&fit=crop",
    price: 79,
    isPremium: false,
    published: true,
    level: "BEGINNER" as const,
    duration: 900,
    students: 2103,
    rating: 4.7,
    modules: 10,
    lessons: 68,
    features: [
      "ERC-721 & ERC-1155 standards",
      "IPFS integration",
      "Minting mechanisms",
      "Marketplace development",
      "Royalty implementation",
      "Frontend integration",
    ],
  },
  {
    id: "4",
    title: "Advanced Smart Contract Security",
    slug: "smart-contract-security",
    description: "Learn to identify vulnerabilities, perform security audits, and write secure smart contracts.",
    thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop",
    price: 129,
    isPremium: true,
    published: true,
    level: "ADVANCED" as const,
    duration: 1500,
    students: 432,
    rating: 4.9,
    modules: 14,
    lessons: 95,
    features: [
      "Common vulnerabilities",
      "Security patterns",
      "Auditing techniques",
      "Static analysis tools",
      "Formal verification",
      "Real audit examples",
    ],
  },
  {
    id: "5",
    title: "Web3 & DApp Development",
    slug: "web3-dapp-development",
    description: "Build modern DApps with React, Next.js, and Web3 libraries. Connect to smart contracts seamlessly.",
    thumbnail: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=600&h=400&fit=crop",
    price: 89,
    isPremium: false,
    published: true,
    level: "INTERMEDIATE" as const,
    duration: 1100,
    students: 1567,
    rating: 4.6,
    modules: 11,
    lessons: 76,
    features: [
      "ethers.js & wagmi",
      "Wallet integration",
      "Contract interaction",
      "Real-time updates",
      "IPFS & TheGraph",
      "Production deployment",
    ],
  },
  {
    id: "6",
    title: "DAO Development & Governance",
    slug: "dao-development",
    description: "Create decentralized autonomous organizations with voting, proposals, and treasury management.",
    thumbnail: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop",
    price: 119,
    isPremium: true,
    published: false,
    level: "INTERMEDIATE" as const,
    duration: 1300,
    students: 0,
    rating: 0,
    modules: 13,
    lessons: 89,
    features: [
      "Governance tokens",
      "Voting mechanisms",
      "Proposal systems",
      "Treasury management",
      "Timelock contracts",
      "Multi-sig wallets",
    ],
  },
]

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]

  const filteredCourses = courses.filter((course) => {
    const matchesLevel = !selectedLevel || course.level === selectedLevel
    return matchesLevel && course.published
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Learn Blockchain Development</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Master Web3 Development
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Learn blockchain development with hands-on courses covering Solidity, DeFi, NFTs, and more.
              Build real-world projects and launch your Web3 career.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-semibold">50+ Hours of Content</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">6,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-semibold">4.8 Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLevel === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLevel(null)}
          >
            All Levels
          </Button>
          {levels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
            >
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group flex flex-col overflow-hidden hover:shadow-lg">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                </div>
                {course.isPremium && (
                  <Badge className="absolute right-2 top-2">Premium</Badge>
                )}
              </div>

              <CardHeader className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline">{course.level}</Badge>
                  {course.rating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{course.rating}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.floor(course.duration / 60)}h
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.students}
                  </div>
                </div>

                <div className="space-y-1">
                  {course.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-2xl font-bold">${course.price}</span>
                  <Button asChild>
                    <Link href={`/courses/${course.slug}`}>Enroll Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No courses found matching your criteria.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Start Learning Today</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of developers learning blockchain development.
              Get lifetime access to all courses with our premium membership.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact">Get Premium Access</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
