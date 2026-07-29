"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface CategoryFormData {
  id?: string
  name: string
  slug: string
  image?: string | null
}

interface AdminCategoryFormProps {
  category?: CategoryFormData
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"]

export function AdminCategoryForm({ category }: AdminCategoryFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(category?.image ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Solo se permiten PNG, JPG o JPEG")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen supera los 5MB")
      return
    }
    setImageUrl(URL.createObjectURL(file))
    setImageFile(file)
  }, [])

  const removeImage = useCallback(() => {
    if (imageFile) URL.revokeObjectURL(imageUrl ?? "")
    setImageUrl(null)
    setImageFile(null)
  }, [imageFile, imageUrl])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSubmitting(true)

    try {
      let finalImage: string | null = imageUrl

      if (imageFile) {
        const fd = new FormData()
        fd.append("file", imageFile)
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
        if (!res.ok) throw new Error("Error al subir la imagen")
        const { url } = await res.json()
        finalImage = url
      }

      const body: Record<string, unknown> = {
        name: form.get("name"),
        slug: form.get("slug"),
        image: finalImage,
      }

      const url = category?.id
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories"
      const method = category?.id ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Error al guardar" }))
        throw new Error(err.message ?? "Error al guardar")
      }

      router.push("/admin/categorias")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar la categoría")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/categorias")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </h1>
          <p className="text-muted-foreground">
            {category ? "Modifica los datos de la categoría" : "Agrega una nueva categoría al catálogo"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6 space-y-5">
            <h2 className="text-lg font-semibold">Información General</h2>

            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Nombre de la categoría</label>
              <Input id="name" name="name" defaultValue={category?.name} placeholder="Ej: Ropa Deportiva" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
              <Input id="slug" name="slug" defaultValue={category?.slug} placeholder="Ej: ropa-deportiva" required />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold">Imagen de la Categoría</h2>

            {imageUrl ? (
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Vista previa"
                  className="aspect-video w-full rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center transition hover:border-primary/50 hover:bg-primary/5"
              >
                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium">Haz clic para subir una imagen</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG o JPEG — hasta 5MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1 rounded-full">
              {submitting ? "Guardando..." : category ? "Guardar Cambios" : "Crear Categoría"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categorias")}
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
