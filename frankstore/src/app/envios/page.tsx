import type { Metadata } from "next"
import { Container } from "@/components/container"

export const metadata: Metadata = {
  title: "Envíos",
  description: "Información de envíos de FrankStore. Hacemos envíos a toda Argentina desde Córdoba Capital.",
}

export default function EnviosPage() {
  return (
    <Container py={12} className="max-w-3xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Envíos</h1>
          <p className="mt-2 text-muted-foreground">Información sobre nuestros envíos</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Tiempos de entrega</h2>
            <p className="mt-2 text-muted-foreground">
              Realizamos envíos a toda Argentina. Los tiempos de entrega varían entre 3 y 7 días hábiles
              dependiendo de la ubicación, con cobertura especial en Córdoba Capital.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Costo de envío</h2>
            <p className="mt-2 text-muted-foreground">
              Envío gratis en compras superiores a $150.000 ARS. Para compras menores, el costo se calcula
              al momento del checkout según tu dirección.
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
