# Análisis Completo — FrankStore

## Bugs Críticos

| Bug | Ubicación | Impacto |
|---|---|---|
| Checkout muestra resumen vacío después de `clearCart()` | `src/app/checkout/page.tsx:103` | El usuario nunca ve el resumen de su pedido |
| Dirección del WhatsApp es Argentina (`5493517580449`) en una tienda "colombiana" | `src/app/checkout/page.tsx:15` | Inconsistencia de mercado |
| Favoritos del botón Heart no hacen nada | `src/components/add-to-cart-button.tsx:36-38` | Funcionalidad rota |
| Formulario de guardar perfil no guarda nada | `src/app/profile/page.tsx` | Botón inútil |
| Formulario de nueva dirección nunca agrega | `src/app/profile/addresses/page.tsx:154` | CRUD roto |
| Búsqueda del header no filtra nada | `src/components/header.tsx` | UX deficiente |
| Newsletter del home no tiene handler | `src/app/page.tsx:76-87` | CTA inútil |
| Botones de eliminar en admin no tienen onClick | `src/app/admin/productos/page.tsx` | Acciones rota |

## Problemas de Performance

| Problema | Archivo | Solución |
|---|---|---|
| `totalItems`, `totalPrice`, `isEmpty` se recalculan en cada render | `src/context/cart-context.tsx:93-95` | Envolver en `useMemo` |
| `setTimeout` no se limpia al desmontar componente | `src/components/product-card.tsx`, `src/components/add-to-cart-button.tsx` | `useEffect` cleanup |
| `URL.createObjectURL` nunca se revoca | `src/components/admin-product-form.tsx:34` | `URL.revokeObjectURL` en cleanup |
| No hay `React.memo` en componentes que consumen contexto | `src/components/header.tsx`, `src/components/product-card.tsx` | Memoizar componentes |
| El carrusel no pausa en hover | `src/components/product-carousel.tsx` | Agregar `onMouseEnter/Leave` |

## Violaciones DRY (Código Repetido)

| Código duplicado | Archivos | Solución |
|---|---|---|
| Lógica "Agregado ✓" con timer de 2s | `product-card.tsx` + `add-to-cart-button.tsx` | Hook `useAddedToCart()` |
| Badge de estado de pedido | `profile/page.tsx` + `profile/orders/page.tsx` | Componente `StatusBadge` compartido |
| Array de navegación del perfil | `profile-sidebar.tsx` + `profile-mobile-nav.tsx` | Constante `PROFILE_NAV_ITEMS` |
| Filtros de categoría | `catalogo/page.tsx`, `header.tsx`, `footer.tsx` | Módulo de datos de navegación |
| `toLocaleString("es-CO")` | 15+ archivos | Utilidad `formatCOP(price)` |
| `border-0 shadow-sm` en cards | 20+ ocurrencias | Wrapper o config de Tailwind |

## Código Muerto

| Archivo | Estado |
|---|---|
| `src/components/hero.tsx` | Definido pero nunca importado |
| `src/components/ui/navigation-menu.tsx` | Nunca usado |
| `src/components/ui/progress.tsx` | Nunca usado |
| `src/components/ui/tooltip.tsx` | Nunca usado |
| `src/components/ui/dropdown-menu.tsx` | Nunca usado |

## Problemas de Arquitectura

1. **Sin backend**: Prisma está en `package.json` pero nunca se importa. Todos los datos son estáticos.
2. **Sin autenticación**: Las rutas `/admin/*` son accesibles para cualquiera.
3. **Sin estados de carga**: No hay skeletons ni spinners. Cuando se conecte un backend, todo será lento sin feedback.
4. **Sin `error.tsx`**: Si algo falla, el usuario ve la página de error genérica de Next.js.
5. **Sin `not-found.tsx`**: Solo el producto maneja 404. Las demás rutas no.
6. **Toggle de tema inactivo**: Los botones Claro/Oscuro/Sistema en settings no funcionan.

## Accesibilidad

- Sin `aria-label` en botones de solo icono (buscar, menú, carrito)
- Puntos del carrusel sin `aria-current`
- Sin gestión de foco en diálogos
- Sin skip-to-content link
- Posibles problemas de contraste con `text-primary/20`

## Prioridades

| Prioridad | Acción |
|---|---|
| **P0** | Arreglar checkout success (muestra datos vacíos), conectar backend, autenticación |
| **P1** | Extraer hooks compartidos, `useMemo` en cart, limpiar timers, hacer búsqueda funcional |
| **P2** | Eliminar código muerto, agregar loading skeletons, fix WhatsApp número |
| **P3** | Validación con zod, toasts en admin, SEO metadata, facturas |
