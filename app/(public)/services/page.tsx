import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Blocks, Shield, Rocket, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Code,
    title: "Smart Contract Development",
    description: "Custom smart contract development for your blockchain project with industry best practices.",
    features: [
      "ERC20, ERC721, ERC1155 token standards",
      "DeFi protocols (lending, staking, DEX)",
      "DAO governance contracts",
      "Multi-signature wallets",
      "Upgradeable contracts",
      "Gas optimization",
    ],
    price: "Starting at $5,000",
    popular: true,
  },
  {
    icon: Blocks,
    title: "DApp Development",
    description: "Full-stack decentralized application development with seamless Web3 integration.",
    features: [
      "React/Next.js frontend development",
      "Web3 wallet integration (MetaMask, WalletConnect)",
      "Subgraph/TheGraph integration",
      "IPFS storage implementation",
      "Real-time blockchain data",
      "Responsive UI/UX design",
    ],
    price: "Starting at $10,000",
    popular: false,
  },
  {
    icon: Shield,
    title: "Smart Contract Auditing",
    description: "Comprehensive security audits to identify vulnerabilities and ensure production-readiness.",
    features: [
      "Line-by-line code review",
      "Security vulnerability assessment",
      "Gas optimization suggestions",
      "Detailed audit report",
      "Re-audit after fixes",
      "Best practices recommendations",
    ],
    price: "Starting at $3,000",
    popular: false,
  },
  {
    icon: Rocket,
    title: "Blockchain Consulting",
    description: "Strategic guidance on blockchain architecture, tokenomics, and implementation.",
    features: [
      "Architecture design & planning",
      "Tokenomics modeling",
      "Blockchain selection (Ethereum, Polygon, etc.)",
      "Smart contract strategy",
      "Security best practices",
      "Deployment & maintenance guidance",
    ],
    price: "Starting at $2,000",
    popular: false,
  },
]

const process = [
  {
    step: "1",
    title: "Discovery Call",
    description: "We discuss your project requirements, goals, and timeline.",
  },
  {
    step: "2",
    title: "Proposal & Quote",
    description: "Receive a detailed proposal with scope, timeline, and pricing.",
  },
  {
    step: "3",
    title: "Development",
    description: "Regular updates and collaboration throughout the development process.",
  },
  {
    step: "4",
    title: "Testing & Deployment",
    description: "Thorough testing, audit, and deployment to mainnet or testnet.",
  },
  {
    step: "5",
    title: "Support & Maintenance",
    description: "Ongoing support and maintenance to ensure smooth operation.",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 dark:from-blue-950 dark:via-background dark:to-purple-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Professional Services</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Blockchain Development Services
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              From smart contracts to full-stack DApps, I provide comprehensive blockchain
              development services tailored to your needs.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">What I Offer</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive blockchain solutions for your project
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card
                  key={service.title}
                  className={`relative ${
                    service.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {service.popular && (
                    <Badge className="absolute -top-3 right-4">Most Popular</Badge>
                  )}
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 space-y-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-start">
                          <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-lg font-semibold">{service.price}</span>
                      <Button variant="outline" asChild>
                        <Link href="/contact">Get Quote</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Simple and transparent process from start to finish
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              {process.map((item, index) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                    {index < process.length - 1 && (
                      <div className="ml-6 mt-4 h-8 w-0.5 bg-border" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Project?</h2>
              <p className="mb-8 text-lg opacity-90">
                Let's discuss your blockchain needs and create something amazing together.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/portfolio">View Portfolio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
