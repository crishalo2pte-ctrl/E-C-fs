import Link from "next/link"
import { categoryLinks } from "@/lib/navigation"
import { socialLinks } from "@/lib/social"

export function Footer() {
  return (
    <footer className="border-t bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">
              FRANK<span className="text-neon-gray">STORE</span>
            </h3>
            <p className="text-sm text-gray-400">
              Moda consciente con estilo único. Descubre piezas que cuentan una historia.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Categorías</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Ayuda</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/contacto" className="transition-colors hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/envios" className="transition-colors hover:text-white">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="transition-colors hover:text-white">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Síguenos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FrankStore. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
