import { useState } from 'react';
import { MapPin, Sparkles, Calendar, Flag, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { getUserById } from '../data/users';
import { getDestinationsByIds } from '../data/destinations';
import { getActivitiesByIds } from '../data/activities';
import { savedTrips } from '../data/savedTrips';

interface SavedPageProps {
  userId?: string; // The logged-in user ID
  onViewDestination?: (destinationId: string) => void;
  onViewActivity?: (activityId: string) => void;
  onViewTrip?: (tripId: string) => void;
  onViewAllPlaces?: () => void;
  onViewAllExperiences?: () => void;
  onViewAllTrips?: () => void;
}

type RemoveItem = {
  type: 'place' | 'experience' | 'trip';
  id: string;
  name: string;
} | null;

export function SavedPage({ userId = 'user-john-doe', onViewDestination, onViewActivity, onViewTrip, onViewAllPlaces, onViewAllExperiences, onViewAllTrips }: SavedPageProps) {
  // Get user data
  const user = getUserById(userId);
  
  // Load saved items from user's data
  const userSavedDestinations = user?.savedDestinationIds 
    ? getDestinationsByIds(user.savedDestinationIds).map(dest => ({
        id: dest.id,
        name: dest.name,
        country: dest.country,
        image: dest.image,
        savedDate: new Date().toISOString().split('T')[0] // Mock saved date
      }))
    : [];

  const userSavedActivities = user?.savedActivityIds
    ? getActivitiesByIds(user.savedActivityIds).map(act => ({
        id: act.id,
        name: act.name,
        location: act.location,
        category: act.category,
        image: act.image,
        savedDate: new Date().toISOString().split('T')[0] // Mock saved date
      }))
    : [];

  const userSavedTrips = user?.savedTripIds
    ? user.savedTripIds
        .map(tripId => savedTrips.find(t => t.id === tripId))
        .filter((trip): trip is NonNullable<typeof trip> => trip !== undefined)
        .map(trip => ({
          id: trip.id,
          name: trip.title,
          destination: trip.destinations.map(d => d.name).join(', '),
          dates: 'Dates TBD', // SavedTrip doesn't have startDate/endDate
          image: trip.mainImage,
          savedDate: new Date().toISOString().split('T')[0] // Mock saved date
        }))
    : [];

  const [savedPlaces, setSavedPlaces] = useState(userSavedDestinations);
  const [savedExperiences, setSavedExperiences] = useState(userSavedActivities);
  const [savedTripsState, setSavedTripsState] = useState(userSavedTrips);
  const [itemToRemove, setItemToRemove] = useState<RemoveItem>(null);

  const handleRemoveItem = () => {
    if (!itemToRemove) return;

    switch (itemToRemove.type) {
      case 'place':
        setSavedPlaces(prev => prev.filter(p => p.id !== itemToRemove.id));
        break;
      case 'experience':
        setSavedExperiences(prev => prev.filter(e => e.id !== itemToRemove.id));
        break;
      case 'trip':
        setSavedTripsState(prev => prev.filter(t => t.id !== itemToRemove.id));
        break;
    }

    setItemToRemove(null);
  };

  const getDisplayItems = <T,>(items: T[]) => {
    // Show up to 4 items, if there are more show View All button
    return items.slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Saved</h1>
          <p className="text-gray-600">Your bookmarked places, experiences, and trips</p>
        </div>

        {/* Places Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl">Places</h2>
              <Badge variant="secondary">{savedPlaces.length}</Badge>
            </div>
            {savedPlaces.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAllPlaces}
                className="gap-1"
              >
                View All
                <ChevronRight className={`w-4 h-4 transition-transform`} />
              </Button>
            )}
          </div>

          {savedPlaces.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {getDisplayItems(savedPlaces).map((place) => (
                <Card
                  key={place.id}
                  className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onViewDestination?.(place.id)}
                >
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToRemove({ type: 'place', id: place.id, name: place.name });
                      }}
                    >
                      <Flag className="w-4 h-4 fill-blue-600 text-blue-600" />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{place.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-1">{place.country}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm">No saved places yet</p>
            </div>
          )}
        </div>

        {/* Experiences Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl">Experiences</h2>
              <Badge variant="secondary">{savedExperiences.length}</Badge>
            </div>
            {savedExperiences.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAllExperiences}
                className="gap-1"
              >
                View All
                <ChevronRight className={`w-4 h-4 transition-transform`} />
              </Button>
            )}
          </div>

          {savedExperiences.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {getDisplayItems(savedExperiences).map((experience) => (
                <Card
                  key={experience.id}
                  className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onViewActivity?.(experience.id)}
                >
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToRemove({ type: 'experience', id: experience.id, name: experience.name });
                      }}
                    >
                      <Flag className="w-4 h-4 fill-blue-600 text-blue-600" />
                    </button>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm text-xs">
                        {experience.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{experience.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-1">{experience.location}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm">No saved experiences yet</p>
            </div>
          )}
        </div>

        {/* Trips Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl">Trips</h2>
              <Badge variant="secondary">{savedTripsState.length}</Badge>
            </div>
            {savedTripsState.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAllTrips}
                className="gap-1"
              >
                View All
                <ChevronRight className={`w-4 h-4 transition-transform`} />
              </Button>
            )}
          </div>

          {savedTripsState.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {getDisplayItems(savedTripsState).map((trip) => (
                <Card
                  key={trip.id}
                  className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onViewTrip?.(trip.id)}
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToRemove({ type: 'trip', id: trip.id, name: trip.name });
                      }}
                    >
                      <Flag className="w-4 h-4 fill-blue-600 text-blue-600" />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{trip.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{trip.dates}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm">No saved trips yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.name}" from your saved {itemToRemove?.type}s?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveItem}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}