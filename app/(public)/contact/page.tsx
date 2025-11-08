import { ContactForm } from "@/components/forms/contact-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">
          Have a project in mind? Let's discuss how we can work together.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <ContactForm />

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Feel free to reach out through any of these channels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:contact@basantsd.com"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    contact@basantsd.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+1234567890"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    Remote / Available Worldwide
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Office Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
