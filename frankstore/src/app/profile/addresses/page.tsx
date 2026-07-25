"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, MapPin, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { useAddresses } from "@/hooks/use-addresses"
import { fetcher } from "@/lib/api"
import { AddressesSkeleton, Skeleton } from "@/components/skeletons"

export default function AddressesPage() {
  const { addresses, isLoading, mutate } = useAddresses()
  const [showForm, setShowForm] = useState(false)
  const [editAddr, setEditAddr] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", street: "", city: "", department: "", postalCode: "", phone: "" })
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditAddr(null)
    setForm({ name: "", street: "", city: "", department: "", postalCode: "", phone: "" })
    setShowForm(true)
  }

  const openEdit = (addr: typeof addresses[0]) => {
    setEditAddr(addr.id)
    setForm({ name: addr.name, street: addr.street, city: addr.city, department: addr.department, postalCode: addr.postalCode, phone: addr.phone })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await fetcher(`/api/addresses/${id}`, { method: "DELETE" })
    mutate()
  }

  const handleDefault = async (id: string) => {
    await fetcher(`/api/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isDefault: true }),
    })
    mutate()
  }

  const handleSave = async () => {
    setSaving(true)
    const url = editAddr ? `/api/addresses/${editAddr}` : "/api/addresses"
    const method = editAddr ? "PUT" : "POST"
    await fetcher(url, {
      method,
      body: JSON.stringify({ ...form, isDefault: addresses.length === 0 }),
    })
    setSaving(false)
    setShowForm(false)
    setEditAddr(null)
    mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <AddressesSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Direcciones</h1>
          <p className="text-muted-foreground">Gestiona tus direcciones de envío</p>
        </div>
        <Button onClick={openNew} className="rounded-full">
          <Plus className="mr-1 h-4 w-4" /> Nueva Dirección
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium">No tienes direcciones guardadas</p>
            <p className="text-sm text-muted-foreground mb-4">Agrega una dirección para tus envíos</p>
            <Button onClick={openNew} className="rounded-full">
              <Plus className="mr-1 h-4 w-4" /> Agregar Dirección
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id} className="border-0 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{addr.name}</p>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary">
                          <Star className="h-3 w-3 fill-primary" /> Predeterminada
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(addr)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.department}</p>
                  <p>CP: {addr.postalCode}</p>
                  <p>{addr.phone}</p>
                </div>
                {!addr.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 rounded-full text-xs"
                    onClick={() => handleDefault(addr.id)}
                  >
                    Establecer como principal
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={(o) => !o && setShowForm(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editAddr ? "Editar Dirección" : "Nueva Dirección"}</DialogTitle>
            <DialogDescription>
              {editAddr ? "Modifica los datos de la dirección" : "Agrega una nueva dirección de envío"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input placeholder="Ej: Casa, Oficina" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input placeholder="Calle, número, apto" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ciudad</label>
                <Input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Departamento</label>
                <Input placeholder="Departamento" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Código Postal</label>
                <Input placeholder="000000" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input placeholder="+54 351 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditAddr(null) }}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
