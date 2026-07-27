"use client"

import { useState, useRef, useCallback } from "react"
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
  images?: string[]
  categoryId: string
  featured: boolean
  bestSeller: boolean
}

interface AdminProductFormProps {
  product?: ProductFormData
  categories: CategoryOption[]
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"]

interface ImageEntry {
  url: string
  file?: File
}

export function AdminProductForm({ product, categories }: AdminProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<ImageEntry[]>(() => {
    const existing = product?.images?.length
      ? product.images
      : product?.image
        ? [product.image]
        : []
    return existing.map((url) => ({ url }))
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const valid: ImageEntry[] = []
    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`"${file.name}" no es PNG, JPG o JPEG — se omitió`)
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" supera 5MB — se omitió`)
        continue
      }
      valid.push({ url: URL.createObjectURL(file), file })
    }

    setImages((prev) => [...prev, ...valid])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const next = [...prev]
      const removed = next.splice(index, 1)[0]
      if (removed.file) URL.revokeObjectURL(removed.url)
      return next
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSubmitting(true)

    try {
      const allUrls: string[] = []

      const newFiles = images.filter((img) => img.file)
      if (newFiles.length > 0) {
        setUploading(true)
        for (let i = 0; i < newFiles.length; i++) {
          setUploadProgress(`Subiendo imagen ${i + 1} de ${newFiles.length}...`)
          const fd = new FormData()
          fd.append("file", newFiles[i].file!)

          const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: "Error al subir imagen" }))
            throw new Error(err.message ?? "Error al subir imagen")
          }
          const { url } = await res.json()
          allUrls.push(url)
        }
        setUploading(false)
        setUploadProgress("")
      }

      const existingUrls = images.filter((img) => !img.file).map((img) => img.url)
      const finalImages = [...existingUrls, ...allUrls]
      const primaryImage = finalImages[0] ?? ""

      const body: Record<string, unknown> = {
        name: form.get("name"),
        slug: form.get("slug"),
        description: form.get("description"),
        price: Number(form.get("price")),
        categoryId: form.get("categoryId"),
        featured: form.get("featured") === "on",
        bestSeller: form.get("bestSeller") === "on",
        image: primaryImage,
        images: finalImages,
      }

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
      setUploading(false)
      setUploadProgress("")
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
            <h2 className="text-lg font-semibold">Imágenes del Producto</h2>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <div key={img.url} className="relative group">
                    <img
                      src={img.url}
                      alt={`Imagen ${i + 1}`}
                      className="aspect-square w-full rounded-lg object-cover border"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center transition hover:border-primary/50 hover:bg-primary/5"
            >
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium">
                {images.length > 0 ? "Agregar más imágenes" : "Haz clic para subir imágenes"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG o JPEG — hasta 5MB c/u — Múltiples archivos permitidos
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept=".png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1 rounded-full">
              {uploading
                ? uploadProgress
                : submitting
                  ? "Guardando..."
                  : product
                    ? "Guardar Cambios"
                    : "Crear Producto"}
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
