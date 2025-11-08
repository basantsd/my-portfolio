"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  BookOpen,
  ChevronRight,
  Code,
  Lightbulb,
  AlertCircle
} from "lucide-react"
import { formatDate } from "@/lib/utils"

// Sample blog data (in production, this would come from a database or CMS)
const blogPosts = [
  {
    id: "1",
    title: "Getting Started with Solidity Smart Contracts",
    slug: "getting-started-solidity",
    excerpt: "Learn the fundamentals of Solidity and how to write your first smart contract on Ethereum.",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop",
    tags: ["Solidity", "Ethereum", "Tutorial"],
    readTime: 8,
    createdAt: new Date("2024-01-15"),
    views: 1234,
    author: {
      name: "Basant Singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=basant",
      role: "Blockchain Developer"
    },
    content: `
      <h2>Introduction to Solidity</h2>
      <p>Solidity is a statically-typed programming language designed for developing smart contracts that run on the Ethereum Virtual Machine (EVM). Whether you're building DeFi protocols, NFT marketplaces, or DAO governance systems, Solidity is the language you need to master.</p>

      <h3>Why Learn Solidity?</h3>
      <ul>
        <li>Most popular smart contract language with extensive tooling and community support</li>
        <li>Powers the majority of DeFi applications with billions in total value locked</li>
        <li>Essential skill for blockchain developers with high demand in the job market</li>
        <li>Foundation for understanding other smart contract languages</li>
      </ul>

      <h3>Your First Smart Contract</h3>
      <p>Let's start with a simple contract that demonstrates key Solidity concepts:</p>

      <pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private storedData;

    event DataStored(uint256 indexed newValue, address indexed sender);

    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x, msg.sender);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}</code></pre>

      <h3>Key Concepts Explained</h3>
      <p><strong>SPDX License:</strong> Identifies the license under which the code is distributed. Always include this to avoid compilation warnings.</p>

      <p><strong>Pragma Directive:</strong> Specifies the Solidity compiler version. Using <code>^0.8.19</code> means any version from 0.8.19 up to (but not including) 0.9.0.</p>

      <p><strong>State Variables:</strong> Variables that permanently store data in the blockchain. In our example, <code>storedData</code> is a state variable.</p>

      <p><strong>Events:</strong> Allow logging on the blockchain. They're crucial for off-chain applications to track contract activity.</p>

      <h3>Setting Up Your Development Environment</h3>
      <p>To start developing with Solidity, you'll need:</p>

      <ol>
        <li><strong>Node.js:</strong> JavaScript runtime for running development tools</li>
        <li><strong>Hardhat or Foundry:</strong> Development frameworks for compiling and testing</li>
        <li><strong>MetaMask:</strong> Browser wallet for interacting with your contracts</li>
        <li><strong>VS Code with Solidity extension:</strong> Best IDE setup for development</li>
      </ol>

      <pre><code># Install Hardhat
npm install --save-dev hardhat

# Initialize a new Hardhat project
npx hardhat init</code></pre>

      <h3>Best Practices for Beginners</h3>
      <ul>
        <li>Always use the latest stable Solidity version for new projects</li>
        <li>Follow the Checks-Effects-Interactions pattern to prevent reentrancy</li>
        <li>Use OpenZeppelin contracts for standard implementations</li>
        <li>Write comprehensive tests before deploying to mainnet</li>
        <li>Start with testnets (Sepolia, Goerli) before deploying to mainnet</li>
      </ul>

      <h3>Common Pitfalls to Avoid</h3>
      <p>As a beginner, watch out for these common mistakes:</p>

      <ul>
        <li><strong>Integer Overflow:</strong> Use Solidity 0.8+ which has built-in overflow checks</li>
        <li><strong>Reentrancy Attacks:</strong> Always update state before external calls</li>
        <li><strong>Gas Optimization:</strong> Understand gas costs early to write efficient contracts</li>
        <li><strong>Access Control:</strong> Properly implement modifiers for restricted functions</li>
      </ul>

      <h3>Next Steps</h3>
      <p>Now that you understand the basics, here's your learning path:</p>

      <ol>
        <li>Build a simple ERC-20 token contract</li>
        <li>Create an NFT collection using ERC-721</li>
        <li>Develop a basic DEX with liquidity pools</li>
        <li>Learn about security auditing and testing</li>
        <li>Join the community and contribute to open source</li>
      </ol>

      <h3>Conclusion</h3>
      <p>Solidity is your gateway to blockchain development. Start with simple contracts, gradually increase complexity, and always prioritize security. The blockchain space is rapidly evolving, and mastering Solidity opens doors to exciting opportunities in Web3.</p>

      <p>Happy coding, and welcome to the decentralized future!</p>
    `
  },
  {
    id: "2",
    title: "DeFi Protocol Security: Best Practices",
    slug: "defi-security-best-practices",
    excerpt: "Essential security considerations when building DeFi protocols and how to protect against common vulnerabilities.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop",
    tags: ["DeFi", "Security", "Best Practices"],
    readTime: 12,
    createdAt: new Date("2024-01-10"),
    views: 2156,
    author: {
      name: "Basant Singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=basant",
      role: "Blockchain Developer"
    },
    content: `
      <h2>Securing Your DeFi Protocol</h2>
      <p>DeFi protocols handle billions of dollars in value, making security paramount. This comprehensive guide covers essential security practices for building robust, hack-resistant protocols.</p>

      <h3>Common Vulnerabilities</h3>
      <p>Understanding attack vectors is the first step to prevention:</p>

      <ul>
        <li><strong>Reentrancy:</strong> The infamous vulnerability that led to the DAO hack</li>
        <li><strong>Flash Loan Attacks:</strong> Price manipulation through uncollateralized loans</li>
        <li><strong>Oracle Manipulation:</strong> Exploiting price feed vulnerabilities</li>
        <li><strong>Front-running:</strong> MEV exploitation and sandwich attacks</li>
      </ul>

      <p>Learn more about these and how to protect your protocol in our comprehensive security course.</p>
    `
  },
  {
    id: "3",
    title: "Building NFT Marketplaces: Complete Guide",
    slug: "nft-marketplace-guide",
    excerpt: "A comprehensive guide to building your own NFT marketplace with ERC-721 and ERC-1155 support.",
    coverImage: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&h=600&fit=crop",
    tags: ["NFT", "Marketplace", "Guide"],
    readTime: 15,
    createdAt: new Date("2024-01-05"),
    views: 3421,
    author: {
      name: "Basant Singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=basant",
      role: "Blockchain Developer"
    },
    content: `
      <h2>Creating Your NFT Marketplace</h2>
      <p>NFT marketplaces are complex applications combining smart contracts, IPFS storage, and modern web technologies. This guide walks you through building a production-ready marketplace from scratch.</p>

      <h3>Architecture Overview</h3>
      <p>A complete NFT marketplace requires:</p>

      <ul>
        <li>Smart contracts for minting, listing, and trading</li>
        <li>IPFS for decentralized metadata storage</li>
        <li>Frontend with Web3 integration</li>
        <li>Indexing layer for efficient queries</li>
      </ul>
    `
  },
]

const relatedPosts = [
  {
    title: "Gas Optimization Techniques in Solidity",
    slug: "gas-optimization-solidity",
    coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=250&fit=crop",
    readTime: 10
  },
  {
    title: "Web3 Authentication: A Complete Guide",
    slug: "web3-authentication-guide",
    coverImage: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=250&fit=crop",
    readTime: 9
  },
  {
    title: "Understanding EVM and How It Works",
    slug: "understanding-evm",
    coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop",
    readTime: 14
  }
]

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <div className="font-semibold text-foreground">{post.author.name}</div>
                  <div className="text-xs">{post.author.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views.toLocaleString()} views
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_300px]">
          {/* Article Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Info Boxes */}
            <Card className="not-prose my-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="flex gap-3 p-4">
                <Lightbulb className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="mb-1 font-semibold text-blue-900 dark:text-blue-100">Pro Tip</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Always test your smart contracts on testnets before deploying to mainnet. Use tools like Hardhat and Foundry for comprehensive testing.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Author Bio */}
            <div className="not-prose flex gap-4 rounded-lg border bg-muted/50 p-6">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h3 className="mb-1 font-semibold">{post.author.name}</h3>
                <p className="mb-2 text-sm text-muted-foreground">{post.author.role}</p>
                <p className="text-sm">
                  Blockchain developer and educator passionate about making Web3 accessible to everyone.
                  Building the decentralized future, one smart contract at a time.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Table of Contents */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <BookOpen className="h-5 w-5" />
                  Table of Contents
                </h3>
                <nav className="space-y-2 text-sm">
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Introduction
                  </a>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Why Learn Solidity?
                  </a>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Your First Contract
                  </a>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Best Practices
                  </a>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Next Steps
                  </a>
                </nav>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">Stay Updated</h3>
                <p className="mb-4 text-sm text-blue-50">
                  Get the latest blockchain tutorials and insights delivered to your inbox.
                </p>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Quick Links</h3>
                <div className="space-y-3 text-sm">
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Code className="h-4 w-4" />
                    View Code Examples
                  </a>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <BookOpen className="h-4 w-4" />
                    Related Courses
                  </a>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Share2 className="h-4 w-4" />
                    Share Article
                  </a>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* Related Posts */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-3xl font-bold">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.slug} className="group overflow-hidden hover:shadow-lg">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-2 line-clamp-2 font-semibold">{relatedPost.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {relatedPost.readTime} min read
                    </div>
                    <Button variant="ghost" size="sm" asChild className="mt-4 w-full">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        Read More
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
