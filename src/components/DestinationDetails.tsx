import { useState } from 'react';
import { X, MapPin, ChevronLeft, ChevronRight, ExternalLink, Users, UtensilsCrossed, Star, ChevronRight as ChevronRightIcon, Calendar, Plus, Luggage, Map, Home, Bookmark, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { format } from 'date-fns';
import type { DraftTrip } from './AddToExistingTripDialog';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

interface DestinationDetailsProps {
  destination: {
    id: string;
    name: string;
    country: string;
    region: string;
    description: string;
    image: string;
    attributes: string[];
    priceLevel: number;
    visitedBy: string[];
  };
  onClose: () => void;
  following?: string[];
  selectedFilters?: string[];
  onViewTripDetails?: (tripId: string) => void;
  onCreateTrip?: (destination: { id: string; name: string; country: string }) => void;
  onAddToTrip?: (destination: { id: string; name: string; country: string }) => void;
  draftTrips?: DraftTrip[];
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
  isSaved?: boolean;
  onToggleSave?: (destinationId: string) => void;
  savedActivityIds?: string[];
  onToggleSaveActivity?: (activityId: string) => void;
}

// Season data with price and climate info combined
interface SeasonInfo {
  name: string;
  months: string;
  priceLevel: 'Budget-friendly' | 'Moderate' | 'Expensive' | 'Very Expensive';
  climate: string;
  temperature: string;
}

// Restaurant recommendation
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string; // e.g., "$15-25 pp" or "$40-60 pp"
  description: string;
  image: string;
  rating: number;
  userName: string;
}

// Extended destination data for details view
const destinationExtendedData: Record<string, {
  gallery: string[];
  coordinates: { lat: number; lng: number };
  averagePriceContext: string; // Relative price compared to other destinations
  seasons: SeasonInfo[];
  popularActivities: string[];
  highlights?: string[]; // UNESCO sites, famous landmarks, etc.
  foodScene: string; // Quick blurb
  restaurants: Restaurant[];
}> = {
  '1': {
    gallery: [
      'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?w=1200',
      'https://images.unsplash.com/photo-1621277224630-81d9af65ede4?w=1200',
      'https://images.unsplash.com/photo-1569930784237-e6d6e31babd0?w=1200',
      'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1200',
    ],
    coordinates: { lat: 9.6383, lng: -84.1459 },
    averagePriceContext: 'Moderate pricing compared to other Central American beach destinations. More affordable than Tulum, similar to Playa del Carmen.',
    seasons: [
      {
        name: 'High Season',
        months: 'December - April',
        priceLevel: 'Expensive',
        climate: 'Dry and sunny',
        temperature: '75-85°F'
      },
      {
        name: 'Shoulder Season',
        months: 'May & November',
        priceLevel: 'Moderate',
        climate: 'Occasional rain, mostly sunny',
        temperature: '75-85°F'
      },
      {
        name: 'Low Season',
        months: 'June - October',
        priceLevel: 'Budget-friendly',
        climate: 'Rainy season, afternoon showers',
        temperature: '75-88°F'
      }
    ],
    popularActivities: [
      'Beach lounging',
      'Rainforest hiking',
      'Wildlife spotting',
      'Surfing',
      'Zip-lining',
      'Snorkeling',
      'National park tours',
      'Kayaking'
    ],
    highlights: [
      'Manuel Antonio National Park - pristine beaches and wildlife',
      'Three stunning beaches within the national park',
      'Sloth and monkey sightings common',
      'Coral reefs perfect for snorkeling'
    ],
    foodScene: 'Fresh seafood and traditional Costa Rican casados at local sodas. Upscale options available but limited.',
    restaurants: [
      {
        id: 'r1',
        name: 'El Avión',
        cuisine: 'Seafood',
        priceRange: '$15-30 pp',
        description: 'Iconic restaurant built inside a 1954 Fairchild C-123 plane with stunning sunset views',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        rating: 4.6,
        userName: 'Maria S.'
      },
      {
        id: 'r2',
        name: 'Cafe Milagro',
        cuisine: 'Local',
        priceRange: '$8-18 pp',
        description: 'Local favorite for breakfast and coffee with organic, locally-sourced ingredients',
        image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
        rating: 4.7,
        userName: 'Jake T.'
      },
      {
        id: 'r3',
        name: 'Restaurante Marlin',
        cuisine: 'Seafood',
        priceRange: '$12-25 pp',
        description: 'Beachfront dining with the freshest catch of the day and traditional ceviche',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        rating: 4.5,
        userName: 'Emma L.'
      },
      {
        id: 'r4',
        name: 'Soda Sanchez',
        cuisine: 'Local',
        priceRange: '$5-12 pp',
        description: 'Authentic local soda serving casados and gallo pinto at unbeatable prices',
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
        rating: 4.8,
        userName: 'Carlos M.'
      }
    ]
  },
  '2': {
    gallery: [
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    ],
    coordinates: { lat: 10.2994, lng: -85.8394 },
    averagePriceContext: 'Budget to moderate pricing. One of the more affordable beach towns in Costa Rica with competitive accommodation and food options.',
    seasons: [
      {
        name: 'High Season',
        months: 'December - April',
        priceLevel: 'Expensive',
        climate: 'Dry, hot, and sunny',
        temperature: '78-92°F'
      },
      {
        name: 'Surf Season',
        months: 'May - November',
        priceLevel: 'Moderate',
        climate: 'Warm with afternoon rains',
        temperature: '75-90°F'
      }
    ],
    popularActivities: [
      'Surfing',
      'Beach parties',
      'Sunset cruises',
      'Sportfishing',
      'ATV tours',
      'Yoga classes',
      'Paddleboarding',
      'Turtle watching'
    ],
    highlights: [
      'World-class surf breaks for all levels',
      'Las Baulas National Marine Park nearby',
      'Leatherback turtle nesting (October-March)',
      'Vibrant expat community'
    ],
    foodScene: 'International cuisine from Italian to Asian. Great beachfront restaurants and casual food trucks.',
    restaurants: [
      {
        id: 'r5',
        name: 'Pangas Beach Club',
        cuisine: 'International',
        priceRange: '$20-35 pp',
        description: 'Upscale beachfront dining with creative cocktails and fresh ceviche',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        rating: 4.5,
        userName: 'Sophie R.'
      },
      {
        id: 'r6',
        name: 'Nogi\'s Restaurant',
        cuisine: 'Seafood',
        priceRange: '$15-28 pp',
        description: 'Casual beachside spot known for grilled fish and tropical ambiance',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        rating: 4.6,
        userName: 'Tom W.'
      },
      {
        id: 'r7',
        name: 'Taco Star',
        cuisine: 'Mexican',
        priceRange: '$6-12 pp',
        description: 'Local favorite taco stand with incredible fish tacos and fresh salsas',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
        rating: 4.8,
        userName: 'Lisa K.'
      },
      {
        id: 'r8',
        name: 'Dragonfly Bar & Grill',
        cuisine: 'Asian',
        priceRange: '$18-32 pp',
        description: 'Creative Asian-Latin fusion in a romantic garden setting',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
        rating: 4.7,
        userName: 'David H.'
      }
    ]
  },
  '6': {
    gallery: [
      'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200',
      'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?w=1200',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200',
      'https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=1200',
    ],
    coordinates: { lat: 20.2114, lng: -87.4654 },
    averagePriceContext: 'Premium pricing, especially for Mexico. One of the most expensive destinations in Latin America with boutique hotels and upscale dining.',
    seasons: [
      {
        name: 'High Season',
        months: 'December - March',
        priceLevel: 'Very Expensive',
        climate: 'Perfect weather, minimal rain',
        temperature: '75-85°F'
      },
      {
        name: 'Shoulder Season',
        months: 'April - May, November',
        priceLevel: 'Expensive',
        climate: 'Hot and humid, occasional rain',
        temperature: '80-90°F'
      },
      {
        name: 'Low Season',
        months: 'June - October',
        priceLevel: 'Moderate',
        climate: 'Hot, humid, frequent afternoon storms',
        temperature: '80-95°F'
      }
    ],
    popularActivities: [
      'Mayan ruins exploration',
      'Cenote swimming',
      'Yoga & wellness',
      'Beach clubs',
      'Snorkeling',
      'Spa treatments',
      'Bike tours',
      'Photography'
    ],
    highlights: [
      'Tulum Ruins - UNESCO World Heritage Site',
      'Gran Cenote and Dos Ojos cenote systems',
      'Sian Ka\'an Biosphere Reserve (UNESCO)',
      'Ancient Mayan port city overlooking Caribbean'
    ],
    foodScene: 'Upscale beachfront dining and trendy vegan cafes. Traditional Mexican food downtown at better prices.',
    restaurants: [
      {
        id: 'r9',
        name: 'Hartwood',
        cuisine: 'Local',
        priceRange: '$45-70 pp',
        description: 'Legendary open-air restaurant with wood-fired cooking and no electricity',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        rating: 4.9,
        userName: 'Alexandra P.'
      },
      {
        id: 'r10',
        name: 'Posada Margherita',
        cuisine: 'Italian',
        priceRange: '$35-55 pp',
        description: 'Authentic Italian beachfront dining with homemade pasta and fresh ingredients',
        image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800',
        rating: 4.7,
        userName: 'Marco V.'
      },
      {
        id: 'r11',
        name: 'Antojitos La Chiapaneca',
        cuisine: 'Local',
        priceRange: '$8-15 pp',
        description: 'Local taqueria downtown serving authentic Yucatan dishes at great prices',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
        rating: 4.6,
        userName: 'Juan C.'
      },
      {
        id: 'r12',
        name: 'Raw Love',
        cuisine: 'Vegan',
        priceRange: '$18-28 pp',
        description: 'Trendy plant-based cafe with smoothie bowls, salads, and raw desserts',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        rating: 4.8,
        userName: 'Rachel G.'
      }
    ]
  }
};

// Default data for destinations without extended info
const getDefaultExtendedData = () => ({
  gallery: [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
  ],
  coordinates: { lat: 10.0, lng: -84.0 },
  averagePriceContext: 'Moderate pricing compared to similar destinations in the region.',
  seasons: [
    {
      name: 'High Season',
      months: 'December - April',
      priceLevel: 'Expensive' as const,
      climate: 'Dry and sunny',
      temperature: '70-85°F'
    },
    {
      name: 'Low Season',
      months: 'May - November',
      priceLevel: 'Budget-friendly' as const,
      climate: 'Rainy season',
      temperature: '70-88°F'
    }
  ],
  popularActivities: ['Sightseeing', 'Local cuisine', 'Cultural experiences', 'Beach activities', 'Hiking'],
  highlights: undefined,
  foodScene: 'Diverse culinary options ranging from street food to upscale dining.',
  restaurants: [
    {
      id: 'rd1',
      name: 'Local Favorite',
      cuisine: 'Local',
      priceRange: '$12-22 pp',
      description: 'Popular spot serving traditional dishes with fresh local ingredients',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      rating: 4.5,
      userName: 'Sarah J.'
    },
    {
      id: 'rd2',
      name: 'Street Food Market',
      cuisine: 'Street Food',
      priceRange: '$5-10 pp',
      description: 'Authentic local street food with amazing variety and flavor',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      rating: 4.6,
      userName: 'Mike D.'
    }
  ]
});

// User-generated activities
interface UserActivity {
  id: string;
  name: string;
  location: string;
  userName: string;
  rating: number;
  category: string;
  description: string;
  image: string;
  pricePerPerson: string; // e.g., "$25 pp" or "$50-75 pp"
}

// User-recommended accommodations
interface UserAccommodation {
  id: string;
  name: string;
  location: string;
  userName: string;
  rating: number;
  type: 'Hotel' | 'Hostel' | 'Airbnb' | 'Resort' | 'Boutique Hotel' | 'House' | 'Condo';
  description: string;
  image: string;
  pricePerNight: number;
  amenities: string[];
}

const userActivitiesByDestination: Record<string, UserActivity[]> = {
  '2': [ // Tamarindo
    {
      id: 'act-1',
      name: 'Surfing at Witch\'s Rock Surf Camp',
      location: 'Witch\'s Rock Surf Camp',
      userName: 'Sarah',
      rating: 5,
      category: 'Surfing',
      description: 'Amazing surf lessons with experienced instructors. Perfect waves for all levels!',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400',
      pricePerPerson: '$65 pp'
    },
    {
      id: 'act-2',
      name: 'Sunset Sailing Catamaran',
      location: 'Tamarindo Bay',
      userName: 'Michael',
      rating: 5,
      category: 'Sunset cruises',
      description: 'Incredible sunset cruise with snorkeling, drinks, and appetizers. Saw dolphins!',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      pricePerPerson: '$85 pp'
    },
    {
      id: 'act-3',
      name: 'Kayaking through Mangroves',
      location: 'Tamarindo Estuary',
      userName: 'Emma',
      rating: 4,
      category: 'Kayaking',
      description: 'Peaceful kayak tour through mangroves. Spotted monkeys and exotic birds.',
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400',
      pricePerPerson: '$55 pp'
    },
    {
      id: 'act-4',
      name: 'Beach Horseback Riding',
      location: 'Tamarindo Beach',
      userName: 'Bryce',
      rating: 5,
      category: 'Beach activities',
      description: 'Romantic horseback ride along the beach at sunset. Unforgettable experience!',
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400',
      pricePerPerson: '$70 pp'
    },
    {
      id: 'act-5',
      name: 'ATV Jungle Adventure',
      location: 'Tamarindo Highlands',
      userName: 'Cayman',
      rating: 5,
      category: 'ATV tours',
      description: 'Thrilling ATV ride through jungle trails with breathtaking viewpoints.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      pricePerPerson: '$95 pp'
    },
    {
      id: 'act-6',
      name: 'Stand Up Paddleboarding',
      location: 'Tamarindo Bay',
      userName: 'James',
      rating: 4,
      category: 'Paddleboarding',
      description: 'Great morning activity with calm waters. Rented boards from local shop.',
      image: 'https://images.unsplash.com/photo-1508418669327-61a6e6fc5d18?w=400',
      pricePerPerson: '$30 pp'
    },
    {
      id: 'act-7',
      name: 'Morning Yoga on the Beach',
      location: 'Playa Tamarindo',
      userName: 'Sarah',
      rating: 5,
      category: 'Yoga classes',
      description: 'Sunrise yoga session on the beach. Perfect way to start the day!',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      pricePerPerson: '$25 pp'
    },
    {
      id: 'act-8',
      name: 'Sport Fishing Charter',
      location: 'Pacific Coast',
      userName: 'Michael',
      rating: 5,
      category: 'Sportfishing',
      description: 'Full day charter. Caught marlin and tuna. Professional crew!',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      pricePerPerson: '$450 pp'
    }
  ],
  '1': [ // Manuel Antonio
    {
      id: 'act-9',
      name: 'Canopy Zip Line Adventure',
      location: 'Rainforest Adventures',
      userName: 'Emma',
      rating: 5,
      category: 'Zip-lining',
      description: 'Epic zip-lining through the rainforest canopy. Incredible views!',
      image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=400',
      pricePerPerson: '$80 pp'
    },
    {
      id: 'act-10',
      name: 'Snorkeling at Coral Reef',
      location: 'Manuel Antonio Beach',
      userName: 'Bryce',
      rating: 5,
      category: 'Snorkeling',
      description: 'Crystal clear waters with abundant marine life. Saw sea turtles!',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      pricePerPerson: '$60 pp'
    },
    {
      id: 'act-11',
      name: 'Rainforest Hiking Tour',
      location: 'Manuel Antonio National Park',
      userName: 'Sarah',
      rating: 5,
      category: 'Rainforest hiking',
      description: 'Guided hike through the national park. Saw sloths, monkeys, and toucans!',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
      pricePerPerson: '$45 pp'
    },
    {
      id: 'act-12',
      name: 'Wildlife Photography Tour',
      location: 'National Park Trails',
      userName: 'Cayman',
      rating: 4,
      category: 'Wildlife spotting',
      description: 'Amazing wildlife photography opportunities. Guide knew all the best spots.',
      image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400',
      pricePerPerson: '$75 pp'
    }
  ],
  '6': [ // Tulum
    {
      id: 'act-13',
      name: 'Cenote Diving Experience',
      location: 'Gran Cenote',
      userName: 'James',
      rating: 5,
      category: 'Cenote swimming',
      description: 'Surreal underwater cave diving. One of the best experiences of my life!',
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400',
      pricePerPerson: '$120 pp'
    },
    {
      id: 'act-14',
      name: 'Tulum Ruins Sunrise Tour',
      location: 'Tulum Archaeological Site',
      userName: 'Emma',
      rating: 5,
      category: 'Mayan ruins exploration',
      description: 'Beat the crowds with early morning tour. Stunning views of ruins by the sea.',
      image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400',
      pricePerPerson: '$55 pp'
    },
    {
      id: 'act-15',
      name: 'Beach Club Day Pass',
      location: 'Papaya Playa Project',
      userName: 'Sarah',
      rating: 4,
      category: 'Beach clubs',
      description: 'Chic beach club with great food and music. Perfect for a relaxing day.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
      pricePerPerson: '$75 pp'
    }
  ]
};

const userAccommodationsByDestination: Record<string, UserAccommodation[]> = {
  '2': [ // Tamarindo
    {
      id: 'acc-1',
      name: 'Hotel Tamarindo Diria Beach Resort',
      location: 'Beachfront, Tamarindo',
      userName: 'Sarah',
      rating: 4.5,
      type: 'Resort',
      description: 'Beautiful beachfront resort with multiple pools, restaurants, and stunning ocean views. Great for families and couples.',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      pricePerNight: 180,
      amenities: ['Pool', 'Beach access', 'Restaurant', 'Bar', 'Spa']
    },
    {
      id: 'acc-2',
      name: 'Witch\'s Rock Surf Camp',
      location: 'Central Tamarindo',
      userName: 'Michael',
      rating: 5,
      type: 'Hostel',
      description: 'Perfect spot for surfers! Great social vibe, affordable rates, and amazing surf lessons.',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
      pricePerNight: 35,
      amenities: ['Surf lessons', 'Pool', 'Bar', 'Breakfast included']
    },
    {
      id: 'acc-3',
      name: 'Beachfront Villa Casa Azul',
      location: 'Playa Langosta',
      userName: 'Emma',
      rating: 5,
      type: 'Condo',
      description: 'Stunning private villa with direct beach access. Perfect for groups or families. Full kitchen and private pool.',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      pricePerNight: 350,
      amenities: ['Private pool', 'Beach access', 'Kitchen', 'WiFi', 'Parking']
    },
    {
      id: 'acc-4',
      name: 'Cala Luna Boutique Hotel',
      location: 'Langosta Beach',
      userName: 'Bryce',
      rating: 5,
      type: 'Boutique Hotel',
      description: 'Intimate boutique hotel with incredible service and beautiful rooms. Adults-only paradise.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      pricePerNight: 280,
      amenities: ['Pool', 'Beach access', 'Spa', 'Restaurant', 'Adults only']
    }
  ],
  '1': [ // Manuel Antonio
    {
      id: 'acc-5',
      name: 'Hotel Si Como No',
      location: 'Manuel Antonio Hillside',
      userName: 'Sarah',
      rating: 5,
      type: 'Hotel',
      description: 'Eco-friendly luxury hotel with stunning views, two pools, and complimentary shuttle to the beach.',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
      pricePerNight: 245,
      amenities: ['Pool', 'Restaurant', 'Spa', 'Beach shuttle', 'Eco-friendly']
    },
    {
      id: 'acc-6',
      name: 'Rainforest Treehouse',
      location: 'Near National Park',
      userName: 'Cayman',
      rating: 5,
      type: 'House',
      description: 'Unique treehouse experience in the rainforest! Wake up to monkeys and sloths outside your window.',
      image: 'https://images.unsplash.com/photo-1618767689160-da3fb9fba058?w=400',
      pricePerNight: 195,
      amenities: ['Unique experience', 'Wildlife', 'Kitchen', 'WiFi']
    },
    {
      id: 'acc-7',
      name: 'Vista Serena Hostel',
      location: 'Quepos',
      userName: 'James',
      rating: 4,
      type: 'Hostel',
      description: 'Budget-friendly option near Manuel Antonio with a pool and great social atmosphere.',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
      pricePerNight: 28,
      amenities: ['Pool', 'Shared kitchen', 'Bar', 'Tours desk']
    }
  ],
  '6': [ // Tulum
    {
      id: 'acc-8',
      name: 'Be Tulum Hotel',
      location: 'Tulum Beach Zone',
      userName: 'Emma',
      rating: 5,
      type: 'Boutique Hotel',
      description: 'Ultra-chic boutique hotel on the beach. Minimalist design, incredible food, and yoga classes.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      pricePerNight: 450,
      amenities: ['Beach access', 'Restaurant', 'Yoga', 'Pool', 'Spa']
    },
    {
      id: 'acc-9',
      name: 'Casa Malca',
      location: 'Tulum Beach',
      userName: 'Sarah',
      rating: 5,
      type: 'Boutique Hotel',
      description: 'Former Pablo Escobar mansion turned boutique hotel. Art-filled rooms and stunning beachfront.',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      pricePerNight: 520,
      amenities: ['Beach access', 'Art collection', 'Restaurant', 'Pool', 'Bar']
    },
    {
      id: 'acc-10',
      name: 'Jungle Loft Downtown',
      location: 'Tulum Pueblo',
      userName: 'Michael',
      rating: 4.5,
      type: 'Airbnb',
      description: 'Modern loft in the heart of downtown Tulum. Walking distance to restaurants and cenotes.',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      pricePerNight: 125,
      amenities: ['Kitchen', 'WiFi', 'AC', 'Central location']
    }
  ]
};

export function DestinationDetails({ destination, onClose, following, selectedFilters = [], onViewTripDetails, onCreateTrip, onAddToTrip, draftTrips, isLoggedIn, onLoginRequired, isSaved = false, onToggleSave, savedActivityIds = [], onToggleSaveActivity }: DestinationDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string | null>(null);
  const [viewAllActivitiesOpen, setViewAllActivitiesOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<UserAccommodation | null>(null);
  const [showFriendTripsDialog, setShowFriendTripsDialog] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);
  const [accommodationsExpanded, setAccommodationsExpanded] = useState(false);
  const [restaurantsExpanded, setRestaurantsExpanded] = useState(false);
  const [showActivityFilters, setShowActivityFilters] = useState(false);
  const [selectedAccommodationFilter, setSelectedAccommodationFilter] = useState<string | null>(null);
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState<string | null>(null);
  const [showAccommodationFilters, setShowAccommodationFilters] = useState(false);
  const [showCuisineFilters, setShowCuisineFilters] = useState(false);
  
  const extendedData = destinationExtendedData[destination.id] || getDefaultExtendedData();
  
  // Insert map as second item in gallery (index 1)
  const galleryWithMap = [
    extendedData.gallery[0], // First photo
    'MAP_PLACEHOLDER', // Map goes here as second item
    ...extendedData.gallery.slice(1) // Rest of photos
  ];

  // Get user activities for this destination
  const userActivities = userActivitiesByDestination[destination.id] || [];
  
  // Get user accommodations for this destination
  const userAccommodations = userAccommodationsByDestination[destination.id] || [];

  // Get unique accommodation types from the data
  const availableAccommodationTypes = Array.from(new Set(userAccommodations.map(acc => acc.type)));
  
  // Filter accommodations by type
  const filteredAccommodations = selectedAccommodationFilter
    ? userAccommodations.filter(acc => acc.type === selectedAccommodationFilter)
    : userAccommodations;

  // Get unique cuisines from the restaurant data
  const availableCuisines = Array.from(new Set(extendedData.restaurants.map(r => r.cuisine)));
  
  // Filter restaurants by cuisine
  const filteredRestaurants = selectedCuisineFilter
    ? extendedData.restaurants.filter(r => r.cuisine === selectedCuisineFilter)
    : extendedData.restaurants;

  // Mock data for friend trips to this destination
  const friendTripsData: Record<string, Array<{
    id: string;
    name: string;
    date: string;
    duration: string;
    coverImage: string;
    highlights: string[];
  }>> = {
    'Bryce': [
      {
        id: '1',
        name: 'Costa Rica Adventure',
        date: 'January 2024',
        duration: '5 days',
        coverImage: 'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?w=600',
        highlights: ['Zip-lining', 'Beach relaxation', 'Wildlife spotting']
      }
    ],
    'Cayman': [
      {
        id: '2',
        name: 'Surfing Tamarindo',
        date: 'March 2024',
        duration: '7 days',
        coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600',
        highlights: ['Surfing lessons', 'Beach parties', 'ATV tours']
      }
    ],
    'Sarah': [
      {
        id: '1',
        name: '10 Days Through Italian Coastline',
        date: 'June 2024',
        duration: '10 days',
        coverImage: 'https://images.unsplash.com/photo-1534113414509-0bd4d66f96c0?w=600',
        highlights: ['Historical sites', 'Coastal views', 'Italian cuisine']
      }
    ],
    'Michael': [],
    'Emma': []
  };

  // Get friends who visited and their trips
  const friendsWhoVisited = following && following.length > 0 
    ? destination.visitedBy.filter(name => following.includes(name))
    : [];
  
  const friendTrips = friendsWhoVisited.map(friend => ({
    friend,
    trips: friendTripsData[friend] || []
  })).filter(item => item.trips.length > 0);

  // Filter and sort user activities based on selected activity filter
  // Filter activities based on selected filter
  const getFilteredActivities = () => {
    if (!selectedActivityFilter) {
      return userActivities;
    }
    
    // First, get activities that match the selected filter
    const matched = userActivities.filter(act => act.category === selectedActivityFilter);
    // Then, get the rest
    const unmatched = userActivities.filter(act => act.category !== selectedActivityFilter);
    
    // Return matched first, then unmatched
    return [...matched, ...unmatched];
  };

  const filteredActivities = getFilteredActivities();
  // On mobile: Show 2 activities initially (1 row), expand to show all
  const initialCount = 2; // 1 row on mobile (2 columns)
  const previewActivities = activitiesExpanded ? filteredActivities : filteredActivities.slice(0, initialCount);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryWithMap.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryWithMap.length) % galleryWithMap.length);
  };

  // Helper function to format visitor names
  const getVisitorText = (visitedBy: string[]): string | null => {
    if (!following || following.length === 0 || visitedBy.length === 0) return null;
    
    const friendsWhoVisited = visitedBy.filter(name => following.includes(name));
    if (friendsWhoVisited.length === 0) return null;

    if (friendsWhoVisited.length === 1) {
      return `${friendsWhoVisited[0]} visited here`;
    } else if (friendsWhoVisited.length === 2) {
      return `${friendsWhoVisited[0]} and ${friendsWhoVisited[1]} visited here`;
    } else if (friendsWhoVisited.length <= 5) {
      const lastFriend = friendsWhoVisited[friendsWhoVisited.length - 1];
      const otherFriends = friendsWhoVisited.slice(0, -1).join(', ');
      return `${otherFriends}, and ${lastFriend} visited here`;
    } else {
      const firstThree = friendsWhoVisited.slice(0, 3).join(', ');
      const remaining = friendsWhoVisited.length - 3;
      return `${firstThree}, and ${remaining} others visited here`;
    }
  };

  // Check which activities match the user's selected filters
  const isActivityMatched = (activity: string): boolean => {
    // Create a mapping of activities to filter categories
    const activityToFilter: Record<string, string[]> = {
      'Beach lounging': ['Beach & Coast', 'Relaxation & Spa'],
      'Surfing': ['Beach & Coast', 'Adventure & Sports'],
      'Rainforest hiking': ['Mountains & Hiking', 'Wildlife & Nature', 'Adventure & Sports'],
      'Wildlife spotting': ['Wildlife & Nature'],
      'Zip-lining': ['Adventure & Sports'],
      'Snorkeling': ['Beach & Coast', 'Adventure & Sports', 'Wildlife & Nature'],
      'National park tours': ['Wildlife & Nature', 'Adventure & Sports'],
      'Kayaking': ['Adventure & Sports', 'Wildlife & Nature'],
      'Beach parties': ['Beach & Coast', 'Nightlife & Entertainment'],
      'Sunset cruises': ['Beach & Coast', 'Relaxation & Spa'],
      'Sportfishing': ['Adventure & Sports'],
      'ATV tours': ['Adventure & Sports'],
      'Yoga classes': ['Relaxation & Spa'],
      'Paddleboarding': ['Beach & Coast', 'Adventure & Sports'],
      'Turtle watching': ['Wildlife & Nature'],
      'Mayan ruins exploration': ['History & Museums', 'City & Culture'],
      'Cenote swimming': ['Adventure & Sports', 'Wildlife & Nature'],
      'Yoga & wellness': ['Relaxation & Spa'],
      'Beach clubs': ['Beach & Coast', 'Luxury & Resorts', 'Nightlife & Entertainment'],
      'Spa treatments': ['Relaxation & Spa', 'Luxury & Resorts'],
      'Bike tours': ['Adventure & Sports'],
      'Photography': ['City & Culture'],
      'Sightseeing': ['City & Culture'],
      'Local cuisine': ['Food & Wine'],
      'Cultural experiences': ['City & Culture', 'History & Museums'],
      'Beach activities': ['Beach & Coast'],
      'Hiking': ['Mountains & Hiking', 'Adventure & Sports']
    };

    const relatedFilters = activityToFilter[activity] || [];
    return relatedFilters.some(filter => selectedFilters.includes(filter));
  };

  const visitorText = getVisitorText(destination.visitedBy);

  // Get price level color
  const getPriceLevelColor = (priceLevel: string) => {
    switch (priceLevel) {
      case 'Budget-friendly':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Moderate':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Expensive':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Very Expensive':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 bottom-[72px] md:inset-0 bg-black/50 z-50 overflow-y-auto scrollbar-hide">
      <div className="min-h-full md:min-h-screen py-0 md:py-8 px-0 md:px-4 pt-0 md:pt-24 pb-4">
        <div className="max-w-5xl mx-auto bg-white md:rounded-lg md:shadow-2xl min-h-screen md:min-h-0">
          {/* Header - MOBILE: Full width, simpler layout */}
          <div className="sticky top-0 bg-white z-10 border-b px-4 md:px-6 py-3 md:py-4 flex items-center justify-between md:rounded-t-lg">
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl mb-1">{destination.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span>{destination.country}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {onToggleSave && (
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginPrompt(true);
                      return;
                    }
                    onToggleSave(destination.id);
                  }}
                  className="flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors"
                >
                  <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-slate-900' : 'text-gray-500'}`} />
                </button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>

          {/* Image Gallery - MOBILE: Shorter height */}
          <div className="relative h-56 md:h-96 bg-gray-900">
            {galleryWithMap[currentImageIndex] === 'MAP_PLACEHOLDER' ? (
              // Show embedded map as second slide in carousel
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${extendedData.coordinates.lat},${extendedData.coordinates.lng}&zoom=12`}
                allowFullScreen
              />
            ) : (
              <img 
                src={galleryWithMap[currentImageIndex]} 
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Map Button - Always visible in bottom right (like trips page) */}
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="absolute bottom-4 right-4 bg-white/95 hover:bg-white backdrop-blur-sm rounded-lg shadow-lg p-2 transition-all hover:scale-105 border border-gray-200 z-10"
            >
              <Map className="w-4 h-4 text-blue-600" />
            </button>
            
            {/* Gallery Navigation */}
            {galleryWithMap.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryWithMap.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Friend Visits Badge */}
            {visitorText && (
              <button
                onClick={() => setShowFriendTripsDialog(true)}
                className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{visitorText}</span>
                </div>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Trip Action Buttons */}
            {(onCreateTrip || onAddToTrip) && (
              <>
                <Separator />
              </>
            )}

            {/* Seasons with Price & Climate */}
            <div>
              <h2 className="text-2xl mb-4">Best Times to Visit</h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6">
                {extendedData.seasons.map((season, index) => (
                  <Card key={index} className="p-4 border-gray-200 flex-shrink-0 w-64 min-w-[16rem]">
                    <div className="flex flex-col h-full">
                      <div className="mb-3">
                        <h3 className="text-base font-semibold mb-1">{season.name}</h3>
                        <p className="text-xs text-slate-600">{season.months}</p>
                      </div>
                      <Badge className={`px-2 py-0.5 text-xs w-fit mb-3 ${getPriceLevelColor(season.priceLevel)}`}>
                        {season.priceLevel}
                      </Badge>
                      <div className="space-y-2 text-xs mt-auto">
                        <div>
                          <span className="text-gray-600">Climate: </span>
                          <span className="text-gray-900">{season.climate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Temp: </span>
                          <span className="text-gray-900">{season.temperature}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Where to Stay - User Accommodations */}
            {userAccommodations.length > 0 && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl flex items-center gap-2">
                      <Home className="w-6 h-6 text-slate-700" />
                      Where to Stay
                    </h2>
                    {/* View Filters Button */}
                    {availableAccommodationTypes.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAccommodationFilters(!showAccommodationFilters)}
                        className="text-sm"
                      >
                        View Filters
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Accommodations recommended by travelers
                  </p>
                  
                  {/* Accommodation Type Filter Badges */}
                  {availableAccommodationTypes.length > 0 && showAccommodationFilters && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                          {availableAccommodationTypes.map((type) => {
                            const isSelected = selectedAccommodationFilter === type;
                            return (
                              <Badge 
                                key={type} 
                                variant={isSelected ? "default" : "secondary"}
                                className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                                  isSelected ? 'bg-slate-900 hover:bg-slate-800' : ''
                                }`}
                                onClick={() => {
                                  setSelectedAccommodationFilter(isSelected ? null : type);
                                }}
                              >
                                {type}
                              </Badge>
                            );
                          })}
                    </div>
                  </div>
                )}
                  
                  {/* User Accommodations Grid - MOBILE: 2 columns */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(accommodationsExpanded ? filteredAccommodations : filteredAccommodations.slice(0, 2)).map((accommodation) => (
                      <Card
                        key={accommodation.id}
                        className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                        onClick={() => setSelectedAccommodation(accommodation)}
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={accommodation.image}
                            alt={accommodation.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{accommodation.rating}</span>
                          </div>
                          <Badge className="absolute top-2 left-2 text-xs px-2 py-0.5 bg-slate-900 text-white">
                            {accommodation.type}
                          </Badge>
                        </div>
                        <div className="p-2.5">
                          <h3 className="font-medium text-xs mb-1 line-clamp-2">{accommodation.name}</h3>
                          <p className="text-xs text-gray-600 mb-1.5 line-clamp-1">{accommodation.location}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Users className="w-3 h-3" />
                              <span className="truncate">by {accommodation.userName}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-900">
                              ${accommodation.pricePerNight}/nt
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  {/* View More / View Less Button */}
                  {filteredAccommodations.length > 2 && (
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setAccommodationsExpanded(!accommodationsExpanded)}
                        className="w-full md:w-auto"
                      >
                        {accommodationsExpanded ? 'View Less' : `View More (${filteredAccommodations.length - 2} more)`}
                        <ChevronRightIcon className={`w-4 h-4 ml-2 transition-transform ${accommodationsExpanded ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />
              </>
            )}

            {/* Popular Activities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">Popular Activities</h2>
                {userActivities.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowActivityFilters(!showActivityFilters)}
                  >
                    {showActivityFilters ? 'Hide Filters' : 'View Filters'}
                  </Button>
                )}
              </div>
              
              {/* Activity Filter Badges - Hidden by default */}
              {showActivityFilters && userActivities.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {extendedData.popularActivities.map((activity, index) => {
                      const isMatched = isActivityMatched(activity);
                      const isSelected = selectedActivityFilter === activity;
                      return (
                        <Badge 
                          key={index} 
                          variant={isMatched ? "default" : "secondary"}
                          className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                            isMatched ? 'bg-slate-900 hover:bg-slate-800' : ''
                          } ${
                            isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                          }`}
                          onClick={() => {
                            setSelectedActivityFilter(isSelected ? null : activity);
                          }}
                        >
                          {activity}
                        </Badge>
                      );
                    })}
                  </div>
                  {selectedFilters.length > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                      Highlighted activities match your search preferences
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Click on an activity type to filter recommendations below
                  </p>
                </div>
              )}
              
              {userActivities.length > 0 && (
                <>
                  
                  {/* User Activities Grid - MOBILE: 2 columns, DESKTOP: 5 columns */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {previewActivities.map((activity) => (
                      <Card
                        key={activity.id}
                        className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{activity.rating}</span>
                          </div>
                        </div>
                        <div className="p-2.5">
                          <h3 className="font-medium text-xs mb-1 line-clamp-2">{activity.name}</h3>
                          <p className="text-xs text-gray-600 mb-1.5 line-clamp-1">{activity.location}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Users className="w-3 h-3" />
                              <span className="truncate">by {activity.userName}</span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700">
                              {activity.pricePerPerson}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  {/* View More / View Less Button */}
                  {filteredActivities.length > initialCount && (
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setActivitiesExpanded(!activitiesExpanded)}
                        className="w-full md:w-auto"
                      >
                        {activitiesExpanded ? 'View Less' : `View More (${filteredActivities.length - initialCount} more)`}
                        <ChevronRightIcon className={`w-4 h-4 ml-2 transition-transform ${activitiesExpanded ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            <Separator />

            {/* Food Scene - Restaurants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-slate-700" />
                  Food Scene
                </h2>
                {/* View Filters Button */}
                {availableCuisines.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCuisineFilters(!showCuisineFilters)}
                    className="text-sm"
                  >
                    View Filters
                  </Button>
                )}
              </div>
              
              {/* Cuisine Filter Badges - Only show cuisines that exist in data */}
              {availableCuisines.length > 0 && showCuisineFilters && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                      {availableCuisines.map((cuisine) => {
                        const isSelected = selectedCuisineFilter === cuisine;
                        return (
                          <Badge 
                            key={cuisine} 
                            variant={isSelected ? "default" : "secondary"}
                            className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                              isSelected ? 'bg-slate-900 hover:bg-slate-800' : ''
                            }`}
                            onClick={() => {
                              setSelectedCuisineFilter(isSelected ? null : cuisine);
                            }}
                          >
                            {cuisine}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              
              {/* Restaurants Grid - MOBILE: 2 columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredRestaurants.slice(0, restaurantsExpanded ? undefined : 2).map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="overflow-hidden"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h3 className="font-medium text-xs mb-0.5 line-clamp-1">{restaurant.name}</h3>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-1">{restaurant.cuisine}</p>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{restaurant.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span className="truncate">by {restaurant.userName}</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700">
                          {restaurant.priceRange}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* View More / View Less Button */}
              {filteredRestaurants.length > 2 && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setRestaurantsExpanded(!restaurantsExpanded)}
                    className="w-full md:w-auto"
                  >
                    {restaurantsExpanded ? 'View Less' : `View More (${filteredRestaurants.length - 2} more)`}
                    <ChevronRightIcon className={`w-4 h-4 ml-2 transition-transform ${restaurantsExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button className="flex-1 bg-slate-900 hover:bg-slate-800" size="lg">
                <ExternalLink className="w-5 h-5 mr-2" />
                Book Now
              </Button>
              <Button variant="outline" className="flex-1 border-slate-300 hover:bg-slate-50" size="lg">
                Save to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Trip Action Buttons - Bottom center, above nav bar */}
      {(onCreateTrip || onAddToTrip) && (
        <div className="fixed bottom-20 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
          <div className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-2 pointer-events-auto">
            {onCreateTrip && (
              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLoginPrompt(true);
                    return;
                  }
                  onCreateTrip({ 
                    id: destination.id, 
                    name: destination.name, 
                    country: destination.country 
                  });
                }}
                size="sm"
                className="rounded-full h-9 px-4"
              >
                <Luggage className="w-4 h-4 mr-1.5" />
                New Trip
              </Button>
            )}
            {onAddToTrip && (
              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLoginPrompt(true);
                    return;
                  }
                  onAddToTrip({ 
                    id: destination.id, 
                    name: destination.name, 
                    country: destination.country 
                  });
                }}
                variant="outline"
                size="sm"
                className="rounded-full h-9 px-4"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add to Trip
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Map Modal - Full screen map view */}
      <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {destination.name}, {destination.country}
            </DialogTitle>
            <DialogDescription>
              View the location on an interactive map
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 w-full overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${extendedData.coordinates.lat},${extendedData.coordinates.lng}&zoom=14`}
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Friend Trips Dialog */}
      <Dialog open={showFriendTripsDialog} onOpenChange={setShowFriendTripsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl">Friends Who Visited {destination.name}</DialogTitle>
            <DialogDescription>
              See the trips your friends took to this destination
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {friendTrips.length > 0 ? (
              friendTrips.map(({ friend, trips }) => (
                <div key={friend} className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">{friend[0]}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{friend}</h3>
                  </div>
                  
                  <div className="grid gap-3">
                    {trips.map((trip) => (
                      <Card 
                        key={trip.id}
                        className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                        onClick={() => {
                          setShowFriendTripsDialog(false);
                          if (onViewTripDetails) {
                            onViewTripDetails(trip.id);
                          }
                        }}
                      >
                        <div className="flex gap-4">
                          <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
                            <img
                              src={trip.coverImage}
                              alt={trip.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {trip.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{trip.date}</span>
                              </div>
                              <span>•</span>
                              <span>{trip.duration}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {trip.highlights.map((highlight, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No trip details available yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Details Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-2xl">
          {selectedActivity && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedActivity.name}</DialogTitle>
                <DialogDescription>
                  Recommended by {selectedActivity.userName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <img
                    src={selectedActivity.image}
                    alt={selectedActivity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedActivity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedActivity.rating}</span>
                  </div>
                </div>
                
                {/* Save Activity Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-0">
                      {selectedActivity.category}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setSelectedActivity(null);
                        setShowLoginPrompt(true);
                        return;
                      }
                      if (onToggleSaveActivity) {
                        onToggleSaveActivity(selectedActivity.id);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Flag 
                      className={`w-4 h-4 ${
                        savedActivityIds.includes(selectedActivity.id) 
                          ? 'fill-current' 
                          : ''
                      }`} 
                    />
                    {savedActivityIds.includes(selectedActivity.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
                
                <div>
                  <p className="text-gray-700 leading-relaxed">{selectedActivity.description}</p>
                </div>
                
                {/* Price Display */}
                <div className="flex items-center justify-between py-3 border-t border-b">
                  <span className="text-gray-600">Price</span>
                  <span className="text-xl font-semibold text-emerald-700">
                    {selectedActivity.pricePerPerson}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">{selectedActivity.userName[0]}</span>
                  </div>
                  <span className="text-sm text-gray-600">Recommended by {selectedActivity.userName}</span>
                </div>

                {/* Trip Management Buttons */}
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold">Add to Your Trip</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {onCreateTrip && (
                      <Button
                        onClick={() => {
                          if (!isLoggedIn) {
                            setSelectedActivity(null);
                            setShowLoginPrompt(true);
                            return;
                          }
                          onCreateTrip({
                            id: destination.id,
                            name: destination.name,
                            country: destination.country
                          });
                          setSelectedActivity(null);
                        }}
                        className="flex-1"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Trip
                      </Button>
                    )}
                    {onAddToTrip && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={(e: React.MouseEvent) => {
                              if (!isLoggedIn) {
                                e.preventDefault();
                                setSelectedActivity(null);
                                setShowLoginPrompt(true);
                              }
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Existing Trip
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold mb-3">Select a Trip</h4>
                            {draftTrips && draftTrips.length > 0 ? (
                              draftTrips.map((trip) => (
                                <Button
                                  key={trip.id}
                                  variant="ghost"
                                  className="w-full justify-start text-left"
                                  onClick={() => {
                                    onAddToTrip({
                                      id: destination.id,
                                      name: destination.name,
                                      country: destination.country
                                    });
                                    setSelectedActivity(null);
                                  }}
                                >
                                  <div className="flex-1 truncate">
                                    <div className="font-medium truncate">{trip.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {trip.destinations.length} destination{trip.destinations.length !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </Button>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-4">
                                No existing trips. Create a new trip first!
                              </p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View All Activities Dialog */}
      <Dialog open={viewAllActivitiesOpen} onOpenChange={setViewAllActivitiesOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              All Activities in {destination.name}
              {selectedActivityFilter && ` - ${selectedActivityFilter}`}
            </DialogTitle>
            <DialogDescription>
              Activities recommended by travelers
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                onClick={() => {
                  setViewAllActivitiesOpen(false);
                  setSelectedActivity(activity);
                }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{activity.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{activity.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">{activity.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span className="truncate">by {activity.userName}</span>
                    </div>
                    {activity.estimatedCost && (
                      <span className="text-xs font-semibold text-emerald-700">
                        ${activity.estimatedCost}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Accommodation Details Dialog */}
      <Dialog open={!!selectedAccommodation} onOpenChange={() => setSelectedAccommodation(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAccommodation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedAccommodation.name}</DialogTitle>
                <DialogDescription>
                  {selectedAccommodation.type} • Recommended by {selectedAccommodation.userName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <img
                    src={selectedAccommodation.image}
                    alt={selectedAccommodation.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 text-sm px-3 py-1 bg-slate-900 text-white">
                    {selectedAccommodation.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedAccommodation.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedAccommodation.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-gray-600">Price per night</span>
                  <span className="text-2xl font-semibold text-slate-900">${selectedAccommodation.pricePerNight}</span>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed mb-4">{selectedAccommodation.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAccommodation.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">{selectedAccommodation.userName[0]}</span>
                  </div>
                  <span className="text-sm text-gray-600">Recommended by {selectedAccommodation.userName}</span>
                </div>

                {/* Booking Actions */}
                <Separator />
                <div className="flex gap-3">
                  <Button className="flex-1 bg-slate-900 hover:bg-slate-800">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Booking Site
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save to Trip
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Log in or sign up to continue</DialogTitle>
            <DialogDescription>
              You need to be logged in to create trips and save destinations
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button
              onClick={() => {
                setShowLoginPrompt(false);
                if (onLoginRequired) {
                  onLoginRequired();
                }
              }}
              className="w-full"
              size="lg"
            >
              Log In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}