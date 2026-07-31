import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"
import pg from "pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(
      new pg.Pool({
        connectionString: process.env.DATABASE_URL!,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 60000,
        max: 5,
      }),
    ),
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
