import type { Metadata } from "next"
import { Container } from "@/components/container"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Resolvé tus dudas sobre FrankStore: métodos de pago, envíos, cambios y más.",
}

const faqs = [
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos Mercado Pago (tarjetas de crédito/débito) y transferencia bancaria.",
  },
  {
    q: "¿Cómo puedo hacer un seguimiento de mi pedido?",
    a: "Una vez enviado tu pedido, recibirás un número de guía por WhatsApp para rastrearlo.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, realizamos envíos a toda Argentina con cobertura nacional.",
  },
  {
    q: "¿Puedo cambiar mi pedido después de comprar?",
    a: "Sí, contáctanos dentro de las primeras 24 horas después de la compra para realizar cambios.",
  },
]

export default function FAQPage() {
  return (
    <Container py={12} className="max-w-3xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preguntas Frecuentes</h1>
          <p className="mt-2 text-muted-foreground">Resolvemos tus dudas</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
