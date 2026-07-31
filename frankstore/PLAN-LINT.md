          
# Plan — Limpiar los 12 errores de lint

Los errores son **pre-existentes** (no fueron introducidos por los fixes de responsividad). Se dividen en 3 grupos:

| Grupo | Errores | Archivos |
|-------|---------|----------|
| 1. `let` → `const` | 2 | `src/app/api/login/route.ts` |
| 2. Hooks condicionales | 6 | `src/app/checkout/page.tsx` |
| 3. setState síncrono en effect | 4 | `profile/page.tsx`, `admin-layout.tsx`, `auth-context.tsx`, `cart-context.tsx` |

---

## Grupo 1 — `let` → `const` (2)

**Archivo:** `src/app/api/login/route.ts`

| Línea | Actual | Fix |
|-------|--------|-----|
| 156 | `let token = request.cookies.get('auth_token')?.value` | `const token = ...` |
| 167 | `let decoded = verifyAccessToken(token)` | `const decoded = ...` |

Ambas variables son solo de lectura; no se reasignan. Cambio seguro.

---

## Grupo 2 — Hooks condicionales (6)

**Archivo:** `src/app/checkout/page.tsx`

**Problema:** los 6 `useState` (form, errors, paymentMethod, processing, success, lastOrder) están declarados **después** del `if (isLoading) return` (líneas 90–97). React exige que los hooks se llamen incondicionalmente y en el mismo orden en cada render.

**Fix:** mover los 6 `useState` a la **parte superior** del componente, justo después de `useCart()`. El skeleton se mantiene como early return (sin hooks después de él).

Estructura resultante:

```tsx
export default function CheckoutPage() {
  const { items, totalPrice, totalItems, isEmpty, isLoading, removeFromCart, updateQuantity, clearCart } = useCart()

  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", address: "", notes: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [paymentMethod, setPaymentMethod] = useState<"pagofacil" | "mercadopago">("pagofacil")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[]; total: number } | null>(null)

  if (isLoading) {
    return (/* skeleton */)
  }
  // ... resto de la lógica sin cambios
}
```

**Bonus (mismo archivo):** quitar `FormEvent` del import de `react` (warning).

---

## Grupo 3 — setState síncrono en effect (4)

> Nota: el linter solo marca `setState` **síncrono** cuyo valor se deriva de una fuente externa (`setUser(JSON.parse())`, `setItems(loadCart())`, etc.). Los setters constantes como `setIsLoading(false)` no son marcados, por eso se conservan.

### 3a. `src/app/profile/page.tsx:36` — patrón "adjust state on prop change"

**Problema:** `setForm({...})` síncrono dentro del `useEffect` que corre cuando `isLoaded` cambia.

**Fix:** patrón oficial de React (derived state durante el render), sin effect:

```tsx
const [form, setForm] = useState({ name: profile.name, lastName: profile.lastName, email: profile.email, phone: profile.phone, birthDate: profile.birthDate })
const [prevIsLoaded, setPrevIsLoaded] = useState(isLoaded)

if (isLoaded && isLoaded !== prevIsLoaded) {
  setPrevIsLoaded(isLoaded)
  setForm({
    name: profile.name,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    birthDate: profile.birthDate,
  })
}
```

Se elimina el `useEffect` completo. **Bonus:** desaparece el warning de `exhaustive-deps`.

### 3b. `src/components/admin-layout.tsx:62` — leer sesión en render

**Problema:** `setSession(s)` síncrono dentro del effect que re-chequea la sesión al navegar.

**Fix:** la sesión se lee durante el render (reactivo a la navegación) en vez de mantenerla en estado:

```tsx
const session = useMemo(() => getSession(), [pathname])

useEffect(() => {
  if (!session) {
    router.replace("/login")
  }
}, [session, router])
```

- `useMemo` estabiliza la referencia entre renders (solo se recalcula al cambiar `pathname`).
- Se elimina `setSession` y el estado `session`.
- El guard `if (!session) return <>{children}</>` queda igual.
- Comportamiento conservado: si la sesión desaparece al navegar, el efecto redirige a `/login`.

### 3c. `src/context/auth-context.tsx:40` — lazy initializer

**Problema:** `setUser(JSON.parse(raw))` síncrono en el effect de mount.

**Fix:** extraer un helper que lea y valide localStorage, y usarlo como inicializador lazy:

```tsx
function loadStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("auth_token")
  if (!token) return null
  const raw = localStorage.getItem("user_data")
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    return null
  }
}

// en el componente:
const [user, setUser] = useState<User | null>(loadStoredUser)
```

El `useEffect` conserva solo `setIsLoading(false)` (constante, no marcada) y el listener de `storage`.

**Bonus (mismo archivo):** quitar `useRouter` del import (warning).

### 3d. `src/context/cart-context.tsx:48` — lazy initializer

**Problema:** `setItems(loadCart())` síncrono en el effect de mount.

**Fix:** usar la función `loadCart()` ya existente como inicializador lazy:

```tsx
const [items, setItems] = useState<CartItem[]>(loadCart)
```

El effect queda solo con `setIsLoading(false)`. El effect de persistencia a localStorage queda igual.

---

## Por qué es seguro

- No hay cambios de comportamiento visible: `isLoading`/`isLoaded` siguen controlando el primer render (evita mismatches de hidratación entre server y client).
- Los lazy initializers leen localStorage solo en el primer render del cliente.
- Solo se reestructura el código para cumplir las reglas de React (`rules-of-hooks`, `set-state-in-effect`).

## Verificación

1. `npm run lint` → deben quedar **0 errores** (pueden permanecer los warnings).
2. `npm run build` → typecheck + build completo.
3. Prueba manual rápida de flujos:
   - Login/logout de admin (redirect a `/login`).
   - Edición de perfil (el form se carga al abrir, no se resetea al tipear).
   - Checkout con ítems (skeleton de carga, stepper de cantidad, pago).
   - Carrito persistiendo en localStorage entre recargas.

## Pendiente opcional

- ~23 warnings restantes: imports sin usar (`profile-mobile-nav`, `profile-sidebar`, `catalogo`, `product-carousel-section`, `orders`, `product-card`), `<img>` → `next/image`, `exhaustive-deps`.
