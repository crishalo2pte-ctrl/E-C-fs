const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frankstore.com.ar"

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "FrankStore",
    url: siteUrl,
    description: "Moda consciente con estilo único. Ropa y accesorios de calidad en Córdoba, Argentina.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Córdoba",
      addressRegion: "Córdoba",
      addressCountry: "AR",
    },
    telephone: "+54 9 3517 58-0449",
    currencyAccepted: "ARS",
    paymentAccepted: ["Mercado Pago", "Transferencia bancaria", "Rapipago"],
    areaServed: "Argentina",
    sameAs: [
      "https://www.instagram.com/frankstore",
      "https://www.facebook.com/frankstore",
      "https://www.tiktok.com/@frankstore",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  )
}
