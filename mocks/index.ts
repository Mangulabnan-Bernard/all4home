// Main index file for all mock data
// This serves as the central export point for all mock modules

export * from './mock_users'
export * from './mock_providers'
export * from './mock_categories'
export * from './mock_services'
export * from './mock_bookings'
export * from './mock_reviews'
export * from './mock_payments'
export * from './mock_numbers'

// Re-export commonly used combinations
import { mockUsers } from './mock_users'
import { mockProviders } from './mock_providers'
import { mockServiceCategories } from './mock_categories'
import { mockServices } from './mock_services'
import { mockBookings } from './mock_bookings'
import { mockReviews } from './mock_reviews'
import { mockPayments } from './mock_payments'

// Complete dataset with relationships
export const mockData = {
  users: mockUsers,
  providers: mockProviders,
  categories: mockServiceCategories,
  services: mockServices,
  bookings: mockBookings,
  reviews: mockReviews,
  payments: mockPayments
}

// Helper function to get all data for a specific user
export const getUserData = (userId: string) => {
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return null

  return {
    user,
    provider: mockProviders.find(p => p.userId === userId),
    bookings: mockBookings.filter(b => b.customerId === userId),
    reviews: mockReviews.filter(r => r.customerId === userId),
    payments: mockPayments.filter(p => 
      mockBookings.find(b => b.id === p.bookingId)?.customerId === userId
    )
  }
}

// Helper function to get provider data
export const getProviderData = (providerId: string) => {
  const provider = mockProviders.find(p => p.id === providerId)
  if (!provider) return null

  return {
    provider,
    user: mockUsers.find(u => u.id === provider.userId),
    services: mockServices.filter(s => s.providerId === providerId),
    bookings: mockBookings.filter(b => b.providerId === providerId),
    reviews: mockReviews.filter(r => r.providerId === providerId),
    payments: mockPayments.filter(p => 
      mockBookings.find(b => b.id === p.bookingId)?.providerId === providerId
    )
  }
}

// Helper function to get category data with services
export const getCategoryData = (categoryId: string) => {
  const category = mockServiceCategories.find(c => c.id === categoryId)
  if (!category) return null

  return {
    category,
    services: mockServices.filter(s => s.categoryId === categoryId),
    providers: mockProviders.filter(p => 
      mockServices.some(s => s.categoryId === categoryId && s.providerId === p.id)
    )
  }
}

// Mock data statistics
export const mockStats = {
  totalUsers: mockUsers.length,
  totalProviders: mockProviders.length,
  totalCategories: mockServiceCategories.length,
  totalServices: mockServices.length,
  totalBookings: mockBookings.length,
  totalReviews: mockReviews.length,
  totalPayments: mockPayments.length,
  averageRating: mockReviews.length > 0 
    ? mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length 
    : 0,
  totalRevenue: mockPayments
    .filter(p => p.status === 'RELEASED')
    .reduce((sum, p) => sum + p.amount, 0)
}
