/**
 * Accommodations Database - Single Source of Truth
 * 
 * ALL accommodations in the application are defined here.
 * These are accommodations users can save to their profile.
 */

export interface Accommodation {
  id: string; // Unique identifier for the accommodation (e.g., 'acc-tamarindo-diria')
  name: string; // Name of the accommodation property
  location: string; // Specific location within the destination (e.g., 'Beachfront, Tamarindo')
  destinationId?: string; // Reference to destination in destinations database (e.g., 'dest-tamarindo')
  type: 'Hotel' | 'Hostel' | 'Airbnb' | 'Resort' | 'Boutique Hotel' | 'House' | 'Condo' | 'Lodge' | 'Villa'; // Type of accommodation
  description: string; // Detailed description of the property
  image: string; // URL to main property image
  pricePerNight: number; // Nightly rate in USD
  priceLevel?: number; // Price tier from 1-5 ($-$$$$$)
  rating?: number; // Average rating (typically 1-5 stars)
  reviewCount?: number; // Total number of reviews
  amenities?: string[]; // List of amenities (e.g., 'Pool', 'WiFi', 'Gym')
  tags?: string[]; // Searchable tags (e.g., 'Beachfront', 'Family Friendly')
  userName?: string; // Name of user who recommended this accommodation
}

export const accommodationsDatabase: Record<string, Accommodation> = {
  // Tamarindo Accommodations
  'acc-tamarindo-diria': {
    id: 'acc-tamarindo-diria',
    name: 'Hotel Tamarindo Diria Beach Resort',
    location: 'Beachfront, Tamarindo',
    destinationId: 'dest-tamarindo',
    type: 'Resort',
    description: 'Beautiful beachfront resort with multiple pools, restaurants, and stunning ocean views. Great for families and couples.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    pricePerNight: 180,
    priceLevel: 3,
    rating: 4.5,
    reviewCount: 823,
    amenities: ['Pool', 'Beach access', 'Restaurant', 'Bar', 'Spa'],
    tags: ['Beachfront', 'Family Friendly', 'Resort'],
    userName: 'Sarah'
  },

  'acc-tamarindo-witches-rock': {
    id: 'acc-tamarindo-witches-rock',
    name: 'Witch\'s Rock Surf Camp',
    location: 'Central Tamarindo',
    destinationId: 'dest-tamarindo',
    type: 'Hostel',
    description: 'Perfect spot for surfers! Great social vibe, affordable rates, and amazing surf lessons.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    pricePerNight: 35,
    priceLevel: 1,
    rating: 5,
    reviewCount: 1245,
    amenities: ['Surf lessons', 'Pool', 'Bar', 'Breakfast included'],
    tags: ['Surf', 'Social', 'Budget'],
    userName: 'Michael'
  },

  'acc-tamarindo-casa-azul': {
    id: 'acc-tamarindo-casa-azul',
    name: 'Beachfront Villa Casa Azul',
    location: 'Playa Langosta',
    destinationId: 'dest-tamarindo',
    type: 'Villa',
    description: 'Stunning private villa with direct beach access. Perfect for groups or families. Full kitchen and private pool.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    pricePerNight: 350,
    priceLevel: 4,
    rating: 5,
    reviewCount: 234,
    amenities: ['Private pool', 'Beach access', 'Kitchen', 'WiFi', 'Parking'],
    tags: ['Luxury', 'Private', 'Beachfront', 'Groups'],
    userName: 'Emma'
  },

  'acc-tamarindo-cala-luna': {
    id: 'acc-tamarindo-cala-luna',
    name: 'Cala Luna Boutique Hotel',
    location: 'Langosta Beach',
    destinationId: 'dest-tamarindo',
    type: 'Boutique Hotel',
    description: 'Intimate boutique hotel with incredible service and beautiful rooms. Adults-only paradise.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    pricePerNight: 280,
    priceLevel: 4,
    rating: 5,
    reviewCount: 567,
    amenities: ['Pool', 'Beach access', 'Spa', 'Restaurant', 'Adults only'],
    tags: ['Boutique', 'Luxury', 'Romantic', 'Adults Only'],
    userName: 'Bryce'
  },

  // Manuel Antonio Accommodations
  'acc-manuel-antonio-si-como-no': {
    id: 'acc-manuel-antonio-si-como-no',
    name: 'Hotel Si Como No',
    location: 'Manuel Antonio Hillside',
    destinationId: 'dest-manuel-antonio',
    type: 'Hotel',
    description: 'Eco-friendly luxury hotel with stunning views, two pools, and complimentary shuttle to the beach.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    pricePerNight: 245,
    priceLevel: 3,
    rating: 5,
    reviewCount: 1034,
    amenities: ['Pool', 'Restaurant', 'Spa', 'Beach shuttle', 'Eco-friendly'],
    tags: ['Eco-Friendly', 'Luxury', 'Rainforest Views'],
    userName: 'Sarah'
  },

  'acc-manuel-antonio-treehouse': {
    id: 'acc-manuel-antonio-treehouse',
    name: 'Rainforest Treehouse',
    location: 'Near National Park',
    destinationId: 'dest-manuel-antonio',
    type: 'House',
    description: 'Unique treehouse experience in the rainforest! Wake up to monkeys and sloths outside your window.',
    image: 'https://images.unsplash.com/photo-1618767689160-da3fb9fba058?w=400',
    pricePerNight: 195,
    priceLevel: 3,
    rating: 5,
    reviewCount: 456,
    amenities: ['Unique experience', 'Wildlife', 'Kitchen', 'WiFi'],
    tags: ['Unique', 'Wildlife', 'Nature'],
    userName: 'Cayman'
  },

  'acc-manuel-antonio-vista-serena': {
    id: 'acc-manuel-antonio-vista-serena',
    name: 'Vista Serena Hostel',
    location: 'Quepos',
    destinationId: 'dest-manuel-antonio',
    type: 'Hostel',
    description: 'Budget-friendly option near Manuel Antonio with a pool and great social atmosphere.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    pricePerNight: 28,
    priceLevel: 1,
    rating: 4,
    reviewCount: 789,
    amenities: ['Pool', 'Shared kitchen', 'Bar', 'Tours desk'],
    tags: ['Budget', 'Social', 'Hostel'],
    userName: 'James'
  },

  // Tulum Accommodations
  'acc-tulum-be-tulum': {
    id: 'acc-tulum-be-tulum',
    name: 'Be Tulum Hotel',
    location: 'Tulum Beach Zone',
    destinationId: 'dest-tulum',
    type: 'Boutique Hotel',
    description: 'Ultra-chic boutique hotel on the beach. Minimalist design, incredible food, and yoga classes.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    pricePerNight: 450,
    priceLevel: 5,
    rating: 5,
    reviewCount: 892,
    amenities: ['Beach access', 'Restaurant', 'Yoga', 'Pool', 'Spa'],
    tags: ['Luxury', 'Beachfront', 'Wellness', 'Boutique'],
    userName: 'Emma'
  },

  'acc-tulum-casa-malca': {
    id: 'acc-tulum-casa-malca',
    name: 'Casa Malca',
    location: 'Tulum Beach',
    destinationId: 'dest-tulum',
    type: 'Boutique Hotel',
    description: 'Former Pablo Escobar mansion turned boutique hotel. Art-filled rooms and stunning beachfront.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    pricePerNight: 520,
    priceLevel: 5,
    rating: 5,
    reviewCount: 634,
    amenities: ['Beach access', 'Art collection', 'Restaurant', 'Pool', 'Bar'],
    tags: ['Luxury', 'Art', 'Historic', 'Beachfront'],
    userName: 'Sarah'
  },

  'acc-tulum-jungle-loft': {
    id: 'acc-tulum-jungle-loft',
    name: 'Jungle Loft Downtown',
    location: 'Tulum Pueblo',
    destinationId: 'dest-tulum',
    type: 'Airbnb',
    description: 'Modern loft in the heart of downtown Tulum. Walking distance to restaurants and cenotes.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    pricePerNight: 125,
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 412,
    amenities: ['Kitchen', 'WiFi', 'AC', 'Central location'],
    tags: ['Modern', 'Central', 'Budget-Friendly'],
    userName: 'Michael'
  }
};

// Helper functions
export function getAccommodationById(accommodationId: string): Accommodation | undefined {
  return accommodationsDatabase[accommodationId];
}

export function getAccommodationsByIds(accommodationIds: string[]): Accommodation[] {
  return accommodationIds
    .map(id => getAccommodationById(id))
    .filter((accommodation): accommodation is Accommodation => accommodation !== undefined);
}

export function getAccommodationsByDestination(destinationId: string): Accommodation[] {
  return Object.values(accommodationsDatabase).filter(
    accommodation => accommodation.destinationId === destinationId
  );
}

export function getAccommodationsByType(type: string): Accommodation[] {
  return Object.values(accommodationsDatabase).filter(
    accommodation => accommodation.type.toLowerCase().includes(type.toLowerCase())
  );
}

export function getAccommodationsByPriceRange(minPrice: number, maxPrice: number): Accommodation[] {
  return Object.values(accommodationsDatabase).filter(
    accommodation => accommodation.pricePerNight >= minPrice && accommodation.pricePerNight <= maxPrice
  );
}

export function getTopRatedAccommodations(limit: number = 10): Accommodation[] {
  return Object.values(accommodationsDatabase)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

export function getAllAccommodations(): Accommodation[] {
  return Object.values(accommodationsDatabase);
}
