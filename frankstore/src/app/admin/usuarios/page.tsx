"use client"

import { useState } from "react"
import { Search, Shield, ShieldOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatARS } from "@/lib/format"
import { useAdminUsers } from "@/hooks/use-admin-users"

export default function AdminUsuarios() {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { users, isLoading, mutate } = useAdminUsers()

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const selected = users.find((u) => u.id === selectedId) ?? null

  const toggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "PATCH" })
      if (!res.ok) throw new Error("Error al cambiar estado")
      mutate()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al cambiar estado del usuario")
    }
  }

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
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios registrados</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
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
                <TableHead>Usuario</TableHead>
                <TableHead className="hidden lg:table-cell">Rol</TableHead>
                <TableHead className="hidden lg:table-cell">Órdenes</TableHead>
                <TableHead className="hidden lg:table-cell">Total Gastado</TableHead>
                <TableHead className="hidden lg:table-cell">Registro</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow
                  key={u.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(u.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={u.role === "admin" ? "default" : "secondary"} className="rounded-full">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{u.orders}</TableCell>
                  <TableCell className="hidden lg:table-cell font-medium">
                    <span className="font-medium">{formatARS(u.totalSpent)}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{u.joined}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.status === "activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => toggleStatus(u.id, e)}
                    >
                      {u.status === "activo" ? <ShieldOff className="h-4 w-4 text-destructive" /> : <Shield className="h-4 w-4 text-green-600" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del Usuario</DialogTitle>
            <DialogDescription>Información completa del usuario</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Nombre</span>
                <span className="text-sm font-medium">{selected.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm">{selected.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Rol</span>
                <Badge variant={selected.role === "admin" ? "default" : "secondary"} className="rounded-full">
                  {selected.role}
                </Badge>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Órdenes</span>
                <span className="text-sm font-medium">{selected.orders}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Total Gastado</span>
                <span className="text-sm font-bold">{formatARS(selected.totalSpent)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Registro</span>
                <span className="text-sm">{selected.joined}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  selected.status === "activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {selected.status}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
