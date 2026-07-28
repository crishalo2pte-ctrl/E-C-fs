import { TrendingUp, Package, CreditCard, Users } from "lucide-react"

export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatARS } from "@/lib/format"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const [productCount, paymentData, activeUsers, recentPayments, recentUsers] = await Promise.all([
    prisma.product.count(),
    prisma.payment.findMany({ include: { user: true }, orderBy: { date: "desc" } }),
    prisma.user.count({ where: { status: "activo" } }),
    prisma.payment.findMany({
      include: { user: true },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const totalRevenue = paymentData
    .filter((p) => p.status === "completado")
    .reduce((sum, p) => sum + p.amount, 0)
  const totalOrders = paymentData.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de FrankStore</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatARS(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">Pagos completados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{productCount}</p>
            <p className="text-xs text-muted-foreground">En catálogo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-xs text-muted-foreground">Total transacciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeUsers}</p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimos Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.user.name} {p.user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{p.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatARS(p.amount)}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      p.status === "completado" ? "bg-green-100 text-green-700" :
                      p.status === "pendiente" ? "bg-yellow-100 text-yellow-700" :
                      p.status === "fallido" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usuarios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name} {u.lastName}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    u.status === "activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
