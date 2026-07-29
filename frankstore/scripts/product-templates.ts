type ProductCategory = "cat_ropa" | "cat_imperdibles" | "cat_destacada" | "cat_mas-vendidos"

interface ProductTypeConfig {
  category: ProductCategory
  basePrice: number
  displayName?: string
  template: (kw: ExtractedKeywords) => string
}

export interface ExtractedKeywords {
  type: string | null
  typeName: string
  color: string | null
  brand: string | null
  features: string[]
  extras: string[]
}

const TYPES: Record<string, ProductTypeConfig> = {
  zapatillas: {
    category: "cat_mas-vendidos",
    basePrice: 165000,
    displayName: "Zapatillas",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const brand = kw.brand ? ` de la marca ${kw.brand}` : ""
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Zapatillas${brand} en color ${color}${extras} Diseño aerodinámico, upper de malla ultraligera, suela de espuma EVA con amortiguación responsive. Ideales para running y uso diario con máximo confort.`
    },
  },
  zapatilla: {
    category: "cat_mas-vendidos",
    basePrice: 165000,
    displayName: "Zapatilla",
    template: (kw) => TYPES.zapatillas.template(kw),
  },
  zapato: {
    category: "cat_mas-vendidos",
    basePrice: 160000,
    displayName: "Zapato",
    template: (kw) => TYPES.zapatillas.template(kw),
  },
  buzo: {
    category: "cat_ropa",
    basePrice: 89000,
    displayName: "Buzo",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Buzo ${color} de algodón premium 350gsm${extras} Corte regular, capucha forrada, bolsillo canguro, cierre metálico de alta calidad. Ideal para el día a día con estilo urbano.`
    },
  },
  poleron: {
    category: "cat_ropa",
    basePrice: 110000,
    displayName: "Polerón",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Polerón ${color} de tejido de punto grueso${extras} Cierre frontal completo, cuello alto, puños elásticos. Diseño minimalista versátil para combinar con cualquier outfit.`
    },
  },
  camisa: {
    category: "cat_ropa",
    basePrice: 79900,
    displayName: "Camisa",
    template: (kw) => {
      const color = kw.color ?? "clásica"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Camisa ${color} de lino 100% natural${extras} Fresca, transpirable y perfecta para el clima. Corte moderno con botones de alta calidad.`
    },
  },
  camiseta: {
    category: "cat_ropa",
    basePrice: 35900,
    displayName: "Camiseta",
    template: (kw) => {
      const color = kw.color ?? "clásica"
      const brand = kw.brand ? ` ${kw.brand}` : ""
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Camiseta${brand} ${color} de algodón orgánico 160gsm${extras} Corte regular, cuello redondo reforzado. Prenda esencial para cualquier guardarropa.`
    },
  },
  remera: {
    category: "cat_ropa",
    basePrice: 35900,
    displayName: "Remera",
    template: (kw) => TYPES.camiseta.template(kw),
  },
  pantalon: {
    category: "cat_ropa",
    basePrice: 99900,
    displayName: "Pantalón",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Pantalón ${color} de gabardina stretch${extras} Corte moderno, bolsillos funcionales. Funciona para oficina y ocasiones casuales.`
    },
  },
  jeans: {
    category: "cat_ropa",
    basePrice: 119900,
    displayName: "Jeans",
    template: (kw) => {
      const color = kw.color ?? "azul"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Jeans ${color} de algodón stretch con corte moderno${extras} Comodidad y estilo en una sola prenda.`
    },
  },
  vestido: {
    category: "cat_ropa",
    basePrice: 109900,
    displayName: "Vestido",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Vestido ${color} corte recto, largo midi${extras} Tejido de alta calidad que no se arruga. Elegancia y comodidad para cualquier ocasión.`
    },
  },
  falda: {
    category: "cat_ropa",
    basePrice: 89900,
    displayName: "Falda",
    template: (kw) => {
      const color = kw.color ?? "clásica"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Falda ${color} de viscosa con caída fluida${extras} Cintura elástica y bolsillos laterales.`
    },
  },
  chaqueta: {
    category: "cat_ropa",
    basePrice: 149900,
    displayName: "Chaqueta",
    template: (kw) => {
      const color = kw.color ?? "clásica"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Chaqueta ${color} de alta calidad${extras} Corte moderno, cierre frontal, bolsillos funcionales. Ideal para media temporada.`
    },
  },
  abrigo: {
    category: "cat_destacada",
    basePrice: 249900,
    displayName: "Abrigo",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Abrigo ${color} de lana de alta calidad${extras} Corte oversize, cuello solapa, bolsillos ocultos. Prenda estrella para la temporada de frío.`
    },
  },
  traje: {
    category: "cat_destacada",
    basePrice: 299900,
    displayName: "Traje",
    template: (kw) => {
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Traje de alta calidad${extras} Corte moderno, forro completo, pantalón sin pinzas. Perfecto para ocasiones especiales.`
    },
  },
  hoodie: {
    category: "cat_mas-vendidos",
    basePrice: 129900,
    displayName: "Hoodie",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Hoodie ${color} de algodón 350gsm felpa interior${extras} Capucha forrada, bolsillo canguro, puños acanalados.`
    },
  },
  sueter: {
    category: "cat_ropa",
    basePrice: 89900,
    displayName: "Suéter",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Suéter ${color} de punto medio${extras} Cuello redondo, puños y bajo acanalados.`
    },
  },
  cuchillo: {
    category: "cat_imperdibles",
    basePrice: 95000,
    displayName: "Cuchillo",
    template: (kw) => {
      const color = kw.color ?? "plateado"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Cuchillo ${color} de alta calidad${extras} Acero inoxidable con filo preciso. Mango ergonómico antideslizante. Ideal para cocina y uso profesional.`
    },
  },
  cuchillos: {
    category: "cat_imperdibles",
    basePrice: 95000,
    displayName: "Cuchillo",
    template: (kw) => TYPES.cuchillo.template(kw),
  },
  herramientas: {
    category: "cat_imperdibles",
    basePrice: 75000,
    displayName: "Kit de Herramientas",
    template: (kw) => {
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : ""
      return `Kit completo de herramientas${extras}. Incluye múltiples funciones en un solo dispositivo. Acero inoxidable de alta resistencia. Imprescindible para cualquier emergencia o proyecto.`
    },
  },
  kit: {
    category: "cat_imperdibles",
    basePrice: 75000,
    displayName: "Kit",
    template: (kw) => TYPES.herramientas.template(kw),
  },
  taladro: {
    category: "cat_destacada",
    basePrice: 220000,
    displayName: "Taladro",
    template: (kw) => {
      const color = kw.color ?? "profesional"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Taladro ${color} de alta potencia${extras} Motor potente, velocidades variables, mandril autoblocante. Incluye accesorios y maletín de transporte.`
    },
  },
  dron: {
    category: "cat_imperdibles",
    basePrice: 850000,
    displayName: "Dron",
    template: (kw) => {
      const color = kw.color ?? "profesional"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Dron ${color} con cámara de alta resolución${extras} Estabilización avanzada, GPS, vuelo autónomo. Incluye control remoto y maletín de transporte.`
    },
  },
  mochila: {
    category: "cat_mas-vendidos",
    basePrice: 89900,
    displayName: "Mochila",
    template: (kw) => {
      const color = kw.color ?? "clásica"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Mochila ${color} resistente al agua${extras} Compartimento para laptop, organizador interno, bolsillos laterales. Ideal para uso diario y viajes.`
    },
  },
  gorra: {
    category: "cat_mas-vendidos",
    basePrice: 49900,
    displayName: "Gorra",
    template: (kw) => {
      const color = kw.color ?? "clásica"
      const brand = kw.brand ? ` ${kw.brand}` : ""
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Gorra${brand} ${color} de alta calidad${extras} 6 paneles, visera plana, cierre ajustable. Bordado frontal de alta definición.`
    },
  },
  collar: {
    category: "cat_mas-vendidos",
    basePrice: 39900,
    displayName: "Collar",
    template: (kw) => {
      const color = kw.color ?? "plateado"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Collar ${color} de acero inoxidable${extras} Diseño moderno y elegante. Hipoalergénico, resistente al agua y al desgaste diario.`
    },
  },
  chain: {
    category: "cat_mas-vendidos",
    basePrice: 39900,
    displayName: "Chain",
    template: (kw) => TYPES.collar.template(kw),
  },
  necklace: {
    category: "cat_mas-vendidos",
    basePrice: 39900,
    displayName: "Necklace",
    template: (kw) => TYPES.collar.template(kw),
  },
  conjunto: {
    category: "cat_destacada",
    basePrice: 199900,
    displayName: "Conjunto",
    template: (kw) => {
      const color = kw.color ?? "clásico"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Conjunto ${color} de alta calidad${extras} Incluye dos prendas coordinadas. Tejido premium, diseño moderno y cómodo.`
    },
  },
  bermudas: {
    category: "cat_ropa",
    basePrice: 69900,
    displayName: "Bermudas",
    template: (kw) => {
      const color = kw.color ?? "clásicas"
      const extras = kw.extras.length > 0 ? ` ${kw.extras.join(" ")}.` : "."
      return `Bermudas ${color} de gabardina stretch${extras} Largo a la rodilla, bolsillos funcionales, cintura ajustable.`
    },
  },
}

const COLOR_MAP: Record<string, string> = {
  negro: "Negro",
  neegro: "Negro",
  negra: "Negro",
  negras: "Negro",
  negros: "Negro",
  blanco: "Blanco",
  blanca: "Blanco",
  blancas: "Blanco",
  blancos: "Blanco",
  gris: "Gris",
  grises: "Gris",
  naranja: "Naranja",
  naranjas: "Naranja",
  azul: "Azul",
  azules: "Azul",
  rojo: "Rojo",
  roja: "Rojo",
  rojas: "Rojo",
  rojos: "Rojo",
  verde: "Verde",
  verdes: "Verde",
  amarillo: "Amarillo",
  amarilla: "Amarillo",
  amarillas: "Amarillo",
  amarillos: "Amarillo",
  oro: "Oro",
  gold: "Oro",
  dorado: "Oro",
  dorada: "Oro",
  plateado: "Plateado",
  plateada: "Plateado",
  silver: "Plateado",
  marron: "Marrón",
  marrones: "Marrón",
  rosa: "Rosa",
  rosas: "Rosa",
  violeta: "Violeta",
  violetas: "Violeta",
  celeste: "Celeste",
  celestes: "Celeste",
  beige: "Beige",
  coral: "Coral",
  mostaza: "Mostaza",
  lila: "Lila",
  lilas: "Lila",
  crema: "Crema",
  cremas: "Crema",
  bordo: "Burdeos",
  borgoña: "Burdeos",
  cafe: "Marrón",
  cafs: "Marrón",
}

const BRAND_MAP: Record<string, string> = {
  adidas: "Adidas",
  nike: "Nike",
  puma: "Puma",
  reebok: "Reebok",
  frank: "FrankStore",
}

const STOP_WORDS = new Set([
  "de", "la", "el", "en", "con", "y", "a", "del", "las", "los",
  "un", "una", "para", "por", "que", "es", "se", "su", "lo",
  "como", "más", "pero", "sus", "le", "ya", "este", "entre",
])

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[áäàâã]/g, "a")
    .replace(/[éëèêẽ]/g, "e")
    .replace(/[íïìîĩ]/g, "i")
    .replace(/[óöòôõ]/g, "o")
    .replace(/[úüùûũ]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9]/g, "")
}

function stripExtensions(filename: string): string {
  let name = filename
  while (/\.(jpe?g|png)$/i.test(name)) {
    name = name.replace(/\.(jpe?g|png)$/i, "")
  }
  return name
}

export function extractKeywords(filename: string): ExtractedKeywords {
  const nameWithoutExt = stripExtensions(filename)

  const words = nameWithoutExt
    .split(/[\s_-]+/)
    .map(normalizeWord)
    .filter((w) => w.length > 0)

  const filtered = words.filter((w) => !STOP_WORDS.has(w))

  let type: string | null = null
  let color: string | null = null
  let brand: string | null = null
  const extrasRaw: string[] = []

  for (const word of filtered) {
    if (TYPES[word]) {
      if (!type || word.length > type.length) {
        type = word
      }
      continue
    }
    if (!color && COLOR_MAP[word]) {
      color = COLOR_MAP[word]
      continue
    }
    if (!brand && BRAND_MAP[word]) {
      brand = BRAND_MAP[word]
      continue
    }
    extrasRaw.push(word)
  }

  const extras: string[] = []
  const hasModeloNumber = extrasRaw.some((w) => /^\d+$/.test(w))
  for (const w of extrasRaw) {
    if (/^\d+$/.test(w)) {
      extras.push(`modelo ${w}`)
    } else if (hasModeloNumber && w === "modelo") {
      continue
    } else {
      extras.push(w.charAt(0).toUpperCase() + w.slice(1))
    }
  }

  const typeName = type && TYPES[type]?.displayName
    ? TYPES[type].displayName!
    : type
      ? type.charAt(0).toUpperCase() + type.slice(1)
      : "Producto"

  return { type, typeName, color, brand, features: [], extras }
}

export function generateProductName(kw: ExtractedKeywords): string {
  const parts: string[] = [kw.typeName]

  if (kw.brand) parts.push(kw.brand)
  if (kw.color) parts.push(kw.color)

  for (const e of kw.extras) {
    if (!parts.includes(e)) parts.push(e)
  }

  return parts.join(" ")
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áäàâã]/g, "a")
    .replace(/[éëèêẽ]/g, "e")
    .replace(/[íïìîĩ]/g, "i")
    .replace(/[óöòôõ]/g, "o")
    .replace(/[úüùûũ]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function generateProductData(
  filename: string
): {
  name: string
  slug: string
  description: string
  price: number
  categoryId: string
  featured: boolean
  bestSeller: boolean
} | null {
  const nameWithoutExt = stripExtensions(filename)

  if (/^\d+$/.test(nameWithoutExt)) {
    return null
  }

  const kw = extractKeywords(filename)

  if (!kw.type) {
    return null
  }

  const name = generateProductName(kw)
  const slug = generateSlug(name)

  const config = TYPES[kw.type!]
  const description = config.template(kw)

  return {
    name,
    slug,
    description,
    price: config.basePrice,
    categoryId: config.category,
    featured: false,
    bestSeller: false,
  }
}
