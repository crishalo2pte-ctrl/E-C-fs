import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client.js"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.refreshToken.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const userPassword = await bcrypt.hash("Usuario123!", 12)
  const adminPassword = await bcrypt.hash("Admin123!", 12)

  const user = await prisma.user.create({
    data: {
      id: "usr_001",
      name: "Diego",
      lastName: "Ramírez",
      email: "diego@frankstore.com.ar",
      phone: "+54 351 456 7890",
      level: "Premium",
      birthDate: "15/06/1992",
      registeredAt: new Date("2026-01-01"),
      role: "user",
      status: "activo",
      language: "es",
      currency: "ARS",
      passwordHash: userPassword,
      notifEmail: true,
      notifSms: false,
      notifPromotions: true,
      notifOrderUpdates: true,
      notifNewsletter: false,
    },
  })
  console.log("User created:", user.email)

  await prisma.user.create({
    data: {
      id: "adm_001",
      name: "Admin",
      lastName: "FrankStore",
      email: "admin@frankstore.com.ar",
      phone: "+54 351 555 0000",
      level: "Premium",
      role: "admin",
      status: "activo",
      language: "es",
      currency: "ARS",
      passwordHash: adminPassword,
    },
  })
  console.log("Admin created")

  const jhonPassword = await bcrypt.hash("admin.26", 12)
  await prisma.user.create({
    data: {
      id: "adm_002",
      name: "Jhon",
      lastName: "Admin",
      email: "jhonadmin@frankstore.com",
      phone: "+54 11 555 0001",
      level: "Premium",
      role: "admin",
      status: "activo",
      language: "es",
      currency: "ARS",
      passwordHash: jhonPassword,
    },
  })
  console.log("Jhon Admin created")

  const categories = await Promise.all([
    prisma.category.create({ data: { id: "cat_ropa", name: "Ropa", slug: "ropa", image: "/images/category-ropa.jpg" } }),
    prisma.category.create({ data: { id: "cat_imperdibles", name: "Imperdibles", slug: "imperdibles", image: "/images/category-imperdibles.jpg" } }),
    prisma.category.create({ data: { id: "cat_destacada", name: "Colección Destacada", slug: "coleccion-destacada", image: "/images/category-destacada.jpg" } }),
    prisma.category.create({ data: { id: "cat_mas-vendidos", name: "Más Vendidos", slug: "mas-vendidos", image: "/images/category-mas-vendidos.jpg" } }),
  ])
  console.log(`${categories.length} categories created`)

  const productsData = [
    { id: "1", name: "Camisa Linen Classic", slug: "camisa-linen-classic", description: "Camisa de lino 100% natural. Fresca, transpirable y perfecta para el clima tropical.", price: 79.9, categoryId: "cat_ropa", featured: true, bestSeller: false },
    { id: "2", name: "Jeans Slim Fit Premium", slug: "jeans-slim-fit-premium", description: "Jeans de algodón stretch con corte slim. Comodidad y estilo en una sola prenda.", price: 119.9, categoryId: "cat_ropa", featured: false, bestSeller: false },
    { id: "3", name: "Polera Básica Algodón", slug: "polera-basica-algodon", description: "Polera de algodón peinado 180gsm. Corte clásico, cuello redondo reforzado.", price: 45.9, categoryId: "cat_ropa", featured: false, bestSeller: false },
    { id: "4", name: "Falda Midi Elegante", slug: "falda-midi-elegante", description: "Falda midi de viscosa con caída fluida. Cintura elástica y bolsillos laterales.", price: 89.9, categoryId: "cat_ropa", featured: false, bestSeller: false },
    { id: "5", name: "Bermudas Casual", slug: "bermudas-casual", description: "Bermudas de gabardina stretch. Largo a la rodilla, bolsillos funcionales.", price: 69.9, categoryId: "cat_ropa", featured: false, bestSeller: false },
    { id: "6", name: "Camiseta Blanca Básica", slug: "camiseta-blanca-basica", description: "Camiseta esencial de algodón orgánico 160gsm. Corte regular, cuello redondo.", price: 35.9, categoryId: "cat_imperdibles", featured: true, bestSeller: true },
    { id: "7", name: "Pantalón Negro Versátil", slug: "pantalon-negro-versatil", description: "Pantalón chino negro stretch. Funciona para oficina y ocasiones casuales.", price: 99.9, categoryId: "cat_imperdibles", featured: false, bestSeller: false },
    { id: "8", name: "Chaqueta Denim Clásica", slug: "chaqueta-denim-clasica", description: "Chaqueta denim 12oz azul índigo. Corte recto, botones metálicos, bolsillos pecho.", price: 149.9, categoryId: "cat_imperdibles", featured: true, bestSeller: true },
    { id: "9", name: "Vestido Negro Esencial", slug: "vestido-negro-esencial", description: "Vestido negro corte recto, largo midi. Tejido ponte roma que no se arruga.", price: 109.9, categoryId: "cat_imperdibles", featured: false, bestSeller: false },
    { id: "10", name: "Suéter Gris Comfort", slug: "sueter-gris-comfort", description: "Suéter de punto medio en gris melange. Cuello redondo, puños y bajo acanalados.", price: 89.9, categoryId: "cat_imperdibles", featured: false, bestSeller: false },
    { id: "11", name: "Traje Elegante Premium", slug: "traje-elegante-premium", description: "Traje dos piezas lana fría italiana. Corte moderno, forro completo, pantalón sin pinzas.", price: 299.9, categoryId: "cat_destacada", featured: true, bestSeller: false },
    { id: "12", name: "Vestido Floral Exclusivo", slug: "vestido-floral-exclusivo", description: "Vestido midi estampado floral único. Seda viscosa, escote en V, manga abullonada.", price: 179.9, categoryId: "cat_destacada", featured: false, bestSeller: false },
    { id: "13", name: "Camisa Premium Edición Limitada", slug: "camisa-premium-edicion-limitada", description: "Camisa popelín algodón egipcio 200 hilos. Cuenta con numeración exclusiva 1/100.", price: 129.9, categoryId: "cat_destacada", featured: false, bestSeller: false },
    { id: "14", name: "Conjunto Deportivo Luxury", slug: "conjunto-deportivo-luxury", description: "Sudadera y jogger en algodón premium cepillado. Logo bordado, detalles reflectivos.", price: 199.9, categoryId: "cat_destacada", featured: false, bestSeller: false },
    { id: "15", name: "Abrigo Invierno Designer", slug: "abrigo-invierno-designer", description: "Abrigo largo lana merino doble faz. Corte oversize, cuello solapa, bolsillos ocultos.", price: 249.9, categoryId: "cat_destacada", featured: true, bestSeller: false },
    { id: "16", name: "Hoodie Urban Classic", slug: "hoodie-urban-classic", description: "Hoodie algodón 350gsm felpa interior. Capucha forrada, bolsillo canguro, puños acanalados.", price: 129.9, categoryId: "cat_mas-vendidos", featured: false, bestSeller: true },
    { id: "17", name: "Zapatillas Street Style", slug: "zapatillas-street-style", description: "Zapatillas retro runner. Suela EVA, upper mesh y piel, plantilla memory foam.", price: 159.9, categoryId: "cat_mas-vendidos", featured: false, bestSeller: true },
    { id: "18", name: "Gorra Snapback Frank", slug: "gorra-snapback-frank", description: "Gorra snapback 6 paneles. Frontal estructurado, visera plana, bordado 3D FrankStore.", price: 49.9, categoryId: "cat_mas-vendidos", featured: false, bestSeller: true },
    { id: "19", name: "Mochila Urban Pack", slug: "mochila-urban-pack", description: "Mochila 22L poliéster resistente al agua. Compartimento laptop 15\", organizador interno.", price: 89.9, categoryId: "cat_mas-vendidos", featured: false, bestSeller: true },
    { id: "20", name: "Chain Necklace Gold", slug: "chain-necklace-gold", description: "Collar cadena eslabones acero inoxidable baño oro 18k. Largo 50cm + 5cm extensión.", price: 39.9, categoryId: "cat_mas-vendidos", featured: true, bestSeller: true },
  ]

  const products = await Promise.all(
    productsData.map((p) =>
      prisma.product.create({
        data: {
          ...p,
          image: `/images/product-${p.id}.jpg`,
          images: [`/images/product-${p.id}.jpg`],
          carousel: p.featured === true,
          carouselOrder: 0,
        },
      })
    )
  )
  console.log(`${products.length} products created`)

  await Promise.all([
    prisma.address.create({ data: { id: "a1", userId: user.id, name: "Casa Principal", street: "Av. Colón 1234, Piso 4", city: "Córdoba", department: "Córdoba", postalCode: "X5000", phone: "+54 351 456 7890", isDefault: true } }),
    prisma.address.create({ data: { id: "a2", userId: user.id, name: "Oficina", street: "Av. Hipólito Yrigoyen 567, Piso 8", city: "Córdoba", department: "Córdoba", postalCode: "X5002", phone: "+54 351 987 6543", isDefault: false } }),
    prisma.address.create({ data: { id: "a3", userId: user.id, name: "Departamento Bs As", street: "Av. Santa Fe 2345", city: "Buenos Aires", department: "CABA", postalCode: "C1425", phone: "+54 11 2345 6789", isDefault: false } }),
  ])
  console.log("3 addresses created")

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  const ordersData = [
    { id: "o1", number: "FS-2026-001", status: "entregada" as const, total: 199.8, paymentMethod: "Tarjeta •••• 4242", addressSnapshot: "Av. Colón 1234, Córdoba", date: "2026-07-15", items: [{ productId: "1", name: "Camisa Linen Classic", price: 79.9, quantity: 1 }, { productId: "2", name: "Jeans Slim Fit Premium", price: 119.9, quantity: 1 }] },
    { id: "o2", number: "FS-2026-002", status: "enviada" as const, total: 149.9, paymentMethod: "Mercado Pago •••• 7890", addressSnapshot: "San Martín 567, Buenos Aires", date: "2026-07-10", items: [{ productId: "8", name: "Chaqueta Denim Clásica", price: 149.9, quantity: 1 }] },
    { id: "o3", number: "FS-2026-003", status: "confirmada" as const, total: 349.8, paymentMethod: "Tarjeta •••• 4242", addressSnapshot: "Av. Colón 1234, Córdoba", date: "2026-07-05", items: [{ productId: "11", name: "Traje Elegante Premium", price: 299.9, quantity: 1 }, { productId: "18", name: "Gorra Snapback Frank", price: 49.9, quantity: 1 }] },
    { id: "o4", number: "FS-2026-004", status: "entregada" as const, total: 249.9, paymentMethod: "Rapipago", addressSnapshot: "San Martín 567, Buenos Aires", date: "2026-06-28", items: [{ productId: "15", name: "Abrigo Invierno Designer", price: 249.9, quantity: 1 }] },
    { id: "o5", number: "FS-2026-005", status: "cancelada" as const, total: 179.9, paymentMethod: "Tarjeta •••• 4242", addressSnapshot: "Av. Colón 1234, Córdoba", date: "2026-06-20", items: [{ productId: "12", name: "Vestido Floral Exclusivo", price: 179.9, quantity: 1 }] },
    { id: "o6", number: "FS-2026-006", status: "entregada" as const, total: 89.9, paymentMethod: "Mercado Pago •••• 7890", addressSnapshot: "San Martín 567, Buenos Aires", date: "2026-06-15", items: [{ productId: "10", name: "Suéter Gris Comfort", price: 89.9, quantity: 1 }] },
  ]

  for (const o of ordersData) {
    const { items, date, ...orderFields } = o
    await prisma.order.create({
      data: {
        ...orderFields,
        userId: user.id,
        createdAt: new Date(date + "T10:00:00Z"),
        items: { create: items.map((item) => ({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity, image: productMap[item.productId]?.image ?? null })) },
      },
    })
  }
  console.log(`${ordersData.length} orders created`)

  const favoritePairs = [
    { productId: "1" }, { productId: "8" }, { productId: "11" },
    { productId: "18" }, { productId: "2" }, { productId: "15" },
  ]
  await Promise.all(
    favoritePairs.map((fp, i) =>
      prisma.favorite.create({ data: { id: `f${i + 1}`, userId: user.id, productId: fp.productId } })
    )
  )
  console.log("6 favorites created")

  await Promise.all([
    prisma.payment.create({ data: { transactionId: "txn_001", userId: user.id, amount: 199.8, currency: "ARS", method: "Tarjeta", status: "completado", product: "Camisa Linen Classic + Jeans Slim Fit Premium", date: new Date("2026-07-15") } }),
    prisma.payment.create({ data: { transactionId: "txn_002", userId: user.id, amount: 149.9, currency: "ARS", method: "Mercado Pago", status: "completado", product: "Chaqueta Denim Clásica", date: new Date("2026-07-10") } }),
  ])
  console.log("2 payments created")

  console.log("\nSeed completed successfully!")
  console.log("User credentials: diego@frankstore.com.ar / Usuario123!")
  console.log("Admin credentials: admin@frankstore.com.ar / Admin123!")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
