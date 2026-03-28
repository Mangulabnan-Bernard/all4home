import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/actions'
import { createPaymentIntent } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { serviceId, providerId, scheduledTime, totalAmount } = await request.json()

    // Create booking
    const booking = await createBooking({
      serviceId,
      providerId,
      customerId: 'customer-id', // This should come from authenticated user
      scheduledTime: new Date(scheduledTime),
      totalAmount
    })

    // Create payment intent
    const payment = await createPaymentIntent(totalAmount, booking.id)

    return NextResponse.json({
      bookingId: booking.id,
      clientSecret: payment.clientSecret,
      paymentIntentId: payment.paymentIntentId
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
