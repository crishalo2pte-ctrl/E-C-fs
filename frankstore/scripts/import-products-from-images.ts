import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"
import { v2 as cloudinary } from "cloudinary"
import * as fs from "fs"
import * as path from "path"
import { generateProductData } from "./product-templates"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const IMAGES_DIR = path.resolve(__dirname, "..", "public", "images")
const CLOUDINARY_FOLDER = "frankstore/products"

const ALLOWED_EXTENSIONS = /\.(jpe?g|png)$/i

function getImageFiles(): string[] {
  const files = fs.readdirSync(IMAGES_DIR)
  return files
    .filter((f) => ALLOWED_EXTENSIONS.test(f))
    .sort()
}

async function uploadToCloudinary(filePath: string): Promise<string> {
  const resolved = path.resolve(IMAGES_DIR, filePath)
  console.log(`   Subiendo ${filePath} a Cloudinary...`)

  const result = await cloudinary.uploader.upload(resolved, {
    folder: CLOUDINARY_FOLDER,
    resource_type: "image",
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  })

  console.log(`   ✅ URL: ${result.secure_url}`)
  return result.secure_url
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run")
  if (isDryRun) console.log("⚡ MODO DRY-RUN — No se subirán imágenes ni se crearán productos")
  console.log("🔍 Escaneando imágenes en:", IMAGES_DIR)
  console.log("")

  const imageFiles = getImageFiles()
  console.log(`📁 Se encontraron ${imageFiles.length} imágenes`)

  const existingSlugs = new Set(
    (
      await prisma.product.findMany({
        select: { slug: true },
      })
    ).map((p) => p.slug)
  )
  console.log(`📦 ${existingSlugs.size} productos existentes en BD`)

  const toCreate: { file: string; data: NonNullable<ReturnType<typeof generateProductData>> }[] = []
  const skipped: string[] = []

  for (const file of imageFiles) {
    console.log("")
    console.log(`--- ${file} ---`)

    const productData = generateProductData(file)

    if (!productData) {
      console.log(`   ⏭️  No se pudo generar datos para "${file}" (saltando)`)
      skipped.push(file)
      continue
    }

    if (existingSlugs.has(productData.slug)) {
      console.log(`   ⏭️  Ya existe producto con slug "${productData.slug}" — saltando`)
      skipped.push(file)
      continue
    }

    console.log(`   🏷️  Nombre: ${productData.name}`)
    console.log(`   🔗 Slug: ${productData.slug}`)
    console.log(`   📝 Descripción: ${productData.description.slice(0, 120)}...`)
    console.log(`   💰 Precio: $${productData.price.toLocaleString("es-AR")}`)
    console.log(`   📂 Categoría: ${productData.categoryId}`)

    toCreate.push({ file, data: productData })
  }

  console.log("")
  console.log("=".repeat(50))
  console.log("📊 PREVISUALIZACIÓN")
  console.log("=".repeat(50))
  console.log(`📦 A crear: ${toCreate.length}`)
  console.log(`⏭️  Saltados: ${skipped.length}`)

  if (toCreate.length > 0) {
    console.log("")
    console.log("Productos a crear:")
    for (const { file, data } of toCreate) {
      console.log(`   • ${data.name} (${file})`)
    }
  }

  if (isDryRun) {
    console.log("")
    console.log("🏁 Dry-run completado. Ejecuta sin --dry-run para realizar la importación.")
    return
  }

  if (toCreate.length === 0) {
    console.log("")
    console.log("🏁 No hay productos nuevos para crear.")
    return
  }

  console.log("")
  console.log("🚀 Iniciando importación...")

  const created: string[] = []
  const errors: string[] = []

  for (const { file, data } of toCreate) {
    try {
      const imageUrl = await uploadToCloudinary(file)

      const product = await prisma.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          image: imageUrl,
          images: [imageUrl],
          categoryId: data.categoryId,
          featured: data.featured,
          bestSeller: data.bestSeller,
        },
      })

      console.log(`   ✅ Producto CREADO: ${product.name} (${product.id})`)
      created.push(file)
    } catch (err) {
      console.error(`   ❌ Error procesando "${file}":`, err)
      errors.push(file)
    }
  }

  console.log("")
  console.log("=".repeat(50))
  console.log("📊 REPORTE FINAL")
  console.log("=".repeat(50))
  console.log(`✅ Creados: ${created.length}`)
  console.log(`⏭️  Saltados: ${skipped.length}`)
  console.log(`❌ Errores: ${errors.length}`)

  if (created.length > 0) {
    console.log("")
    console.log("Productos creados:")
    for (const file of created) {
      console.log(`   ✅ ${file}`)
    }
  }

  if (errors.length > 0) {
    console.log("")
    console.log("Errores:")
    for (const file of errors) {
      console.log(`   ❌ ${file}`)
    }
  }

  console.log("")
  console.log("🎉 Proceso completado.")
}

main()
  .catch((e) => {
    console.error("Error fatal:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
