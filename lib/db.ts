import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient

try {
  prismaInstance = new PrismaClient()
  // Test the connection
  prismaInstance.$connect()
  console.log('Database connected successfully')
} catch (error) {
  console.warn('Database connection failed, using fallback mode:', error)
  // Create a mock prisma instance that throws errors for all operations
  prismaInstance = new Proxy({} as PrismaClient, {
    get() {
      throw new Error('Database not available')
    }
  })
}

export const prisma = prismaInstance

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
