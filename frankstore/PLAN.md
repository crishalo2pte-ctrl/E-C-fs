# Plan de pre-deploy para Vercel

## ~~Paso 1 — Arreglar el middleware~~ ✅
- ~~Mover `src/proxy.ts` → `src/middleware.ts`~~ (No aplica — Next.js 16 usa `proxy.ts`, ya estaba bien).

## Paso 2 — Sincronizar imágenes del seed
- Los nombres de archivo en `public/images/` no coinciden con los que guarda el seed (`/images/product-1.jpg`, etc.).
- Opción A: Renombrar los archivos reales para que coincidan (ej: `buzo neegro.jpeg` → `product-1.jpg`).
- Opción B: Actualizar `prisma/seed.ts` y `src/lib/products.ts` para usar los nombres reales.

## Paso 3 — Agregar favicon
- `src/app/layout.tsx:54` referencia `/favicon.ico` pero no existe.
- Solución: copiar o crear un favicon en `public/favicon.ico`, o cambiar la referencia a `file.svg` o `vercel.svg`.

## Paso 4 — Imágenes de categorías faltantes
- El seed referencia `/images/category-ropa.jpg`, `/images/category-imperdibles.jpg`, etc.
- Crear esas imágenes en `public/images/` o actualizar el seed para omitir `image` en categorías.

## Paso 5 — Agregar NEXT_PUBLIC_SITE_URL a Vercel
- Ya hay fallback en el código, pero agregar la variable en el dashboard de Vercel:
  - `NEXT_PUBLIC_SITE_URL` → `https://frankstore.com.ar` (o tu dominio)

## Paso 6 — Configurar variables de entorno en Vercel
Agregar en Vercel Dashboard → Project Settings → Environment Variables:
- `DATABASE_URL` — PostgreSQL en producción (Neon, Supabase, etc.)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Paso 7 — Build de prueba
- Ejecutar `npm run build` localmente para verificar que no hay errores de tipo.
- Si hay errores, corregirlos antes de deployar.

## Paso 8 — Deployar a Vercel
- `npx vercel` para primera vez, vincular repo.
- O conectar el repo de GitHub desde Vercel Dashboard.
