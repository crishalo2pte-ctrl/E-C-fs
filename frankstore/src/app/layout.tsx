import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { JsonLd } from "@/components/json-ld"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frankstore.com.ar"

export const metadata: Metadata = {
  title: {
    default: "FrankStore — Moda Consciente en Córdoba, Argentina",
    template: "%s — FrankStore",
  },
  description:
    "Descubrí piezas únicas de ropa y accesorios en FrankStore. Moda consciente con estilo único. Envíos a toda Argentina. Ubicados en Córdoba Capital.",
  keywords: [
    "ropa", "moda", "Córdoba", "Argentina", "FrankStore", "indumentaria",
    "accesorios", "moda consciente", "ropa de calidad", "tienda online Argentina",
    "ecommerce Córdoba",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "FrankStore",
    title: "FrankStore — Moda Consciente en Córdoba, Argentina",
    description:
      "Descubrí piezas únicas de ropa y accesorios. Moda consciente con estilo único en Córdoba Capital.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "FrankStore — Moda Consciente",
    description:
      "Descubrí piezas únicas de ropa y accesorios. Moda consciente con estilo único.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111111" />
        <meta name="geo.region" content="AR-X" />
        <meta name="geo.placename" content="Córdoba" />
        <meta name="geo.position" content="-31.4201;-64.1888" />
        <meta name="ICBM" content="-31.4201, -64.1888" />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <JsonLd />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
