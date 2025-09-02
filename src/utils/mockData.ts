import { Property } from '../types';

// Mock property data for demonstration
export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment',
    type: 'apartment',
    bhk: '3BHK',
    address: '123 Park Avenue, Downtown',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    landmark: 'Near Metro Station',
    area: 1200,
    price: 8500000,
    listingIntent: 'sale',
    status: 'active',
    biddingEnabled: true,
    views: 45,
    inquiries: 12,
    amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    videos: [],
    description: 'Beautiful 3BHK apartment with modern amenities and great city views.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Modern Villa with Garden',
    type: 'villa',
    bhk: '4BHK',
    address: '456 Green Valley, Suburbs',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    landmark: 'Green Valley Society',
    area: 2500,
    price: 45000,
    listingIntent: 'rent',
    status: 'active',
    biddingEnabled: false,
    views: 23,
    inquiries: 5,
    amenities: ['Garden', 'Parking', 'Security', 'Power Backup'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    videos: [],
    description: 'Spacious villa with private garden, perfect for families.',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    type: 'commercial',
    bhk: 'Office',
    address: '789 Business District',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    landmark: 'IT Hub Area',
    area: 800,
    price: 12000000,
    listingIntent: 'urgent-sale',
    status: 'active',
    biddingEnabled: true,
    views: 67,
    inquiries: 18,
    amenities: ['Elevator', 'Parking', 'Conference Room', 'Reception'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ],
    videos: [],
    description: 'Prime commercial space in the heart of business district.',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  }
];

// Available cities for filter dropdown
export const availableCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

// Available amenities for property forms
export const availableAmenities = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Security',
  'Garden',
  'Power Backup',
  'Elevator',
  'Conference Room',
  'Reception',
  'Balcony',
  'Air Conditioning',
  'Furnished'
];