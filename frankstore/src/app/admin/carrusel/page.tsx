"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminTableSkeleton } from "@/components/skeletons"
import { useAdminProducts } from "@/hooks/use-admin-products"

const CAROUSEL_LIMIT = 10

export default function AdminCarrusel() {
  const { products, isLoading, mutate } = useAdminProducts()
  const [dirty, setDirty] = useState(false)
  const [carouselIds, setCarouselIds] = useState<string[]>([])

  const defaultIds = products
    .filter((p) => p.carousel)
    .sort((a, b) => (a.carouselOrder ?? 0) - (b.carouselOrder ?? 0))
    .map((p) => p.id)

  const currentIds = dirty ? carouselIds : defaultIds

  const toggle = (id: string, enabled: boolean) => {
    if (enabled) {
      if (currentIds.includes(id)) return
      setCarouselIds([...currentIds, id])
    } else {
      setCarouselIds(currentIds.filter((p) => p !== id))
    }
    setDirty(true)
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= currentIds.length) return
    const next = [...currentIds]
    ;[next[index], next[target]] = [next[target], next[index]]
    setCarouselIds(next)
    setDirty(true)
  }

  const save = async () => {
    try {
      const res = await fetch("/api/admin/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: currentIds }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Error al guardar" }))
        throw new Error(err.message ?? "Error al guardar")
      }
      setDirty(false)
      mutate()
      alert("Carrusel actualizado correctamente")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar el carrusel")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="mt-1 h-4 w-64 rounded bg-muted" />
          </div>
          <div className="h-10 w-32 rounded-full bg-muted" />
        </div>
        <AdminTableSkeleton />
      </div>
    )
  }

  const selectedProducts = currentIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Carrusel</h1>
          <p className="text-muted-foreground">
            Controla qué productos se muestran en el carrusel de la portada
          </p>
        </div>
        <Button onClick={save} className="rounded-full">
          <Save className="mr-1 h-4 w-4" /> Guardar cambios
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Productos</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {currentIds.length}/{CAROUSEL_LIMIT} seleccionados
                </Badge>
              </div>
            </CardHeader>
            {currentIds.length > CAROUSEL_LIMIT && (
              <div className="border-b border-border bg-destructive/5 px-6 py-3 text-sm text-destructive">
                Seleccionaste {currentIds.length} productos. Solo se muestran los primeros{" "}
                {CAROUSEL_LIMIT} en la portada; usá las flechas para ordenar.
              </div>
            )}
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="hidden lg:table-cell">Categoría</TableHead>
                    <TableHead className="w-24 text-center">Mostrar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const index = currentIds.indexOf(product.id)
                    const enabled = index !== -1
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {enabled ? (
                            <div className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                onClick={() => move(index, -1)}
                                disabled={index === 0}
                                className="text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                                aria-label="Subir posición"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <span className="text-xs font-medium text-primary">
                                {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => move(index, 1)}
                                disabled={index === currentIds.length - 1}
                                className="text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                                aria-label="Bajar posición"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-sm font-bold text-primary">{product.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{product.category}</TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => toggle(product.id, checked)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vista previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Ningún producto seleccionado. Activa el switch de un producto para agregarlo.
                </p>
              ) : (
                selectedProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-primary">{product.name.charAt(0)}</span>
                      )}
                    </div>
                    <p className="truncate text-sm font-medium">{product.name}</p>
                  </div>
                ))
              )}
              <p className="pt-2 text-xs text-muted-foreground">
                Se mostrarán hasta {CAROUSEL_LIMIT} productos en el carrusel, en este orden.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
