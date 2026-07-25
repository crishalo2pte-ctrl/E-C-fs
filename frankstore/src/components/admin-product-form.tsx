"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

export interface CategoryOption {
  id: string
  name: string
}

export interface ProductFormData {
  id?: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  categoryId: string
  featured: boolean
  bestSeller: boolean
}

interface AdminProductFormProps {
  product?: ProductFormData
  categories: CategoryOption[]
}

export function AdminProductForm({ product, categories }: AdminProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Solo se permiten archivos PNG, JPG y JPEG")
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      price: Number(form.get("price")),
      categoryId: form.get("categoryId"),
      featured: form.get("featured") === "on",
      bestSeller: form.get("bestSeller") === "on",
    }
    if (imagePreview && !imageFile) {
      body.image = imagePreview
    }

    try {
      const url = product?.id
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"
      const method = product?.id ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Error al guardar" }))
        throw new Error(err.message ?? "Error al guardar")
      }

      router.push("/admin/productos")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar el producto")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/productos")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h1>
          <p className="text-muted-foreground">
            {product ? "Modifica los datos del producto" : "Agrega un nuevo producto al catálogo"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6 space-y-5">
            <h2 className="text-lg font-semibold">Información General</h2>

            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Nombre del producto</label>
              <Input id="name" name="name" defaultValue={product?.name} placeholder="Ej: Camisa Oversize Premium" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
              <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="Ej: camisa-oversize-premium" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Descripción</label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description}
                placeholder="Describe el producto..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">Precio ($ARS)</label>
                <Input id="price" name="price" type="number" step="0.001" defaultValue={product?.price} placeholder="0" required />
              </div>
              <div className="grid gap-2">
                <label htmlFor="categoryId" className="text-sm font-medium">Categoría</label>
                <Select name="categoryId" defaultValue={product?.categoryId}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Switch id="featured" name="featured" defaultChecked={product?.featured} />
                <label htmlFor="featured" className="font-medium">Destacado</label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="bestSeller" name="bestSeller" defaultChecked={product?.bestSeller} />
                <label htmlFor="bestSeller" className="font-medium">Más vendido</label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold">Imagen del Producto</h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center transition hover:border-primary/50 hover:bg-primary/5"
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="max-h-48 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage() }}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Haz clic para subir imagen</p>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG o JPEG hasta 5MB</p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleImageChange}
            />

            {imageFile && (
              <p className="text-xs text-muted-foreground truncate">
                {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1 rounded-full">
              {submitting ? "Guardando..." : product ? "Guardar Cambios" : "Crear Producto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/productos")}
              className="rounded-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
