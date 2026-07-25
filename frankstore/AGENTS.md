# FrankStore — AGENTS.md

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- shadcn/ui (Radix Nova style) — components in `src/components/ui/`
- Prisma v7 (PostgreSQL) — schema at `prisma/schema.prisma`, client generated to `src/generated/prisma`
- Path alias `@/*` → `./src/*`

## Commands
```bash
npm run dev      # dev server at localhost:3000 (Turbopack)
npm run build    # production build (Turbopack default; pass --webpack to use webpack)
npm run lint     # ESLint
```

## Known gotchas
- shadcn components that import from `radix-ui` **must** have a `"use client"` directive at the top. The shadcn generator does not always add it (`badge.tsx`, `button.tsx`, `card.tsx` etc.). If you see `TypeError: X.createContext is not a function` during build, add `"use client"` to the offending UI component.
- Prisma v7 uses `prisma.config.ts` (not the schema url field alone). The schema `provider` field in `schema.prisma` is `"prisma-client"` in v7.
- La tienda está ubicada en **Córdoba, Argentina**. Moneda: **ARS (Peso Argentino)**.
- Product prices are stored as floats and displayed with `toLocaleString("es-AR")` via `formatARS()`.
- Mock data lives in `src/lib/products.ts` — no backend logic is wired yet. When connecting real data, replace this with Prisma queries and create API routes or server actions.

## Architecture
- `src/app/page.tsx` — Home (auto-slider carousel at top, featured, imperdibles, categories, newsletter, latest)
- `src/app/catalogo/page.tsx` — Catalog with query-param filters (`?featured=true`, `?imperdibles=true`, `?cat=slug`)
- `src/app/catalogo/ropa/page.tsx` — Clothing subcategory
- `src/app/producto/[id]/page.tsx` — Product detail (tallas, colores, relacionados)
- `src/components/` — app-specific components (header, footer, hero→carousel, product-card, section-header)
- `src/components/ui/` — shadcn primitives

## Color theme
Green matte (`oklch(0.45 0.06 145)`), black, white. Defined as CSS custom properties in `src/app/globals.css`.

## Prisma
- `DATABASE_URL` must be set in `.env` for PostgreSQL.
- Migrations folder: `prisma/migrations/`.
- Run `npx prisma generate` after schema changes to regenerate the client.
- Prisma skills are installed at `.agents/skills/prisma-*/` for agent reference.
