import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin-layout"

export const metadata: Metadata = {
  title: "Admin — FrankStore",
  description: "Panel de administración de FrankStore. Gestioná productos, pedidos, usuarios y pagos.",
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
