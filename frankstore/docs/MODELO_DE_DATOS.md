# Modelo de Datos — FrankStore

> Generado el 25/07/2026 · Actualizado el 25/07/2026
> Tienda ubicada en **Córdoba, Argentina**
> Moneda: **ARS (Peso Argentino)**
> Formato: `formatARS()` con locale `es-AR`
> Slack: `+54 9 3517 58-0449`

---

## Convenciones

- IDs: `cuid()` generado por Prisma
- Timestamps: `createdAt` y `updatedAt` automáticos
- Strings sin longitud fija (PostgreSQL no requiere `@db.VarChar`)
- Imágenes: solo URLs (strings) — integración con Cloudinary posterior
- Sin stock numérico: no hay control de inventario
- Precio único por producto: las variantes no tienen precio propio
- Carrito en localStorage, no en DB

---

## Modelos

### Category

```
id        String   @id @default(cuid())
name      String
slug      String   @unique
image     String?
products  Product[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| name | String | Nombre visible ("Ropa", "Imperdibles", etc.) |
| slug | String | URL slug único ("ropa", "imperdibles") |
| image | String? | URL de imagen de la categoría |
| products | Product[] | Relación 1:N con productos |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Última modificación |

---

### Product

```
id          String    @id @default(cuid())
name        String
slug        String    @unique
description String
price       Float
image       String
images      String[]
categoryId  String
category    Category  @relation(fields: [categoryId], references: [id])
featured    Boolean   @default(false)
bestSeller  Boolean   @default(false)
variants    Variant[]
createdAt   DateTime  @default(now())
updatedAt   DateTime  @updatedAt
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| name | String | Nombre del producto |
| slug | String | URL slug único |
| description | String | Descripción del producto |
| price | Float | Precio en ARS (Peso Argentino) — todas las variantes comparten este precio |
| image | String | URL de imagen principal |
| images | String[] | URLs de imágenes adicionales |
| categoryId | String | FK a Category |
| featured | Boolean | Producto destacado en homepage |
| bestSeller | Boolean | Producto más vendido |
| variants | Variant[] | Relación 1:N con variantes (talla/color) |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Última modificación |

Relaciones:
- N:1 con Category
- 1:N con Variant
- 1:N con Favorite
- 1:N con OrderItem

---

### Variant

Define las combinaciones de talla y color disponibles para un producto.

```
id        String  @id @default(cuid())
productId String
product   Product @relation(fields: [productId], references: [id])
size      String?   (S, M, L, XL, etc.)
color     String?   (Negro, Blanco, Rojo, etc.)
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| productId | String | FK a Product |
| size | String? | Talla (opcional — productos sin talla pueden ser null) |
| color | String? | Color (opcional) |
| product | Product | Relación N:1 con Product |

Notas:
- Sin precio propio: hereda el precio del Product
- Sin stock: no hay control de inventario
- Ambos campos son opcionales (un producto puede tener solo tallas, solo colores, o ambos)
- Un Variant representa una combinación única de size + color para un producto

---

### User

Unifica los datos de `UserProfile` (perfil público) y `AdminUser` (admin). Diseñado para:
- Funcionar sin auth al inicio (passwordHash nullable)
- Soportar auth real después con JWT + bcryptjs

```
id                 String   @id @default(cuid())
name               String
lastName           String
email              String   @unique
phone              String
passwordHash       String?  (null hasta implementar auth)
avatar             String   @default("")
level              String   @default("Silver")    (Silver | Gold | Premium)
birthDate          String?
registeredAt       DateTime @default(now())
role               String   @default("user")      (user | admin)
status             String   @default("activo")    (activo | bloqueado)
language           String?  @default("es")
currency           String?  @default("ARS")
notifEmail         Boolean  @default(true)
notifSms           Boolean  @default(false)
notifPromotions    Boolean  @default(true)
notifOrderUpdates  Boolean  @default(true)
notifNewsletter    Boolean  @default(false)
orders             Order[]
addresses          Address[]
favorites          Favorite[]
payments           Payment[]
createdAt          DateTime @default(now())
updatedAt          DateTime @updatedAt
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| name | String | Nombre |
| lastName | String | Apellido |
| email | String | Email único |
| phone | String | Teléfono |
| passwordHash | String? | Hash bcrypt (nullable — auth se implementa después) |
| avatar | String | URL del avatar |
| level | String | Nivel del usuario (Silver, Gold, Premium) |
| birthDate | String? | Fecha de nacimiento |
| registeredAt | DateTime | Fecha de registro |
| role | String | Rol (user, admin) |
| status | String | Estado (activo, bloqueado) |
| language | String? | Idioma preferido (default: "es") |
| currency | String? | Moneda preferida (default: "ARS") |
| notifEmail | Boolean | Notificaciones por email |
| notifSms | Boolean | Notificaciones por SMS |
| notifPromotions | Boolean | Promociones |
| notifOrderUpdates | Boolean | Actualizaciones de pedido |
| notifNewsletter | Boolean | Newsletter |
| orders | Order[] | Relación 1:N |
| addresses | Address[] | Relación 1:N |
| favorites | Favorite[] | Relación 1:N |
| payments | Payment[] | Relación 1:N |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Última modificación |

Relaciones:
- 1:N con Order
- 1:N con Address
- 1:N con Favorite
- 1:N con Payment

---

### Order

```
id              String      @id @default(cuid())
number          String      @unique      (ej: "FS-2026-0001")
userId          String
user            User        @relation(fields: [userId], references: [id])
status          String      @default("pendiente")   (pendiente | procesando | enviado | entregado | cancelado)
total           Float
paymentMethod   String      (PagoFacil | Mercado Pago | Tarjeta | Rapipago | Transferencia)
addressSnapshot String      (texto plano, se copia al momento de la orden)
notes           String?
items           OrderItem[]
createdAt       DateTime    @default(now())
updatedAt       DateTime    @updatedAt
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| number | String | Número de orden único (autogenerado) |
| userId | String | FK a User |
| status | String | Estado: pendiente, procesando, enviado, entregado, cancelado |
| total | Float | Monto total |
| paymentMethod | String | Método de pago usado |
| addressSnapshot | String | Dirección completa capturada al momento de la orden (no FK, no se actualiza aunque el usuario cambie su dirección después) |
| notes | String? | Notas del cliente |
| items | OrderItem[] | Relación 1:N |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Última modificación |

Relaciones:
- N:1 con User
- 1:N con OrderItem
- 1:1 con Payment (opcional)

---

### OrderItem

Snapshot de cada producto al momento de la compra (no FK a Product para preservar el histórico aunque el producto se elimine después).

```
id        String  @id @default(cuid())
orderId   String
order     Order   @relation(fields: [orderId], references: [id])
productId String
name      String
price     Float
quantity  Int
image     String?
variantId String?  (FK opcional a Variant)
size      String?  (snapshot de la variante seleccionada)
color     String?  (snapshot de la variante seleccionada)
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| orderId | String | FK a Order |
| productId | String | ID del producto (referencial, no FK — el producto puede eliminarse) |
| name | String | Nombre del producto al momento de la compra |
| price | Float | Precio unitario al momento de la compra |
| quantity | Int | Cantidad |
| image | String? | URL de imagen al momento de la compra |
| variantId | String? | FK opcional a Variant (seleccionada en el checkout) |
| size | String? | Talla seleccionada (snapshot) |
| color | String? | Color seleccionado (snapshot) |
| order | Order | Relación N:1 |

---

### Address

```
id         String   @id @default(cuid())
userId     String
user       User     @relation(fields: [userId], references: [id])
name       String    (Casa, Oficina, etc.)
street     String
city       String
department String
postalCode String
phone      String
isDefault  Boolean  @default(false)
createdAt  DateTime @default(now())
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| userId | String | FK a User |
| name | String | Nombre o alias (Casa, Oficina, etc.) |
| street | String | Dirección completa |
| city | String | Ciudad |
| department | String | Departamento |
| postalCode | String | Código postal |
| phone | String | Teléfono de contacto |
| isDefault | Boolean | Si es la dirección predeterminada |
| createdAt | DateTime | Fecha de creación |

Restricciones:
- Solo una dirección puede tener `isDefault = true` por usuario

---

### Favorite

```
id        String   @id @default(cuid())
userId    String
user      User     @relation(fields: [userId], references: [id])
productId String
product   Product  @relation(fields: [productId], references: [id])
createdAt DateTime @default(now())

@@unique([userId, productId])
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| userId | String | FK a User |
| productId | String | FK a Product |
| createdAt | DateTime | Fecha de creación |

Restricciones:
- `@@unique([userId, productId])` — un usuario no puede tener el mismo producto dos veces en favoritos

---

### Payment

```
id            String   @id @default(cuid())
transactionId String   @unique
orderId       String?  (nullable — puede vincularse después)
userId        String
user          User     @relation(fields: [userId], references: [id])
amount        Float
method        String   (Tarjeta | Transferencia | Rapipago | Mercado Pago)
status        String   (completado | pendiente | fallido | reembolsado)
product       String   (nombre del producto para visibilidad rápida)
date          DateTime @default(now())
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | Identificador único |
| transactionId | String | ID de transacción único |
| orderId | String? | FK opcional a Order (se vincula después de crear la orden) |
| userId | String | FK a User |
| amount | Float | Monto |
| method | String | Método de pago |
| status | String | Estado del pago |
| product | String | Nombre del producto (para vista rápida en admin sin JOIN) |
| date | DateTime | Fecha del pago |
| user | User | Relación N:1 |

---

## Resumen de Relaciones

| Origen | Relación | Destino | Tipo |
|--------|----------|---------|------|
| Category | 1 ── N | Product | Obligado |
| Product | N ── 1 | Category | Obligado |
| Product | 1 ── N | Variant | Opcional |
| Product | 1 ── N | Favorite | Opcional |
| User | 1 ── N | Order | Obligado |
| User | 1 ── N | Address | Obligado |
| User | 1 ── N | Favorite | Obligado |
| User | 1 ── N | Payment | Obligado |
| Order | 1 ── N | OrderItem | Obligado |
| Order | N ── 1 | User | Obligado |
| OrderItem | N ── 1 | Order | Obligado |
| Address | N ── 1 | User | Obligado |
| Favorite | N ── 1 | User | Obligado |
| Favorite | N ── 1 | Product | Obligado |
| Payment | N ── 1 | User | Obligado |
| Variant | N ── 1 | Product | Obligado |

---

## Decisión de Diseño: Carrito

El carrito **no está en DB**. Vive en localStorage y se envía al backend al hacer checkout:

```
CartItem (localStorage)
├── productId: string
├── variantId?: string    (variante seleccionada si aplica)
├── size?: string          (talla seleccionada)
├── color?: string         (color seleccionado)
├── name: string
├── price: number
├── image: string
└── quantity: number
```

Al hacer checkout:
1. Frontend envía `{ items: CartItem[], form: FormData }` a `POST /api/orders`
2. Backend crea Order + OrderItems en DB
3. Frontend limpia localStorage

---

## Decisión de Diseño: Dirección en Órdenes

`addressSnapshot` es texto plano, no FK a Address. Esto asegura que:
- La orden conserve la dirección exacta que el usuario ingresó al comprar
- Si el usuario modifica su dirección después, las órdenes anteriores no cambian

---

## SEO Implementado

| Aspecto | Detalle |
|---------|---------|
| Metadata | `generateMetadata()` en páginas dinámicas, `export const metadata` en estáticas |
| OpenGraph | `og:title`, `og:description`, `og:type`, `og:locale: es_AR` |
| Twitter Cards | `summary_large_image` |
| JSON-LD | Organization (layout global) + Product (detalle de producto) |
| Geo tags | `geo.region: AR-X`, `geo.placename: Córdoba`, `geo.position` |
| Canonical | URLs canónicas en todas las páginas |
| noindex | `/admin/*`, `/profile/*`, `/checkout`, `/login` |

## Próximos Pasos

1. Traducir este modelo a `prisma/schema.prisma`
2. Configurar `DATABASE_URL` en `.env` para PostgreSQL local
3. Ejecutar `npx prisma migrate dev --name init`
4. Crear seed con datos actuales de mock (`src/lib/products.ts`, `src/lib/profile-data.ts`, `src/lib/admin-data.ts`)
5. Generar API routes (`src/app/api/*`)
6. Crear hooks SWR (`src/hooks/use-products.ts`, etc.)
7. Reemplazar mock data con consultas a Prisma + hooks SWR
