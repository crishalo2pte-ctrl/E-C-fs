# DBFIXES - Plan de Corrección del Backend

## FASE 1: CRÍTICOS (Hacer primero)

### 1.1 Seguridad del `.env`
- [ ] Verificar que `.env` NO esté en el historial de git (`git log --all --full-history -- .env`)
- [ ] Si está en git history, rotar todas las credenciales (DB password, Cloudinary API secret, JWT secrets)
- [ ] Confirmar que `.gitignore` excluye `.env*`
- [ ] Generar nuevos JWT secrets de al menos 64 caracteres cryptográficamente aleatorios

### 1.2 Fix `verifyRefreshToken()` en `src/lib/auth.ts`
- [ ] Cambiar `generateRefreshToken()` para generar JWTs en vez de random hex
- [ ] O implementar verificación de refresh tokens desde DB en vez de JWT verify
- [ ] Crear endpoint `POST /api/auth/refresh` para renovar access tokens

---

## FASE 2: ALTOS (Seguridad y Auth)

### 2.1 Cookie mismatch admin
- [ ] En `src/app/api/admin/login/route.ts`: cambiar `admin_token` → `auth_token`
- [ ] En `src/lib/auth.ts:getTokenFromRequest()`: aceptar ambos cookies (`auth_token` y `admin_token`)
- [ ] Agregar campo `role` al payload del JWT para que `requireAdmin()` pueda verificar sin query extra

### 2.2 Crear `middleware.ts` (Next.js Middleware)
- [ ] Crear `src/middleware.ts` con protección de rutas:
  - `/admin/*` → require JWT con role=admin
  - `/profile/*` → require JWT autenticado
  - `/api/admin/*` → require JWT con role=admin
- [ ] Redirigir a `/login` si no autenticado

### 2.3 Sincronizar status enums
- [ ] **Opción A** (recomendada): Cambiar `status-config.ts` para que coincida con el schema de Prisma:
  ```
  OrderStatus: pendiente | confirmada | enviada | entregada | cancelada
  UserStatus: activo | bloqueado
  ```
- [ ] **Opción B**: Cambiar el schema de Prisma para coincidir con el UI:
  ```
  OrderStatus: pendiente | procesando | enviado | entregado | cancelado
  UserStatus: activo | inactivo
  ```
- [ ] Ejecutar migración si se elige opción B
- [ ] Actualizar `seed.ts` con los valores correctos

### 2.4 Fix race condition en número de orden
- [ ] En `api/orders/route.ts`: usar database sequence o unique constraint con retry
- [ ] Ejemplo: `SELECT nextval('order_number_seq')` o usar UUID

### 2.5 Fix N+1 en admin/users
- [ ] En `api/admin/users/route.ts`: reemplazar queries individuales con:
  ```typescript
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true } },
      orders: {
        select: { total: true },
      },
    },
  });
  ```
- [ ] Calcular total spent con `.reduce()` en el resultado

### 2.6 Protección anti-auto-democión de admin
- [ ] En `api/admin/users/[id]/route.ts`:
  - Impedir que un admin cambie su propio rol a "user"
  - Impedir que un admin se bloquee a sí mismo
  - Contar admins activos antes de permitir cambio de rol

### 2.7 Login: rate limiting y validación
- [ ] Agregar rate limiting al endpoint de login (máx 5 intentos/min)
- [ ] Separar login de registro en endpoints distintos
- [ ] Agregar validación de email en registro

---

## FASE 3: MEDIOS (Data Integrity)

### 3.1 Fix Prisma Schema
- [ ] `birthDate`: cambiar de `String?` a `DateTime?`
- [ ] Agregar FK relation en `Payment.orderId` → `Order.id`
- [ ] Cambiar `Float` a `Decimal` para precios (`Product.price`, `Order.total`, `Payment.amount`)
- [ ] Agregar `currency` a la migración si falta

### 3.2 Fix Seed data
- [ ] Corregir IDs de productos en ordenes para que coincidan con productos reales
- [ ] Unificar escala de precios (decidir: ARS con decimales o enteros)
- [ ] Unificar email de usuario (diego@frankstore.com.ar o .co)

### 3.3 Fix validación en API orders
- [ ] En `api/orders/route.ts` POST:
  - Validar que cada `productId` existe en la DB
  - Obtener precios de la DB en vez de confiar en el cliente
  - Recalcular total server-side

### 3.4 Fix profile data dual
- [ ] Eliminar `profile-context.tsx` (localStorage) o sincronizar con `use-profile.ts` (API)
- [ ] Hacer que `profile-context.tsx` lea de la API en vez de localStorage

### 3.5 Limpiar mock data legacy
- [ ] Eliminar `src/lib/products.ts` → mover tipo `Product` a `src/types/product.ts`
- [ ] Eliminar `src/lib/admin-data.ts` → mover tipos a `src/types/admin.ts`
- [ ] Eliminar `src/lib/profile-data.ts` → mover tipos a `src/types/profile.ts`
- [ ] Actualizar imports en todos los hooks y componentes

### 3.6 Unificar precios
- [ ] Decidir escala:ARS con decimales (79.90) o enteros (79900)
- [ ] Actualizar seed, create-products.ts y cualquier mock data
- [ ] Actualizar `formatARS` si es necesario

---

## FASE 4: BAJOS (Mejoras)

### 4.1 Paginación
- [ ] Agregar paginación a `GET /api/products` (limit/offset o cursor)
- [ ] Agregar paginación a `GET /api/admin/users`

### 4.2 Input validation
- [ ] Agregar validación con Zod a todos los endpoints POST/PUT/PATCH
- [ ] Validar email uniqueness al actualizar perfil
- [ ] Validar campos de dirección no vacíos

### 4.3 Revalidation
- [ ] En `api/admin/products` POST/PUT/DELETE: revalidar paths específicos:
  ```typescript
  revalidatePath("/");
  revalidatePath(`/productos/${slug}`);
  revalidatePath("/catalogo");
  ```

### 4.4 Cloudinary error handling
- [ ] En `src/lib/cloudinary.ts`: envolver `deleteImage` en try-catch con logging

### 4.5 Phone number consistency
- [ ] Decidir: +57 (Colombia) o +54 (Argentina)
- [ ] Actualizar default en profile-context.tsx

---

## COMANDOS ÚTILES

```bash
# Verificar si .env fue commiteado
git log --all --full-history -- .env

# Regenerar migración después de cambios al schema
npx prisma migrate dev --name <nombre>

# Generar Prisma client
npx prisma generate

# Ejecutar seed
npx prisma db seed

# Verificar tipos TypeScript
npx tsc --noEmit

# Lint
npm run lint
```

---

## NOTA SOBRE MONEDA

El proyecto parece estar en transición entre:
- **Colombian Pesos (COP)**: precios grandes (79,900) en mock data
- **Argentine Pesos (ARS)**: precios pequeños (79.9) en seed + `formatARS`

**Decisión pendiente**: ¿qué moneda usa el proyecto? Actualizar todos los archivos según corresponda.
