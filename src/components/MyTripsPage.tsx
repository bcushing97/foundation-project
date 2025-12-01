import { useState } from 'react';
import { MapPin, Calendar, Plane, ChevronRight, Clock, Plus } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { DraftTrip } from './AddToExistingTripDialog';

interface MyTripsPageProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  } | null;
  draftTrips?: DraftTrip[];
  onCreateNewTrip?: () => void;
  onEditTrip?: (tripId: string) => void;
  onViewTripDetails?: (tripId: string) => void;
}

export function MyTripsPage({ 
  user, 
  draftTrips = [],
  onCreateNewTrip,
  onEditTrip,
  onViewTripDetails
}: MyTripsPageProps) {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  // Separate trips into upcoming and past based on createdAt or other criteria
  // For now, we'll show all draftTrips as upcoming since they don't have dates
  const upcomingTrips = draftTrips;
  const pastTrips: DraftTrip[] = [];

  const formatDateRange = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) return 'Dates TBD';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
  };

  const getDuration = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) return null;
    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntil = (startDate?: Date) => {
    if (!startDate) return null;
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFirstDestinationImage = (trip: DraftTrip) => {
    // Try to get the first destination's image from saved items
    const firstDest = trip.destinations[0];
    if (firstDest?.savedActivities?.[0]?.image) {
      return firstDest.savedActivities[0].image;
    }
    if (firstDest?.savedRestaurants?.[0]?.image) {
      return firstDest.savedRestaurants[0].image;
    }
    if (firstDest?.savedHotels?.[0]?.image) {
      return firstDest.savedHotels[0].image;
    }
    return null;
  };

  const TripCard = ({ trip }: { trip: DraftTrip }) => {
    const coverImage = getFirstDestinationImage(trip);
    const duration = getDuration(trip.startDate, trip.endDate);
    const daysUntil = trip.startDate ? getDaysUntil(trip.startDate) : null;

    return (
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        onClick={() => onEditTrip?.(trip.id)}
      >
        {/* Cover Image */}
        {coverImage ? (
          <div className="relative h-40 overflow-hidden">
            <ImageWithFallback
              src={coverImage}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Days Until Badge for Upcoming Trips */}
            {trip.startDate && daysUntil !== null && daysUntil > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-blue-600 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {daysUntil} days
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg mb-2">{trip.name}</h3>

          {/* Destinations */}
          <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-1">
              {trip.destinations.map(d => d.name).join(' → ')}
            </p>
          </div>

          {/* Date & Duration */}
          {(trip.startDate || trip.endDate) && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <p>
                {formatDateRange(trip.startDate, trip.endDate)}
                {duration && ` • ${duration} days`}
              </p>
            </div>
          )}

          {/* Budget */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-sm">
              <span className="text-gray-600">Budget: </span>
              <span className="font-medium">${trip.totalBudget?.toLocaleString() || '0'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEditTrip?.(trip.id);
              }}
            >
              View
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl mb-3">Log in to view your trips</h2>
          <p className="text-gray-600 mb-6">Create an account or log in to plan and manage your trips</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2">My Trips</h1>
          <p className="text-gray-600">
            Plan, manage, and reminisce about your adventures
          </p>
        </div>

        {/* Create New Trip Button */}
        <Button 
          onClick={onCreateNewTrip}
          className="w-full mb-6 h-12"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Trip
        </Button>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v: string) => setSelectedTab(v as 'upcoming' | 'past')} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming" className="gap-2">
              <Plane className="w-4 h-4" />
              Upcoming ({upcomingTrips.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <Calendar className="w-4 h-4" />
              Past ({pastTrips.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Trips */}
          <TabsContent value="upcoming" className="mt-6">
            {upcomingTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Plane className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl mb-2">No upcoming trips yet</h3>
                <p className="text-gray-600 mb-6">
                  Start planning your next adventure!
                </p>
                <Button onClick={onCreateNewTrip}>Create Trip</Button>
              </Card>
            )}
          </TabsContent>

          {/* Past Trips */}
          <TabsContent value="past" className="mt-6">
            {pastTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl mb-2">No past trips</h3>
                <p className="text-gray-600">
                  Your completed trips will appear here
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}