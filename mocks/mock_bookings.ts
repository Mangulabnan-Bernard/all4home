import { Booking, BookingStatus } from '../lib/types'
import { mockUsers } from './mock_users'
import { mockProviders } from './mock_providers'
import { mockServices } from './mock_services'

export const mockBookings: Booking[] = [
  {
    id: 'booking_1',
    customerId: 'user_2',
    customer: mockUsers.find(u => u.id === 'user_2')!,
    providerId: 'provider_1',
    provider: mockProviders.find(p => p.id === 'provider_1')!,
    serviceId: 'service_1',
    service: mockServices.find(s => s.id === 'service_1')!,
    status: BookingStatus.COMPLETED,
    scheduledTime: new Date('2024-02-15T10:00:00Z'),
    gpsLat: 40.7128,
    gpsLng: -74.0060,
    evidencePhotos: [
      '/evidence/before_1.jpg',
      '/evidence/after_1.jpg'
    ],
    totalAmount: 75.0,
    providerConfirmed: true,
    customerConfirmed: true,
    createdAt: new Date('2024-02-14T15:30:00Z'),
    updatedAt: new Date('2024-02-15T14:30:00Z'),
    payments: [],
    reviews: [],
    disputes: []
  },
  {
    id: 'booking_2',
    customerId: 'user_4',
    customer: mockUsers.find(u => u.id === 'user_4')!,
    providerId: 'provider_2',
    provider: mockProviders.find(p => p.id === 'provider_2')!,
    serviceId: 'service_3',
    service: mockServices.find(s => s.id === 'service_3')!,
    status: BookingStatus.IN_PROGRESS,
    scheduledTime: new Date('2024-02-20T14:00:00Z'),
    gpsLat: null,
    gpsLng: null,
    evidencePhotos: null,
    totalAmount: 120.0,
    providerConfirmed: true,
    customerConfirmed: false,
    createdAt: new Date('2024-02-18T09:15:00Z'),
    updatedAt: new Date('2024-02-19T16:45:00Z'),
    payments: [],
    reviews: [],
    disputes: []
  },
  {
    id: 'booking_3',
    customerId: 'user_2',
    customer: mockUsers.find(u => u.id === 'user_2')!,
    providerId: 'provider_1',
    provider: mockProviders.find(p => p.id === 'provider_1')!,
    serviceId: 'service_2',
    service: mockServices.find(s => s.id === 'service_2')!,
    status: BookingStatus.PENDING,
    scheduledTime: new Date('2024-02-25T09:00:00Z'),
    gpsLat: null,
    gpsLng: null,
    evidencePhotos: null,
    totalAmount: 50.0,
    providerConfirmed: false,
    customerConfirmed: false,
    createdAt: new Date('2024-02-22T11:20:00Z'),
    updatedAt: new Date('2024-02-22T11:20:00Z'),
    payments: [],
    reviews: [],
    disputes: []
  },
  {
    id: 'booking_4',
    customerId: 'user_4',
    customer: mockUsers.find(u => u.id === 'user_4')!,
    providerId: 'provider_2',
    provider: mockProviders.find(p => p.id === 'provider_2')!,
    serviceId: 'service_4',
    service: mockServices.find(s => s.id === 'service_4')!,
    status: BookingStatus.DISPUTED,
    scheduledTime: new Date('2024-02-10T16:00:00Z'),
    gpsLat: 40.7580,
    gpsLng: -73.9855,
    evidencePhotos: [
      '/evidence/dispute_before.jpg',
      '/evidence/dispute_after.jpg'
    ],
    totalAmount: 90.0,
    providerConfirmed: true,
    customerConfirmed: false,
    createdAt: new Date('2024-02-08T13:45:00Z'),
    updatedAt: new Date('2024-02-11T10:30:00Z'),
    payments: [],
    reviews: [],
    disputes: []
  }
]

export const getBookingById = (id: string) => {
  return mockBookings.find(booking => booking.id === id)
}

export const getBookingsByCustomerId = (customerId: string) => {
  return mockBookings.filter(booking => booking.customerId === customerId)
}

export const getBookingsByProviderId = (providerId: string) => {
  return mockBookings.filter(booking => booking.providerId === providerId)
}

export const getBookingsByStatus = (status: BookingStatus) => {
  return mockBookings.filter(booking => booking.status === status)
}

export const getPendingBookings = () => {
  return mockBookings.filter(booking => booking.status === BookingStatus.PENDING)
}

export const getCompletedBookings = () => {
  return mockBookings.filter(booking => booking.status === BookingStatus.COMPLETED)
}
