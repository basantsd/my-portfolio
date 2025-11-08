"use client"

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
  Lightbulb
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@prisma/client"

interface BlogPostClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
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
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=basant"
                  alt="Basant Singh"
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <div className="font-semibold text-foreground">Basant Singh</div>
                  <div className="text-xs">Blockchain Developer</div>
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

            {/* Info Box */}
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
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=basant"
                alt="Basant Singh"
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h3 className="mb-1 font-semibold">Basant Singh</h3>
                <p className="mb-2 text-sm text-muted-foreground">Blockchain Developer</p>
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
                  Quick Links
                </h3>
                <nav className="space-y-2 text-sm">
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Share Article
                  </a>
                  <a href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    All Articles
                  </a>
                  <a href="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Browse Courses
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
          </aside>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-3xl font-bold">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group overflow-hidden hover:shadow-lg">
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
      )}
    </div>
  )
}
