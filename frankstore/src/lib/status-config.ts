export const orderStatusConfig = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  confirmada: { label: "Confirmada", color: "bg-blue-100 text-blue-700" },
  enviada: { label: "Enviada", color: "bg-purple-100 text-purple-700" },
  entregada: { label: "Entregada", color: "bg-green-100 text-green-700" },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-700" },
}

export const paymentStatusConfig = {
  completado: { label: "Completado", color: "bg-green-100 text-green-700" },
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  fallido: { label: "Fallido", color: "bg-red-100 text-red-700" },
  reembolsado: { label: "Reembolsado", color: "bg-blue-100 text-blue-700" },
}

export const userStatusConfig = {
  activo: { label: "Activo", color: "bg-green-100 text-green-700" },
  bloqueado: { label: "Bloqueado", color: "bg-red-100 text-red-700" },
}

export type OrderStatus = keyof typeof orderStatusConfig
export type PaymentStatus = keyof typeof paymentStatusConfig
export type UserStatus = keyof typeof userStatusConfig