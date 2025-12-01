import { useState, useEffect, useRef } from 'react';
import { Search, Heart, MessageCircle, MapPin, Calendar, Users as UsersIcon, TrendingUp, X } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface SocialPageProps {
  currentUser?: { firstName: string; lastName: string };
  onViewUserProfile?: (userId: string) => void;
  onViewTrip?: (tripId: string) => void;
}

// Mock data for user search results
const allUsers = [
  { id: '1', name: 'Bryce Thompson', username: '@bryce', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '2', name: 'Cayman Reed', username: '@cayman', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '3', name: 'Sarah Martinez', username: '@sarah_m', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '4', name: 'Michael Chen', username: '@mchen', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: '5', name: 'Emma Wilson', username: '@emma_w', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { id: '6', name: 'James Rodriguez', username: '@jrod', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '7', name: 'Olivia Park', username: '@liv_park', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
];

// Mock feed data - mix of followed and popular users
const feedPosts = [
  {
    id: 'post-1',
    user: {
      id: '1',
      name: 'Bryce Thompson',
      username: '@bryce',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      isFollowing: true,
    },
    trip: {
      id: 'trip-1',
      name: 'Costa Rica Adventure',
      image: 'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?w=600',
      stops: ['Manuel Antonio', 'Monteverde', 'Tamarindo'],
      duration: '10 days',
      startDate: 'Dec 2024',
    },
    likes: 234,
    comments: 42,
    postedAt: '2 hours ago',
    caption: 'Just planned my dream Costa Rica trip! Who wants to join? 🌴',
  },
  {
    id: 'post-2',
    user: {
      id: '3',
      name: 'Sarah Martinez',
      username: '@sarah_m',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      isFollowing: true,
    },
    trip: {
      id: 'trip-2',
      name: 'Yucatan Explorer',
      image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600',
      stops: ['Tulum', 'Playa del Carmen', 'Cozumel'],
      duration: '7 days',
      startDate: 'Jan 2025',
    },
    likes: 189,
    comments: 28,
    postedAt: '5 hours ago',
    caption: 'Beach hopping in Mexico next month! Can\'t wait 🏖️',
  },
  {
    id: 'post-3',
    user: {
      id: '8',
      name: 'Travel Explorer',
      username: '@travelexplorer',
      avatar: undefined,
      isFollowing: false,
      isPopular: true,
    },
    trip: {
      id: 'trip-3',
      name: 'Island Paradise Tour',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
      stops: ['Cozumel', 'Isla Mujeres'],
      duration: '5 days',
      startDate: 'Feb 2025',
    },
    likes: 1543,
    comments: 156,
    postedAt: '1 day ago',
    caption: 'Ultimate Caribbean island hopping guide 🌊',
  },
  {
    id: 'post-4',
    user: {
      id: '2',
      name: 'Cayman Reed',
      username: '@cayman',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      isFollowing: true,
    },
    trip: {
      id: 'trip-4',
      name: 'Surf & Adventure',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600',
      stops: ['Tamarindo', 'Santa Teresa'],
      duration: '6 days',
      startDate: 'Mar 2025',
    },
    likes: 167,
    comments: 31,
    postedAt: '1 day ago',
    caption: 'Surf trip with the crew! 🏄‍♂️ Let me know if you want the itinerary',
  },
  {
    id: 'post-5',
    user: {
      id: '5',
      name: 'Emma Wilson',
      username: '@emma_w',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      isFollowing: true,
    },
    trip: {
      id: 'trip-5',
      name: 'Nature & Wildlife',
      image: 'https://images.unsplash.com/photo-1542652694-40abf526446e?w=600',
      stops: ['Monteverde', 'La Fortuna'],
      duration: '5 days',
      startDate: 'Apr 2025',
    },
    likes: 298,
    comments: 47,
    postedAt: '2 days ago',
    caption: 'Rainforest adventures await! 🦜 Perfect for nature lovers',
  },
  {
    id: 'post-6',
    user: {
      id: '9',
      name: 'Adventure Seekers',
      username: '@adventure_seekers',
      avatar: undefined,
      isFollowing: false,
      isPopular: true,
    },
    trip: {
      id: 'trip-6',
      name: 'Central America Grand Tour',
      image: 'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?w=600',
      stops: ['Tulum', 'Manuel Antonio', 'Tamarindo', 'Monteverde'],
      duration: '14 days',
      startDate: 'May 2025',
    },
    likes: 2341,
    comments: 312,
    postedAt: '3 days ago',
    caption: 'The ultimate 2-week Central America itinerary 🌎',
  },
];

export function SocialPage({ currentUser, onViewUserProfile, onViewTrip }: SocialPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHeaderVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const filteredUsers = searchQuery
    ? allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" ref={scrollContainerRef}>
      <div className="max-w-2xl mx-auto">
        {/* Header with Search */}
        <div 
          className={`bg-white border-b fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${
            headerVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}>
                travl
              </h1>
              
              <button
                onClick={handleOpenSearch}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="fixed inset-0 bg-white z-30">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    className="pl-10 h-12"
                  />
                </div>
                <button
                  onClick={handleCloseSearch}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>

              {/* Search Results */}
              {showSearchResults && filteredUsers.length > 0 && (
                <div className="space-y-1">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
                      onClick={() => {
                        onViewUserProfile?.(user.id);
                        handleCloseSearch();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showSearchResults && filteredUsers.length === 0 && searchQuery && (
                <div className="text-center py-12 text-gray-500">
                  No users found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feed - Add top padding to account for fixed header */}
        <div className="pt-16 divide-y">
          {feedPosts.map((post) => (
            <Card key={post.id} className="rounded-none border-x-0 border-t-0">
              {/* Post Header */}
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onViewUserProfile?.(post.user.id)}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.user.name}</span>
                        {post.user.isPopular && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{post.postedAt}</div>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                {post.caption && (
                  <p className="text-sm mb-3">{post.caption}</p>
                )}
              </div>

              {/* Trip Card */}
              <div 
                className="cursor-pointer"
                onClick={() => onViewTrip?.(post.trip.id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.trip.image}
                    alt={post.trip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold mb-2">{post.trip.name}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.trip.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{post.trip.stops.length} stops</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Stops */}
                <div className="px-4 pt-3 pb-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.trip.stops.map((stop, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-3 flex items-center justify-between border-t">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onViewTrip?.(post.trip.id);
                  }}
                >
                  View Trip
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State for no user */}
        {!currentUser && feedPosts.length === 0 && (
          <div className="text-center py-16 px-4 pt-32">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl mb-2">Join the community</h2>
            <p className="text-gray-600 mb-4">Sign in to see trips from travelers around the world</p>
          </div>
        )}
      </div>
    </div>
  );
}
