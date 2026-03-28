'use server'

import { prisma } from './db'
import { UserRole, VerificationStatus, BookingStatus, PaymentStatus } from './types'
import bcrypt from 'bcryptjs'

// Mock data for development when DB is not available
const mockCategories = [
  {
    id: 'cat1',
    name: 'Cleaning',
    description: 'Professional cleaning services',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    services: []
  },
  {
    id: 'cat2', 
    name: 'Plumbing',
    description: 'Plumbing and pipe services',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    services: []
  }
]

export async function getCategories() {
  try {
    return await prisma.serviceCategory.findMany({
      include: {
        services: {
          include: {
            provider: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })
  } catch (error) {
    console.warn('Database not available, using mock categories:', error)
    return mockCategories
  }
}

export async function getProviders() {
  try {
    return await prisma.provider.findMany({
      include: {
        user: true,
        services: true,
        reviews: {
          include: {
            customer: true
          }
        }
      }
    })
  } catch (error) {
    console.warn('Database not available, using mock providers:', error)
    return []
  }
}

export async function getUsers() {
  return await prisma.user.findMany()
}

export async function getProviderByUserId(userId: string) {
  return await prisma.provider.findFirst({ 
    where: { userId },
    include: {
      user: true,
      services: true,
      reviews: true
    }
  })
}

export async function createProvider(data: {
  userId: string
  category: string
  description: string
  price: number
  idDocumentUrl: string
  certificateUrls: any
}) {
  return await prisma.provider.create({ 
    data: {
      ...data,
      verificationStatus: VerificationStatus.PENDING
    }
  })
}

export async function updateProvider(id: string, data: any) {
  return await prisma.provider.update({ where: { id }, data })
}

export async function getBookings() {
  return await prisma.booking.findMany({
    include: {
      customer: true,
      provider: {
        include: {
          user: true
        }
      },
      service: true,
      payments: true,
      reviews: true,
      disputes: true
    }
  })
}

export async function getBookingById(id: string) {
  return await prisma.booking.findUnique({ 
    where: { id },
    include: {
      customer: true,
      provider: {
        include: {
          user: true
        }
      },
      service: true,
      payments: true,
      reviews: true,
      disputes: true
    }
  })
}

export async function createBooking(data: {
  customerId: string
  providerId: string
  serviceId: string
  scheduledTime: Date
  totalAmount: number
}) {
  return await prisma.booking.create({ 
    data: {
      ...data,
      status: BookingStatus.PENDING
    }
  })
}

export async function updateBooking(id: string, data: any) {
  return await prisma.booking.update({ where: { id }, data })
}

export async function getProviderById(id: string) {
  return await prisma.provider.findUnique({ 
    where: { id },
    include: {
      user: true,
      services: true,
      reviews: {
        include: {
          customer: true
        }
      }
    }
  })
}

export async function getReviewsByProviderId(providerId: string) {
  return await prisma.review.findMany({ 
    where: { providerId },
    include: {
      customer: true,
      booking: true
    }
  })
}

export async function createReview(data: {
  bookingId: string
  customerId: string
  providerId: string
  rating: number
  comment: string
}) {
  return await prisma.review.create({ data })
}

export async function getDisputes() {
  return await prisma.dispute.findMany({
    include: {
      booking: {
        include: {
          customer: true,
          provider: {
            include: {
              user: true
            }
          }
        }
      }
    }
  })
}

export async function createDispute(data: {
  bookingId: string
  filedBy: 'CUSTOMER' | 'PROVIDER'
  description: string
  evidencePhotos?: any
}) {
  return await prisma.dispute.create({ data })
}

export async function approveProvider(id: string) {
  await prisma.provider.update({
    where: { id },
    data: { 
      verificationStatus: VerificationStatus.APPROVED,
      verified: true,
      approvedAt: new Date()
    }
  })
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export async function register(userData: { 
  name: string
  email: string
  phone: string
  password: string
  role: UserRole 
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 12)
  const user = await prisma.user.create({ 
    data: {
      ...userData,
      password: hashedPassword
    }
  })
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export async function updateProviderByUserId(userId: string, data: any) {
  const provider = await prisma.provider.findFirst({ where: { userId } });
  if (provider) {
    return await prisma.provider.update({ where: { id: provider.id }, data });
  }
}

export async function updateUser(id: string, data: any) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 12)
  }
  const user = await prisma.user.update({ where: { id }, data })
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function toggleDarkMode(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return false;
  const newDarkMode = !user.darkMode;
  await prisma.user.update({ where: { id }, data: { darkMode: newDarkMode } });
  return newDarkMode;
}

export async function createPayment(data: {
  bookingId: string
  amount: number
  status: PaymentStatus
  stripePaymentId?: string
}) {
  return await prisma.payment.create({ data })
}

export async function updatePayment(id: string, data: any) {
  return await prisma.payment.update({ where: { id }, data })
}
