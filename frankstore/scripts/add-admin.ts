import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client.js"
import bcrypt from "bcryptjs"

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  const email = "jhonfranco@frankstore.com"
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("El admin ya existe:", existing.email)
    await prisma.$disconnect()
    return
  }

  const passwordHash = await bcrypt.hash("admin1", 12)
  const user = await prisma.user.create({
    data: {
      id: "adm_002",
      name: "Jhon",
      lastName: "Franco",
      email,
      phone: "+54 11 555 0001",
      level: "Premium",
      role: "admin",
      status: "activo",
      language: "es",
      currency: "ARS",
      passwordHash,
    },
  })

  console.log("Admin creado:", user.email)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Error:", e)
  process.exit(1)
})
