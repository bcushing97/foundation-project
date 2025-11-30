import { useState } from 'react';
import { MapPin, Sparkles, ChevronRight, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface MobileSearchPageProps {
  onSearchByLocation: () => void;
  onSearchByExperience: () => void;
}

export function MobileSearchPage({ onSearchByLocation, onSearchByExperience }: MobileSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Search</h1>
          <p className="text-gray-600">Find your next adventure</p>
        </div>

        {/* Quick Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Search Options */}
        <div className="space-y-4">
          <h2 className="text-xl">Search by</h2>
          
          {/* Search by Location */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all active:scale-98"
            onClick={onSearchByLocation}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-1">Location</h3>
                <p className="text-sm text-gray-600">Search for destinations by city, country, or region</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
            </div>
          </Card>

          {/* Search by Experience */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all active:scale-98"
            onClick={onSearchByExperience}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-1">Experience</h3>
                <p className="text-sm text-gray-600">Find destinations based on activities, vibe, and preferences</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
            </div>
          </Card>
        </div>

        {/* Popular Destinations */}
        <div className="mt-8">
          <h2 className="text-xl mb-4">Popular Destinations</h2>
          <div className="grid grid-cols-2 gap-3">
            {popularDestinations.map((dest) => (
              <Card 
                key={dest.id}
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                onClick={onSearchByLocation}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold">{dest.name}</h3>
                    <p className="text-white/90 text-xs">{dest.country}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl mb-4">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <Card 
                  key={index}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <span className="flex-1 text-gray-700">{search}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const popularDestinations = [
  {
    id: '1',
    name: 'Manuel Antonio',
    country: 'Costa Rica',
    image: 'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?w=400',
  },
  {
    id: '2',
    name: 'Tamarindo',
    country: 'Costa Rica',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
  },
  {
    id: '6',
    name: 'Tulum',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400',
  },
  {
    id: '7',
    name: 'Playa del Carmen',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?w=400',
  },
];

const recentSearches = [
  'Beach destinations in Central America',
  'Adventure activities Costa Rica',
  'Tulum beach resorts',
];
