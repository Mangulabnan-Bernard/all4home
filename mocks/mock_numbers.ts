export const mockNumbers = {
  // Phone numbers for different regions
  phoneNumbers: [
    '+1234567890', // US
    '+1234567891',
    '+1234567892',
    '+1234567893',
    '+1234567894',
    '+441234567890', // UK
    '+441234567891',
    '+331234567890', // France
    '+331234567891',
    '+491234567890', // Germany
    '+491234567891'
  ],

  // Generate random phone number
  generatePhoneNumber: (country: 'US' | 'UK' | 'FR' | 'DE' = 'US'): string => {
    const prefixes = {
      US: '+1',
      UK: '+44',
      FR: '+33',
      DE: '+49'
    }
    
    const prefix = prefixes[country]
    const randomDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')
    return prefix + randomDigits
  },

  // Generate random ID
  generateId: (prefix: string = 'id'): string => {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `${prefix}_${timestamp}_${randomStr}`
  },

  // Generate random rating
  generateRating: (): number => {
    return Math.round((Math.random() * 2 + 3) * 10) / 10 // 3.0 to 5.0
  },

  // Generate random price
  generatePrice: (min: number = 15, max: number = 200): number => {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100
  },

  // Generate random coordinates (US cities approximate)
  generateCoordinates: (): { lat: number; lng: number } => {
    const cities = [
      { lat: 40.7128, lng: -74.0060 }, // New York
      { lat: 34.0522, lng: -118.2437 }, // Los Angeles
      { lat: 41.8781, lng: -87.6298 }, // Chicago
      { lat: 29.7604, lng: -95.3698 }, // Houston
      { lat: 33.4484, lng: -112.0740 }, // Phoenix
      { lat: 39.7392, lng: -104.9903 }, // Denver
      { lat: 47.6062, lng: -122.3321 }, // Seattle
      { lat: 25.7617, lng: -80.1918 },  // Miami
    ]
    
    const city = cities[Math.floor(Math.random() * cities.length)]
    // Add some random variation within ~10km radius
    return {
      lat: city.lat + (Math.random() - 0.5) * 0.1,
      lng: city.lng + (Math.random() - 0.5) * 0.1
    }
  },

  // Generate random date within range
  generateDate: (daysBack: number = 30): Date => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
    const randomTime = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime())
    return new Date(randomTime)
  },

  // Generate random boolean with probability
  generateBoolean: (probability: number = 0.5): boolean => {
    return Math.random() < probability
  },

  // Generate random array item
  pickRandom: <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  },

  // Generate random string
  generateString: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}
