import { useState } from 'react';
import { MapPin, Sparkles, Luggage, TrendingUp, Users, Star, Heart, User } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface DiscoverPageProps {
  onViewLocation?: (locationId: string) => void;
  onViewExperience?: (experienceId: string) => void;
  onViewTrip?: (tripId: string) => void;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  } | null;
  onMockLogin?: () => void;
  onViewProfile?: () => void;
}

// Mock data for locations
const featuredLocations = [
  {
    id: '1',
    name: 'Manuel Antonio',
    country: 'Costa Rica',
    image: 'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?w=600',
    tags: ['Beach', 'Wildlife', 'Adventure'],
    travelers: 1243,
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Tulum',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600',
    tags: ['Beach', 'History', 'Relaxation'],
    travelers: 2156,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Tamarindo',
    country: 'Costa Rica',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600',
    tags: ['Surfing', 'Beach', 'Nightlife'],
    travelers: 987,
    rating: 4.7,
  },
  {
    id: '7',
    name: 'Playa del Carmen',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?w=600',
    tags: ['Beach', 'Diving', 'Culture'],
    travelers: 1876,
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Monteverde',
    country: 'Costa Rica',
    image: 'https://images.unsplash.com/photo-1542652694-40abf526446e?w=600',
    tags: ['Nature', 'Adventure', 'Eco-tourism'],
    travelers: 654,
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Cozumel',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600',
    tags: ['Diving', 'Beach', 'Marine Life'],
    travelers: 1432,
    rating: 4.8,
  },
];

// Mock data for experiences
const popularExperiences = [
  {
    id: 'exp-1',
    name: 'Cenote Diving Adventure',
    location: 'Tulum, Mexico',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600',
    category: 'Adventure',
    duration: '4 hours',
    participants: 856,
    rating: 4.9,
  },
  {
    id: 'exp-2',
    name: 'Rainforest Canopy Tour',
    location: 'Manuel Antonio, Costa Rica',
    image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=600',
    category: 'Adventure',
    duration: '3 hours',
    participants: 1243,
    rating: 4.8,
  },
  {
    id: 'exp-3',
    name: 'Surfing Lessons',
    location: 'Tamarindo, Costa Rica',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600',
    category: 'Water Sports',
    duration: '2 hours',
    participants: 2341,
    rating: 4.7,
  },
  {
    id: 'exp-4',
    name: 'Mayan Ruins Tour',
    location: 'Tulum, Mexico',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600',
    category: 'Culture',
    duration: '5 hours',
    participants: 1987,
    rating: 4.9,
  },
  {
    id: 'exp-5',
    name: 'Wildlife Safari',
    location: 'Monteverde, Costa Rica',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600',
    category: 'Nature',
    duration: '6 hours',
    participants: 743,
    rating: 4.8,
  },
  {
    id: 'exp-6',
    name: 'Snorkeling Paradise',
    location: 'Cozumel, Mexico',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
    category: 'Water Sports',
    duration: '3 hours',
    participants: 1654,
    rating: 4.7,
  },
];

// Mock data for user trips
const trendingTrips = [
  {
    id: 'trip-1',
    name: 'Costa Rica Adventure',
    creator: 'Sarah M.',
    stops: ['Manuel Antonio', 'Monteverde', 'Tamarindo'],
    duration: '10 days',
    image: 'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?w=600',
    travelers: 234,
    likes: 456,
  },
  {
    id: 'trip-2',
    name: 'Yucatan Explorer',
    creator: 'Michael R.',
    stops: ['Tulum', 'Playa del Carmen', 'Cozumel'],
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600',
    travelers: 189,
    likes: 372,
  },
  {
    id: 'trip-3',
    name: 'Beach Paradise Tour',
    creator: 'Emma L.',
    stops: ['Tulum', 'Manuel Antonio'],
    duration: '8 days',
    image: 'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?w=600',
    travelers: 156,
    likes: 298,
  },
  {
    id: 'trip-4',
    name: 'Surf & Adventure',
    creator: 'James K.',
    stops: ['Tamarindo', 'Playa del Carmen'],
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600',
    travelers: 201,
    likes: 423,
  },
  {
    id: 'trip-5',
    name: 'Nature & Wildlife',
    creator: 'Olivia P.',
    stops: ['Monteverde', 'Manuel Antonio'],
    duration: '5 days',
    image: 'https://images.unsplash.com/photo-1542652694-40abf526446e?w=600',
    travelers: 143,
    likes: 267,
  },
];

export function DiscoverPage({ onViewLocation, onViewExperience, onViewTrip, user, onMockLogin, onViewProfile }: DiscoverPageProps) {
  const [selectedTab, setSelectedTab] = useState<'locations' | 'experiences' | 'trips'>('locations');

  const getInitials = (user: { firstName: string; lastName: string }) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Top Header Bar - Hidden on mobile */}
      <div className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl tracking-tight">travl</h1>
          </div>

          {/* Right side - Profile or Test Login */}
          <div className="flex items-center gap-3">
            {!user && onMockLogin && (
              <Button 
                onClick={onMockLogin}
                variant="outline"
                size="sm"
              >
                Test Sign In
              </Button>
            )}
            
            {user && onViewProfile && (
              <button
                onClick={onViewProfile}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700">
                    {getInitials(user)}
                  </span>
                )}
              </button>
            )}
            
            {!user && (
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                onClick={onMockLogin}
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl mb-2">Discover</h2>
          <p className="text-gray-600">Explore popular destinations, experiences, and trips</p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v: string) => setSelectedTab(v as 'locations' | 'experiences' | 'trips')}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="locations" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Locations</span>
              <span className="sm:hidden">Places</span>
            </TabsTrigger>
            <TabsTrigger value="experiences" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Experiences</span>
              <span className="sm:hidden">Things</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="gap-2">
              <Luggage className="w-4 h-4" />
              Trips
            </TabsTrigger>
          </TabsList>

          {/* Locations Tab */}
          <TabsContent value="locations" className="mt-0">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Trending destinations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredLocations.map((location) => (
                <Card 
                  key={location.id}
                  className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onViewLocation?.(location.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-lg mb-1">{location.name}</h3>
                      <p className="text-white/90 text-sm">{location.country}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{location.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {location.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{location.travelers.toLocaleString()} travelers</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Experiences Tab */}
          <TabsContent value="experiences" className="mt-0">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Popular activities</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularExperiences.map((experience) => (
                <Card 
                  key={experience.id}
                  className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onViewExperience?.(experience.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                        {experience.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{experience.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{experience.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{experience.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{experience.duration}</span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{experience.participants.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="mt-0">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Trips created by travelers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingTrips.map((trip) => (
                <Card 
                  key={trip.id}
                  className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onViewTrip?.(trip.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold mb-1">{trip.name}</h3>
                      <p className="text-white/90 text-sm">by {trip.creator}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Luggage className="w-4 h-4" />
                      <span>{trip.duration} • {trip.stops.length} stops</span>
                    </div>
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Stops:</div>
                      <div className="flex flex-wrap gap-1">
                        {trip.stops.map((stop, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {stop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{trip.travelers}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span>{trip.likes}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}