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
  status: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado"
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
    status: "entregado",
    total: 249_800,
    paymentMethod: "Tarjeta •••• 4242",
    address: "Av. Colón 1234, Córdoba",
    items: [
      { name: "Camisa Oversize Premium", quantity: 1, price: 89_900 },
      { name: "Pantalón Relax Fit", quantity: 1, price: 109_900 },
    ],
  },
  {
    id: "o2",
    number: "FS-2026-002",
    date: "10 Jul 2026",
    status: "enviado",
    total: 159_900,
    paymentMethod: "Mercado Pago •••• 7890",
    address: "San Martín 567, Buenos Aires",
    items: [
      { name: "Chaqueta Tejida Artesanal", quantity: 1, price: 159_900 },
    ],
  },
  {
    id: "o3",
    number: "FS-2026-003",
    date: "5 Jul 2026",
    status: "procesando",
    total: 189_700,
    paymentMethod: "Tarjeta •••• 4242",
    address: "Av. Colón 1234, Córdoba",
    items: [
      { name: "Bolso de Cuero Natural", quantity: 1, price: 129_900 },
      { name: "Gorra Tejida Frank", quantity: 1, price: 39_900 },
    ],
  },
  {
    id: "o4",
    number: "FS-2026-004",
    date: "28 Jun 2026",
    status: "entregado",
    total: 119_900,
    paymentMethod: "Rapipago",
    address: "San Martín 567, Buenos Aires",
    items: [
      { name: "Saco Cardigan Premium", quantity: 1, price: 119_900 },
    ],
  },
  {
    id: "o5",
    number: "FS-2026-005",
    date: "20 Jun 2026",
    status: "cancelado",
    total: 99_900,
    paymentMethod: "Tarjeta •••• 4242",
    address: "Av. Colón 1234, Córdoba",
    items: [
      { name: "Vestido Midi Flora", quantity: 1, price: 99_900 },
    ],
  },
  {
    id: "o6",
    number: "FS-2026-006",
    date: "15 Jun 2026",
    status: "entregado",
    total: 59_900,
    paymentMethod: "Mercado Pago •••• 7890",
    address: "San Martín 567, Buenos Aires",
    items: [
      { name: "Bufanda de Lana", quantity: 1, price: 59_900 },
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
  { id: "f1", name: "Camisa Oversize Premium", price: 89_900, image: "/images/product-1.jpg", inStock: true, slug: "camisa-oversize-premium", category: "Ropa" },
  { id: "f2", name: "Chaqueta Tejida Artesanal", price: 159_900, image: "/images/product-2.jpg", inStock: true, slug: "chaqueta-tejida-artesanal", category: "Ropa" },
  { id: "f3", name: "Bolso de Cuero Natural", price: 129_900, image: "/images/product-3.jpg", inStock: true, slug: "bolso-cuero-natural", category: "Imperdibles" },
  { id: "f4", name: "Gorra Tejida Frank", price: 39_900, image: "/images/product-7.jpg", inStock: false, slug: "gorra-tejida-frank", category: "Más Vendidos" },
  { id: "f5", name: "Pantalón Relax Fit", price: 109_900, image: "/images/product-4.jpg", inStock: true, slug: "pantalon-relax-fit", category: "Ropa" },
  { id: "f6", name: "Saco Cardigan Premium", price: 119_900, image: "/images/product-6.jpg", inStock: true, slug: "saco-cardigan-premium", category: "Colección Destacada" },
]
