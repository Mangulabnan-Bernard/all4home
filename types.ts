
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELED = 'CANCELED'
}

export enum PaymentStatus {
  ESCROW = 'ESCROW',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  darkMode: boolean;
  avatar?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  category: string;
  description: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  verificationStatus: VerificationStatus;
  idDocumentUrl: string;
  certificateUrls: string[];
  portfolioImages: string[];
  serviceRadiusKm: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  images: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledTime: string;
  gpsCheckIn?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  evidencePhotos: string[];
  totalAmount: number;
  providerConfirmed: boolean;
  customerConfirmed: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  filedBy: UserRole;
  description: string;
  evidencePhotos: string[];
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
}
