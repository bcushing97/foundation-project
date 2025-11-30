/**
 * Activities/Experiences Database - Single Source of Truth
 * 
 * ALL activities and experiences in the application are defined here.
 * These are experiences users can save to their profile.
 */

export interface Activity {
  id: string; // Unique identifier for the activity (e.g., 'act-witches-rock-surfing')
  name: string; // Name of the activity/experience
  location: string; // Specific location where activity takes place
  destinationId?: string; // Reference to destination in destinations database (e.g., 'dest-tamarindo')
  category: string; // Activity category (e.g., 'Surfing', 'Hiking', 'Cultural')
  image: string; // URL to activity image
  description?: string; // Detailed description of the activity
  duration?: string; // How long the activity takes (e.g., '2 hours', 'Full Day')
  priceLevel?: number; // Price tier from 1-5 ($-$$$$$)
  estimatedCost?: number; // Approximate cost in USD
  rating?: number; // Average rating (typically 1-5 stars)
  reviewCount?: number; // Total number of reviews
  tags?: string[]; // Searchable tags (e.g., 'Water Sports', 'Adventure')
  difficulty?: 'Easy' | 'Moderate' | 'Challenging' | 'Expert'; // Difficulty level
  bestTimeOfDay?: string; // Recommended time (e.g., 'Morning', 'Sunset')
}

export const activitiesDatabase: Record<string, Activity> = {
  'act-witches-rock-surfing': {
    id: 'act-witches-rock-surfing',
    name: 'Surfing at Witch\'s Rock',
    location: 'Tamarindo, Costa Rica',
    destinationId: 'dest-tamarindo',
    category: 'Surfing',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600',
    description: 'Legendary surf break featured in the movie Endless Summer. Powerful waves for experienced surfers.',
    duration: 'Full Day',
    priceLevel: 3,
    estimatedCost: 175,
    rating: 4.8,
    reviewCount: 342,
    tags: ['Surfing', 'Water Sports', 'Adventure', 'Expert'],
    difficulty: 'Expert',
    bestTimeOfDay: 'Morning'
  },

  'act-cenote-diving-tulum': {
    id: 'act-cenote-diving-tulum',
    name: 'Cenote Diving',
    location: 'Gran Cenote, Tulum',
    destinationId: 'dest-tulum',
    category: 'Diving',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600',
    description: 'Explore the mystical underwater caves of Yucatan\'s cenotes. Crystal-clear freshwater diving experience.',
    duration: '3-4 hours',
    priceLevel: 3,
    estimatedCost: 120,
    rating: 4.9,
    reviewCount: 567,
    tags: ['Diving', 'Cenotes', 'Adventure', 'Underwater Caves'],
    difficulty: 'Moderate',
    bestTimeOfDay: 'Morning'
  },

  'act-canopy-zipline-manuel-antonio': {
    id: 'act-canopy-zipline-manuel-antonio',
    name: 'Canopy Zip Line',
    location: 'Manuel Antonio, Costa Rica',
    destinationId: 'dest-manuel-antonio',
    category: 'Zip-lining',
    image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=600',
    description: 'Soar through the rainforest canopy on this thrilling zipline adventure with stunning ocean views.',
    duration: '2-3 hours',
    priceLevel: 2,
    estimatedCost: 85,
    rating: 4.7,
    reviewCount: 823,
    tags: ['Zip-lining', 'Adventure', 'Rainforest', 'Adrenaline'],
    difficulty: 'Easy',
    bestTimeOfDay: 'Morning or Afternoon'
  },

  'act-hot-air-balloon-cappadocia': {
    id: 'act-hot-air-balloon-cappadocia',
    name: 'Hot Air Balloon Ride',
    location: 'Cappadocia, Turkey',
    destinationId: 'dest-cappadocia',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600',
    description: 'Float over the fairy chimneys and valleys of Cappadocia at sunrise. An unforgettable bucket-list experience.',
    duration: '3-4 hours',
    priceLevel: 4,
    estimatedCost: 250,
    rating: 4.9,
    reviewCount: 2134,
    tags: ['Hot Air Balloon', 'Sunrise', 'Bucket List', 'Scenic'],
    difficulty: 'Easy',
    bestTimeOfDay: 'Sunrise'
  },

  'act-snorkeling-manuel-antonio': {
    id: 'act-snorkeling-manuel-antonio',
    name: 'Snorkeling Tour',
    location: 'Manuel Antonio National Park',
    destinationId: 'dest-manuel-antonio',
    category: 'Water Sports',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    description: 'Discover colorful coral reefs and tropical fish in the crystal-clear waters of Manuel Antonio.',
    duration: '3 hours',
    priceLevel: 2,
    estimatedCost: 75,
    rating: 4.8,
    reviewCount: 445,
    tags: ['Snorkeling', 'Water Sports', 'Marine Life'],
    difficulty: 'Easy',
    bestTimeOfDay: 'Morning'
  },

  'act-beach-yoga-tulum': {
    id: 'act-beach-yoga-tulum',
    name: 'Beach Yoga Class',
    location: 'Tulum Beach',
    destinationId: 'dest-tulum',
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    description: 'Start your day with a rejuvenating yoga session on the pristine beaches of Tulum.',
    duration: '90 minutes',
    priceLevel: 1,
    estimatedCost: 35,
    rating: 4.9,
    reviewCount: 312,
    tags: ['Yoga', 'Wellness', 'Beach', 'Meditation'],
    difficulty: 'Easy',
    bestTimeOfDay: 'Sunrise'
  },

  'act-wine-tasting-santorini': {
    id: 'act-wine-tasting-santorini',
    name: 'Sunset Wine Tasting',
    location: 'Santorini, Greece',
    destinationId: 'dest-santorini',
    category: 'Wine & Culinary',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    description: 'Sample exceptional Assyrtiko wines at a traditional winery while watching the famous Santorini sunset.',
    duration: '2-3 hours',
    priceLevel: 3,
    estimatedCost: 95,
    rating: 4.8,
    reviewCount: 678,
    tags: ['Wine', 'Sunset', 'Culinary', 'Culture'],
    difficulty: 'Easy',
    bestTimeOfDay: 'Sunset'
  },

  'act-scuba-diving-bali': {
    id: 'act-scuba-diving-bali',
    name: 'Scuba Diving Adventure',
    location: 'Nusa Penida, Bali',
    destinationId: 'dest-bali',
    category: 'Diving',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
    description: 'Dive with majestic manta rays and explore vibrant coral reefs in Bali\'s pristine waters.',
    duration: 'Full Day',
    priceLevel: 3,
    estimatedCost: 150,
    rating: 4.9,
    reviewCount: 891,
    tags: ['Diving', 'Marine Life', 'Manta Rays', 'Adventure'],
    difficulty: 'Moderate',
    bestTimeOfDay: 'Morning'
  }
};

// Helper functions
export function getActivityById(activityId: string): Activity | undefined {
  return activitiesDatabase[activityId];
}

export function getActivitiesByIds(activityIds: string[]): Activity[] {
  return activityIds
    .map(id => getActivityById(id))
    .filter((activity): activity is Activity => activity !== undefined);
}

export function getActivitiesByDestination(destinationId: string): Activity[] {
  return Object.values(activitiesDatabase).filter(
    activity => activity.destinationId === destinationId
  );
}

export function getActivitiesByCategory(category: string): Activity[] {
  return Object.values(activitiesDatabase).filter(
    activity => activity.category.toLowerCase().includes(category.toLowerCase())
  );
}

export function getActivitiesByTag(tag: string): Activity[] {
  return Object.values(activitiesDatabase).filter(activity =>
    activity.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function getTopRatedActivities(limit: number = 10): Activity[] {
  return Object.values(activitiesDatabase)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

export function getAllActivities(): Activity[] {
  return Object.values(activitiesDatabase);
}
