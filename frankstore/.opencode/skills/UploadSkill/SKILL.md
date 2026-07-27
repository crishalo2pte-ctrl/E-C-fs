---
name: uploadskill
description: Create and upload new products to FrankStore admin panel via API. Use when user says "crear producto", "subir producto", "nuevo producto", "add product", "upload product", "agregar producto al catalogo", or wants to list a new item in the store. Handles login, image upload to Cloudinary, and product creation.
---

# UploadSkill — Crear Productos en FrankStore

Workflow completo para crear productos via API del admin. Copiar los comandos PowerShell y ajustar los parametros.

## Parametros del Producto

**Requeridos:**
| Parametro | Tipo | Ejemplo |
|-----------|------|---------|
| `name` | string | "Cuchillo Negro Elegante" |
| `slug` | string | "cuchillo-negro-elegante" (minusculas, guiones) |
| `description` | string | "Descripcion del producto..." |
| `price` | number | 90000 (pesos ARS, sin decimales ni separadores) |
| `categoryId` | string | Ver categorias abajo |
| `image` | string | URL de Cloudinary (se obtiene del paso 2) |

**Opcionales:**
| Parametro | Tipo | Default |
|-----------|------|---------|
| `images` | string[] | `[image]` (galeria, misma URL si es solo 1) |
| `featured` | boolean | `false` (aparece en seccion destacada) |
| `bestSeller` | boolean | `false` (aparece en "Mas Vendidos") |

## Categorias Disponibles

| ID | Nombre |
|----|--------|
| `cat_ropa` | Ropa |
| `cat_imperdibles` | Imperdibles |
| `cat_destacada` | Coleccion Destacada |
| `cat_mas-vendidos` | Mas Vendidos |

## Workflow Completo (PowerShell)

### Paso 0: Verificar servidor

```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000" -Method HEAD -TimeoutSec 2 } catch { npm run dev }
```

### Paso 1: Login Admin

```powershell
$body = @{email="admin@frankstore.com.ar"; password="admin"} | ConvertTo-Json
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/login" -Method POST -ContentType "application/json" -Body $body
$token = $login.token
```

### Paso 2: Subir Imagen a Cloudinary

La imagen debe estar en `public/images/` dentro del proyecto.

```powershell
$imagePath = "C:\Users\Name\Desktop\ecomerce colombiano\frankstore\public\images\TU_IMAGEN.jpg"
$bytes = [System.IO.File]::ReadAllBytes($imagePath)
$boundary = [System.Guid]::NewGuid().ToString()
$bodyLines = @()
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"file`"; filename=`"producto.jpg`""
$bodyLines += "Content-Type: image/jpeg"
$bodyLines += ""
$bodyLines += [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($bytes)
$bodyLines += "--$boundary--"
$body = $bodyLines -join "`r`n"
$upload = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/upload" -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $body -Headers @{"Authorization"="Bearer $token"}
$imageUrl = $upload.url
```

### Paso 3: Crear Producto

```powershell
$body = @{
    name = "Nombre del Producto"
    slug = "nombre-del-producto"
    description = "Descripcion del producto aqui"
    price = 90000
    image = $imageUrl
    images = @($imageUrl)
    categoryId = "cat_mas-vendidos"
    featured = $true
    bestSeller = $true
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/products" -Method POST -ContentType "application/json" -Body $body -Headers @{"Authorization"="Bearer $token"}
```

### Paso 4: Verificar

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/products" -Method GET | Where-Object { $_.name -like "*Nombre*" } | Format-List
```

## Gotchas

- **Imagen**: Solo PNG, JPG, JPEG. Maximo 5MB por archivo. El sistema valida tipo y tamanho.
- **Token**: Es base64, no JWT. Se envia como `Bearer $token` en el header Authorization.
- **Precio**: Numero sin formato. 90000 no "90.000" ni "$90.000".
- **Slug**: Minusculas, sin espacios, guiones en vez de espacios. Debe ser unico.
- **Servidor**: Si no responde en localhost:3000, verificar que `npm run dev` esta corriendo.
- **Categorias**: Usar los IDs exactos (`cat_ropa`, etc.), no los nombres.
