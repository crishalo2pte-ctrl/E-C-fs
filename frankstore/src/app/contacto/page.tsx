import type { Metadata } from "next"
import { Container } from "@/components/container"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Comunicate con FrankStore. WhatsApp, email y ubicación en Córdoba Capital, Argentina.",
}

export default function ContactoPage() {
  return (
    <Container py={12} className="max-w-3xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacto</h1>
          <p className="mt-2 text-muted-foreground">Estamos aquí para ayudarte</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center">
            <Phone className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">WhatsApp</h3>
            <a
              href="https://wa.me/5493517580449"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              +54 9 3517 58-0449
            </a>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center">
            <Mail className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">Email</h3>
            <a
              href="mailto:hola@frankstore.com"
              className="mt-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              hola@frankstore.com
            </a>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center">
            <MapPin className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">Ubicación</h3>
            <p className="mt-1 text-sm text-muted-foreground">Córdoba, Argentina</p>
          </div>
        </div>
      </div>
    </Container>
  )
}
