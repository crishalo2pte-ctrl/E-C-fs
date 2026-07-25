# Admin Panel Plan - FrankStore

## 📋 Resumen Ejecutivo

El panel de administración de FrankStore está siendo migrado de datos mock a una arquitectura completa con Prisma/PostgreSQL, API REST y hooks SWR. Actualmente se encuentra en la **Fase 2** con autenticación básica implementada.

---

## 🎯 Objetivos del Proyecto

1. **Sincronización completa Frontend + Backend** para el panel de admin
2. **CRUD funcional** para productos, usuarios y pagos
3. **Autenticación** para proteger rutas admin
4. **UI/UX consistente** con el resto de la tienda

---

## 📊 Estado Actual (25/Julio/2026)

### ✅ COMPLETADO

#### Infraestructura Backend
- **Base de datos**: PostgreSQL nativo Windows (puerto 5432)
- **DB Name**: `frankstore`, User: `frankstore_user`, Password: `frankstore_password`
- **Prisma**: Schema con 9 modelos migrados y seed ejecutado
- **API Routes**: 14 endpoints REST implementados
- **SWR Hooks**: 9 hooks creados (productos, usuarios, pagos, perfil, etc.)

#### Admin Pages
| Página | Estado | Datos |
|--------|--------|-------|
| **Dashboard** (`/admin`) | ✅ Server Component | Prisma directo |
| **Productos** (`/admin/productos`) | ✅ Client Component | SWR → `GET /api/admin/products` |
| **Productos/nuevo** (`/admin/productos/nuevo`) | ✅ Server Component | Prisma categorías → AdminProductForm → `POST /api/admin/products` |
| **Productos/[id]/editar** | ✅ Server Component | Prisma producto + categorías → AdminProductForm → `PUT /api/admin/products/[id]` |
| **Usuarios** (`/admin/usuarios`) | ✅ Client Component | SWR → `GET /api/admin/users` |
| **Pagos** (`/admin/pagos`) | ✅ Client Component | SWR → `GET /api/admin/payments` |
| **Login** (`/admin/login`) | ⚠️ Demo | Acepta cualquier credencial |

#### API Endpoints
| Endpoint | Método | Estado |
|----------|--------|--------|
| `/api/admin/products` | GET | ✅ Listar todos |
| `/api/admin/products` | POST | ✅ Crear nuevo |
| `/api/admin/products/[id]` | PUT | ✅ Actualizar |
| `/api/admin/products/[id]` | DELETE | ✅ Eliminar |
| `/api/admin/users` | GET | ✅ Listar (excluye admin) |
| `/api/admin/users/[id]` | PATCH | ✅ Toggle status (bloquear/desbloquear) |
| `/api/admin/payments` | GET | ✅ Listar todos |

---

## 🔜 PENDIENTES (Fase 3)

### 1. Users CRUD Completo

#### 1.1 API GET single user
**Archivo**: `src/app/api/admin/users/[id]/route.ts`

```typescript
// Endpoint GET para obtener un usuario específico
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id } })
  
  if (!user) {
    return NextResponse.json(
      { message: "Usuario no encontrado" },
      { status: 404 }
    )
  }

  const ordersCount = await prisma.order.count({
    where: { userId: user.id }
  })
  
  const payments = await prisma.payment.findMany({
    where: { userId: user.id }
  })
  
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0)

  return NextResponse.json({
    id: user.id,
    name: `${user.name} ${user.lastName}`,
    email: user.email,
    role: user.role,
    status: user.status,
    orders: ordersCount,
    totalSpent,
    joined: user.registeredAt.toLocaleDateString("es-AR"),
    phone: user.phone,
    level: user.level,
    avatar: user.avatar,
  })
}
```

#### 1.2 API PUT full user edit
**Archivo**: `src/app/api/admin/users/[id]/route.ts`

```typescript
// Endpoint PUT para actualizar un usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { name, lastName, email, phone, role, level } = body

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json(
      { message: "Usuario no encontrado" },
      { status: 404 }
    )
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(lastName !== undefined && { lastName }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(role !== undefined && { role }),
      ...(level !== undefined && { level }),
    },
  })

  return NextResponse.json({
    id: updated.id,
    name: `${updated.name} ${updated.lastName}`,
    email: updated.email,
    role: updated.role,
    status: updated.status,
  })
}
```

#### 1.3 Incluir admin user en la lista
**Archivo**: `src/app/api/admin/users/route.ts`

```typescript
// Quitar el filtro que excluye admin
export async function GET() {
  const users = await prisma.user.findMany({
    // ❌ ELIMINAR: where: { role: { not: "admin" } }
    orderBy: { createdAt: "desc" },
  })
  // ... resto del código
}
```

#### 1.4 Modal de edición en Admin UI
**Archivo**: `src/app/admin/usuarios/page.tsx`

Agregar:
- Botón de editar (pencil icon) junto al botón de status
- Modal/Formulario de edición con campos: nombre, email, rol
- Conexión con `GET /api/admin/users/[id]` para cargar datos
- Conexión con `PUT /api/admin/users/[id]` para guardar cambios

---

### 2. Incluir admin user `adm_001` en la lista

El admin user está en el seed pero no aparece en la lista porque el endpoint `GET /api/admin/users` tiene el filtro `role: { not: "admin" }`.

**Solución**: Eliminar ese filtro para que todos los usuarios (incluidos admins) aparezcan en la lista.

---

### 3. Autenticación real (Fase 4)

#### 3.1 Login funcional
**Archivo**: `src/app/api/admin/login/route.ts`

```typescript
// Endpoint que valide credenciales reales
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    )
  }
  
  // Generar token JWT o sesión
  const token = generateToken(user.id)
  
  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: `${user.name} ${user.lastName}`,
      email: user.email,
      role: user.role,
    }
  })
}
```

#### 3.2 Protección de rutas
**Archivo**: `src/middleware.ts`

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next()
  }

  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}
```

#### 3.3 Admin layout con sesión
**Archivo**: `src/components/admin-layout.tsx`

```typescript
// Leer sesión desde localStorage
const session = JSON.parse(localStorage.getItem("admin_session") || "null")

if (!session) {
  router.push("/admin/login")
}
```

---

## 🗂️ Archivos Importantes

### Backend
- `prisma/schema.prisma` - Schema de base de datos
- `prisma/seed.ts` - Datos iniciales
- `src/app/api/admin/` - Endpoints API
- `src/hooks/use-admin-*.ts` - Hooks SWR

### Frontend
- `src/app/admin/` - Pages del admin
- `src/components/admin-layout.tsx` - Layout con sidebar
- `src/components/admin-product-form.tsx` - Formulario de productos

---

## 🚀 Próximos Pasos (por prioridad)

1. **URGENTE**: Corregir bug de carga del admin (ver issue arriba)
2. **ALTA**: Implementar Users CRUD completo
3. **MEDIA**: Login funcional con JWT
4. **BAJA**: Perfil de admin editable
5. **OPCIONAL**: Dashboard con métricas en tiempo real

---

## 📝 Notas Técnicas

### Stack Actual
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Prisma v7, PostgreSQL nativo Windows
- **Auth**: Cookie-based (próximamente JWT)
- **Data Fetching**: SWR para Client Components, Prisma directo para Server Components

### Decisiones de Arquitectura
1. **Server Components** para páginas que necesitan datos frescos (dashboard, forms)
2. **Client Components** con SWR para páginas que necesitan interacción (listas con búsqueda/filtros)
3. **API Routes** como capa de abstracción entre frontend y Prisma
4. **Proxy** para protección de rutas en Next.js 16

---

## 🔄 Changelog

### 25/Julio/2026
- Implementado CRUD completo de productos
- Implementado endpoints de usuarios y pagos
- Creados hooks SWR para admin
- Implementado proxy para protección de rutas
- **BUG**: Admin page no carga - investigando...

---

*Documento generado automáticamente - FrankStore Admin Panel Plan*
