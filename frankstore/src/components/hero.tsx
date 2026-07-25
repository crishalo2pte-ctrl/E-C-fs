import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Nueva Colección 2026
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Estilo que
              <span className="text-primary"> define</span>
              <br />
              tu esencia
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Descubre piezas únicas diseñadas para quienes buscan autenticidad y 
              calidad en cada detalle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/catalogo">Explorar Colección</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/catalogo/ropa">Ver Ropa</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48 w-40 rounded-2xl bg-gradient-to-br from-primary to-primary/60" />
                <div className="mt-8 h-48 w-40 rounded-2xl bg-gradient-to-br from-primary/80 to-primary/40" />
                <div className="-mt-8 h-48 w-40 rounded-2xl bg-gradient-to-br from-primary/60 to-primary/20" />
                <div className="h-48 w-40 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
