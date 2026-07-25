"use client"

import { useState } from "react"
import { Eye, Download, Truck, ChevronDown, ChevronUp, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useOrders } from "@/hooks/use-orders"
import type { Order } from "@/lib/profile-data"
import { formatARS } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"
import { OrdersSkeleton, Skeleton } from "@/components/skeletons"

export default function OrdersPage() {
  const { orders, isLoading } = useOrders()
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = orders.filter(
    (o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <OrdersSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mis Pedidos</h1>
        <p className="text-muted-foreground">Historial completo de tus pedidos</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por numero o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Metodo Pago</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-mono text-sm font-medium">{order.number}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="font-semibold">{formatARS(order.total)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {order.status === "enviado" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3 p-4">
            {filtered.map((order) => (
              <div key={order.id} className="rounded-xl border bg-white p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div>
                    <p className="font-mono text-sm font-medium">{order.number}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    {expandedId === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
                {expandedId === order.id && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                        <span>{formatARS(item.price)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatARS(order.total)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" className="rounded-full flex-1" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>Ver</span>
                        </span>
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full flex-1">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>Factura</span>
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={(o) => !o && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido</DialogTitle>
            <DialogDescription>{selectedOrder?.number}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="text-sm font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Metodo de Pago</p>
                  <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Envio a</p>
                  <p className="text-sm">{selectedOrder.address}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Productos</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatARS(item.price)}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatARS(selectedOrder.total)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full">
                  <Download className="mr-1 h-4 w-4" /> Descargar Factura
                </Button>
                {selectedOrder.status === "enviado" && (
                  <Button variant="outline" className="flex-1 rounded-full">
                    <Truck className="mr-1 h-4 w-4" /> Seguir Envio
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
