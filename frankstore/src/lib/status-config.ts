export const orderStatusConfig = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  procesando: { label: "Procesando", color: "bg-blue-100 text-blue-700" },
  enviado: { label: "Enviado", color: "bg-purple-100 text-purple-700" },
  entregado: { label: "Entregado", color: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" },
}

export const paymentStatusConfig = {
  completado: { label: "Completado", color: "bg-green-100 text-green-700" },
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  fallido: { label: "Fallido", color: "bg-red-100 text-red-700" },
  reembolsado: { label: "Reembolsado", color: "bg-blue-100 text-blue-700" },
}

export const userStatusConfig = {
  activo: { label: "Activo", color: "bg-green-100 text-green-700" },
  inactivo: { label: "Inactivo", color: "bg-red-100 text-red-700" },
}

export type OrderStatus = keyof typeof orderStatusConfig
export type PaymentStatus = keyof typeof paymentStatusConfig
export type UserStatus = keyof typeof userStatusConfig