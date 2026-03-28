import { mockProviders } from './mock_providers'
import { mockServiceCategories } from './mock_categories'

export const mockServices = [
  {
    id: 'service_1',
    providerId: 'provider_1',
    provider: mockProviders.find(p => p.id === 'provider_1')!,
    categoryId: 'cat_1',
    category: mockServiceCategories.find(c => c.id === 'cat_1')!,
    name: 'Deep House Cleaning',
    description: 'Comprehensive deep cleaning service including all rooms, kitchen, bathrooms, and living areas. Professional equipment and eco-friendly products.',
    basePrice: 25.0,
    createdAt: new Date('2024-01-18T09:15:00Z'),
    updatedAt: new Date('2024-01-18T09:15:00Z'),
    bookings: []
  },
  {
    id: 'service_2',
    providerId: 'provider_1',
    provider: mockProviders.find(p => p.id === 'provider_1')!,
    categoryId: 'cat_1',
    category: mockServiceCategories.find(c => c.id === 'cat_1')!,
    name: 'Regular House Cleaning',
    description: 'Weekly/bi-weekly cleaning service to maintain your home. Dusting, vacuuming, mopping, and bathroom cleaning.',
    basePrice: 20.0,
    createdAt: new Date('2024-01-18T09:15:00Z'),
    updatedAt: new Date('2024-01-18T09:15:00Z'),
    bookings: []
  },
  {
    id: 'service_3',
    providerId: 'provider_2',
    provider: mockProviders.find(p => p.id === 'provider_2')!,
    categoryId: 'cat_2',
    category: mockServiceCategories.find(c => c.id === 'cat_2')!,
    name: 'Emergency Plumbing Repair',
    description: '24/7 emergency plumbing services for leaks, clogs, and urgent repairs. Licensed and insured.',
    basePrice: 45.0,
    createdAt: new Date('2024-02-05T11:20:00Z'),
    updatedAt: new Date('2024-02-05T11:20:00Z'),
    bookings: []
  },
  {
    id: 'service_4',
    providerId: 'provider_2',
    provider: mockProviders.find(p => p.id === 'provider_2')!,
    categoryId: 'cat_2',
    category: mockServiceCategories.find(c => c.id === 'cat_2')!,
    name: 'Pipe Installation',
    description: 'Professional pipe installation for new construction and renovations. All types of piping systems.',
    basePrice: 35.0,
    createdAt: new Date('2024-02-05T11:20:00Z'),
    updatedAt: new Date('2024-02-05T11:20:00Z'),
    bookings: []
  },
  {
    id: 'service_5',
    providerId: 'provider_3',
    provider: mockProviders.find(p => p.id === 'provider_3')!,
    categoryId: 'cat_3',
    category: mockServiceCategories.find(c => c.id === 'cat_3')!,
    name: 'Electrical Panel Installation',
    description: 'Complete electrical panel installation and upgrades. Licensed electrician with warranty.',
    basePrice: 55.0,
    createdAt: new Date('2024-02-10T13:30:00Z'),
    updatedAt: new Date('2024-02-10T13:30:00Z'),
    bookings: []
  },
  {
    id: 'service_6',
    providerId: 'provider_3',
    provider: mockProviders.find(p => p.id === 'provider_3')!,
    categoryId: 'cat_3',
    category: mockServiceCategories.find(c => c.id === 'cat_3')!,
    name: 'Wiring and Rewiring',
    description: 'Professional wiring services for new constructions, renovations, and electrical system upgrades.',
    basePrice: 40.0,
    createdAt: new Date('2024-02-10T13:30:00Z'),
    updatedAt: new Date('2024-02-10T13:30:00Z'),
    bookings: []
  }
]

export const getServiceById = (id: string) => {
  return mockServices.find(service => service.id === id)
}

export const getServicesByProviderId = (providerId: string) => {
  return mockServices.filter(service => service.providerId === providerId)
}

export const getServicesByCategoryId = (categoryId: string) => {
  return mockServices.filter(service => service.categoryId === categoryId)
}

export const getServicesByCategoryName = (categoryName: string) => {
  return mockServices.filter(service => 
    service.category.name.toLowerCase() === categoryName.toLowerCase()
  )
}

export const getServicesInPriceRange = (minPrice: number, maxPrice: number) => {
  return mockServices.filter(service => 
    service.basePrice >= minPrice && service.basePrice <= maxPrice
  )
}
