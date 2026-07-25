"use client"

import { useState } from "react"
import { Globe, Bell } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promotions: true,
    orderUpdates: true,
    newsletter: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Administra tus preferencias</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full justify-start rounded-xl bg-white border p-1 h-auto">
          <TabsTrigger value="general" className="rounded-lg gap-1.5">
            <Globe className="h-3.5 w-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Preferencias Generales</CardTitle>
              <CardDescription>Configura el idioma, moneda y tema de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Idioma</label>
                  <Input defaultValue="Español" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moneda</label>
                  <Input defaultValue="ARS (Argentino)" className="bg-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tema</label>
                <div className="flex gap-3">
                  {["Claro", "Oscuro", "Sistema"].map((theme) => (
                    <button
                      key={theme}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        theme === "Claro"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="rounded-full">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              <CardDescription>Elige cómo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "email" as const, label: "Notificaciones por Email", desc: "Recibe actualizaciones en tu correo" },
                { key: "sms" as const, label: "Notificaciones por SMS", desc: "Recibe alertas por mensaje de texto" },
                { key: "promotions" as const, label: "Promociones", desc: "Ofertas especiales y descuentos" },
                { key: "orderUpdates" as const, label: "Actualizaciones de Pedido", desc: "Estado de tus envíos y entregas" },
                { key: "newsletter" as const, label: "Newsletter", desc: "Novedades y tendencias de moda" },
              ].map((item, i) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                    />
                  </div>
                  {i < 4 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
