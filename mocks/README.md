# Mock Data System

This directory contains a comprehensive mock data system for the All4Home application, allowing the app to run without a database connection during development.

## Structure

```
mocks/
├── index.ts              # Main export file and helper functions
├── mock_users.ts          # User data and helper functions
├── mock_providers.ts      # Service provider data
├── mock_categories.ts     # Service categories
├── mock_services.ts       # Individual services
├── mock_bookings.ts       # Booking records
├── mock_reviews.ts        # Customer reviews
├── mock_payments.ts       # Payment records
└── mock_numbers.ts        # Utility functions for generating data
```

## Usage

### Importing Mock Data

```typescript
// Import all mock data
import { mockData, mockUsers, mockProviders } from '../mocks'

// Import specific mock modules
import { getUserById, getProviderByUserId } from '../mocks/mock_users'
import { getServicesByCategory } from '../mocks/mock_services'
```

### Helper Functions

Each mock module includes helper functions:

```typescript
// User helpers
import { getUserById, getUserByEmail, getUsersByRole } from '../mocks/mock_users'

// Provider helpers  
import { getProviderById, getProvidersByCategory } from '../mocks/mock_providers'

// Service helpers
import { getServicesByProviderId, getServicesInPriceRange } from '../mocks/mock_services'

// Booking helpers
import { getBookingsByCustomerId, getBookingsByStatus } from '../mocks/mock_bookings'
```

### Data Generation Utilities

The `mock_numbers.ts` file provides utilities for generating test data:

```typescript
import { mockNumbers } from '../mocks/mock_numbers'

// Generate random phone number
const phone = mockNumbers.generatePhoneNumber('US')

// Generate random ID
const id = mockNumbers.generateId('booking')

// Generate random coordinates
const coords = mockNumbers.generateCoordinates()

// Generate random price
const price = mockNumbers.generatePrice(20, 100)
```

### Combined Data Helpers

The main index file provides helper functions for getting related data:

```typescript
import { getUserData, getProviderData, getCategoryData } from '../mocks'

// Get all data for a specific user
const userData = getUserData('user_2')
// Returns: { user, provider, bookings, reviews, payments }

// Get provider data with all related info
const providerData = getProviderData('provider_1')
// Returns: { provider, user, services, bookings, reviews, payments }

// Get category with services and providers
const categoryData = getCategoryData('cat_1')
// Returns: { category, services, providers }
```

## Mock Data Content

### Users
- 5 mock users with different roles (Admin, Customer, Provider)
- Includes hashed passwords for authentication testing
- Pre-defined email addresses and phone numbers

### Providers  
- 3 mock service providers with different categories
- Verification statuses (Approved, Pending)
- Ratings and service descriptions

### Categories
- 6 service categories (Cleaning, Plumbing, Electrical, Landscaping, Painting, HVAC)
- Category descriptions and sample images

### Services
- 6 individual services linked to providers and categories
- Realistic pricing and descriptions

### Bookings
- 4 sample bookings with different statuses
- GPS coordinates and evidence photos
- Payment amounts and confirmation states

### Reviews
- 4 customer reviews with ratings and comments
- Linked to bookings and providers

### Payments
- 5 payment records with different statuses
- Stripe payment IDs and amounts

## Integration with Actions

The mock system is integrated into the server actions:

```typescript
// In lib/actions.ts
export async function getCategories() {
  try {
    return await prisma.serviceCategory.findMany({...})
  } catch (error) {
    console.warn('Database not available, using mock categories:', error)
    return mockServiceCategories
  }
}
```

## Development Benefits

1. **No Database Required**: Application works without MySQL setup
2. **Realistic Data**: Comprehensive test data covering all scenarios
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Easy Testing**: Consistent data for unit and integration tests
5. **Offline Development**: Work without internet connection
6. **Fast Prototyping**: Quick iteration without database migrations

## Production Deployment

When deploying to production with a real database:

1. Set up MySQL database
2. Update `.env` with database credentials
3. Run `npx prisma migrate dev`
4. The application will automatically use the real database

The mock system provides a seamless fallback during development while maintaining full production readiness.
