import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  const skills = [
    "Solidity Smart Contracts",
    "Ethereum & EVM Chains",
    "DeFi Protocols",
    "NFT Development",
    "Web3.js & Ethers.js",
    "React & Next.js",
    "TypeScript",
    "Node.js",
    "Hardhat & Foundry",
    "Security Auditing",
  ]

  const experience = [
    {
      title: "Senior Blockchain Developer",
      company: "Web3 Innovations",
      period: "2022 - Present",
      description: "Lead developer for DeFi protocols and NFT marketplaces",
    },
    {
      title: "Smart Contract Engineer",
      company: "CryptoTech Solutions",
      period: "2020 - 2022",
      description: "Developed and audited smart contracts for various blockchain projects",
    },
    {
      title: "Full Stack Developer",
      company: "Tech Startup",
      period: "2018 - 2020",
      description: "Built full-stack applications with modern web technologies",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="mb-4 text-4xl font-bold">About Me</h1>
        <div className="max-w-3xl">
          <p className="mb-4 text-lg text-muted-foreground">
            I'm Basant Singh Dobal, a passionate blockchain developer with over 5 years
            of experience in building decentralized applications and smart contracts.
          </p>
          <p className="mb-4 text-lg text-muted-foreground">
            My journey in blockchain started with Bitcoin's whitepaper, and since then,
            I've been fascinated by the potential of decentralized technologies to
            transform industries and empower individuals.
          </p>
          <p className="text-lg text-muted-foreground">
            I specialize in Ethereum and EVM-compatible chains, with deep expertise in
            Solidity, DeFi protocols, NFT standards, and Web3 integration. I'm committed
            to writing secure, gas-optimized, and well-tested smart contracts.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-4 py-2 text-base">
              <CheckCircle className="mr-2 h-4 w-4" />
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Experience</h2>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-primary">{exp.company}</p>
                  </div>
                  <Badge variant="outline">{exp.period}</Badge>
                </div>
                <p className="mt-2 text-muted-foreground">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Education & Certifications */}
      <section>
        <h2 className="mb-6 text-3xl font-bold">Education & Certifications</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">B.Tech in Computer Science</p>
                  <p className="text-sm text-muted-foreground">University Name, 2014-2018</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Certified Blockchain Developer</p>
                  <p className="text-sm text-muted-foreground">Blockchain Council</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Smart Contract Security Auditor</p>
                  <p className="text-sm text-muted-foreground">OpenZeppelin</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
