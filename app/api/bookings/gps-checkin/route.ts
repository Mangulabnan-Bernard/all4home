import { NextRequest, NextResponse } from 'next/server'
import { updateBooking } from '@/lib/actions'
import { BookingStatus } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { bookingId, lat, lng, timestamp } = await request.json()

    // Update booking with GPS data
    await updateBooking(bookingId, {
      gpsLat: lat,
      gpsLng: lng,
      status: BookingStatus.IN_PROGRESS
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('GPS check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}
