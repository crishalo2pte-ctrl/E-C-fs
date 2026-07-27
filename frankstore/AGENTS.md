# FrankStore — AGENTS.md

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- shadcn/ui (Radix Nova style) — components in `src/components/ui/`
- Prisma v7 (PostgreSQL) — schema: `prisma/schema.prisma`, client output: `src/generated/prisma`
- Cloudinary for image uploads, SWR for client-side data fetching
- Auth: bcrypt + jsonwebtoken (admin token stored in localStorage/cookie)
- Path alias `@/*` → `./src/*`

## Commands
```bash
npm run dev      # dev server localhost:3000 (Turbopack)
npm run build    # production build
npm run lint     # ESLint
npx prisma generate  # regenerate Prisma client after schema changes
npx prisma db seed   # seed database (destructive: deletes all data first)
```
No test suite exists. No typecheck script — rely on `npm run build` for type verification.

## Gotchas
- **"use client" directive**: shadcn components importing from `radix-ui` must have `"use client"` at top. The generator doesn't always add it. If `TypeError: X.createContext is not a function`, add the directive.
- **Prisma v7**: Uses `prisma.config.ts` and `"provider = "prisma-client"` in schema (not the old provider values). Client generates to `src/generated/prisma`, not `node_modules/.prisma/client`.
- **Seed is destructive**: `npx prisma db seed` runs `deleteMany()` on every table before seeding.
- **Currency**: ARS (Argentine Peso). Prices stored as floats, formatted via `formatARS()` in `src/lib/format.ts` using `toLocaleString("es-AR")`.

## Architecture

### Pages (`src/app/`)
- `page.tsx` — Home (carousel, featured, imperdibles, categories, newsletter)
- `catalogo/` — Catalog with query-param filters (`?featured=true`, `?cat=slug`)
- `catalogo/ropa/page.tsx` — Clothing subcategory
- `producto/[id]/page.tsx` — Product detail
- `admin/` — Admin panel (dashboard, products CRUD, payments, users)
- `login/` — User login
- `checkout/`, `contacto/`, `faq/`, `envios/`, `devoluciones/`, `profile/` — Other pages

### API Routes (`src/app/api/`)
- `products/`, `categories/` — Public API
- `admin/products/`, `admin/upload/`, `admin/login/` — Admin API (requires auth token)
- `login/`, `orders/`, `addresses/`, `favorites/`, `profile/` — User API

### Components
- `src/components/` — App-specific (header, footer, product-card, admin-layout, admin-product-form)
- `src/components/ui/` — shadcn primitives

### Key libs
- `src/lib/prisma.ts` — Prisma singleton
- `src/lib/cloudinary.ts` — Cloudinary config + upload/delete helpers
- `src/lib/auth.ts` — JWT token helpers
- `src/lib/format.ts` — `formatARS()` price formatter
- `src/lib/products.ts` — Legacy mock data (still referenced by some components)

## Color theme
Green matte (`oklch(0.45 0.06 145)`), black, white. CSS custom properties in `src/app/globals.css`.
