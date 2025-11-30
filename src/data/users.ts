/**
 * Users Database - Single Source of Truth
 * 
 * ALL users in the application are defined here.
 * Other tables reference users by their ID.
 */

export interface User {
  id: string; // Unique identifier for the user (e.g., 'user-john-doe')
  firstName: string; // User's first name
  lastName: string; // User's last name
  email: string; // User's email address
  profilePicture?: string; // URL to user's profile picture
  bio?: string; // User's biography or description
  location?: string; // User's home location (city, state/country)
  memberSince: Date; // Date when user joined the platform
  stats: {
    tripsCreated: number; // Number of trips this user has created
    tripsSaved: number; // Number of trips this user has saved
    followers: number; // Number of users following this user
    following: number; // Number of users this user follows
    countriesVisited: number; // Number of countries this user has visited
  };
  interests?: string[]; // User's travel interests (e.g., 'Photography', 'Adventure')
  travelStyle?: string[]; // User's preferred travel styles (e.g., 'Backpacker', 'Luxury')
  passport?: {
    number?: string; // Passport number
    expiryDate?: Date; // Passport expiration date
    country: string; // Passport issuing country
  };
  following?: string[]; // Array of user IDs this user follows
  followers?: string[]; // Array of user IDs who follow this user
  savedTripIds?: string[]; // Array of trip IDs this user has saved (references savedTrips)
  savedActivityIds?: string[]; // Array of activity IDs this user has saved (references activities)
  savedDestinationIds?: string[]; // Array of destination IDs this user has saved (references destinations)
  savedAccommodationIds?: string[]; // Array of accommodation IDs this user has saved (references accommodations)
}

export const usersDatabase: Record<string, User> = {
  'user-john-doe': {
    id: 'user-john-doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Explorer at heart. Love discovering new places and trying adventure activities!',
    location: 'New York, NY',
    memberSince: new Date('2023-06-01'),
    stats: {
      tripsCreated: 2,
      tripsSaved: 0,
      followers: 45,
      following: 23,
      countriesVisited: 8
    },
    interests: ['Adventure', 'Beach', 'Surfing', 'Diving'],
    travelStyle: ['Adventure', 'Beach & Coast', 'Active'],
    passport: {
      country: 'United States'
    },
    following: ['user-sarah', 'user-bryce'],
    followers: ['user-current'],
    savedTripIds: [],
    savedActivityIds: [],
    savedDestinationIds: []
  },

  'user-current': {
    id: 'user-current',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Adventure seeker and travel photographer. Love discovering hidden gems and sharing travel tips!',
    location: 'San Francisco, CA',
    memberSince: new Date('2022-03-15'),
    stats: {
      tripsCreated: 3,
      tripsSaved: 12,
      followers: 234,
      following: 189,
      countriesVisited: 23
    },
    interests: ['Photography', 'Hiking', 'Food', 'Culture'],
    travelStyle: ['Adventure', 'Budget-conscious', 'Off the beaten path'],
    passport: {
      number: 'US123456789',
      expiryDate: new Date('2028-06-15'),
      country: 'United States'
    },
    following: ['user-sarah', 'user-bryce', 'user-emma', 'user-james'],
    savedTripIds: ['trip-1', 'trip-2', 'trip-4'],
    savedActivityIds: ['serengeti-game-drive', 'everest-base-camp-trek']
  },

  'user-sarah': {
    id: 'user-sarah',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Mountain enthusiast and adventure photographer based in Switzerland. Living my best alpine life! 🏔️',
    location: 'Zürich, Switzerland',
    memberSince: new Date('2021-01-20'),
    stats: {
      tripsCreated: 8,
      tripsSaved: 45,
      followers: 1892,
      following: 456,
      countriesVisited: 47
    },
    interests: ['Mountains', 'Photography', 'Skiing', 'Hiking', 'Adventure'],
    travelStyle: ['Adventure', 'Luxury', 'Active'],
    passport: {
      country: 'Switzerland'
    },
    following: ['user-current', 'user-bryce', 'user-maya'],
    followers: ['user-current', 'user-emma', 'user-james', 'user-mike'],
    savedTripIds: ['trip-2', 'trip-5', 'trip-7'],
    savedActivityIds: ['everest-base-camp-trek', 'fitz-roy-trek']
  },

  'user-bryce': {
    id: 'user-bryce',
    firstName: 'Bryce',
    lastName: 'Mitchell',
    email: 'bryce.mitchell@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bio: 'Travel photographer and Italian cuisine enthusiast. I\'ve visited Italy 7 times and love sharing hidden gems!',
    location: 'Los Angeles, CA',
    memberSince: new Date('2020-07-10'),
    stats: {
      tripsCreated: 12,
      tripsSaved: 67,
      followers: 3241,
      following: 892,
      countriesVisited: 34
    },
    interests: ['Food & Wine', 'Photography', 'History', 'Culture', 'Beach'],
    travelStyle: ['Cultural immersion', 'Foodie', 'Luxury'],
    passport: {
      country: 'United States'
    },
    following: ['user-sarah', 'user-emma', 'user-maya'],
    followers: ['user-current', 'user-sarah', 'user-james'],
    savedTripIds: ['trip-4', 'trip-8'],
    savedActivityIds: ['kyoto-food-tour', 'santorini-sunset-cruise']
  },

  'user-emma': {
    id: 'user-emma',
    firstName: 'Emma',
    lastName: 'Chen',
    email: 'emma.chen@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Wellness travel advocate and yoga instructor. Finding peace and balance around the world 🧘‍♀️',
    location: 'Vancouver, Canada',
    memberSince: new Date('2021-09-05'),
    stats: {
      tripsCreated: 6,
      tripsSaved: 34,
      followers: 1456,
      following: 324,
      countriesVisited: 28
    },
    interests: ['Wellness', 'Yoga', 'Meditation', 'Nature', 'Healthy Living'],
    travelStyle: ['Wellness', 'Relaxation', 'Spiritual'],
    passport: {
      country: 'Canada'
    },
    following: ['user-maya', 'user-sarah', 'user-current'],
    followers: ['user-current', 'user-bryce', 'user-james'],
    savedTripIds: ['trip-6', 'trip-5'],
    savedActivityIds: ['bali-yoga-retreat', 'balinese-massage']
  },

  'user-james': {
    id: 'user-james',
    firstName: 'James',
    lastName: 'Rodriguez',
    email: 'james.rodriguez@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Adrenaline junkie and extreme sports enthusiast. If it\'s fast and dangerous, I\'m in!',
    location: 'Miami, FL',
    memberSince: new Date('2021-11-12'),
    stats: {
      tripsCreated: 5,
      tripsSaved: 28,
      followers: 892,
      following: 456,
      countriesVisited: 19
    },
    interests: ['Extreme Sports', 'Racing', 'Water Sports', 'Adventure'],
    travelStyle: ['Adventure', 'Luxury', 'Active'],
    passport: {
      country: 'United States'
    },
    following: ['user-mike', 'user-sarah', 'user-current'],
    followers: ['user-current', 'user-emma'],
    savedTripIds: ['trip-3', 'trip-7'],
    savedActivityIds: ['monaco-grand-prix', 'glacier-hiking']
  },

  'user-maya': {
    id: 'user-maya',
    firstName: 'Maya',
    lastName: 'Patel',
    email: 'maya.patel@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    bio: 'Cultural explorer and history buff. Love ancient civilizations and UNESCO World Heritage Sites.',
    location: 'London, UK',
    memberSince: new Date('2020-04-22'),
    stats: {
      tripsCreated: 10,
      tripsSaved: 89,
      followers: 2134,
      following: 567,
      countriesVisited: 52
    },
    interests: ['History', 'Culture', 'Museums', 'Architecture', 'Art'],
    travelStyle: ['Cultural immersion', 'Historical', 'Educational'],
    passport: {
      country: 'United Kingdom'
    },
    following: ['user-bryce', 'user-sarah', 'user-emma'],
    followers: ['user-emma', 'user-james'],
    savedTripIds: ['trip-4', 'trip-8'],
    savedActivityIds: ['senso-ji-temple-tour', 'nara-deer-park']
  },

  'user-mike': {
    id: 'user-mike',
    firstName: 'Mike',
    lastName: 'O\'Brien',
    email: 'mike.obrien@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
    bio: 'Wildlife photographer and safari guide. 15 years exploring Africa\'s greatest national parks.',
    location: 'Nairobi, Kenya',
    memberSince: new Date('2019-08-30'),
    stats: {
      tripsCreated: 15,
      tripsSaved: 42,
      followers: 4567,
      following: 234,
      countriesVisited: 38
    },
    interests: ['Wildlife', 'Photography', 'Nature', 'Safari', 'Conservation'],
    travelStyle: ['Adventure', 'Wildlife', 'Photography'],
    passport: {
      country: 'Kenya'
    },
    following: ['user-sarah', 'user-maya'],
    followers: ['user-james', 'user-current', 'user-sarah'],
    savedTripIds: ['trip-1', 'trip-2'],
    savedActivityIds: ['serengeti-game-drive', 'hot-air-balloon-safari']
  },

  'user-lisa': {
    id: 'user-lisa',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    bio: 'Island hopper and beach lover. Exploring the world one coastline at a time 🏖️',
    location: 'Sydney, Australia',
    memberSince: new Date('2021-02-14'),
    stats: {
      tripsCreated: 7,
      tripsSaved: 51,
      followers: 1678,
      following: 423,
      countriesVisited: 31
    },
    interests: ['Beach', 'Water Sports', 'Snorkeling', 'Island Life', 'Sunsets'],
    travelStyle: ['Beach & Coast', 'Relaxation', 'Active'],
    passport: {
      country: 'Australia'
    },
    following: ['user-emma', 'user-sarah'],
    followers: ['user-current'],
    savedTripIds: ['trip-8', 'trip-6'],
    savedActivityIds: ['santorini-sunset-cruise', 'mykonos-beach-club']
  }
};

// Helper functions
export function getUserById(userId: string): User | undefined {
  return usersDatabase[userId];
}

export function getUsersByIds(userIds: string[]): User[] {
  return userIds
    .map(id => getUserById(id))
    .filter((user): user is User => user !== undefined);
}

export function getUserByEmail(email: string): User | undefined {
  return Object.values(usersDatabase).find(user => user.email === email);
}

export function getUsersByLocation(location: string): User[] {
  return Object.values(usersDatabase).filter(user => 
    user.location?.toLowerCase().includes(location.toLowerCase())
  );
}

export function getUsersByInterest(interest: string): User[] {
  return Object.values(usersDatabase).filter(user =>
    user.interests?.some(i => i.toLowerCase().includes(interest.toLowerCase()))
  );
}

export function getTopTravelersBy(metric: 'tripsCreated' | 'followers' | 'countriesVisited', limit: number = 10): User[] {
  return Object.values(usersDatabase)
    .sort((a, b) => b.stats[metric] - a.stats[metric])
    .slice(0, limit);
}

export function getAllUsers(): User[] {
  return Object.values(usersDatabase);
}

// Get current logged-in user (for demo purposes)
export function getCurrentUser(): User {
  return usersDatabase['user-current'];
}