"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

const blogPosts = [
  {
    id: "1",
    title: "Getting Started with Solidity Smart Contracts",
    slug: "getting-started-solidity",
    excerpt: "Learn the fundamentals of Solidity and how to write your first smart contract on Ethereum.",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    tags: ["Solidity", "Ethereum", "Tutorial"],
    readTime: 8,
    createdAt: new Date("2024-01-15"),
    views: 1234,
  },
  {
    id: "2",
    title: "DeFi Protocol Security: Best Practices",
    slug: "defi-security-best-practices",
    excerpt: "Essential security considerations when building DeFi protocols and how to protect against common vulnerabilities.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop",
    tags: ["DeFi", "Security", "Best Practices"],
    readTime: 12,
    createdAt: new Date("2024-01-10"),
    views: 2156,
  },
  {
    id: "3",
    title: "Building NFT Marketplaces: Complete Guide",
    slug: "nft-marketplace-guide",
    excerpt: "A comprehensive guide to building your own NFT marketplace with ERC-721 and ERC-1155 support.",
    coverImage: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=400&fit=crop",
    tags: ["NFT", "Marketplace", "Guide"],
    readTime: 15,
    createdAt: new Date("2024-01-05"),
    views: 3421,
  },
  {
    id: "4",
    title: "Gas Optimization Techniques in Solidity",
    slug: "gas-optimization-solidity",
    excerpt: "Learn advanced techniques to optimize gas costs in your smart contracts and save users money.",
    coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop",
    tags: ["Solidity", "Optimization", "Gas"],
    readTime: 10,
    createdAt: new Date("2023-12-28"),
    views: 1876,
  },
  {
    id: "5",
    title: "Web3 Authentication: A Complete Guide",
    slug: "web3-authentication-guide",
    excerpt: "Implement secure Web3 authentication in your DApp using MetaMask and WalletConnect.",
    coverImage: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=400&fit=crop",
    tags: ["Web3", "Authentication", "DApp"],
    readTime: 9,
    createdAt: new Date("2023-12-20"),
    views: 2543,
  },
  {
    id: "6",
    title: "Understanding EVM and How It Works",
    slug: "understanding-evm",
    excerpt: "Deep dive into the Ethereum Virtual Machine and how smart contracts are executed.",
    coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop",
    tags: ["Ethereum", "EVM", "Advanced"],
    readTime: 14,
    createdAt: new Date("2023-12-15"),
    views: 1654,
  },
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Get all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)))

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  // Featured post (most recent)
  const featuredPost = blogPosts[0]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Blog</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Blockchain Insights & Tutorials
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Learn about blockchain development, smart contracts, DeFi, NFTs, and Web3 technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Post</h2>
        <Card className="group overflow-hidden hover:shadow-lg">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-video overflow-hidden md:aspect-auto">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {featuredPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="mb-3 text-2xl font-bold">{featuredPost.title}</h3>
              <p className="mb-4 text-muted-foreground">{featuredPost.excerpt}</p>
              <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(featuredPost.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readTime} min read
                </div>
              </div>
              <Button asChild>
                <Link href={`/blog/${featuredPost.slug}`}>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 pb-8">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All Posts
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="group overflow-hidden hover:shadow-lg">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="mb-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>Read Article</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
