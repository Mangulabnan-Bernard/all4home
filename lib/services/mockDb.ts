
import { User, ProviderProfile, Booking, UserRole, VerificationStatus, BookingStatus, ServiceCategory, Review } from '../types';

const STORAGE_KEY = 'all4home_db';

interface DB {
  users: User[];
  providers: ProviderProfile[];
  categories: ServiceCategory[];
  bookings: Booking[];
  reviews: Review[];
}

const INITIAL_DATA: DB = {
  users: [
    { id: 'u1', name: 'Admin User', email: 'admin@all4home.com', phone: '12345678', role: UserRole.ADMIN, darkMode: false },
    { id: 'u2', name: 'John Customer', email: 'customer@test.com', phone: '87654321', role: UserRole.CUSTOMER, darkMode: false },
    { id: 'u3', name: 'Sarah Pro', email: 'sarah@pro.com', phone: '11223344', role: UserRole.PROVIDER, darkMode: false },
  ],
  providers: [
    {
      id: 'p1',
      userId: 'u3',
      category: 'Cleaning',
      description: 'Expert home cleaning with eco-friendly products. Over 5 years of experience specialized in deep sanitization and organizing. I treat every home as my own.',
      pricePerHour: 45,
      rating: 4.9,
      reviewCount: 128,
      verified: true,
      verificationStatus: VerificationStatus.APPROVED,
      idDocumentUrl: 'https://picsum.photos/400/300',
      certificateUrls: [],
      portfolioImages: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
      ],
      serviceRadiusKm: 25,
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: 'Downtown Los Angeles, CA'
      }
    }
  ],
  categories: [
    { id: 'c1', name: 'Cleaning', description: 'Home, Office, Deep Cleaning', images: ['https://picsum.photos/seed/clean1/800/400', 'https://picsum.photos/seed/clean2/800/400', 'https://picsum.photos/seed/clean3/800/400'] },
    { id: 'c2', name: 'Plumbing', description: 'Leaking, Clogs, Installation', images: ['https://picsum.photos/seed/plumb1/800/400', 'https://picsum.photos/seed/plumb2/800/400', 'https://picsum.photos/seed/plumb3/800/400'] },
    { id: 'c3', name: 'Electrician', description: 'Wiring, Lighting, Repair', images: ['https://picsum.photos/seed/elec1/800/400', 'https://picsum.photos/seed/elec2/800/400', 'https://picsum.photos/seed/elec3/800/400'] },
    { id: 'c4', name: 'Gardening', description: 'Landscaping, Mowing, Pruning', images: ['https://picsum.photos/seed/garden1/800/400', 'https://picsum.photos/seed/garden2/800/400'] },
  ],
  bookings: [],
  reviews: [
    { id: 'r1', bookingId: 'b1', customerId: 'u2', customerName: 'John Customer', providerId: 'p1', rating: 5, comment: 'Sarah did an incredible job! The kitchen looks like new. Very professional and arrived exactly on time.', createdAt: '2024-03-10' },
    { id: 'r2', bookingId: 'b2', customerId: 'u4', customerName: 'Emily W.', providerId: 'p1', rating: 4, comment: 'Very thorough cleaning. Used eco-friendly products as promised. Will book again.', createdAt: '2024-03-12' },
    { id: 'r3', bookingId: 'b3', customerId: 'u5', customerName: 'Michael R.', providerId: 'p1', rating: 5, comment: 'The best cleaning service I have used in LA. GPS check-in gave me peace of mind.', createdAt: '2024-03-15' }
  ]
};

class MockDb {
  private data: DB;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  async getUsers() { return this.data.users; }
  async getUserById(id: string) { return this.data.users.find(u => u.id === id); }
  
  async getProviders() { return this.data.providers; }
  async getProviderById(id: string) { return this.data.providers.find(p => p.id === id); }
  async getProviderByUserId(userId: string) { return this.data.providers.find(p => p.userId === userId); }

  async getCategories() { return this.data.categories; }

  async getReviewsByProviderId(providerId: string) {
    return this.data.reviews.filter(r => r.providerId === providerId);
  }

  async getBookingsByUserId(userId: string, role: UserRole) {
    if (role === UserRole.CUSTOMER) return this.data.bookings.filter(b => b.customerId === userId);
    if (role === UserRole.PROVIDER) {
      const provider = this.data.providers.find(p => p.userId === userId);
      return provider ? this.data.bookings.filter(b => b.providerId === provider.id) : [];
    }
    return this.data.bookings;
  }

  async createBooking(booking: Omit<Booking, 'id'>) {
    const newBooking = { ...booking, id: Math.random().toString(36).substr(2, 9) };
    this.data.bookings.push(newBooking);
    this.save();
    return newBooking;
  }

  async updateBooking(id: string, updates: Partial<Booking>) {
    const idx = this.data.bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.data.bookings[idx] = { ...this.data.bookings[idx], ...updates };
      this.save();
      return this.data.bookings[idx];
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  async updateProviderProfile(userId: string, updates: Partial<ProviderProfile>) {
    const idx = this.data.providers.findIndex(p => p.userId === userId);
    if (idx !== -1) {
      this.data.providers[idx] = { ...this.data.providers[idx], ...updates };
      this.save();
      return this.data.providers[idx];
    }
    return null;
  }

  async applyAsProvider(application: any) {
    const newProvider: ProviderProfile = {
      ...application,
      id: Math.random().toString(36).substr(2, 9),
      verified: false,
      verificationStatus: VerificationStatus.PENDING,
      rating: 0,
      reviewCount: 0,
      portfolioImages: [],
      serviceRadiusKm: 20
    };
    this.data.providers.push(newProvider);
    this.save();
    return newProvider;
  }

  async approveProvider(providerId: string) {
    const idx = this.data.providers.findIndex(p => p.id === providerId);
    if (idx !== -1) {
      this.data.providers[idx].verified = true;
      this.data.providers[idx].verificationStatus = VerificationStatus.APPROVED;
      this.save();
    }
  }

  async toggleDarkMode(userId: string) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.darkMode = !user.darkMode;
      this.save();
      return user.darkMode;
    }
    return false;
  }
}

export const db = new MockDb();
