"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart, type CartItem } from "@/context/cart-context"
import { CartSkeleton, Skeleton } from "@/components/skeletons"

const WHATSAPP_NUMBER = "5493517580449"

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  notes: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  address?: string
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = "Requerido"
  if (!data.email.trim()) errors.email = "Requerido"
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email inválido"
  if (!data.phone.trim()) errors.phone = "Requerido"
  if (!data.address.trim()) errors.address = "Requerido"
  return errors
}

function buildWhatsAppMessage(items: ReturnType<typeof useCart>["items"], total: number, form: FormData): string {
  const lines: string[] = []
  lines.push("🛒 *Nuevo Pedido - FrankStore*")
  lines.push("")
  lines.push("*Productos:*")
  items.forEach((item, i) => {
    const subtotal = item.price * item.quantity
    lines.push(
      `${i + 1}. ${item.name} x${item.quantity} — $${subtotal.toLocaleString("es-AR")}`
    )
  })
  lines.push(`*Total: $${total.toLocaleString("es-AR")}*`)
  lines.push("")
  lines.push("*Datos del Cliente:*")
  lines.push(`Nombre: ${form.name}`)
  lines.push(`Email: ${form.email}`)
  lines.push(`Teléfono: ${form.phone}`)
  lines.push(`Dirección: ${form.address}`)
  if (form.notes.trim()) {
    lines.push("")
    lines.push(`*Notas:* ${form.notes}`)
  }
  return lines.join("\n")
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, isEmpty, isLoading, removeFromCart, updateQuantity, clearCart } = useCart()
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", address: "", notes: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [paymentMethod, setPaymentMethod] = useState<"pagofacil" | "mercadopago">("pagofacil")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[]; total: number } | null>(null)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/catalogo">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
        </div>
        <CartSkeleton />
      </div>
    )
  }

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePagoFacil = () => {
    const validation = validateForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    const msg = buildWhatsAppMessage(items, totalPrice, form)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    if (window.matchMedia("(min-width: 768px)").matches) {
      window.open(url, "_blank")
    } else {
      window.location.href = url
    }
    setLastOrder({ items, total: totalPrice })
    setSuccess(true)
    clearCart()
  }

  const handleMercadoPago = () => {
    const validation = validateForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setLastOrder({ items, total: totalPrice })
      setSuccess(true)
      clearCart()
    }, 2000)
  }

  if (isEmpty && !success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-2xl font-bold">Tu carrito está vacío</h2>
        <p className="mt-2 text-muted-foreground">
          Agrega productos desde nuestro catálogo
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/catalogo">Ir al Catálogo</Link>
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">¡Pago Exitoso!</h2>
        <p className="mt-3 text-muted-foreground">
          Gracias por tu compra. Recibirás un correo con los detalles de tu pedido.
        </p>
        <Card className="mx-auto mt-8 max-w-md border-0 bg-muted/50 text-left">
          <CardHeader>
            <CardTitle className="text-base">Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {lastOrder?.items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toLocaleString("es-AR")}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${lastOrder?.total.toLocaleString("es-AR")}</span>
            </div>
          </CardContent>
        </Card>
        <Button asChild className="mt-8 rounded-full">
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/catalogo">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            {totalItems} producto{totalItems !== 1 ? "s" : ""} en tu carrito
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.productId}>
                  <div className="hidden items-center gap-4 rounded-lg bg-muted/30 p-3 sm:flex">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Restar ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Sumar ${item.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="w-20 text-right text-sm font-medium">
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-destructive"
                      onClick={() => removeFromCart(item.productId)}
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-lg bg-muted/30 p-4 sm:hidden">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base font-bold text-primary">
                        {item.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          ${item.price.toLocaleString("es-AR")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-destructive"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 border-t pt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toLocaleString("es-AR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Restar ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Sumar ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Datos de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nombre Completo <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Juan Pérez"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="juan@email.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Teléfono <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="+57 300 123 4567"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Dirección de Envío <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Av. Colón 1234, Córdoba, Argentina"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive">{errors.address}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Textarea
                  placeholder="Ej: Enviar después de las 2pm"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Método de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as "pagofacil" | "mercadopago")}
              >
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition hover:border-primary/50 ${
                    paymentMethod === "pagofacil" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="pagofacil" id="pagofacil" />
                  <div>
                    <p className="font-medium">PagoFacil</p>
                    <p className="text-xs text-muted-foreground">
                      Recibe el enlace de pago por WhatsApp
                    </p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition hover:border-primary/50 ${
                    paymentMethod === "mercadopago" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="mercadopago" id="mercadopago" />
                  <div>
                    <p className="font-medium">Mercado Pago Argentina</p>
                    <p className="text-xs text-muted-foreground">
                      Paga con tarjeta, débito o efectivo
                    </p>
                  </div>
                </label>
              </RadioGroup>

              <Button
                className="w-full rounded-full"
                size="lg"
                onClick={paymentMethod === "pagofacil" ? handlePagoFacil : handleMercadoPago}
              >
                {paymentMethod === "pagofacil"
                  ? "Solicitar Pago por WhatsApp"
                  : "Pagar con Mercado Pago"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center rounded-2xl bg-white px-10 py-12 shadow-2xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Procesando pago...</p>
            <p className="text-sm text-muted-foreground">Espera un momento</p>
          </div>
        </div>
      )}
    </div>
  )
}