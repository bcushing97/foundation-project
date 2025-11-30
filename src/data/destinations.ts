/**
 * Destinations Database - Single Source of Truth
 * 
 * ALL destinations in the application are defined here.
 * These are places users can save to their profile.
 */

export interface Destination {
  id: string; // Unique identifier for the destination (e.g., 'dest-tamarindo')
  name: string; // Display name of the destination (e.g., 'Tamarindo')
  country: string; // Country where the destination is located
  region?: string; // Geographic region (e.g., 'Central America', 'Southeast Asia')
  image: string; // URL to destination hero image
  description?: string; // Brief description of the destination
  coordinates?: {
    lat: number; // Latitude coordinate
    lng: number; // Longitude coordinate
  };
  tags?: string[]; // Searchable tags (e.g., 'Beach', 'Surfing', 'Wildlife')
  bestTimeToVisit?: string; // Recommended travel period (e.g., 'December - April')
  averageCost?: number; // Average daily cost in USD
  popularity?: number; // Popularity score from 1-100
}

export const destinationsDatabase: Record<string, Destination> = {
  'dest-manuel-antonio': {
    id: 'dest-manuel-antonio',
    name: 'Manuel Antonio',
    country: 'Costa Rica',
    region: 'Central America',
    image: 'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?w=600',
    description: 'A stunning beach town on Costa Rica\'s Pacific coast, known for its pristine beaches, lush rainforest, and abundant wildlife.',
    coordinates: {
      lat: 9.3908,
      lng: -84.1306
    },
    tags: ['Beach', 'Wildlife', 'Rainforest', 'Adventure'],
    bestTimeToVisit: 'December - April',
    averageCost: 150,
    popularity: 85
  },

  'dest-tulum': {
    id: 'dest-tulum',
    name: 'Tulum',
    country: 'Mexico',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600',
    description: 'Ancient Mayan ruins perched on Caribbean cliffs, bohemian beach clubs, and world-class cenotes.',
    coordinates: {
      lat: 20.2114,
      lng: -87.4654
    },
    tags: ['Beach', 'History', 'Wellness', 'Culture'],
    bestTimeToVisit: 'November - April',
    averageCost: 120,
    popularity: 92
  },

  'dest-bali': {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    description: 'The Island of the Gods offers stunning rice terraces, ancient temples, pristine beaches, and world-renowned surf.',
    coordinates: {
      lat: -8.4095,
      lng: 115.1889
    },
    tags: ['Beach', 'Culture', 'Wellness', 'Surfing', 'Temples'],
    bestTimeToVisit: 'April - October',
    averageCost: 80,
    popularity: 98
  },

  'dest-santorini': {
    id: 'dest-santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600',
    description: 'Iconic white-washed buildings with blue domes perched on volcanic cliffs overlooking the azure Aegean Sea.',
    coordinates: {
      lat: 36.3932,
      lng: 25.4615
    },
    tags: ['Beach', 'Romance', 'Sunset', 'Wine', 'History'],
    bestTimeToVisit: 'April - November',
    averageCost: 200,
    popularity: 95
  },

  'dest-cappadocia': {
    id: 'dest-cappadocia',
    name: 'Cappadocia',
    country: 'Turkey',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600',
    description: 'Surreal landscape of fairy chimneys, ancient cave dwellings, and unforgettable hot air balloon rides at sunrise.',
    coordinates: {
      lat: 38.6431,
      lng: 34.8289
    },
    tags: ['Adventure', 'History', 'Hot Air Balloon', 'Unique Landscape'],
    bestTimeToVisit: 'April - May, September - October',
    averageCost: 100,
    popularity: 88
  },

  'dest-tamarindo': {
    id: 'dest-tamarindo',
    name: 'Tamarindo',
    country: 'Costa Rica',
    region: 'Central America',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600',
    description: 'Premier surf town with consistent waves, golden beaches, and vibrant nightlife on Costa Rica\'s Gold Coast.',
    coordinates: {
      lat: 10.2976,
      lng: -85.8367
    },
    tags: ['Beach', 'Surfing', 'Nightlife', 'Adventure'],
    bestTimeToVisit: 'December - April',
    averageCost: 130,
    popularity: 82
  }
};

// Helper functions
export function getDestinationById(destinationId: string): Destination | undefined {
  return destinationsDatabase[destinationId];
}

export function getDestinationsByIds(destinationIds: string[]): Destination[] {
  return destinationIds
    .map(id => getDestinationById(id))
    .filter((dest): dest is Destination => dest !== undefined);
}

export function getDestinationsByCountry(country: string): Destination[] {
  return Object.values(destinationsDatabase).filter(dest =>
    dest.country.toLowerCase().includes(country.toLowerCase())
  );
}

export function getDestinationsByTag(tag: string): Destination[] {
  return Object.values(destinationsDatabase).filter(dest =>
    dest.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function getPopularDestinations(limit: number = 10): Destination[] {
  return Object.values(destinationsDatabase)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

export function getAllDestinations(): Destination[] {
  return Object.values(destinationsDatabase);
}

// World Destinations - Comprehensive list for autocomplete
export const worldDestinations = [
  // North America
  'New York, USA',
  'Los Angeles, USA',
  'San Francisco, USA',
  'Miami, USA',
  'Chicago, USA',
  'Las Vegas, USA',
  'Seattle, USA',
  'Boston, USA',
  'Austin, USA',
  'Nashville, USA',
  'New Orleans, USA',
  'Hawaii, USA',
  'Alaska, USA',
  'Cancun, Mexico',
  'Tulum, Mexico',
  'Mexico City, Mexico',
  'Cabo San Lucas, Mexico',
  'Puerto Vallarta, Mexico',
  'Toronto, Canada',
  'Vancouver, Canada',
  'Montreal, Canada',
  'Banff, Canada',
  'Quebec City, Canada',
  
  // Central America & Caribbean
  'Costa Rica',
  'Manuel Antonio, Costa Rica',
  'Tamarindo, Costa Rica',
  'Panama City, Panama',
  'Belize City, Belize',
  'Guatemala City, Guatemala',
  'Jamaica',
  'Bahamas',
  'Barbados',
  'Aruba',
  'Dominican Republic',
  'Cuba',
  
  // South America
  'Rio de Janeiro, Brazil',
  'São Paulo, Brazil',
  'Buenos Aires, Argentina',
  'Patagonia, Argentina',
  'Lima, Peru',
  'Cusco, Peru',
  'Machu Picchu, Peru',
  'Bogotá, Colombia',
  'Cartagena, Colombia',
  'Santiago, Chile',
  'Quito, Ecuador',
  'Galápagos Islands, Ecuador',
  
  // Europe
  'London, UK',
  'Paris, France',
  'Rome, Italy',
  'Barcelona, Spain',
  'Madrid, Spain',
  'Amsterdam, Netherlands',
  'Berlin, Germany',
  'Munich, Germany',
  'Vienna, Austria',
  'Prague, Czech Republic',
  'Budapest, Hungary',
  'Athens, Greece',
  'Santorini, Greece',
  'Mykonos, Greece',
  'Istanbul, Turkey',
  'Cappadocia, Turkey',
  'Lisbon, Portugal',
  'Porto, Portugal',
  'Dublin, Ireland',
  'Edinburgh, Scotland',
  'Copenhagen, Denmark',
  'Stockholm, Sweden',
  'Oslo, Norway',
  'Reykjavik, Iceland',
  'Helsinki, Finland',
  'Zurich, Switzerland',
  'Geneva, Switzerland',
  'Brussels, Belgium',
  'Krakow, Poland',
  'Dubrovnik, Croatia',
  
  // Asia
  'Tokyo, Japan',
  'Kyoto, Japan',
  'Osaka, Japan',
  'Seoul, South Korea',
  'Beijing, China',
  'Shanghai, China',
  'Hong Kong',
  'Bangkok, Thailand',
  'Phuket, Thailand',
  'Chiang Mai, Thailand',
  'Singapore',
  'Bali, Indonesia',
  'Jakarta, Indonesia',
  'Hanoi, Vietnam',
  'Ho Chi Minh City, Vietnam',
  'Siem Reap, Cambodia',
  'Manila, Philippines',
  'Kuala Lumpur, Malaysia',
  'Mumbai, India',
  'New Delhi, India',
  'Jaipur, India',
  'Goa, India',
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Tel Aviv, Israel',
  'Jerusalem, Israel',
  
  // Oceania
  'Sydney, Australia',
  'Melbourne, Australia',
  'Brisbane, Australia',
  'Perth, Australia',
  'Gold Coast, Australia',
  'Auckland, New Zealand',
  'Queenstown, New Zealand',
  'Wellington, New Zealand',
  'Fiji',
  'Tahiti',
  'Bora Bora',
  
  // Africa
  'Cape Town, South Africa',
  'Johannesburg, South Africa',
  'Marrakech, Morocco',
  'Cairo, Egypt',
  'Nairobi, Kenya',
  'Serengeti, Tanzania',
  'Zanzibar, Tanzania',
  'Victoria Falls, Zimbabwe',
  'Mauritius',
  'Seychelles',
];