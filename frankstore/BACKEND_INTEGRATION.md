# FrankStore - Contexto Actualizado para Backend Integration

## Resumen del Estado Actual

Este documento registra el estado actual de los contextos y hooks para facilitar la futura integración con backend real.

---

## 1. CartContext (`src/context/cart-context.tsx`)

### Estado Actual
- **Persistencia**: localStorage (`frankstore-cart`)
- **Hidratación**: Async con flag `isLoading`
- **API expuesta**:
  ```typescript
  interface CartContextType {
    items: CartItem[]
    totalItems: number
    totalPrice: number
    isEmpty: boolean
    isLoading: boolean          // ← NUEVO: para skeletons
    addToCart: (product: Product, qty?: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, qty: number) => void
    clearCart: () => void
  }
  ```

### CartItem Structure
```typescript
interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}
```

### Para Backend
| Cambio Necesario | Descripción |
|------------------|-------------|
| `loadCart()` | Reemplazar con `GET /api/cart` |
| `saveCart()` | Reemplazar con `POST /api/cart` (o sync automático) |
| `addToCart` | `POST /api/cart/items` |
| `removeFromCart` | `DELETE /api/cart/items/:productId` |
| `updateQuantity` | `PATCH /api/cart/items/:productId` |
| `clearCart` | `DELETE /api/cart` |
| `isLoading` | Usar estado real de `useSWR`/`react-query` |

### Skeletons Listos
- `CartSkeleton` en `src/components/skeletons.tsx`

---

## 2. ProfileContext (`src/context/profile-context.tsx`)

### Estado Actual
- **Persistencia**: localStorage (`frankstore-profile`)
- **Hidratación**: Async con flag `isLoaded`
- **API expuesta**:
  ```typescript
  interface ProfileContextType {
    profile: UserProfile
    updateProfile: (data: Partial<UserProfile>) => void
    isEditing: boolean
    setIsEditing: (editing: boolean) => void
    saveProfile: () => void
    isLoaded: boolean           // ← NUEVO: evita hydration mismatch
  }
  ```

### UserProfile Structure
```typescript
interface UserProfile {
  id: string
  name: string
  lastName: string
  email: string
  phone: string
  avatar: string
  level: "Premium" | "Gold" | "Silver"
  registeredAt: string
  birthDate: string
}
```

### Para Backend
| Cambio Necesario | Descripción |
|------------------|-------------|
| `loadProfile()` | Reemplazar con `GET /api/profile` |
| `updateProfile()` | Reemplazar con `PATCH /api/profile` |
| `saveProfile()` | En backend real: confirmación de guardado / toast |
| `isLoaded` | Usar estado real de `useSWR`/`react-query` |

### Skeletons Listos
- `ProfileSkeleton` en `src/components/skeletons.tsx`

---

## 3. Páginas con Skeletons Implementados

| Página | Skeleton | Estado Loading |
|--------|----------|----------------|
| `/catalogo` | `ProductCardSkeleton` ×8 | `showSkeleton` (sin query params) |
| `/producto/[id]` | `ProductoSkeleton` | Componente exportado separado |
| `/checkout` | `CartSkeleton` | `isLoading` del CartContext |
| `/profile/orders` | `OrdersSkeleton` | `useState` simulado (800ms) |
| `/profile/addresses` | `AddressesSkeleton` | `useEffect` simulado (600ms) |
| `/profile/favorites` | `FavoritesSkeleton` | `useState` simulado (600ms) |
| `/admin/productos` | `AdminTableSkeleton` | `useState` simulado (500ms) |

---

## 4. Componentes de Skeleton (`src/components/skeletons.tsx`)

### Exportados
```typescript
export const Skeleton                    // Base
export const ProductCardSkeleton         // Card producto en grid
export const ProductDetailSkeleton       // Página detalle producto
export const CartSkeleton                // Checkout carrito
export const ProfileSkeleton             // Dashboard perfil
export const OrdersSkeleton              // Tabla pedidos
export const AddressesSkeleton           // Grid direcciones
export const FavoritesSkeleton           // Grid favoritos
export const AdminTableSkeleton          // Tabla admin
export const PageHeaderSkeleton          // Header genérico
export const ButtonSkeleton              // Botón genérico
```

### Uso
```tsx
import { ProductCardSkeleton, CartSkeleton } from "@/components/skeletons"

// En grid
{[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}

// En checkout
<CartSkeleton />
```

---

## 5. Mock Data a Reemplazar

| Archivo | Datos | Endpoint Sugerido |
|---------|-------|-------------------|
| `src/lib/products.ts` | `products[]`, `categories[]` | `GET /api/products`, `GET /api/categories` |
| `src/lib/profile-data.ts` | `profileData`, `ordersData`, `addressesData`, `favoritesData` | `GET /api/profile`, `GET /api/orders`, `GET /api/addresses`, `GET /api/favorites` |
| `src/lib/admin-data.ts` | `adminUsers`, `paymentsData` | `GET /api/admin/users`, `GET /api/admin/payments` |

---

## 6. Próximos Pasos para Backend Integration

### Fase 1: API Layer
1. Crear `src/lib/api.ts` con fetcher genérico
2. Definir tipos TypeScript para respuestas API
3. Configurar `axios`/`ky`/`fetch` con interceptors (auth, errors)

### Fase 2: Data Fetching
```tsx
// Patrón recomendado con useSWR
import useSWR from "swr"

function useProducts(params?: ProductParams) {
  const { data, error, isLoading } = useSWR(
    params ? `/api/products?${new URLSearchParams(params)}` : "/api/products",
    fetcher
  )
  return { products: data?.data, isLoading, error }
}
```

### Fase 3: Mutations
```tsx
// Con react-query o useSWR mutate
const { mutate } = useSWR("/api/cart", fetcher)

const addToCart = async (product: Product) => {
  await api.post("/api/cart/items", { productId: product.id })
  mutate() // Revalida cache
}
```

### Fase 4: Auth & Protected Routes
1. Middleware `src/middleware.ts` para rutas `/admin/*` y `/profile/*`
2. JWT en httpOnly cookies o localStorage + refresh token
3. Redirect a `/login` con `next` param

---

## 7. Comandos Útiles

```bash
# Build check
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Dev server
npm run dev
```

---

## 8. Notas Importantes

- **Tailwind v4**: No hay `tailwind.config.js`; config en `src/app/globals.css` con `@theme`
- **Prisma v7**: Client se genera en `src/generated/prisma` (ejecutar `npx prisma generate`)
- **shadcn/ui**: Componentes en `src/components/ui/` con `"use client"` obligatorio
- **Path alias**: `@/*` → `./src/*`
- **No hay API routes aún**: Todo es mock data client-side
- **WhatsApp number**: `+54 9 3517 58-0449` (Argentina, intencional por request usuario)

---

*Generado automáticamente - Actualizar al conectar backend real*