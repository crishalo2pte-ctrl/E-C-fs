# Arquitectura FrankStore — Frontend ↔ Backend

## Leyenda

→ data flow / fetch
⇄ mutación (lectura + escritura)
<> componente / elemento
[] array / lista

---

## 1. Página Pública Principal + Catálogo

```
┌───────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 16)           │
├───────────────────────┬──────────────────────┬───────┤
│   Páginas Web          │   Componentes        │   API │
├───────────────────────┼──────────────────────┼───────┤
│  / (Home)             │ <ProductCarousel>    │       │
│  /catalogo            │ <ProductCard>[]     │       │
│  /catalogo/ropa       │ <SectionHeader>     │       │
│  /producto/[id]       │ <ProductCard>[]     │       │
│  /contacto, /envios,  │ <Container, Footer,  │       │
│   /devoluciones,      │ <Header>            │       │
│   /faq                │ <JsonLd/>           │       │
└───────────────────────┴──────────────────────┴───────┘
        │               │                  │
        │ GET /api/products │ GET /api/products │ GET /api/products
        │ GET /api/categories │ \
        ▼                  ▼                  ▼
┌───────────────────────────────────────┐┌─────────────────┐┌─────────────────┐
│            BACKEND (API)                │ │   PRISMA       │ │   PRISMA       │
│   src/app/api/                        │ │  Category      │ │  Product       │
│                                       │ │               │ │               │
│   GET /api/products?cat=&search=     │ │   Category ────1── Product    │
│   GET /api/products/[id]               │ │   1 ──── N ──── products    │\n│   GET /api/categories               │ │   1 ──── N ──── Variant       │\n│                                       │ │   ┌───────────────┐ │\n│   POST /api/auth/login               │ │   │      User       │ │\n│   (futura)                          │ │   │               │ │\n│   GET /api/cart                      │ │   │   1 ──── N ──── │ │\n│   POST /api/cart/items                │ │   │    orders      │ │\n│   PUT /api/cart/items/[id]            │ │   │               │ │\n│   DELETE /api/cart/items/[id]         │ │   └───────────────┘ │\n│   POST /api/orders                    │ │                   │\n│   (checkout)                         │ │                   │\n└───────────────────────────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 2. Perfil de Usuario

```
┌───────────────────────────────────────┐\n│             FRONTEND                  │\n├───────────────────────┬─────────────────┤\n│   Páginas Web          │   Componentes    │\n├───────────────────────┼─────────────────┤\n│  /profile (dashboard) │ <Card>[] stats   │\n│  /profile/orders       │ <Avatar>         │\n│  /profile/addresses    │ <Card>[] dirección│\n│  /profile/favorites    │ <Card>[] productos│\n│  /profile/settings     │ <Tabs> prefs     │\n└───────────────────────┴─────────────────┘\n        │\n        │ GET /api/profile (User)\n        │ GET /api/orders (Order + OrderItem)\n        │ GET /api/addresses (Address)\n        │ GET /api/favorites (Favorite + Product)\n        ▼\n┌───────────────────────────────────────┐\n│            BACKEND (API)                │\n│  GET /api/profile   \\\n│  GET /api/orders    \\\n│  GET /api/addresses \\\n│  GET /api/favorites \\\n│  PATCH /api/profile  \\\n└───────────────────────────────────────┘\n        │\n        ▼\n┌───────────────────────────────────────┐\n│            PRISMA                       │\n│   User ──1── N ── Order ──1── N ── OrderItem │\n│   User ──1── N ── Address                  │\n│   User ──1── N ── Favorite ── N ── Product   │\n└───────────────────────────────────────┘\n```\n
---\n
## 3. Checkout + Carrito

```\n┌───────────────────────────────────────┐\n│             FRONTEND                  │\n├───────────────────────┬─────────────────┤\n│   Página Web          │   Componentes    │\n├───────────────────────┼─────────────────┤\n│  /checkout           │   Form (datos)   │\n│                     │   PagoFacil       │\n│                     │   Mercado Pago (mock) │\n│                     │   Limpiar carrito │\n└───────────────────────┴─────────────────┘\n        │\n        │ POST /api/orders (Order + OrderItem)\n        ▼\n┌───────────────────────────────────────┐\n│            BACKEND (API)                │\n│   POST /api/orders                      │\n|   Body: { items, form }                 │\n└───────────────────────────────────────┘\n        ▼\n┌───────────────────────────────────────┐\n│            PRISMA                       │\n│   Order ──1── N ── OrderItem             │\n│   Order ──1── 1 ── Payment (opt)        │\n│   Order ── N ── User                    │\n└───────────────────────────────────────┘\n```\n
---\n
## 4. Panel de Administración

```\n┌───────────────────────────────────────┐\n│             FRONTEND                  │\n├───────────────────────┬─────────────────┤\n│   Páginas Web          │   Componentes    │\n├───────────────────────┼─────────────────┤\n│  /admin (dashboard)  │ <Card>[] stats   │\n│  /admin/productos      │ <Table> productos│\n│  /admin/productos/nuevo │ <Dialog> form   │\n│  /admin/usuarios       │ <Table> usuarios │\n│  /admin/pagos          │ <Table> pagos    │\n└───────────────────────┴─────────────────┘\n        │\n        │ GET /api/admin/users\n        │ GET /api/admin/products\n        │ GET /api/admin/orders\n        │ POST /api/admin/products\n        ▼\n┌───────────────────────────────────────┐\n│            BACKEND (API)                │\n│   GET /api/admin/users                  │\n│   GET /api/admin/products               │\n│   POST /api/admin/products              │\n│   PUT /api/admin/products/[id]          │\n│   DELETE /api/admin/products/[id]       │\n└───────────────────────────────────────┘\n        ▼\n┌───────────────────────────────────────┐\n│            PRISMA                       │\n│   User (role: admin)                   │\n│   Product ──1── N ── Variant          │\n│   Product ──1── N ── Favorite          │\n│   Product ── N ── OrderItem            │\n│   Payment ── N ── Order                │\n└───────────────────────────────────────┘\n```\n
---\n\n## Modelo de Base de Datos (Prisma)\\n\n┌───────────────────────────────────────┐\\n│   Category                           │\\n│   - id, name, slug, image?            │\\n│   - products: Product[]               │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   Product                            │\\n│   - id, name, slug, description       │\\n│   - price (ARS), image, images        │\\n│   - categoryId                        │\\n│   - featured, bestSeller              │\\n│   - variants: Variant[]                │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   Variant                            │\\n│   - id, productId, size?, color?       │\\n│   - product: Product                  │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   User                               │\\n│   - id, email, password?, avatar      │\\n│   - name, lastName, phone             │\\n│   - level, birthDate, registeredAt    │\\n│   - role (user/admin), status        │\\n│   - language, currency                │\\n│   - orders: Order[]                   │\\n│   - addresses: Address[]              │\\n│   - favorites: Favorite[]             │\\n│   - payments: Payment[]                │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   Order                              │\\n│   - id, number (FS-2026-XXXX)          │\\n│   - userId, status, total              │\\n│   - paymentMethod, addressSnapshot    │\\n│   - items: OrderItem[]                 │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   OrderItem                          │\\n│   - id, orderId, productId              │\\n│   - name, price, quantity              │\\n│   - image?, variantId?, size?, color?   │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   Address                            │\\n│   - id, userId, name, street, city,... │\\n│   - isDefault, phone                  │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   Favorite                           │\\n│   - id, userId, productId              │\\n│   - @@unique([userId, productId])      │\\n└───────────────────────────────────────┘\\n\n┌───────────────────────────────────────┐\\n│   Payment                            │\\n│   - id, transactionId, userId           │\\n│   - amount, method, status             │\\n│   - product (para UI rápido)           │\\n└───────────────────────────────────────┘\\n\n---\\n\n## Lista de Carpetas\\n\n```\\nfrankstore/\\n├── src/\\n│   ├── app/                        # NEXT.JS ROUTES\\n│   │   ├── api/                    # BACKEND API ROUTES\\n│   │   ├── page.tsx               # Home\\n│   │   ├── catalogo/page.tsx      # Catálogo\\n│   │   ├── catalogo/ropa/page.tsx # Categoría Ropa\\n│   │   ├── producto/[id]/page.tsx # Detalle\\n│   │   ├── checkout/page.tsx      # Checkout\\n│   │   ├── login/layout.tsx        # Login\\n│   │   ├── profile/...             # Perfil\\n│   │   └── admin/                  # Panel de admin\\n│   ├── components/                 # COMPONENTES\\n│   │   ├── ui/                     # shadcn/ui\\n│   │   ├── product-card.tsx\\n│   │   ├── product-carousel.tsx\\n│   │   ├── header.tsx, footer.tsx\\n│   │   ├── json-ld.tsx             # SEO structured data\\n│   │   └── skeletons.tsx           # Loading states\\n│   ├── context/                    # CONTEXT\\n│   │   ├── cart-context.tsx\\n│   │   └── profile-context.tsx\\n│   ├── hooks/                       # SWR HOOKS\\n│   │   ├── use-products.ts\\n│   │   ├── use-orders.ts\\n│   │   ├── use-addresses.ts\\n│   │   └── use-favorites.ts\\n│   └── lib/                         # UTILITIES\\n│       ├── api.ts                   # FETCHER genérico\\n│       └── auth.ts                  # JWT helpers (futuras)\\n│\\n└── prisma/                         # BASE DE DATOS\\n    ├── schema.prisma              # 9 modelos\\n    ├── seed.ts                     # Seed data\\n    └── migrations/                # Migraciones\\n```\\n\n---\\n\n## Flujo de Datos: SWR ↔ API ↔ Prisma\\n\n```\\
┌─────────────────────────────────────────────────────────────────────────────────┐\\
│  useProducts({cat:\"ropa\"})                                               │\\
│  ┌──────────────────────────┐    GET /api/products?cat=ropa                  │\\
│  │ useSWR(\"/api/products?   │ ──────────────────────────────────────────►   │\\
│  │   cat=ropa\", fetcher)    │                                               │\\
│  │                          │                                               │\\
│  │ data: { products[] }     │ ◄──────────────────────────────────────────   │\\
│  │ isLoading: false         │    JSON Response                              │\\
│  └──────────────────────────┘                                               │\\
│                                                                              │\\
│  useAddresses()                                                               │\\
│  ┌──────────────────────────┐    GET /api/addresses                         │\\
│  │ useSWR(\"/api/addresses\") │ ──────────────────────────────────────────►   │\\
│  │                          │                                               │\\
│  │ mutate() → revalida      │ ◄──────────────────────────────────────────   │\\
│  └──────────────────────────┘    JSON: Address[]                             │\\
│                                                                              │\\
│  createAddress(data)                                                         │\\
│  ┌──────────────────────────┐    POST /api/addresses                        │\\
│  │ fetcher(\"/api/addresses\",│ ──────────────────────────────────────────►   │\\
│  │   { method:\"POST\", ... })│                                               │\\
│  │                          │    Prisma: address.create()                  │\\
│  │ mutate()                 │ ◄──────────────────────────────────────────   │\\
│  └──────────────────────────┘    JSON: { success, address }                 │\\
└─────────────────────────────────────────────────────────────────────────────────┘\\n```\\n\n---\\n\ 
## Próximos Pasos (Plan de implementación backend)\\n
1. **Schema en Prisma:** Traducir modelos actuales a `prisma/schema.prisma`\\
2. **Migración base:** `npx prisma generate` + `npx prisma migrate dev --name init`\\
3. **API Routes:** `/api/products`, `/api/orders`, `/api/addresses`, `/api/favorites`, `/api/auth`, `/api/admin/*`\\
4. **SWR Hooks:** `useProducts()`, `useOrders()`, `useAddresses()`, `useFavorites()`\\
5. **Seeds:** `src/lib/products.ts`, `profile-data.ts`, `admin-data.ts` → Prisma `seed.ts`\\
6. **Autenticación:** Middleware, JWT, login real (opcional por ahora)\\
7. **Carrito:** Migrar localStorage a DB una vez que exista auth\\n\n```