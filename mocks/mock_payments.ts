import { Payment, PaymentStatus } from '../lib/types'
import { mockBookings } from './mock_bookings'

export const mockPayments: Payment[] = [
  {
    id: 'payment_1',
    bookingId: 'booking_1',
    booking: mockBookings.find(b => b.id === 'booking_1')!,
    amount: 75.0,
    status: PaymentStatus.RELEASED,
    stripePaymentId: 'pi_test_1234567890',
    createdAt: new Date('2024-02-14T15:30:00Z'),
    updatedAt: new Date('2024-02-15T14:30:00Z')
  },
  {
    id: 'payment_2',
    bookingId: 'booking_2',
    booking: mockBookings.find(b => b.id === 'booking_2')!,
    amount: 120.0,
    status: PaymentStatus.ESCROW,
    stripePaymentId: 'pi_test_1234567891',
    createdAt: new Date('2024-02-18T09:15:00Z'),
    updatedAt: new Date('2024-02-18T09:15:00Z')
  },
  {
    id: 'payment_3',
    bookingId: 'booking_3',
    booking: mockBookings.find(b => b.id === 'booking_3')!,
    amount: 50.0,
    status: PaymentStatus.ESCROW,
    stripePaymentId: 'pi_test_1234567892',
    createdAt: new Date('2024-02-22T11:20:00Z'),
    updatedAt: new Date('2024-02-22T11:20:00Z')
  },
  {
    id: 'payment_4',
    bookingId: 'booking_4',
    booking: mockBookings.find(b => b.id === 'booking_4')!,
    amount: 90.0,
    status: PaymentStatus.REFUNDED,
    stripePaymentId: 'pi_test_1234567893',
    createdAt: new Date('2024-02-08T13:45:00Z'),
    updatedAt: new Date('2024-02-12T10:30:00Z')
  },
  {
    id: 'payment_5',
    bookingId: 'booking_5',
    booking: mockBookings.find(b => b.id === 'booking_5')!,
    amount: 35.0,
    status: PaymentStatus.FAILED,
    stripePaymentId: 'pi_test_1234567894',
    createdAt: new Date('2024-02-01T16:20:00Z'),
    updatedAt: new Date('2024-02-01T16:25:00Z')
  }
]

export const getPaymentById = (id: string) => {
  return mockPayments.find(payment => payment.id === id)
}

export const getPaymentsByBookingId = (bookingId: string) => {
  return mockPayments.filter(payment => payment.bookingId === bookingId)
}

export const getPaymentsByStatus = (status: PaymentStatus) => {
  return mockPayments.filter(payment => payment.status === status)
}

export const getEscrowPayments = () => {
  return mockPayments.filter(payment => payment.status === PaymentStatus.ESCROW)
}

export const getReleasedPayments = () => {
  return mockPayments.filter(payment => payment.status === PaymentStatus.RELEASED)
}

export const getRefundedPayments = () => {
  return mockPayments.filter(payment => payment.status === PaymentStatus.REFUNDED)
}

export const getTotalRevenue = (): number => {
  return mockPayments
    .filter(payment => payment.status === PaymentStatus.RELEASED)
    .reduce((total, payment) => total + payment.amount, 0)
}

export const getTotalEscrowAmount = (): number => {
  return mockPayments
    .filter(payment => payment.status === PaymentStatus.ESCROW)
    .reduce((total, payment) => total + payment.amount, 0)
}
