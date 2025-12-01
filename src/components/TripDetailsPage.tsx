import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Bookmark, Share2, Heart, Plane, Hotel, Camera, UtensilsCrossed, ChevronLeft, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { SavedTrip } from '../data/savedTrips';
import { getActivityById } from '../data/activities';
import type { Activity } from '../data/activities';
import { usersDatabase } from '../data/users';

interface TripDetailsPageProps {
  trip: SavedTrip;
  onBack: () => void;
  onSaveTrip?: () => void;
  onShareTrip?: () => void;
  isLoggedIn?: boolean;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  } | null;
  onViewCreatorProfile?: (creatorName: string) => void;
  onViewDestination?: (destinationId: string) => void;
  onViewActivity?: (activityId: string) => void;
  onViewAccommodation?: (destinationName: string, accommodationName: string) => void;
}

export function TripDetailsPage({ 
  trip, 
  onBack, 
  onSaveTrip, 
  onShareTrip, 
  isLoggedIn = false,
  user,
  onViewCreatorProfile,
  onViewDestination,
  onViewActivity,
  onViewAccommodation
}: TripDetailsPageProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedDestinations, setSavedDestinations] = useState<Set<number>>(new Set());
  const [savedAccommodations, setSavedAccommodations] = useState<Set<string>>(new Set());
  const [savedActivities, setSavedActivities] = useState<Set<string>>(new Set());

  // Look up the creator from the users database
  const creator = usersDatabase[trip.creatorId];
  const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : 'Unknown';
  const creatorAvatar = creator?.profilePicture;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSaveTrip) {
      onSaveTrip();
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    if (onShareTrip) {
      onShareTrip();
    }
  };

  const toggleSaveDestination = (index: number) => {
    setSavedDestinations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleSaveAccommodation = (key: string) => {
    setSavedAccommodations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleSaveActivity = (activityId: string) => {
    setSavedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % trip.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + trip.images.length) % trip.images.length);
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl flex-1 truncate">{trip.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Image Gallery */}
        <Card className="overflow-hidden">
          <div className="relative h-80 bg-gray-900">
            <img 
              src={trip.images[currentImageIndex]} 
              alt={`${trip.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {trip.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {trip.images.length}
                </div>
              </>
            )}

            {/* Match Percentage Badge */}
            {trip.matchPercentage && (
              <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-full font-medium">
                {trip.matchPercentage}% Match
              </div>
            )}
          </div>
        </Card>

        {/* Trip Header Info */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Trip Title */}
            <h1 className="text-3xl">{trip.title}</h1>
            
            {/* Save and Share Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="gap-2"
              >
                <Bookmark 
                  className={`w-4 h-4 ${isSaved ? 'fill-slate-900' : ''}`} 
                />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
            
            <Separator />
            
            {/* Creator Info with Follow Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {creatorAvatar ? (
                  <Avatar className="w-12 h-12">
                    <img src={creatorAvatar} alt={creatorName} />
                  </Avatar>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
                    {creatorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{creatorName}</p>
                  <p className="text-sm text-gray-600">Trip Creator</p>
                </div>
              </div>

              {/* Follow Button */}
              <Button
                variant={isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={handleFollow}
                className={isFollowing ? "" : "bg-slate-900 hover:bg-slate-800"}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>

            <Separator />

            {/* Trip Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="font-medium">{trip.duration} days</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Budget</span>
                </div>
                <p className="font-medium">
                  ${trip.budget.toLocaleString()} ({renderPriceLevel(trip.priceLevel)})
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Destinations</span>
                </div>
                <p className="font-medium">{trip.destinations.length} stops</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm">Saves</span>
                </div>
                <p className="font-medium">{trip.saves.toLocaleString()}</p>
              </div>
            </div>

            {/* Friends who visited */}
            {trip.visitedByFriends && trip.visitedByFriends.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Friends who visited:</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.visitedByFriends.map((friend) => (
                      <Badge key={friend} variant="secondary" className="gap-1">
                        <Users className="w-3 h-3" />
                        {friend}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6">
          <h2 className="text-xl mb-4">About This Trip</h2>
          <p className="text-gray-700 leading-relaxed">{trip.description}</p>
        </Card>

        {/* Destinations */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl">Destinations</h2>
            <Badge variant="secondary">{trip.destinations.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {trip.destinations.map((destination, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                onClick={() => {
                  if (onViewDestination && destination.id) {
                    onViewDestination(destination.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-emerald-600 transition-colors">{destination.name}</p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="w-3 h-3" />
                    {destination.days} {destination.days === 1 ? 'day' : 'days'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      toggleSaveDestination(index);
                    }}
                    className="gap-2"
                  >
                    <Bookmark 
                      className={`w-4 h-4 ${savedDestinations.has(index) ? 'fill-slate-900' : ''}`} 
                    />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Accommodation */}
        {trip.destinations.some(d => d.accommodations && d.accommodations.length > 0) && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-5 h-5 text-slate-900" />
              <h2 className="text-xl">Accommodation</h2>
            </div>
            
            <div className="space-y-4">
              {trip.destinations.map((destination, destIndex) => (
                destination.accommodations && destination.accommodations.length > 0 && (
                  <div key={destIndex}>
                    <h3 className="font-medium text-gray-900 mb-2">{destination.name}</h3>
                    <div className="space-y-2">
                      {destination.accommodations.map((accommodation, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                          onClick={() => {
                            if (onViewAccommodation) {
                              onViewAccommodation(destination.name, accommodation.name);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">{accommodation.name}</p>
                              <p className="text-sm text-gray-600">{accommodation.type}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {accommodation.nights && (
                                <Badge variant="secondary" className="gap-1">
                                  {accommodation.nights} {accommodation.nights === 1 ? 'night' : 'nights'}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  toggleSaveAccommodation(accommodation.name);
                                }}
                                className="gap-2"
                              >
                                <Bookmark 
                                  className={`w-4 h-4 ${savedAccommodations.has(accommodation.name) ? 'fill-slate-900' : ''}`} 
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </Card>
        )}

        {/* Activities */}
        {trip.destinations.some(d => d.activityIds && d.activityIds.length > 0) && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-slate-900" />
              <h2 className="text-xl">Activities</h2>
            </div>
            
            <div className="space-y-6">
              {trip.destinations.map((destination, destIndex) => {
                if (!destination.activityIds || destination.activityIds.length === 0) return null;
                
                const activities = destination.activityIds
                  .map(id => getActivityById(id))
                  .filter((activity): activity is Activity => activity !== undefined);
                
                if (activities.length === 0) return null;
                
                return (
                  <div key={destIndex}>
                    <h3 className="font-medium text-gray-900 mb-3">{destination.name}</h3>
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div 
                          key={activity.id}
                          className="p-5 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                          onClick={() => {
                            if (onViewActivity) {
                              onViewActivity(activity.id);
                            }
                          }}
                        >
                          <div className="flex gap-4">
                            {/* Activity Icon/Category Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Camera className="w-5 h-5 text-emerald-700" />
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              {/* Header with Title and Price */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{activity.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                </div>
                                {activity.estimatedCost && (
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-semibold text-slate-900">${activity.estimatedCost}</p>
                                    <p className="text-xs text-gray-500">{renderPriceLevel(activity.priceLevel || 1)}</p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Metadata Badges */}
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.duration}
                                </Badge>
                                <Badge variant="outline">{activity.category}</Badge>
                                {activity.difficulty && (
                                  <Badge variant="outline" className="gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {activity.difficulty}
                                  </Badge>
                                )}
                              </div>
                              
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                toggleSaveActivity(activity.id);
                              }}
                              className="gap-2"
                            >
                              <Bookmark 
                                className={`w-4 h-4 ${savedActivities.has(activity.id) ? 'fill-slate-900' : ''}`} 
                              />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Tags */}
        {trip.tags && trip.tags.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl mb-4">Experience Tags</h2>
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Save Trip CTA */}
        {isLoggedIn && (
          <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Like this trip?</h3>
                <p className="text-sm text-gray-300">
                  Save it to your collection and start planning
                </p>
              </div>
              <Button
                onClick={handleSave}
                variant={isSaved ? "secondary" : "default"}
                className={isSaved ? "" : "bg-white text-slate-900 hover:bg-gray-100"}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save Trip'}
              </Button>
            </div>
          </Card>
        )}

        {/* Not Logged In CTA */}
        {!isLoggedIn && (
          <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Sign up to save this trip</h3>
              <p className="text-sm text-gray-300 mb-4">
                Create an account to save trips, plan your adventures, and connect with travelers
              </p>
              <Button
                variant="default"
                className="bg-white text-slate-900 hover:bg-gray-100"
              >
                Sign Up Free
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}