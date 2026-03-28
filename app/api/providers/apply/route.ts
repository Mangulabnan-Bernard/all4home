import { NextRequest, NextResponse } from 'next/server'
import { createProvider } from '@/lib/actions'

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      category,
      description,
      price,
      serviceArea,
      workingHours,
      idDocumentUrl,
      certificateUrls
    } = await request.json()

    // Create provider application
    const provider = await createProvider({
      userId,
      category,
      description,
      price,
      idDocumentUrl,
      certificateUrls
    })

    return NextResponse.json({
      success: true,
      providerId: provider.id,
      message: 'Application submitted successfully. You will be notified within 2-3 business days.'
    })
  } catch (error) {
    console.error('Provider application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
