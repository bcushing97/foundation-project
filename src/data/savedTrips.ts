// Mock data for user-created trips that are searchable

export interface TripAccommodation {
  accommodationId?: string; // Optional reference to accommodation in accommodations database (e.g., 'acc-tamarindo-diria')
  name: string; // Name of the accommodation for display (required even if accommodationId is provided)
  type: string; // Type of accommodation (e.g., 'Hotel', 'Airbnb', 'Tented Camp')
  location: string; // Where the accommodation is located
  nights?: number; // Number of nights stayed at this accommodation
}

export interface TripDestination {
  id?: string; // Unique identifier for this destination in the trip
  destinationId?: string; // Optional reference to destination in destinations database (e.g., 'dest-santorini')
  name: string; // Destination name for display (required even if destinationId is provided)
  days: number; // Number of days spent at this destination during the trip
  accommodations?: TripAccommodation[]; // Where you stayed during this portion of the trip
  activityIds?: string[]; // Activities done at this destination (references activities database)
}

export interface SavedTrip {
  id: string; // Unique identifier for the trip (e.g., 'trip-1')
  title: string; // Trip title/name
  creatorId: string; // ID of user who created this trip (references users database)
  destinations: TripDestination[]; // List of destinations visited during this trip
  duration: number; // Total trip duration in days
  budget: number; // Total trip budget in USD
  priceLevel: number; // Price tier from 1-4 ($-$$$$)
  mainImage: string; // URL to main trip image/hero photo
  images: string[]; // Array of image URLs from the trip
  description: string; // Trip description written by creator
  highlights: string[]; // Key highlights or memorable moments from the trip
  tags: string[]; // Searchable tags (e.g., 'Wildlife', 'Adventure', 'Photography')
  matchPercentage?: number; // Calculated match score based on user's search criteria (0-100)
  visitedByFriends?: string[]; // Array of user IDs of friends who have done this trip
  saves: number; // Number of times this trip has been saved by users
  createdAt: Date; // Date when this trip was created/posted
}

export const savedTrips: SavedTrip[] = [
  {
    id: 'trip-1',
    title: 'Safari Adventure in Tanzania',
    creatorId: 'user-mike',
    destinations: [
      {
        name: 'Serengeti National Park',
        days: 4,
        accommodations: [
          {
            name: 'Serengeti Safari Lodge',
            type: 'Tented Camp',
            location: 'Serengeti National Park',
            nights: 4
          }
        ],
        activityIds: [
          'serengeti-game-drive',
          'hot-air-balloon-safari',
          'maasai-village-visit'
        ]
      },
      {
        name: 'Ngorongoro Crater',
        days: 2,
        accommodations: [
          {
            name: 'Ngorongoro Crater Lodge',
            type: 'Lodge',
            location: 'Ngorongoro Conservation Area',
            nights: 2
          }
        ],
        activityIds: [
          'ngorongoro-crater-tour'
        ]
      },
      {
        name: 'Arusha',
        days: 1,
        accommodations: [
          {
            name: 'Arusha Coffee Lodge',
            type: 'Lodge',
            location: 'Arusha',
            nights: 1
          }
        ],
        activityIds: []
      }
    ],
    duration: 7,
    budget: 3500,
    priceLevel: 3,
    mainImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop'
    ],
    description: 'An unforgettable week exploring the best of Tanzania\'s wildlife. We saw the Big Five, experienced the Great Migration, and camped under the stars.',
    highlights: [
      'Witnessed the Great Migration',
      'Saw all Big Five animals',
      'Camping in Serengeti',
      'Visit to Maasai village',
      'Sunrise hot air balloon ride'
    ],
    tags: ['Wildlife', 'Adventure', 'Photography', 'Camping', 'Nature'],
    visitedByFriends: ['user-2', 'user-3'],
    saves: 234,
    createdAt: new Date('2024-03-15')
  },
  {
    id: 'trip-2',
    title: 'Mount Everest Base Camp Trek',
    creatorId: 'user-sarah',
    destinations: [
      {
        name: 'Kathmandu',
        days: 2,
        accommodations: [
          {
            name: 'Hotel Tibet',
            type: 'Hotel',
            location: 'Thamel, Kathmandu',
            nights: 2
          }
        ],
        activityIds: [
          'kathmandu-temple-tour'
        ]
      },
      {
        name: 'Lukla',
        days: 1,
        accommodations: [
          {
            name: 'Paradise Lodge',
            type: 'Teahouse',
            location: 'Lukla',
            nights: 1
          }
        ],
        activityIds: [
          'mountain-flight'
        ]
      },
      {
        name: 'Namche Bazaar',
        days: 2,
        accommodations: [
          {
            name: 'Namche Hotel',
            type: 'Teahouse',
            location: 'Namche Bazaar',
            nights: 2
          }
        ],
        activityIds: []
      },
      {
        name: 'Everest Base Camp',
        days: 9,
        accommodations: [
          {
            name: 'Various Teahouses',
            type: 'Teahouse',
            location: 'EBC Trek Route',
            nights: 9
          }
        ],
        activityIds: [
          'ebc-trek'
        ]
      }
    ],
    duration: 14,
    budget: 2800,
    priceLevel: 2,
    mainImage: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589802829840-c7be96e5f005?w=800&h=600&fit=crop'
    ],
    description: 'Two weeks of incredible trekking through the Himalayas. Challenging but absolutely worth it for the views and experience.',
    highlights: [
      'Reached Everest Base Camp at 5,364m',
      'Spectacular mountain views',
      'Met amazing fellow trekkers',
      'Experienced Sherpa culture',
      'Sunrise at Kala Patthar'
    ],
    tags: ['Trekking', 'Mountains', 'Adventure', 'Challenge', 'Backpacking'],
    visitedByFriends: ['user-5', 'user-6'],
    saves: 189,
    createdAt: new Date('2024-04-20')
  },
  {
    id: 'trip-3',
    title: 'Monaco Grand Prix Weekend',
    creatorId: 'user-james',
    destinations: [
      {
        name: 'Monaco',
        days: 3,
        accommodations: [
          {
            name: 'Hôtel de Paris Monte-Carlo',
            type: 'Luxury Hotel',
            location: 'Monte Carlo',
            nights: 3
          }
        ],
        activityIds: [
          'monaco-grand-prix',
          'yacht-cruise-monaco',
          'casino-monte-carlo'
        ]
      },
      {
        name: 'Nice',
        days: 1,
        accommodations: [
          {
            name: 'Hotel Negresco',
            type: 'Hotel',
            location: 'Promenade des Anglais, Nice',
            nights: 1
          }
        ],
        activityIds: []
      }
    ],
    duration: 4,
    budget: 8500,
    priceLevel: 4,
    mainImage: 'https://images.unsplash.com/photo-1532478258501-a7c5d8e7f0dc?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1532478258501-a7c5d8e7f0dc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583900985737-6d0495555783?w=800&h=600&fit=crop'
    ],
    description: 'The ultimate F1 experience! Watched the Monaco Grand Prix from a private yacht, stayed in luxury hotels, and experienced the glitz and glamour of Monaco.',
    highlights: [
      'Paddock Club access',
      'Watched race from yacht',
      'Casino de Monte-Carlo visit',
      'Helicopter tour',
      'Michelin star dining'
    ],
    tags: ['F1', 'Luxury', 'Racing', 'Sports', 'Nightlife'],
    visitedByFriends: ['user-1'],
    saves: 456,
    createdAt: new Date('2024-05-25')
  },
  {
    id: 'trip-4',
    title: 'Japan Cherry Blossom Experience',
    creatorId: 'user-bryce',
    destinations: [
      {
        name: 'Tokyo',
        days: 3,
        accommodations: [
          {
            name: 'Park Hyatt Tokyo',
            type: 'Hotel',
            location: 'Shinjuku, Tokyo',
            nights: 3
          }
        ],
        activityIds: [
          'tokyo-food-tour'
        ]
      },
      {
        name: 'Kyoto',
        days: 4,
        accommodations: [
          {
            name: 'Traditional Ryokan',
            type: 'Ryokan',
            location: 'Higashiyama, Kyoto',
            nights: 4
          }
        ],
        activityIds: [
          'tea-ceremony-kyoto',
          'arashiyama-bamboo-forest'
        ]
      },
      {
        name: 'Osaka',
        days: 2,
        accommodations: [
          {
            name: 'Cross Hotel Osaka',
            type: 'Hotel',
            location: 'Dotonbori, Osaka',
            nights: 2
          }
        ],
        activityIds: []
      },
      {
        name: 'Nara',
        days: 1,
        accommodations: [],
        activityIds: [
          'nara-deer-park'
        ]
      }
    ],
    duration: 10,
    budget: 4200,
    priceLevel: 3,
    mainImage: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop'
    ],
    description: 'Perfect timing for cherry blossom season! Explored ancient temples, modern cities, tried incredible food, and made unforgettable memories.',
    highlights: [
      'Hanami parties in Ueno Park',
      'Bamboo forest in Arashiyama',
      'Traditional tea ceremony',
      'Deer feeding in Nara',
      'Street food in Dotonbori'
    ],
    tags: ['Culture', 'Food', 'Cherry Blossoms', 'Temples', 'Photography'],
    visitedByFriends: ['user-9', 'user-2', 'user-4'],
    saves: 892,
    createdAt: new Date('2024-04-05')
  },
  {
    id: 'trip-5',
    title: 'Iceland Ring Road Adventure',
    creatorId: 'user-sarah',
    destinations: [
      {
        name: 'Reykjavik',
        days: 2,
        accommodations: [
          {
            name: 'Hotel Borg',
            type: 'Hotel',
            location: 'Reykjavik',
            nights: 2
          }
        ],
        activityIds: [
          'northern-lights-tour'
        ]
      },
      {
        name: 'Golden Circle',
        days: 1,
        accommodations: [],
        activityIds: [
          'golden-circle-tour'
        ]
      },
      {
        name: 'South Coast',
        days: 2,
        accommodations: [
          {
            name: 'Vik Guesthouse',
            type: 'Guesthouse',
            location: 'Vik',
            nights: 2
          }
        ],
        activityIds: [
          'glacier-hike-iceland'
        ]
      },
      {
        name: 'East Iceland',
        days: 2,
        accommodations: [
          {
            name: 'Fosshotel Glacier Lagoon',
            type: 'Hotel',
            location: 'Near Jökulsárlón',
            nights: 2
          }
        ],
        activityIds: []
      },
      {
        name: 'North Iceland',
        days: 1,
        accommodations: [
          {
            name: 'Akureyri Hotel',
            type: 'Hotel',
            location: 'Akureyri',
            nights: 1
          }
        ],
        activityIds: [
          'blue-lagoon-spa'
        ]
      }
    ],
    duration: 8,
    budget: 3200,
    priceLevel: 3,
    mainImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop'
    ],
    description: 'Epic road trip around Iceland\'s Ring Road. Waterfalls, glaciers, hot springs, and the Northern Lights - Iceland has it all!',
    highlights: [
      'Northern Lights viewing',
      'Blue Lagoon relaxation',
      'Glacier hiking',
      'Black sand beaches',
      'Countless waterfalls'
    ],
    tags: ['Road Trip', 'Nature', 'Photography', 'Adventure', 'Northern Lights'],
    visitedByFriends: ['user-3', 'user-6'],
    saves: 567,
    createdAt: new Date('2024-02-10')
  },
  {
    id: 'trip-6',
    title: 'Bali Wellness Retreat',
    creatorId: 'user-emma',
    destinations: [
      {
        name: 'Ubud',
        days: 6,
        accommodations: [
          {
            name: 'COMO Uma Ubud',
            type: 'Resort',
            location: 'Ubud',
            nights: 6
          }
        ],
        activityIds: [
          'ubud-yoga-class',
          'balinese-massage',
          'rice-terrace-tour'
        ]
      },
      {
        name: 'Canggu',
        days: 3,
        accommodations: [
          {
            name: 'The Slow',
            type: 'Hotel',
            location: 'Canggu',
            nights: 3
          }
        ],
        activityIds: [
          'surf-lesson-canggu'
        ]
      },
      {
        name: 'Seminyak',
        days: 3,
        accommodations: [
          {
            name: 'The Legian Bali',
            type: 'Resort',
            location: 'Seminyak',
            nights: 3
          }
        ],
        activityIds: []
      }
    ],
    duration: 12,
    budget: 2400,
    priceLevel: 2,
    mainImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop'
    ],
    description: 'Two weeks of pure bliss in Bali. Daily yoga, meditation, amazing healthy food, and plenty of time to relax and recharge.',
    highlights: [
      'Daily yoga sessions',
      'Traditional Balinese massage',
      'Visited rice terraces',
      'Healthy organic meals',
      'Waterfall meditation'
    ],
    tags: ['Wellness', 'Yoga', 'Relaxation', 'Healthy Living', 'Beach'],
    visitedByFriends: ['user-1', 'user-9'],
    saves: 423,
    createdAt: new Date('2024-06-12')
  },
  {
    id: 'trip-7',
    title: 'Patagonia Hiking Expedition',
    creatorId: 'user-sarah',
    destinations: [
      {
        name: 'El Calafate',
        days: 3,
        accommodations: [
          {
            name: 'Eolo Patagonia',
            type: 'Lodge',
            location: 'El Calafate',
            nights: 3
          }
        ],
        activityIds: [
          'perito-moreno-glacier',
          'ice-trekking-patagonia'
        ]
      },
      {
        name: 'El Chaltén',
        days: 4,
        accommodations: [
          {
            name: 'Hostería El Puma',
            type: 'Inn',
            location: 'El Chaltén',
            nights: 4
          }
        ],
        activityIds: [
          'fitz-roy-trek'
        ]
      },
      {
        name: 'Torres del Paine',
        days: 3,
        accommodations: [
          {
            name: 'Camping Torres',
            type: 'Campsite',
            location: 'Torres del Paine National Park',
            nights: 3
          }
        ],
        activityIds: []
      }
    ],
    duration: 10,
    budget: 3800,
    priceLevel: 3,
    mainImage: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542627088-4f3a5b10ee92?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop'
    ],
    description: 'Incredible hiking through some of the world\'s most stunning landscapes. Patagonia exceeded all expectations!',
    highlights: [
      'Fitz Roy trek',
      'Torres del Paine W Circuit',
      'Perito Moreno Glacier',
      'Wild camping',
      'Condor spotting'
    ],
    tags: ['Hiking', 'Mountains', 'Adventure', 'Camping', 'Wildlife'],
    visitedByFriends: ['user-5'],
    saves: 345,
    createdAt: new Date('2024-01-18')
  },
  {
    id: 'trip-8',
    title: 'Greek Islands Summer Escape',
    creatorId: 'user-lisa',
    destinations: [
      {
        destinationId: 'dest-santorini',
        name: 'Santorini',
        days: 4,
        accommodations: [
          {
            name: 'Canaves Oia Suites',
            type: 'Hotel',
            location: 'Oia, Santorini',
            nights: 4
          }
        ],
        activityIds: [
          'santorini-sunset-cruise'
        ]
      },
      {
        name: 'Mykonos',
        days: 4,
        accommodations: [
          {
            name: 'Cavo Tagoo',
            type: 'Hotel',
            location: 'Mykonos Town',
            nights: 4
          }
        ],
        activityIds: [
          'mykonos-beach-club'
        ]
      },
      {
        name: 'Athens',
        days: 3,
        accommodations: [
          {
            name: 'Hotel Grande Bretagne',
            type: 'Hotel',
            location: 'Syntagma Square, Athens',
            nights: 3
          }
        ],
        activityIds: [
          'acropolis-guided-tour',
          'greek-cooking-class'
        ]
      },
      {
        name: 'Crete',
        days: 3,
        accommodations: [
          {
            name: 'Blue Palace Resort',
            type: 'Resort',
            location: 'Elounda, Crete',
            nights: 3
          }
        ],
        activityIds: []
      }
    ],
    duration: 14,
    budget: 5200,
    priceLevel: 3,
    mainImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop'
    ],
    description: 'Two perfect weeks island hopping in Greece. Beautiful beaches, delicious food, stunning sunsets, and wonderful people.',
    highlights: [
      'Sunset in Oia',
      'Beach clubs in Mykonos',
      'Ancient Acropolis visit',
      'Fresh seafood daily',
      'Boat day trips'
    ],
    tags: ['Beach', 'Islands', 'Food & Wine', 'Culture', 'Relaxation'],
    visitedByFriends: ['user-2', 'user-1', 'user-3'],
    saves: 678,
    createdAt: new Date('2024-07-08')
  }
];