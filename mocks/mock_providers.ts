import { Provider, VerificationStatus } from '../lib/types'
import { mockUsers } from './mock_users'

export const mockProviders: Provider[] = [
  {
    id: 'provider_1',
    userId: 'user_3',
    user: mockUsers.find(u => u.id === 'user_3')!,
    category: 'Cleaning',
    description: 'Professional house cleaning services with 5+ years of experience. Specializing in deep cleaning, regular maintenance, and post-construction cleanup.',
    price: 25.0,
    rating: 4.8,
    verified: true,
    verificationStatus: VerificationStatus.APPROVED,
    idDocumentUrl: '/documents/sarah_id.jpg',
    certificateUrls: ['cleaning_cert_1.pdf', 'cleaning_cert_2.pdf'],
    approvedAt: new Date('2024-01-19T10:00:00Z'),
    createdAt: new Date('2024-01-18T09:15:00Z'),
    updatedAt: new Date('2024-01-19T10:00:00Z'),
    services: [],
    reviews: []
  },
  {
    id: 'provider_2',
    userId: 'user_5',
    user: mockUsers.find(u => u.id === 'user_5')!,
    category: 'Plumbing',
    description: 'Licensed plumber with emergency services available. Expert in pipe repairs, installations, and maintenance work.',
    price: 45.0,
    rating: 4.6,
    verified: true,
    verificationStatus: VerificationStatus.APPROVED,
    idDocumentUrl: '/documents/emily_id.jpg',
    certificateUrls: ['plumbing_license.pdf', 'emergency_cert.pdf'],
    approvedAt: new Date('2024-02-06T09:00:00Z'),
    createdAt: new Date('2024-02-05T11:20:00Z'),
    updatedAt: new Date('2024-02-06T09:00:00Z'),
    services: [],
    reviews: []
  },
  {
    id: 'provider_3',
    userId: 'user_6',
    user: mockUsers.find(u => u.id === 'user_6')!,
    category: 'Electrical',
    description: 'Certified electrician specializing in residential and commercial electrical work, installations, and repairs.',
    price: 55.0,
    rating: 4.9,
    verified: false,
    verificationStatus: VerificationStatus.PENDING,
    idDocumentUrl: '/documents/electrician_id.jpg',
    certificateUrls: ['electrical_cert.pdf'],
    approvedAt: null,
    createdAt: new Date('2024-02-10T13:30:00Z'),
    updatedAt: new Date('2024-02-10T13:30:00Z'),
    services: [],
    reviews: []
  }
]

export const getProviderById = (id: string): Provider | undefined => {
  return mockProviders.find(provider => provider.id === id)
}

export const getProviderByUserId = (userId: string): Provider | undefined => {
  return mockProviders.find(provider => provider.userId === userId)
}

export const getProvidersByCategory = (category: string): Provider[] => {
  return mockProviders.filter(provider => provider.category === category)
}

export const getVerifiedProviders = (): Provider[] => {
  return mockProviders.filter(provider => provider.verified)
}

export const getPendingProviders = (): Provider[] => {
  return mockProviders.filter(provider => provider.verificationStatus === VerificationStatus.PENDING)
}
