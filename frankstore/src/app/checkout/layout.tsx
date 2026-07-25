import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalizá tu compra en FrankStore. Completá tus datos y elegí tu método de pago.",
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
