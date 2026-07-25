import type { Metadata } from "next"
import { Container } from "@/components/container"

export const metadata: Metadata = {
  title: "Devoluciones",
  description: "Política de devoluciones y cambios de FrankStore. 30 días para devoluciones en Córdoba, Argentina.",
}

export default function DevolucionesPage() {
  return (
    <Container py={12} className="max-w-3xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devoluciones</h1>
          <p className="mt-2 text-muted-foreground">Política de devoluciones y cambios</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Plazo de devolución</h2>
            <p className="mt-2 text-muted-foreground">
              Aceptamos devoluciones hasta 30 días después de recibido el producto. El artículo debe estar
              en su estado original, sin usar y con todas las etiquetas puestas.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Proceso</h2>
            <p className="mt-2 text-muted-foreground">
              Contáctanos vía WhatsApp o email para iniciar el proceso. Te enviaremos una guía de devolución
              y procesaremos el reembolso una vez recibamos el producto.
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
