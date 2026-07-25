import type { Metadata } from "next"
import { ProfileInnerLayout } from "./layout.client"

export const metadata: Metadata = {
  title: "Mi Perfil",
  description: "Gestioná tu perfil, pedidos, direcciones y favoritos en FrankStore.",
  robots: { index: false, follow: false },
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ProfileInnerLayout>{children}</ProfileInnerLayout>
}