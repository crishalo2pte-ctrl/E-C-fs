# Diagrama de Usuarios - FrankStore

## 📊 Estructura de Usuarios en el Sistema

### 🎭 Tipos de Usuario

```
┌─────────────────────────────────────────────────────────┐
│                    FRANKSTORE USERS                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  👤 USUARIO REGULAR (role: "user")                      │
│  ├── Puede comprar productos                            │
│  ├── Tiene carrito de compras                           │
│  ├── Puede guardar favoritos                            │
│  ├── Tiene direcciones de envío                         │
│  ├── Realiza pedidos                                    │
│  └── Ve su perfil y historial                           │
│                                                         │
│  👨‍💼 ADMINISTRADOR (role: "admin")                       │
│  ├── Acceso al panel de admin                           │
│  ├── Gestiona productos (CRUD)                          │
│  ├── Gestiona usuarios                                  │
│  ├── Ve reportes de pagos                               │
│  ├── Ve estadísticas del dashboard                      │
│  └── Puede bloquear/desbloquear usuarios                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🗄️ Modelo de Datos (Prisma Schema)

```
┌─────────────────────────────────────────────────────────┐
│                     USER MODEL                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  id             String    @id                           │
│  name           String                                  │
│  lastName       String                                  │
│  email          String    @unique                       │
│  phone          String                                  │
│  passwordHash   String?                                 │
│  avatar         String    @default("")                  │
│  level          String    @default("Silver")            │
│  birthDate      String?                                 │
│  registeredAt   DateTime  @default(now())               │
│  role           String    @default("user")              │
│  status         String    @default("activo")            │
│  language       String?   @default("es")                │
│  currency       String?   @default("ARS")               │
│                                                         │
│  RELACIONES:                                            │
│  ├── orders       Order[]                               │
│  ├── addresses    Address[]                             │
│  ├── favorites    Favorite[]                            │
│  └── payments     Payment[]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 📊 Diagrama de Relaciones

```
┌──────────────┐        ┌──────────────────┐        ┌──────────────┐
│    User      │        │     Order        │        │   Product    │
├──────────────┤        ├──────────────────┤        ├──────────────┤
│ id           │───────<│ userId           │        │ id           │
│ name         │        │ number           │        │ name         │
│ lastName     │        │ status           │        │ slug         │
│ email        │        │ total            │        │ price        │
│ role         │        │ paymentMethod    │        │ image        │
│ status       │        │ addressSnapshot  │        │ categoryId   │
│ level        │        │ notes            │        │ featured     │
└──────────────┘        │ createdAt        │        │ bestSeller   │
        │               └──────────────────┘        └──────────────┘
        │                       │                         │
        │                       │ 1:N                     │ 1:N
        │                       ▼                         ▼
        │               ┌──────────────────┐        ┌──────────────┐
        │               │   OrderItem      │        │   Favorite   │
        │               ├──────────────────┤        ├──────────────┤
        │               │ orderId          │        │ userId       │
        │               │ productId        │        │ productId    │
        │               │ name             │        │ createdAt    │
        │               │ price            │        └──────────────┘
        │               │ quantity         │
        │               │ image            │
        │               │ variantId        │
        │               └──────────────────┘
        │
        │ 1:N
        ▼
┌──────────────────┐        ┌──────────────────┐
│    Address       │        │    Payment       │
├──────────────────┤        ├──────────────────┤
│ userId           │        │ userId           │
│ name             │        │ transactionId    │
│ street           │        │ orderId          │
│ city             │        │ amount           │
│ department       │        │ method           │
│ postalCode       │        │ status           │
│ phone            │        │ product          │
│ isDefault        │        │ date             │
└──────────────────┘        └──────────────────┘
```

### 🔄 Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────┐
│                    FLUJO DE LOGIN                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Usuario ingresa a /admin/login                      │
│                                                         │
│  2. Ingresa credenciales (email + password)             │
│                                                         │
│  3. Frontend envía POST a /api/admin/login              │
│     {                                                   │
│       "email": "admin@frankstore.com.ar",               │
│       "password": "admin123"                            │
│     }                                                   │
│                                                         │
│  4. Backend busca usuario en DB:                        │
│     prisma.user.findUnique({ where: { email } })       │
│                                                         │
│  5. Verifica que role === "admin"                       │
│                                                         │
│  6. Si es admin: genera token JWT                       │
│     token = jwt.sign({ id, name, email, role })        │
│                                                         │
│  7. Devuelve respuesta con token:                       │
│     {                                                   │
│       "token": "eyJhbGciOiJIUzI1NiIs...",              │
│       "user": { id, name, email, role }                │
│     }                                                   │
│                                                         │
│  8. Frontend guarda token en localStorage:              │
│     localStorage.setItem("admin_session", token)       │
│                                                         │
│  9. Redirige a /admin                                   │
│                                                         │
│  10. Proxy verifica cookie "admin_token"                │
│      - Si existe: permite acceso                        │
│      - Si no existe: redirige a /admin/login            │
│                                                         │
│  11. AdminLayout lee sesión de localStorage             │
│      - Muestra sidebar con nombre del admin             │
│      - Permite acceso a todas las secciones              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 📊 Usuarios de Ejemplo (Seed Data)

```
┌─────────────────────────────────────────────────────────┐
│               USUARIOS EN LA BASE DE DATOS             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  👤 USUARIO REGULAR:                                    │
│  ├── ID: usr_001                                        │
│  ├── Nombre: Diego Ramírez                              │
│  ├── Email: diego@frankstore.com.ar                     │
│  ├── Teléfono: +54 351 456 7890                         │
│  ├── Nivel: Premium                                     │
│  ├── Rol: user                                          │
│  ├── Estado: activo                                     │
│  ├── Idioma: es                                         │
│  ├── Moneda: ARS                                        │
│  ├── Notificaciones:                                    │
│  │   ├── Email: ✅                                      │
│  │   ├── SMS: ❌                                        │
│  │   ├── Promociones: ✅                                │
│  │   ├── Actualización pedidos: ✅                      │
│  │   └── Newsletter: ❌                                 │
│  ├── Direcciones: 3                                     │
│  ├── Pedidos: 6                                         │
│  └── Favoritos: 6 productos                             │
│                                                         │
│  👨‍💼 ADMINISTRADOR:                                      │
│  ├── ID: adm_001                                        │
│  ├── Nombre: Admin FrankStore                           │
│  ├── Email: admin@frankstore.com.ar                     │
│  ├── Teléfono: +54 351 555 0000                         │
│  ├── Nivel: Premium                                     │
│  ├── Rol: admin                                         │
│  ├── Estado: activo                                     │
│  ├── Idioma: es                                         │
│  ├── Moneda: ARS                                        │
│  └── PasswordHash: (no establecido - acepta cualquier) │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🔐 Permisos por Rol

```
┌─────────────────────────────────────────────────────────┐
│                   PERMISOS POR ROL                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 USUARIO REGULAR (role: "user"):                     │
│  ├── ✅ Ver catálogo de productos                       │
│  ├── ✅ Agregar productos al carrito                    │
│  ├── ✅ Realizar compras                                │
│  ├── ✅ Ver historial de pedidos                        │
│  ├── ✅ Gestionar direcciones                           │
│  ├── ✅ Guardar favoritos                               │
│  ├── ✅ Ver perfil                                      │
│  ├── ✅ Editar perfil                                   │
│  ├── ❌ Acceder a panel admin                           │
│  ├── ❌ Gestionar productos                             │
│  ├── ❌ Ver reportes de pagos                           │
│  └── ❌ Gestionar usuarios                              │
│                                                         │
│  👨‍💼 ADMINISTRADOR (role: "admin"):                       │
│  ├── ✅ Todo lo del usuario regular                     │
│  ├── ✅ Acceder a panel admin                           │
│  ├── ✅ Ver dashboard con estadísticas                  │
│  ├── ✅ Crear productos                                 │
│  ├── ✅ Editar productos                                │
│  ├── ✅ Eliminar productos                              │
│  ├── ✅ Ver lista de usuarios                           │
│  ├── ✅ Editar usuarios                                 │
│  ├── ✅ Bloquear/desbloquear usuarios                   │
│  ├── ✅ Ver reportes de pagos                           │
│  └── ✅ Ver estadísticas de ventas                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🔄 Flujo de Datos - Admin Panel

```
┌─────────────────────────────────────────────────────────┐
│              FLUJO DE DATOS EN ADMIN PANEL              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐      ┌──────────────┐                │
│  │   Browser    │      │   Server     │                │
│  │  (React)     │      │  (Next.js)   │                │
│  └──────────────┘      └──────────────┘                │
│         │                       │                       │
│         │ 1. GET /api/admin/products                    │
│         │──────────────────────>│                       │
│         │                       │                       │
│         │                       │ 2. prisma.product.findMany()
│         │                       │──────────────────────>│
│         │                       │                       │
│         │                       │ 3. PostgreSQL         │
│         │                       │──────────────────────>│
│         │                       │                       │
│         │                       │ 4. Results            │
│         │                       │<──────────────────────│
│         │                       │                       │
│         │ 5. JSON Response      │                       │
│         │<──────────────────────│                       │
│         │                       │                       │
│  ┌──────────────┐      ┌──────────────┐                │
│  │   SWR Cache  │      │    Prisma    │                │
│  │  (Client)    │      │   (Server)   │                │
│  └──────────────┘      └──────────────┘                │
│         │                       │                       │
│         │ 6. React State Update │                       │
│         │──────────────────────>│                       │
│         │                       │                       │
│         │ 7. Re-render UI       │                       │
│         │<──────────────────────│                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 📊 Tabla de Resumen - Endpoints de Usuarios

```
┌─────────────────────────────────────────────────────────┐
│                ENDPOINTS DE USUARIOS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 GET /api/admin/users                                │
│  ├── Descripción: Lista todos los usuarios              │
│  ├── Respuesta: Array de usuarios                       │
│  ├── Incluye: Órdenes, total gastado, estado           │
│  └── Acceso: Solo admin                                 │
│                                                         │
│  🔍 GET /api/admin/users/[id]                           │
│  ├── Descripción: Obtiene un usuario específico         │
│  ├── Respuesta: Objeto usuario con detalles             │
│  ├── Incluye: Teléfono, nivel, avatar                   │
│  └── Acceso: Solo admin                                 │
│                                                         │
│  ✏️ PUT /api/admin/users/[id]                           │
│  ├── Descripción: Actualiza un usuario                  │
│  ├── Body: { name, lastName, email, phone, role }       │
│  ├── Respuesta: Usuario actualizado                     │
│  └── Acceso: Solo admin                                 │
│                                                         │
│  🔄 PATCH /api/admin/users/[id]                         │
│  ├── Descripción: Toggle estado (activo/bloqueado)      │
│  ├── Respuesta: Usuario con nuevo estado                │
│  └── Acceso: Solo admin                                 │
│                                                         │
│  📊 GET /api/profile                                     │
│  ├── Descripción: Obtiene perfil del usuario actual     │
│  ├── Respuesta: Objeto perfil                           │
│  └── Acceso: Cualquier usuario autenticado              │
│                                                         │
│  ✏️ PATCH /api/profile                                   │
│  ├── Descripción: Actualiza perfil propio               │
│  ├── Body: { name, lastName, email, phone, birthDate }  │
│  ├── Respuesta: Perfil actualizado                      │
│  └── Acceso: Cualquier usuario autenticado              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🎨 Diagrama de Componentes UI

```
┌─────────────────────────────────────────────────────────┐
│              COMPONENTES UI PARA USUARIOS               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📱 admin/usuarios/page.tsx                             │
│  ├── Tabla de usuarios                                  │
│  ├── Búsqueda por nombre/email                          │
│  ├── Botón de editar (pencil icon)                      │
│  ├── Botón de status (shield icon)                      │
│  └── Modal de detalles                                  │
│                                                         │
│  📝 EditUserForm (próximamente)                          │
│  ├── Campos: nombre, email, rol                         │
│  ├── Validación de formulario                           │
│  ├── Conexión con API PUT                               │
│  └── Feedback de éxito/error                            │
│                                                         │
│  📊 UserStats (próximamente)                             │
│  ├── Total de órdenes                                   │
│  ├── Total gastado                                      │
│  ├── Fecha de registro                                  │
│  └── Estado actual                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🔒 Seguridad

```
┌─────────────────────────────────────────────────────────┐
│                   MEDIDAS DE SEGURIDAD                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔐 Autenticación:                                      │
│  ├── JWT tokens para sesiones                           │
│  ├── Cookies HTTP-only para proxy                       │
│  └── Tokens en localStorage para UI                     │
│                                                         │
│  🛡️ Autorización:                                       │
│  ├── Proxy verifica cookie admin_token                  │
│  ├── Admin layout verifica sesión                       │
│  └── Endpoints verifican role === "admin"               │
│                                                         │
│  🔒 Datos Sensibles:                                    │
│  ├── Passwords hasheados (bcrypt)                       │
│  ├── Emails únicos (constraint)                         │
│  └── Tokens con expiración                              │
│                                                         │
│  🚨 Validación:                                         │
│  ├── Input validation en todos los endpoints            │
│  ├── Sanitización de datos                              │
│  └── Rate limiting (próximamente)                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Resumen

Este diagrama muestra la estructura completa de usuarios en FrankStore:

1. **Dos tipos de usuario**: Regular y Administrador
2. **Modelo de datos completo** con todas las relaciones
3. **Flujo de autenticación** paso a paso
4. **Permisos por rol** claramente definidos
5. **Endpoints de API** para operaciones CRUD
6. **Componentes UI** para interactuar con los datos
7. **Medidas de seguridad** implementadas

El sistema está diseñado para ser seguro, escalable y fácil de mantener.

---

*Documento generado automáticamente - FrankStore User Diagram*
