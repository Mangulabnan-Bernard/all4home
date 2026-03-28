import { prisma } from './db'
import { User, UserRole } from './types'

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.password === password) {
    return user;
  }
  return null;
}

export const register = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await prisma.user.create({ data: user });
}

export const getUsers = () => prisma.user.findMany()

export const getUserById = (id: string) => prisma.user.findUnique({ where: { id } })

export const updateUser = (id: string, data: any) => prisma.user.update({ where: { id }, data })

export const toggleDarkMode = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return false;
  const newDarkMode = !user.darkMode;
  await prisma.user.update({ where: { id }, data: { darkMode: newDarkMode } });
  return newDarkMode;
}

export const getCategories = () => prisma.serviceCategory.findMany()

export const getProviders = () => prisma.providerProfile.findMany()

export const getProviderByUserId = (userId: string) => prisma.providerProfile.findFirst({ where: { userId } })

export const createProvider = (data: any) => prisma.providerProfile.create({ data })

export const updateProvider = (id: string, data: any) => prisma.providerProfile.update({ where: { id }, data })

export const getBookings = () => prisma.booking.findMany()

export const getBookingById = (id: string) => prisma.booking.findUnique({ where: { id } })

export const createBooking = (data: any) => prisma.booking.create({ data })

export const updateBooking = (id: string, data: any) => prisma.booking.update({ where: { id }, data })

export const getReviews = () => prisma.review.findMany()

export const createReview = (data: any) => prisma.review.create({ data })

export const getDisputes = () => prisma.dispute.findMany()

export const createDispute = (data: any) => prisma.dispute.create({ data })

export const updateDispute = (id: string, data: any) => prisma.dispute.update({ where: { id }, data })
