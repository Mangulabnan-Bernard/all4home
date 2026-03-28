export const mockServiceCategories = [
  {
    id: 'cat_1',
    name: 'Cleaning',
    description: 'Professional cleaning services for homes and offices',
    images: [
      '/services/cleaning_1.jpg',
      '/services/cleaning_2.jpg',
      '/services/cleaning_3.jpg'
    ],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    services: []
  },
  {
    id: 'cat_2',
    name: 'Plumbing',
    description: 'Complete plumbing solutions including repairs and installations',
    images: [
      '/services/plumbing_1.jpg',
      '/services/plumbing_2.jpg'
    ],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    services: []
  },
  {
    id: 'cat_3',
    name: 'Electrical',
    description: 'Licensed electrical services for residential and commercial properties',
    images: [
      '/services/electrical_1.jpg',
      '/services/electrical_2.jpg'
    ],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    services: []
  },
  {
    id: 'cat_4',
    name: 'Landscaping',
    description: 'Professional landscaping and garden maintenance services',
    images: [
      '/services/landscaping_1.jpg',
      '/services/landscaping_2.jpg',
      '/services/landscaping_3.jpg'
    ],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    services: []
  },
  {
    id: 'cat_5',
    name: 'Painting',
    description: 'Interior and exterior painting services with quality materials',
    images: [
      '/services/painting_1.jpg',
      '/services/painting_2.jpg'
    ],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    services: []
  },
  {
    id: 'cat_6',
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services',
    images: [
      '/services/hvac_1.jpg',
      '/services/hvac_2.jpg'
    ],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    services: []
  }
]

export const getCategoryById = (id: string) => {
  return mockServiceCategories.find(category => category.id === id)
}

export const getCategoryByName = (name: string) => {
  return mockServiceCategories.find(category => 
    category.name.toLowerCase() === name.toLowerCase()
  )
}

export const getAllCategoryNames = () => {
  return mockServiceCategories.map(category => category.name)
}
