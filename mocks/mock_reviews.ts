import { Review } from '../lib/types'
import { mockUsers } from './mock_users'
import { mockProviders } from './mock_providers'
import { mockBookings } from './mock_bookings'

export const mockReviews: Review[] = [
  {
    id: 'review_1',
    bookingId: 'booking_1',
    booking: mockBookings.find(b => b.id === 'booking_1')!,
    customerId: 'user_2',
    customer: mockUsers.find(u => u.id === 'user_2')!,
    providerId: 'provider_1',
    provider: mockProviders.find(p => p.id === 'provider_1')!,
    rating: 5,
    comment: 'Excellent service! Sarah was very professional and thorough. My house has never been this clean. Highly recommend!',
    createdAt: new Date('2024-02-15T15:00:00Z')
  },
  {
    id: 'review_2',
    bookingId: 'booking_5',
    booking: mockBookings.find(b => b.id === 'booking_5')!,
    customerId: 'user_4',
    customer: mockUsers.find(u => u.id === 'user_4')!,
    providerId: 'provider_2',
    provider: mockProviders.find(p => p.id === 'provider_2')!,
    rating: 4,
    comment: 'Good plumbing work. Fixed the leak quickly and professionally. A bit expensive but quality service.',
    createdAt: new Date('2024-02-08T11:30:00Z')
  },
  {
    id: 'review_3',
    bookingId: 'booking_6',
    booking: mockBookings.find(b => b.id === 'booking_6')!,
    customerId: 'user_2',
    customer: mockUsers.find(u => u.id === 'user_2')!,
    providerId: 'provider_2',
    provider: mockProviders.find(p => p.id === 'provider_2')!,
    rating: 5,
    comment: 'Emily saved the day! Emergency plumbing issue at 2 AM and she was there within an hour. True professional!',
    createdAt: new Date('2024-02-01T08:00:00Z')
  },
  {
    id: 'review_4',
    bookingId: 'booking_7',
    booking: mockBookings.find(b => b.id === 'booking_7')!,
    customerId: 'user_4',
    customer: mockUsers.find(u => u.id === 'user_4')!,
    providerId: 'provider_1',
    provider: mockProviders.find(p => p.id === 'provider_1')!,
    rating: 3,
    comment: 'Service was okay but not exceptional. Arrived a bit late and missed some spots. Had to ask for touch-ups.',
    createdAt: new Date('2024-01-25T16:45:00Z')
  }
]

export const getReviewById = (id: string) => {
  return mockReviews.find(review => review.id === id)
}

export const getReviewsByProviderId = (providerId: string) => {
  return mockReviews.filter(review => review.providerId === providerId)
}

export const getReviewsByCustomerId = (customerId: string) => {
  return mockReviews.filter(review => review.customerId === customerId)
}

export const getReviewsByBookingId = (bookingId: string) => {
  return mockReviews.filter(review => review.bookingId === bookingId)
}

export const getReviewsByRating = (rating: number) => {
  return mockReviews.filter(review => review.rating === rating)
}

export const getAverageRatingForProvider = (providerId: string): number => {
  const providerReviews = getReviewsByProviderId(providerId)
  if (providerReviews.length === 0) return 0
  const total = providerReviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((total / providerReviews.length) * 10) / 10
}

export const getRecentReviews = (limit: number = 10) => {
  return mockReviews
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}
