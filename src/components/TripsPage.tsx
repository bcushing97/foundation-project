import { useState } from 'react';
import { MapPin, Calendar, Heart, Bookmark, Users, TrendingUp, ChevronRight, User, UserCircle, Settings, HelpCircle, LogOut, Bell, Map } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Separator } from './ui/separator';

interface Trip {
  id: string;
  title: string;
  creator: {
    name: string;
    profilePicture?: string;
    isFollowing: boolean;
  };
  destinations: string[];
  duration: number; // in days
  description: string;
  coverImage: string;
  tags: string[];
  likes: number;
  saves: number;
  highlight?: string; // Special highlight for popular trips
}

interface TripsPageProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  following?: string[];
  onViewTripDetails?: (tripId: string) => void;
  onMockLogin?: () => void;
  onViewProfile?: () => void;
  onGoHome?: () => void;
  onGoToMyTrips?: () => void;
  onGoToNotifications?: () => void;
  onGoToSettings?: () => void;
  onGoToHelp?: () => void;
  onSignOut?: () => void;
  onOpenLogin?: () => void;
  onOpenSignUp?: () => void;
  notificationCount?: number;
}

export function TripsPage({ 
  user, 
  following = [], 
  onViewTripDetails, 
  onMockLogin, 
  onViewProfile,
  onGoHome,
  onGoToMyTrips,
  onGoToNotifications,
  onGoToSettings,
  onGoToHelp,
  onSignOut,
  onOpenLogin,
  onOpenSignUp,
  notificationCount = 0
}: TripsPageProps) {
  const [selectedTab, setSelectedTab] = useState<'following' | 'popular'>('following');
  const [savedTrips, setSavedTrips] = useState<string[]>([]);

  const getInitials = (user: { firstName: string; lastName: string }) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Mock trips from people you follow
  const followingTrips: Trip[] = [
    {
      id: '1',
      title: '10 Days Through Italian Coastline',
      creator: {
        name: 'Bryce',
        isFollowing: true
      },
      destinations: ['Rome', 'Amalfi Coast', 'Cinque Terre', 'Venice'],
      duration: 10,
      description: 'A perfect blend of history, stunning coastal views, and authentic Italian cuisine. This itinerary takes you through the most picturesque towns along the Italian coast.',
      coverImage: 'https://images.unsplash.com/photo-1534113414509-0bd4d66f96c0?w=800&h=600&fit=crop',
      tags: ['Beach & Coast', 'Food & Wine', 'History & Museums'],
      likes: 342,
      saves: 156
    },
    {
      id: '2',
      title: 'Swiss Alps Adventure Week',
      creator: {
        name: 'Sarah',
        isFollowing: true
      },
      destinations: ['Zermatt', 'Interlaken', 'Lucerne', 'Grindelwald'],
      duration: 7,
      description: 'Experience the majestic Swiss Alps with hiking, paragliding, and exploring charming mountain villages. Perfect for adventure seekers!',
      coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
      tags: ['Mountains & Hiking', 'Adventure & Sports', 'Nature'],
      likes: 289,
      saves: 134
    },
    {
      id: '3',
      title: 'Ultimate Japan Cultural Experience',
      creator: {
        name: 'Cayman',
        isFollowing: true
      },
      destinations: ['Tokyo', 'Kyoto', 'Osaka', 'Nara', 'Hakone'],
      duration: 14,
      description: 'Immerse yourself in Japanese culture from ancient temples to modern Tokyo. Includes traditional tea ceremonies, sumo wrestling, and cherry blossom viewing.',
      coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      tags: ['City & Culture', 'History & Museums', 'Food & Wine'],
      likes: 521,
      saves: 298
    },
    {
      id: '4',
      title: 'New Zealand South Island Road Trip',
      creator: {
        name: 'Emma',
        isFollowing: true
      },
      destinations: ['Queenstown', 'Milford Sound', 'Wanaka', 'Mount Cook', 'Christchurch'],
      duration: 12,
      description: 'Drive through breathtaking landscapes featuring mountains, fjords, and crystal-clear lakes. Adventure activities at every stop!',
      coverImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&h=600&fit=crop',
      tags: ['Mountains & Hiking', 'Adventure & Sports', 'Wildlife & Nature'],
      likes: 445,
      saves: 267
    },
    {
      id: '5',
      title: 'Parisian Romance & Provence',
      creator: {
        name: 'Michael',
        isFollowing: true
      },
      destinations: ['Paris', 'Avignon', 'Gordes', 'Roussillon', 'Nice'],
      duration: 9,
      description: 'From the Eiffel Tower to lavender fields, experience the romance of France. Includes wine tasting and visits to medieval villages.',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
      tags: ['City & Culture', 'Food & Wine', 'Relaxation & Spa'],
      likes: 398,
      saves: 201
    }
  ];

  // Mock popular creator trips
  const popularTrips: Trip[] = [
    {
      id: '101',
      title: 'The Grand European Tour',
      creator: {
        name: 'Alex Wanderlust',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['London', 'Paris', 'Amsterdam', 'Berlin', 'Prague', 'Vienna', 'Rome'],
      duration: 21,
      description: 'The ultimate European adventure visiting 7 countries and experiencing the best of Western and Central Europe. A journey of a lifetime!',
      coverImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
      tags: ['City & Culture', 'History & Museums', 'Food & Wine'],
      likes: 1823,
      saves: 942,
      highlight: '🏆 Most Popular Trip of 2024'
    },
    {
      id: '102',
      title: 'Southeast Asia Backpacking Route',
      creator: {
        name: 'Jenny Explorer',
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['Bangkok', 'Chiang Mai', 'Hanoi', 'Siem Reap', 'Ho Chi Minh', 'Bali'],
      duration: 28,
      description: 'Budget-friendly backpacking adventure through the most incredible destinations in Southeast Asia. Perfect for first-time backpackers!',
      coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
      tags: ['City & Culture', 'Budget Friendly', 'Adventure & Sports'],
      likes: 1456,
      saves: 876,
      highlight: '💰 Best Budget Trip'
    },
    {
      id: '103',
      title: 'African Safari & Beach Paradise',
      creator: {
        name: 'David Adventures',
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['Serengeti', 'Ngorongoro', 'Zanzibar', 'Cape Town', 'Victoria Falls'],
      duration: 16,
      description: 'Experience the big five on safari and then relax on pristine beaches. The perfect combination of adventure and relaxation.',
      coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
      tags: ['Wildlife & Nature', 'Beach & Coast', 'Adventure & Sports'],
      likes: 2104,
      saves: 1234,
      highlight: '🦁 Best Wildlife Experience'
    },
    {
      id: '104',
      title: 'Iceland Ring Road in Winter',
      creator: {
        name: 'Nordic Nomads',
        profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['Reykjavik', 'Golden Circle', 'Vik', 'Jökulsárlón', 'Akureyri'],
      duration: 8,
      description: 'Chase the Northern Lights while exploring ice caves, black sand beaches, and powerful waterfalls. A magical winter wonderland.',
      coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop',
      tags: ['Wildlife & Nature', 'Adventure & Sports', 'Mountains & Hiking'],
      likes: 1687,
      saves: 891
    },
    {
      id: '105',
      title: 'Luxury Maldives & Dubai Escape',
      creator: {
        name: 'Luxury Travels Co',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['Dubai', 'Abu Dhabi', 'Maldives Resorts'],
      duration: 10,
      description: 'Indulge in ultra-luxury with overwater villas, private islands, world-class dining, and exclusive experiences in two of the most luxurious destinations.',
      coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
      tags: ['Luxury & Resorts', 'Beach & Coast', 'Relaxation & Spa'],
      likes: 1923,
      saves: 1156,
      highlight: '✨ Most Luxurious Trip'
    },
    {
      id: '106',
      title: 'Patagonia Hiking Expedition',
      creator: {
        name: 'Mountain Mike',
        profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['El Calafate', 'El Chaltén', 'Torres del Paine', 'Ushuaia'],
      duration: 14,
      description: 'Trek through some of the most dramatic landscapes on Earth. Glaciers, mountains, and pristine wilderness await adventure seekers.',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
      tags: ['Mountains & Hiking', 'Adventure & Sports', 'Wildlife & Nature'],
      likes: 1345,
      saves: 789
    },
    {
      id: '107',
      title: 'Mediterranean Island Hopping',
      creator: {
        name: 'Coastal Carrie',
        profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['Santorini', 'Mykonos', 'Crete', 'Rhodes', 'Malta'],
      duration: 15,
      description: 'Sail through the stunning Greek islands and Malta, discovering ancient ruins, white-washed villages, and crystal-clear waters.',
      coverImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop',
      tags: ['Beach & Coast', 'History & Museums', 'Relaxation & Spa'],
      likes: 1567,
      saves: 923
    },
    {
      id: '108',
      title: 'Peru: Inca Trail to Machu Picchu',
      creator: {
        name: 'History Hannah',
        profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
        isFollowing: false
      },
      destinations: ['Lima', 'Cusco', 'Sacred Valley', 'Machu Picchu', 'Lake Titicaca'],
      duration: 11,
      description: 'Follow the ancient Inca Trail to the lost city of Machu Picchu. Experience Peruvian culture, cuisine, and breathtaking mountain scenery.',
      coverImage: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop',
      tags: ['Mountains & Hiking', 'History & Museums', 'Adventure & Sports'],
      likes: 1789,
      saves: 1034
    }
  ];

  const toggleSaveTrip = (tripId: string) => {
    setSavedTrips(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

  const TripCard = ({ trip }: { trip: Trip }) => {
    const isSaved = savedTrips.includes(trip.id);

    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
        {/* Cover Image */}
        <div className="relative h-56 overflow-hidden">
          <ImageWithFallback
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Duration Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {trip.duration} days
            </Badge>
          </div>

          {/* Highlight Badge */}
          {trip.highlight && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-amber-500/90 text-white backdrop-blur-sm">
                {trip.highlight}
              </Badge>
            </div>
          )}

          {/* Save Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              toggleSaveTrip(trip.id);
            }}
          >
            <Bookmark 
              className={`w-4 h-4 ${isSaved ? 'fill-current text-blue-600' : 'text-gray-700'}`}
            />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Creator Info */}
          <div className="flex items-center gap-2 mb-3">
            {trip.creator.profilePicture ? (
              <img
                src={trip.creator.profilePicture}
                alt={trip.creator.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
                {trip.creator.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm">{trip.creator.name}</p>
            </div>
            {trip.creator.isFollowing && (
              <Badge variant="secondary" className="ml-auto text-xs">Following</Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
            {trip.title}
          </h3>

          {/* Destinations */}
          <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-1">
              {trip.destinations.join(' → ')}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {trip.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {trip.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats & CTA */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{trip.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                <span>{trip.saves.toLocaleString()}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => onViewTripDetails?.(trip.id)}
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-3">Discover Trip Itineraries</h1>
          <p className="text-xl text-gray-600">
            Get inspired by trips from people you follow and popular travel creators
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v: string) => setSelectedTab(v as 'following' | 'popular')} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="following" className="gap-2">
              <Users className="w-4 h-4" />
              Following ({followingTrips.length})
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Popular ({popularTrips.length})
            </TabsTrigger>
          </TabsList>

          {/* Following Trips */}
          <TabsContent value="following" className="mt-8">
            {user ? (
              <>
                <p className="text-gray-600 mb-6">
                  Trips from people you follow
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {followingTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl mb-2">Sign in to see trips from people you follow</h3>
                <p className="text-gray-600 mb-6">
                  Follow other travelers to get personalized trip inspiration
                </p>
                <Button size="lg" onClick={onMockLogin}>Sign In</Button>
              </Card>
            )}
          </TabsContent>

          {/* Popular Trips */}
          <TabsContent value="popular" className="mt-8">
            <p className="text-gray-600 mb-6">
              Most popular trips from top travel creators
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}