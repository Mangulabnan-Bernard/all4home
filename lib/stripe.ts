'use server'

import Stripe from 'stripe'
import { createPayment } from './actions'
import { PaymentStatus } from './types'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(stripeSecretKey)

export async function createPaymentIntent(amount: number, bookingId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    // Create payment record in database
    await createPayment({
      bookingId,
      amount,
      status: PaymentStatus.ESCROW,
      stripePaymentId: paymentIntent.id
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment')
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === 'succeeded') {
      return { success: true, status: 'succeeded' }
    } else {
      return { success: false, status: paymentIntent.status }
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw new Error('Failed to confirm payment')
  }
}

export async function releaseEscrow(bookingId: string, amount: number) {
  try {
    // In a real implementation, this would handle the actual transfer to provider
    // For now, we'll just update the payment status
    const { updatePayment } = await import('./actions')
    
    await updatePayment(bookingId, {
      status: PaymentStatus.RELEASED
    })

    return { success: true }
  } catch (error) {
    console.error('Error releasing escrow:', error)
    throw new Error('Failed to release escrow')
  }
}

export async function refundPayment(bookingId: string, amount: number) {
  try {
    // In a real implementation, this would process the actual refund
    const { updatePayment } = await import('./actions')
    
    await updatePayment(bookingId, {
      status: PaymentStatus.REFUNDED
    })

    return { success: true }
  } catch (error) {
    console.error('Error processing refund:', error)
    throw new Error('Failed to process refund')
  }
}
