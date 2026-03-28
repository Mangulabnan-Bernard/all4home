import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { updateBooking } from '@/lib/actions'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bookingId = formData.get('bookingId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'evidence')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${bookingId}_${timestamp}_${file.name}`
    const filepath = join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Get current booking to update evidence photos
    const { getBookingById } = await import('@/lib/actions')
    const booking = await getBookingById(bookingId)
    
    if (booking) {
      const currentPhotos = (booking.evidencePhotos as any) || []
      const updatedPhotos = [...currentPhotos, `/uploads/evidence/${filename}`]
      
      await updateBooking(bookingId, {
        evidencePhotos: updatedPhotos
      })
    }

    return NextResponse.json({
      url: `/uploads/evidence/${filename}`,
      filename
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
