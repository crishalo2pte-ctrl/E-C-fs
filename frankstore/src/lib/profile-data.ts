export interface UserProfile {
  id: string
  name: string
  lastName: string
  email: string
  phone: string
  avatar: string
  level: "Premium" | "Gold" | "Silver"
  registeredAt: string
  birthDate: string
}

export interface Order {
  id: string
  number: string
  date: string
  status: "pendiente" | "confirmada" | "enviada" | "entregada" | "cancelada"
  total: number
  paymentMethod: string
  items: { name: string; quantity: number; price: number }[]
  address: string
}

export interface Address {
  id: string
  name: string
  city: string
  department: string
  postalCode: string
  phone: string
  street: string
  isDefault: boolean
}

export interface Favorite {
  id: string
  name: string
  price: number
  image: string
  inStock: boolean
  slug: string
  category: string
}

export const profileData: UserProfile = {
  id: "usr_001",
  name: "Diego",
  lastName: "Ramírez",
  email: "diego@frankstore.com.ar",
  phone: "+54 351 456 7890",
  avatar: "",
  level: "Premium",
  registeredAt: "1 Ene 2026",
  birthDate: "15/06/1992",
}

export const ordersData: Order[] = [
  {
    id: "o1",
    number: "FS-2026-001",
    date: "15 Jul 2026",
    status: "entregada",
    total: 199.8,
    paymentMethod: "Tarjeta •••• 4242",
    address: "Av. Colón 1234, Córdoba",
    items: [
      { name: "Camisa Linen Classic", quantity: 1, price: 79.9 },
      { name: "Jeans Slim Fit Premium", quantity: 1, price: 119.9 },
    ],
  },
  {
    id: "o2",
    number: "FS-2026-002",
    date: "10 Jul 2026",
    status: "enviada",
    total: 149.9,
    paymentMethod: "Mercado Pago •••• 7890",
    address: "San Martín 567, Buenos Aires",
    items: [
      { name: "Chaqueta Denim Clásica", quantity: 1, price: 149.9 },
    ],
  },
  {
    id: "o3",
    number: "FS-2026-003",
    date: "5 Jul 2026",
    status: "confirmada",
    total: 349.8,
    paymentMethod: "Tarjeta •••• 4242",
    address: "Av. Colón 1234, Córdoba",
    items: [
      { name: "Traje Elegante Premium", quantity: 1, price: 299.9 },
      { name: "Gorra Snapback Frank", quantity: 1, price: 49.9 },
    ],
  },
  {
    id: "o4",
    number: "FS-2026-004",
    date: "28 Jun 2026",
    status: "entregada",
    total: 249.9,
    paymentMethod: "Rapipago",
    address: "San Martín 567, Buenos Aires",
    items: [
      { name: "Abrigo Invierno Designer", quantity: 1, price: 249.9 },
    ],
  },
  {
    id: "o5",
    number: "FS-2026-005",
    date: "20 Jun 2026",
    status: "cancelada",
    total: 179.9,
    paymentMethod: "Tarjeta •••• 4242",
    address: "Av. Colón 1234, Córdoba",
    items: [
      { name: "Vestido Floral Exclusivo", quantity: 1, price: 179.9 },
    ],
  },
  {
    id: "o6",
    number: "FS-2026-006",
    date: "15 Jun 2026",
    status: "entregada",
    total: 89.9,
    paymentMethod: "Mercado Pago •••• 7890",
    address: "San Martín 567, Buenos Aires",
    items: [
      { name: "Suéter Gris Comfort", quantity: 1, price: 89.9 },
    ],
  },
]

export const addressesData: Address[] = [
  {
    id: "a1",
    name: "Casa Principal",
    street: "Av. Colón 1234, Piso 4",
    city: "Córdoba",
    department: "Córdoba",
    postalCode: "X5000",
    phone: "+54 351 456 7890",
    isDefault: true,
  },
  {
    id: "a2",
    name: "Oficina",
    street: "Av. Hipólito Yrigoyen 567, Piso 8",
    city: "Córdoba",
    department: "Córdoba",
    postalCode: "X5002",
    phone: "+54 351 987 6543",
    isDefault: false,
  },
  {
    id: "a3",
    name: "Departamento Bs As",
    street: "Av. Santa Fe 2345",
    city: "Buenos Aires",
    department: "CABA",
    postalCode: "C1425",
    phone: "+54 11 2345 6789",
    isDefault: false,
  },
]

export const favoritesData: Favorite[] = [
  { id: "f1", name: "Camisa Linen Classic", price: 79.9, image: "/images/product-1.jpg", inStock: true, slug: "camisa-linen-classic", category: "Ropa" },
  { id: "f2", name: "Chaqueta Denim Clásica", price: 149.9, image: "/images/product-8.jpg", inStock: true, slug: "chaqueta-denim-clasica", category: "Imperdibles" },
  { id: "f3", name: "Traje Elegante Premium", price: 299.9, image: "/images/product-11.jpg", inStock: true, slug: "traje-elegante-premium", category: "Colección Destacada" },
  { id: "f4", name: "Gorra Snapback Frank", price: 49.9, image: "/images/product-18.jpg", inStock: true, slug: "gorra-snapback-frank", category: "Más Vendidos" },
  { id: "f5", name: "Jeans Slim Fit Premium", price: 119.9, image: "/images/product-2.jpg", inStock: true, slug: "jeans-slim-fit-premium", category: "Ropa" },
  { id: "f6", name: "Abrigo Invierno Designer", price: 249.9, image: "/images/product-15.jpg", inStock: true, slug: "abrigo-invierno-designer", category: "Colección Destacada" },
]
