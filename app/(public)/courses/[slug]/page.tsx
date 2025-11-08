"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  BookOpen,
  ArrowLeft,
  Award,
  Download,
  Globe,
  Code,
  Lock,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Share2
} from "lucide-react"

// Sample course data (in production, this would come from a database)
const courses = [
  {
    id: "1",
    title: "Complete Solidity & Smart Contracts Course",
    slug: "solidity-smart-contracts",
    description: "Master Solidity development from basics to advanced concepts. Build real-world DeFi protocols and NFT projects.",
    fullDescription: "This comprehensive course takes you from Solidity basics to building production-ready smart contracts. You'll learn by doing, creating multiple real-world projects including DeFi protocols, NFT marketplaces, and DAO governance systems. By the end of this course, you'll have the skills and confidence to build and deploy your own blockchain applications.",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop",
    price: 99,
    isPremium: true,
    published: true,
    level: "BEGINNER" as const,
    duration: 1200,
    students: 1234,
    rating: 4.8,
    ratingCount: 456,
    modules: 12,
    lessons: 85,
    lastUpdated: "December 2024",
    instructor: {
      name: "Basant Singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=basant",
      role: "Blockchain Developer & Educator",
      bio: "Senior blockchain developer with 5+ years of experience building DeFi protocols and smart contracts. Passionate about education and making Web3 accessible."
    },
    features: [
      "Smart contract development from scratch",
      "Security best practices and auditing",
      "DeFi protocol building",
      "NFT marketplace creation",
      "Testing with Hardhat and Foundry",
      "Real-world projects portfolio",
      "Deployment to mainnet",
      "Gas optimization techniques"
    ],
    learningOutcomes: [
      "Write secure and efficient smart contracts in Solidity",
      "Build and deploy DeFi protocols including DEXs and lending platforms",
      "Create NFT collections and marketplaces",
      "Implement comprehensive testing strategies",
      "Understand and prevent common security vulnerabilities",
      "Optimize contracts for gas efficiency",
      "Deploy and verify contracts on Ethereum mainnet",
      "Build full-stack DApps with React and Web3 libraries"
    ],
    curriculum: [
      {
        module: 1,
        title: "Introduction to Blockchain & Solidity",
        duration: "2 hours",
        lessons: 8,
        isExpanded: false,
        topics: [
          { title: "Course Introduction & Setup", duration: "15 min", isFree: true },
          { title: "Blockchain Fundamentals", duration: "20 min", isFree: true },
          { title: "Introduction to Ethereum", duration: "18 min", isFree: false },
          { title: "Your First Smart Contract", duration: "25 min", isFree: false },
          { title: "Development Environment Setup", duration: "22 min", isFree: false },
          { title: "Solidity Basics - Variables & Types", duration: "20 min", isFree: false },
          { title: "Functions & Modifiers", duration: "18 min", isFree: false },
          { title: "Module Project: Simple Storage", duration: "12 min", isFree: false }
        ]
      },
      {
        module: 2,
        title: "Advanced Solidity Concepts",
        duration: "3 hours",
        lessons: 10,
        isExpanded: false,
        topics: [
          { title: "Inheritance & Interfaces", duration: "25 min", isFree: false },
          { title: "Events & Logging", duration: "18 min", isFree: false },
          { title: "Error Handling", duration: "20 min", isFree: false },
          { title: "Libraries & Using OpenZeppelin", duration: "30 min", isFree: false },
          { title: "Storage vs Memory vs Calldata", duration: "22 min", isFree: false },
          { title: "Mappings & Structs", duration: "18 min", isFree: false },
          { title: "Working with Time", duration: "15 min", isFree: false },
          { title: "Payable Functions & Ether", duration: "20 min", isFree: false },
          { title: "Fallback & Receive Functions", duration: "18 min", isFree: false },
          { title: "Module Project: Token Contract", duration: "14 min", isFree: false }
        ]
      },
      {
        module: 3,
        title: "Testing & Development Tools",
        duration: "2.5 hours",
        lessons: 7,
        isExpanded: false,
        topics: [
          { title: "Introduction to Hardhat", duration: "20 min", isFree: false },
          { title: "Writing Tests with Chai", duration: "30 min", isFree: false },
          { title: "Test Coverage & Best Practices", duration: "25 min", isFree: false },
          { title: "Debugging Smart Contracts", duration: "22 min", isFree: false },
          { title: "Introduction to Foundry", duration: "20 min", isFree: false },
          { title: "Gas Profiling", duration: "18 min", isFree: false },
          { title: "Module Project: Test Suite", duration: "15 min", isFree: false }
        ]
      },
      {
        module: 4,
        title: "DeFi Protocol Development",
        duration: "4 hours",
        lessons: 12,
        isExpanded: false,
        topics: [
          { title: "Understanding DeFi Primitives", duration: "25 min", isFree: false },
          { title: "ERC-20 Token Standard", duration: "30 min", isFree: false },
          { title: "Building a DEX - Part 1", duration: "35 min", isFree: false },
          { title: "Building a DEX - Part 2", duration: "35 min", isFree: false },
          { title: "Liquidity Pools & AMM", duration: "30 min", isFree: false },
          { title: "Staking Mechanisms", duration: "25 min", isFree: false },
          { title: "Yield Farming", duration: "28 min", isFree: false },
          { title: "Flash Loans", duration: "22 min", isFree: false },
          { title: "Oracle Integration", duration: "20 min", isFree: false },
          { title: "Governance Tokens", duration: "18 min", isFree: false },
          { title: "Security Considerations", duration: "25 min", isFree: false },
          { title: "Module Project: Mini DEX", duration: "17 min", isFree: false }
        ]
      },
      {
        module: 5,
        title: "NFT Development",
        duration: "3 hours",
        lessons: 9,
        isExpanded: false,
        topics: [
          { title: "ERC-721 Standard Deep Dive", duration: "25 min", isFree: false },
          { title: "ERC-1155 Multi-Token Standard", duration: "22 min", isFree: false },
          { title: "IPFS Integration", duration: "28 min", isFree: false },
          { title: "Metadata & Attributes", duration: "20 min", isFree: false },
          { title: "Minting Mechanisms", duration: "25 min", isFree: false },
          { title: "Royalties Implementation", duration: "18 min", isFree: false },
          { title: "Building an NFT Marketplace", duration: "40 min", isFree: false },
          { title: "On-chain vs Off-chain Data", duration: "15 min", isFree: false },
          { title: "Module Project: NFT Collection", duration: "17 min", isFree: false }
        ]
      },
      {
        module: 6,
        title: "Security & Best Practices",
        duration: "3.5 hours",
        lessons: 11,
        isExpanded: false,
        topics: [
          { title: "Common Vulnerabilities Overview", duration: "20 min", isFree: false },
          { title: "Reentrancy Attacks", duration: "25 min", isFree: false },
          { title: "Integer Overflow/Underflow", duration: "18 min", isFree: false },
          { title: "Access Control Issues", duration: "20 min", isFree: false },
          { title: "Front-running & MEV", duration: "25 min", isFree: false },
          { title: "Oracle Manipulation", duration: "22 min", isFree: false },
          { title: "Gas Optimization Strategies", duration: "30 min", isFree: false },
          { title: "Upgradeable Contracts", duration: "28 min", isFree: false },
          { title: "Audit Preparation", duration: "25 min", isFree: false },
          { title: "Using Security Tools", duration: "20 min", isFree: false },
          { title: "Module Project: Security Review", duration: "17 min", isFree: false }
        ]
      }
    ],
    requirements: [
      "Basic programming knowledge (JavaScript or similar)",
      "Understanding of basic blockchain concepts",
      "A computer with internet connection",
      "MetaMask wallet (we'll set this up together)"
    ],
    includes: [
      "85 video lessons (20+ hours)",
      "Downloadable code for all projects",
      "6 hands-on projects for your portfolio",
      "Quizzes and assignments",
      "Certificate of completion",
      "Lifetime access to course materials",
      "Private Discord community access",
      "Monthly Q&A sessions"
    ]
  },
  {
    id: "2",
    title: "DeFi Development Masterclass",
    slug: "defi-development",
    description: "Build production-ready DeFi protocols including DEXs, lending platforms, and yield farming systems.",
    fullDescription: "Take your DeFi development skills to the next level. This advanced course covers building production-ready protocols with a focus on security, gas optimization, and best practices used by top DeFi protocols.",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop",
    price: 149,
    isPremium: true,
    published: true,
    level: "INTERMEDIATE" as const,
    duration: 1800,
    students: 856,
    rating: 4.9,
    ratingCount: 234,
    modules: 15,
    lessons: 102,
    lastUpdated: "January 2025",
    instructor: {
      name: "Basant Singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=basant",
      role: "Blockchain Developer & Educator",
      bio: "Senior blockchain developer with 5+ years of experience building DeFi protocols and smart contracts."
    },
    features: [
      "Advanced DeFi concepts and architecture",
      "AMM implementation from scratch",
      "Lending and borrowing protocols",
      "Flash loan mechanics",
      "Yield optimization strategies",
      "Security auditing techniques"
    ],
    learningOutcomes: [],
    curriculum: [],
    requirements: [],
    includes: []
  }
]

const reviews = [
  {
    id: "1",
    author: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    rating: 5,
    date: "2 weeks ago",
    comment: "Best Solidity course I've taken! The projects are practical and the explanations are crystal clear. Already deployed my first DeFi protocol to mainnet!"
  },
  {
    id: "2",
    author: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 5,
    date: "1 month ago",
    comment: "Basant is an excellent teacher. The course structure is well-organized and builds your skills progressively. Highly recommended for anyone serious about blockchain development."
  },
  {
    id: "3",
    author: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    rating: 4,
    date: "1 month ago",
    comment: "Great content and projects. Would love to see more advanced security topics, but overall an excellent course for intermediate developers."
  }
]

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const course = courses.find(c => c.slug === slug)
  const [expandedModules, setExpandedModules] = useState<number[]>([])

  if (!course) {
    notFound()
  }

  const toggleModule = (moduleNum: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleNum)
        ? prev.filter(m => m !== moduleNum)
        : [...prev, moduleNum]
    )
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left Column - Course Info */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                {course.isPremium && <Badge>Premium</Badge>}
                <Badge variant="outline">Bestseller</Badge>
              </div>

              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                {course.title}
              </h1>

              <p className="mb-6 text-lg text-muted-foreground">
                {course.fullDescription}
              </p>

              {/* Stats */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">({course.ratingCount} ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(course.duration / 60)} hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>Updated {course.lastUpdated}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="text-sm text-muted-foreground">Created by</div>
                  <div className="font-semibold">{course.instructor.name}</div>
                </div>
              </div>
            </div>

            {/* Right Column - Course Card */}
            <div className="lg:sticky lg:top-4 lg:h-fit">
              <Card className="overflow-hidden shadow-xl">
                <div className="relative aspect-video">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Button size="lg" className="rounded-full p-4">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="mb-2 text-3xl font-bold">${course.price}</div>
                    <div className="text-sm text-muted-foreground">One-time payment, lifetime access</div>
                  </div>

                  <div className="space-y-3">
                    <Button size="lg" className="w-full">
                      Enroll Now
                    </Button>
                    <Button size="lg" variant="outline" className="w-full">
                      Add to Cart
                    </Button>
                  </div>

                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      30-day money-back guarantee
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Lifetime access
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Certificate of completion
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* What You'll Learn */}
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="text-sm">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* This Course Includes */}
              <Card>
                <CardHeader>
                  <CardTitle>This course includes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {course.includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p>{course.fullDescription}</p>
                  <p>
                    This course is designed for developers who want to master blockchain development
                    and build real-world applications. We focus on practical, hands-on learning with
                    multiple projects that you can add to your portfolio.
                  </p>
                  <h3>Who is this course for?</h3>
                  <ul>
                    <li>Developers wanting to transition into blockchain development</li>
                    <li>Software engineers looking to build DeFi applications</li>
                    <li>Entrepreneurs wanting to understand smart contract development</li>
                    <li>Anyone interested in Web3 technology</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              {course.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {course.modules} modules • {course.lessons} lessons • {Math.floor(course.duration / 60)}h {course.duration % 60}m total
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.curriculum.map((module) => (
                    <Card key={module.module} className="overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.module)}
                        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {expandedModules.includes(module.module) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                          <div>
                            <div className="font-semibold">Module {module.module}: {module.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {module.lessons} lessons • {module.duration}
                            </div>
                          </div>
                        </div>
                      </button>

                      {expandedModules.includes(module.module) && (
                        <div className="border-t bg-muted/20">
                          {module.topics.map((topic, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between border-b p-4 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                {topic.isFree ? (
                                  <Play className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm">{topic.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {topic.isFree && (
                                  <Badge variant="outline" className="text-xs">Free Preview</Badge>
                                )}
                                <span>{topic.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Instructor Tab */}
            <TabsContent value="instructor">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="h-24 w-24 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1 text-2xl font-bold">{course.instructor.name}</h3>
                      <p className="mb-4 text-muted-foreground">{course.instructor.role}</p>
                      <p className="mb-6">{course.instructor.bio}</p>

                      <div className="grid grid-cols-3 gap-4 border-t pt-4">
                        <div>
                          <div className="text-2xl font-bold">{course.rating}</div>
                          <div className="text-sm text-muted-foreground">Instructor Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course.students.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">5</div>
                          <div className="text-sm text-muted-foreground">Courses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Feedback</CardTitle>
                  <CardDescription>
                    {course.rating} average rating • {course.ratingCount} ratings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-semibold">{review.author}</div>
                            <div className="text-sm text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join {course.students.toLocaleString()}+ students already learning {course.title}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg">
                Enroll for ${course.price}
              </Button>
              <Button size="lg" variant="outline">
                Try Free Preview
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
