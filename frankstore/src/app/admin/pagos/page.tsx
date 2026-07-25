"use client"

import { useState } from "react"
import { Search, ArrowUpDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatARS } from "@/lib/format"
import { useAdminPayments } from "@/hooks/use-admin-payments"

const statusColor: Record<string, string> = {
  completado: "bg-green-100 text-green-700",
  pendiente: "bg-yellow-100 text-yellow-700",
  fallido: "bg-red-100 text-red-700",
  reembolsado: "bg-blue-100 text-blue-700",
}

export default function AdminPagos() {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { payments, isLoading } = useAdminPayments()

  const filtered = payments.filter(
    (p) =>
      p.user.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.product.toLowerCase().includes(search.toLowerCase())
  )

  const selected = payments.find((p) => p.id === selectedId) ?? null

  const completedPayments = payments.filter(p => p.status === "completado")
  const totalRecaudado = completedPayments.reduce((s, p) => s + p.amount, 0)
  const completadosCount = completedPayments.length
  const pendientesCount = payments.filter(p => p.status === "pendiente").length
  const fallidosCount = payments.filter(p => p.status === "fallido").length

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="mt-1 h-4 w-64 rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
        <p className="text-muted-foreground">Historial de transacciones y pagos</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatARS(totalRecaudado)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completadosCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{pendientesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{fallidosCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar transacciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button className="flex items-center gap-1 font-medium">
                    Transacción <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(p.id)}
                >
                  <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{p.user}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{p.product}</TableCell>
                  <TableCell className="font-medium">{formatARS(p.amount)}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status] ?? ""}`}>
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del Pago</DialogTitle>
            <DialogDescription>Información completa de la transacción</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Transacción</span>
                <span className="text-sm font-mono font-medium">{selected.transactionId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Usuario</span>
                <span className="text-sm font-medium">{selected.user}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm">{selected.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Producto</span>
                <span className="text-sm font-medium">{selected.product}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Monto</span>
                <span className="text-sm font-bold">{formatARS(selected.amount)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Método</span>
                <span className="text-sm">{selected.method}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Estado</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[selected.status] ?? ""}`}>
                  {selected.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fecha</span>
                <span className="text-sm">{selected.date}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
