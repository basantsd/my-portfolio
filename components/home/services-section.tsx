import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Blocks, Rocket, Shield } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Smart Contract Development",
    description: "Custom smart contract development for ERC20, ERC721, ERC1155 tokens, DeFi protocols, and complex blockchain solutions.",
  },
  {
    icon: Blocks,
    title: "DApp Development",
    description: "Full-stack decentralized application development with modern frameworks and seamless Web3 integration.",
  },
  {
    icon: Shield,
    title: "Smart Contract Auditing",
    description: "Comprehensive security audits to identify vulnerabilities and ensure your contracts are production-ready.",
  },
  {
    icon: Rocket,
    title: "Blockchain Consulting",
    description: "Strategic guidance on blockchain architecture, tokenomics, and implementation best practices.",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Services I Offer
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive blockchain solutions tailored to your needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
