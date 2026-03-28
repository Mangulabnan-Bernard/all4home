import { User, UserRole } from '../lib/types'

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Admin User',
    email: 'admin@all4home.com',
    phone: '+1234567890',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', // hashed 'admin123'
    role: UserRole.ADMIN,
    darkMode: false,
    avatar: null,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 'user_2',
    name: 'John Customer',
    email: 'john@customer.com',
    phone: '+1234567891',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', // hashed 'password123'
    role: UserRole.CUSTOMER,
    darkMode: false,
    avatar: null,
    createdAt: new Date('2024-01-20T14:30:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z')
  },
  {
    id: 'user_3',
    name: 'Sarah Provider',
    email: 'sarah@provider.com',
    phone: '+1234567892',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', // hashed 'password123'
    role: UserRole.PROVIDER,
    darkMode: true,
    avatar: null,
    createdAt: new Date('2024-01-18T09:15:00Z'),
    updatedAt: new Date('2024-01-18T09:15:00Z')
  },
  {
    id: 'user_4',
    name: 'Mike Customer',
    email: 'mike@customer.com',
    phone: '+1234567893',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', // hashed 'password123'
    role: UserRole.CUSTOMER,
    darkMode: false,
    avatar: null,
    createdAt: new Date('2024-02-01T16:45:00Z'),
    updatedAt: new Date('2024-02-01T16:45:00Z')
  },
  {
    id: 'user_5',
    name: 'Emily Provider',
    email: 'emily@provider.com',
    phone: '+1234567894',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', // hashed 'password123'
    role: UserRole.PROVIDER,
    darkMode: false,
    avatar: null,
    createdAt: new Date('2024-02-05T11:20:00Z'),
    updatedAt: new Date('2024-02-05T11:20:00Z')
  }
]

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email)
}

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role)
}

export const createMockUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...userData,
    id: `user_${mockUsers.length + 1}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  mockUsers.push(newUser)
  return newUser
}
