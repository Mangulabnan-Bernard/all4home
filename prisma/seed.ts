import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  await prisma.serviceCategory.createMany({
    data: [
      {
        id: 'cleaning',
        name: 'Cleaning',
        description: 'Professional house and office cleaning services',
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80']
      },
      {
        id: 'plumbing',
        name: 'Plumbing',
        description: 'Expert plumbing repairs and installations',
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80']
      },
      {
        id: 'electrical',
        name: 'Electrical',
        description: 'Certified electrical work and installations',
        images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80']
      },
      {
        id: 'gardening',
        name: 'Gardening',
        description: 'Lawn care and garden maintenance',
        images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80']
      }
    ]
  })

  // Seed users
  await prisma.user.createMany({
    data: [
      {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password',
        role: 'CUSTOMER'
      },
      {
        id: 'user2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        password: 'password',
        role: 'PROVIDER'
      }
    ]
  })

  // Seed provider profile
  await prisma.providerProfile.create({
    data: {
      id: 'provider1',
      userId: 'user2',
      category: 'Cleaning',
      description: 'Experienced cleaner with 5 years of experience',
      pricePerHour: 25,
      rating: 4.8,
      reviewCount: 120,
      verified: true,
      verificationStatus: 'APPROVED',
      idDocumentUrl: 'https://example.com/doc.pdf',
      certificateUrls: ['https://example.com/cert.pdf'],
      portfolioImages: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80'],
      serviceRadiusKm: 50,
      location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' }
    }
  })

  // Seed booking
  await prisma.booking.create({
    data: {
      id: 'booking1',
      customerId: 'user1',
      providerId: 'provider1',
      serviceId: 'cleaning',
      status: 'COMPLETED',
      scheduledTime: new Date(),
      gpsCheckIn: { lat: 40.7128, lng: -74.0060 },
      evidencePhotos: ['https://example.com/photo1.jpg'],
      totalAmount: 100,
      providerConfirmed: true,
      customerConfirmed: true,
    }
  })

  // Seed review
  await prisma.review.create({
    data: {
      id: 'review1',
      bookingId: 'booking1',
      customerId: 'user1',
      providerId: 'provider1',
      rating: 5,
      comment: 'Excellent service! Highly recommended.',
    }
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
