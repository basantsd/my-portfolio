import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import { NewsletterForm } from "@/components/forms/newsletter-form"

const footerLinks = {
  product: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services", href: "/services" },
    { label: "Courses", href: "/courses" },
    { label: "Blog", href: "/blog" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  social: [
    { label: "GitHub", href: "https://github.com/basantsd", icon: Github },
    { label: "Twitter", href: "https://twitter.com/basantsd", icon: Twitter },
    { label: "LinkedIn", href: "https://linkedin.com/in/basantsd", icon: Linkedin },
    { label: "Email", href: "mailto:contact@basantsd.com", icon: Mail },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BasantSD
            </h3>
            <p className="text-sm text-muted-foreground">
              Blockchain Developer & Smart Contract Engineer
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get the latest updates and insights.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Basant Singh Dobal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
