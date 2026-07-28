export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  orders: number
  totalSpent: number
  joined: string
  status: "activo" | "bloqueado"
}

export interface Payment {
  id: string
  transactionId: string
  user: string
  email: string
  amount: number
  method: "Tarjeta" | "Transferencia" | "Rapipago" | "Mercado Pago"
  status: "completado" | "pendiente" | "fallido" | "reembolsado"
  date: string
  product: string
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "María García", email: "maria@email.com", role: "user", orders: 12, totalSpent: 1_289.5, joined: "15 Ene 2026", status: "activo" },
  { id: "u2", name: "Carlos López", email: "carlos@email.com", role: "user", orders: 8, totalSpent: 879.2, joined: "3 Feb 2026", status: "activo" },
  { id: "u3", name: "Ana Martínez", email: "ana@email.com", role: "user", orders: 3, totalSpent: 249.7, joined: "20 Mar 2026", status: "activo" },
  { id: "u4", name: "Pedro Rodríguez", email: "pedro@email.com", role: "user", orders: 0, totalSpent: 0, joined: "10 Abr 2026", status: "bloqueado" },
  { id: "u5", name: "Laura Sánchez", email: "laura@email.com", role: "user", orders: 5, totalSpent: 459.8, joined: "5 May 2026", status: "activo" },
  { id: "u6", name: "Diego Ramírez", email: "diego@email.com", role: "admin", orders: 0, totalSpent: 0, joined: "1 Ene 2026", status: "activo" },
  { id: "u7", name: "Valentina Torres", email: "valentina@email.com", role: "user", orders: 15, totalSpent: 1_890.0, joined: "12 Ene 2026", status: "activo" },
  { id: "u8", name: "Santiago Herrera", email: "santiago@email.com", role: "user", orders: 2, totalSpent: 179.8, joined: "28 Jun 2026", status: "activo" },
]

export const payments: Payment[] = [
  { id: "p1", transactionId: "TXN-001", user: "María García", email: "maria@email.com", amount: 79.9, method: "Tarjeta", status: "completado", date: "15 Jul 2026", product: "Camisa Linen Classic" },
  { id: "p2", transactionId: "TXN-002", user: "Carlos López", email: "carlos@email.com", amount: 149.9, method: "Mercado Pago", status: "completado", date: "14 Jul 2026", product: "Chaqueta Denim Clásica" },
  { id: "p3", transactionId: "TXN-003", user: "Ana Martínez", email: "ana@email.com", amount: 299.9, method: "Tarjeta", status: "pendiente", date: "13 Jul 2026", product: "Traje Elegante Premium" },
  { id: "p4", transactionId: "TXN-004", user: "Valentina Torres", email: "valentina@email.com", amount: 119.9, method: "Transferencia", status: "completado", date: "12 Jul 2026", product: "Jeans Slim Fit Premium" },
  { id: "p5", transactionId: "TXN-005", user: "Laura Sánchez", email: "laura@email.com", amount: 179.9, method: "Rapipago", status: "fallido", date: "11 Jul 2026", product: "Vestido Floral Exclusivo" },
  { id: "p6", transactionId: "TXN-006", user: "Santiago Herrera", email: "santiago@email.com", amount: 249.9, method: "Tarjeta", status: "completado", date: "10 Jul 2026", product: "Abrigo Invierno Designer" },
  { id: "p7", transactionId: "TXN-007", user: "María García", email: "maria@email.com", amount: 49.9, method: "Mercado Pago", status: "reembolsado", date: "9 Jul 2026", product: "Gorra Snapback Frank" },
  { id: "p8", transactionId: "TXN-008", user: "Valentina Torres", email: "valentina@email.com", amount: 89.9, method: "Tarjeta", status: "completado", date: "8 Jul 2026", product: "Suéter Gris Comfort" },
  { id: "p9", transactionId: "TXN-009", user: "Carlos López", email: "carlos@email.com", amount: 349.8, method: "Transferencia", status: "pendiente", date: "7 Jul 2026", product: "Traje Elegante Premium + Gorra Snapback Frank" },
  { id: "p10", transactionId: "TXN-010", user: "Laura Sánchez", email: "laura@email.com", amount: 199.8, method: "Rapipago", status: "completado", date: "6 Jul 2026", product: "Camisa Linen Classic + Jeans Slim Fit Premium" },
]
