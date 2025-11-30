import { MapPin, ChevronRight, Compass } from 'lucide-react';
import { Card } from './ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { useState } from 'react';
import { MobileLocationSearchSheet } from './MobileLocationSearchSheet';
import { MobileExperienceSearchSheet } from './MobileExperienceSearchSheet';
import { MobileTripSearchSheet } from './MobileTripSearchSheet';
import { PlaceSettingIcon } from './PlaceSettingIcon';

interface MobileHomePageProps {
  onLocationSearch: (location: string, filters: {
    selectedFilters: string[];
    numberOfPeople: string;
    tripDays: string;
    budgetType: 'estimate' | 'actual';
    minBudget: string;
    maxBudget: string;
    budgetScope: 'person' | 'total';
    priceRating: number | null;
  }) => void;
  onExperienceSearch: (filters: {
    selectedFilters: string[];
    numberOfPeople: string;
    tripDays: string;
    tripLengthType: 'duration' | 'dates';
    startDate: string;
    endDate: string;
    budgetType: 'estimate' | 'actual';
    minBudget: string;
    maxBudget: string;
    budgetScope: 'person' | 'total';
    priceRating: number | null;
  }) => void;
  onTripSearch: (filters: {
    tripKeywords: string;
    selectedFilters: string[];
    numberOfPeople: string;
    tripDays: string;
    tripLengthType: 'duration' | 'dates';
    startDate: string;
    endDate: string;
    budgetType: 'estimate' | 'actual';
    minBudget: string;
    maxBudget: string;
    budgetScope: 'person' | 'total';
    priceRating: number | null;
  }) => void;
}

export function MobileHomePage({ onLocationSearch, onExperienceSearch, onTripSearch }: MobileHomePageProps) {
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [experienceSheetOpen, setExperienceSheetOpen] = useState(false);
  const [tripSheetOpen, setTripSheetOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6 pt-4">
            <h2 className="text-2xl px-1">Search by</h2>
          </div>

          {/* Search Options */}
          <div className="space-y-4">
            {/* Search by Location */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all active:scale-98"
              onClick={() => setLocationSheetOpen(true)}
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
              onClick={() => setExperienceSheetOpen(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <PlaceSettingIcon className="w-10 h-10 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">Experience</h3>
                  <p className="text-sm text-gray-600">Find destinations based on activities, vibe, and preferences</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
              </div>
            </Card>

            {/* Search by Trip */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all active:scale-98"
              onClick={() => setTripSheetOpen(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-7 h-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">Trip</h3>
                  <p className="text-sm text-gray-600">Search other itineraries to build your own</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
              </div>
            </Card>
          </div>

          {/* Popular Destinations Preview */}
          <div className="mt-8">
            <h2 className="text-xl mb-4 px-1">Popular Destinations</h2>
            <div className="grid grid-cols-2 gap-3">
              {popularDestinations.map((dest) => (
                <Card 
                  key={dest.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setLocationSheetOpen(true)}
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
        </div>
      </div>

      {/* Location Search Sheet */}
      <Sheet open={locationSheetOpen} onOpenChange={setLocationSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-3xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Search by Location</SheetTitle>
            <SheetDescription>Search for destinations by entering a city, country, or region</SheetDescription>
          </SheetHeader>
          <MobileLocationSearchSheet 
            onSearch={onLocationSearch} 
            onClose={() => setLocationSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Experience Search Sheet */}
      <Sheet open={experienceSheetOpen} onOpenChange={setExperienceSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-3xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Search by Experience</SheetTitle>
            <SheetDescription>Find destinations based on activities, preferences, budget, and trip details</SheetDescription>
          </SheetHeader>
          <MobileExperienceSearchSheet 
            onSearch={onExperienceSearch}
            onClose={() => setExperienceSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Trip Search Sheet */}
      <Sheet open={tripSheetOpen} onOpenChange={setTripSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-3xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Search by Trip</SheetTitle>
            <SheetDescription>Plan your trip with activities, budget, and duration</SheetDescription>
          </SheetHeader>
          <MobileTripSearchSheet 
            onSearch={onTripSearch}
            onClose={() => setTripSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
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