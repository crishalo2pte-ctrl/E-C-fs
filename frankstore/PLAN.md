# FrankStore — Plan de Avance

## 1. Imágenes reales de productos
- Subir imágenes a `/public/images/` o usar Unsplash API
- Actualizar `src/lib/products.ts` con URLs reales
- Considerar Cloudinary para upload y optimización

## 2. Conectar Prisma con PostgreSQL
- Configurar `DATABASE_URL` en `.env`
- Ejecutar `npx prisma migrate dev`
- Crear seed con productos mock
- Reemplazar `src/lib/products.ts` con queries Prisma
- Crear API routes para operaciones CRUD

## 3. Autenticación real
- Instalar NextAuth.js o Clerk
- Login/Register con credenciales reales
- Protección de rutas (profile, admin)
- Sesiones persistentes

## 4. Carrito mejorado
- Toast/notificación al agregar producto
- Drawer/sheet del carrito desde el header
- Qty selector en página de detalle

## 5. Búsqueda funcional
- Búsqueda en tiempo real por nombre/categoría
- Debounce para no saturar
- Página de resultados

## 6. SEO y Metadata
- Metadata dinámica por página
- Sitemap.xml y robots.txt
- Schema.org para productos

## 7. Deploy
- Vercel (recomendado para Next.js)
- Dominio personalizado
- Variables de entorno

## 8. Performance
- Lazy loading de imágenes
- Suspense boundaries
- Optimistic updates para carrito
- Prefetching de rutas

## Orden sugerido

| # | Tarea | Tiempo estimado |
|---|---|---|
| 1 | Imágenes reales de productos | 1-2 horas |
| 2 | Conectar Prisma + PostgreSQL | 4-6 horas |
| 3 | Autenticación (NextAuth/Clerk) | 3-4 horas |
| 4 | Toast notifications para carrito | 1 hora |
| 5 | Drawer del carrito en header | 2 horas |
| 6 | Búsqueda funcional | 2-3 horas |
| 7 | SEO metadata | 2 horas |
| 8 | Deploy en Vercel | 1 hora |
