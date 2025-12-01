import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, X, TrendingUp, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { worldDestinations } from '../data/destinations';

interface MobileLocationSearchPageProps {
  onBack: () => void;
  onSearch: (location: string) => void;
}

// Trending destinations
const trendingPlaces = [
  'Bali, Indonesia',
  'Paris, France',
  'Tokyo, Japan'
];

export function MobileLocationSearchPage({ onBack, onSearch }: MobileLocationSearchPageProps) {
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Track scroll direction to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get filtered destination suggestions
  const filteredDestinations = locationInput.trim() 
    ? worldDestinations
        .filter(dest => 
          dest.toLowerCase().includes(locationInput.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    setLocationInput(location);
    setShowSuggestions(false);
    // Automatically search when a location is selected
    onSearch(location);
  };

  const handleClearLocation = () => {
    setLocationInput('');
    setSelectedLocation('');
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (selectedLocation) {
      onSearch(selectedLocation);
    }
  };

  const handleTrendingClick = (place: string) => {
    onSearch(place);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Fixed Header with centered travl */}
      <div 
        className={`sticky top-0 z-50 bg-white border-b transition-transform duration-300 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-center px-4 py-3 relative">
          <button 
            onClick={onBack}
            className="absolute left-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl">travl</h1>
        </div>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="space-y-6">
          {/* Heading */}
          <h2 className="text-2xl text-center text-gray-800">
            Where are we heading?
          </h2>

          {/* Search Input Container - this never moves */}
          <div className="relative z-20">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search destinations..."
                className="pl-10 pr-10 h-14 text-lg"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowSuggestions(true);
                  if (!e.target.value) {
                    setSelectedLocation('');
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {/* Show arrow when location is selected, X when typing */}
              {selectedLocation && !showSuggestions ? (
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <ArrowRight className="w-5 h-5 text-gray-700" />
                </button>
              ) : locationInput && (
                <button
                  onClick={handleClearLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown - absolutely positioned to overlay content */}
            {showSuggestions && filteredDestinations.length > 0 && !selectedLocation && (
              <Card className="absolute top-full mt-2 w-full divide-y shadow-lg z-30">
                {filteredDestinations.map((destination, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-3.5 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg bg-white"
                    onClick={() => handleSelectLocation(destination)}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{destination}</span>
                    </div>
                  </button>
                ))}
              </Card>
            )}
          </div>

          {/* Trending Places - always visible to keep layout stable */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Trending destinations</span>
            </div>
            <div className="space-y-2">
              {trendingPlaces.map((place, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(place)}
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{place}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}