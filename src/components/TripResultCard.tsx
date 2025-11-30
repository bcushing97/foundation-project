import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Users, DollarSign, Bookmark } from 'lucide-react';
import { Avatar } from './ui/avatar';
import type { SavedTrip } from '../data/savedTrips';
import { usersDatabase } from '../data/users';

interface TripResultCardProps {
  trip: SavedTrip;
  onClick: () => void;
  visitedByFriends?: string[];
}

export function TripResultCard({ trip, onClick, visitedByFriends = [] }: TripResultCardProps) {
  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level) + '$'.repeat(4 - level).replace(/\$/g, '·');
  };

  // Look up the creator from the users database
  const creator = usersDatabase[trip.creatorId];
  const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : 'Unknown';
  const creatorAvatar = creator?.profilePicture;

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* Trip Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.mainImage} 
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Match Percentage Badge */}
        {trip.matchPercentage && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">
            {trip.matchPercentage}% Match
          </div>
        )}

        {/* Saves Count */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-full text-xs flex items-center gap-1.5">
          <Bookmark className="size-3.5" />
          {trip.saves}
        </div>
      </div>

      {/* Trip Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-gray-900 group-hover:text-emerald-600 transition-colors">
          {trip.title}
        </h3>

        {/* Creator */}
        <div className="flex items-center gap-2">
          {creatorAvatar ? (
            <img 
              src={creatorAvatar} 
              alt={creatorName}
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <div className="size-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              {creatorName.charAt(0)}
            </div>
          )}
          <span className="text-sm text-gray-600">by {creatorName}</span>
        </div>

        {/* Destinations */}
        <div className="flex items-start gap-2">
          <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-2">
            {trip.destinations.map(d => d.name).join(' → ')}
          </span>
        </div>

        {/* Trip Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-gray-400" />
            <span>{trip.duration} days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-4 text-gray-400" />
            <span className="tracking-wide">{renderPriceLevel(trip.priceLevel)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {trip.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag}
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
          {trip.tags.length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600"
            >
              +{trip.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Friend Badges */}
        {visitedByFriends.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {visitedByFriends.slice(0, 3).map((friend, index) => (
                  <div
                    key={friend}
                    className="size-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs text-emerald-700"
                    style={{ zIndex: 3 - index }}
                  >
                    {friend.charAt(0)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {visitedByFriends.length === 1 
                  ? `${visitedByFriends[0]} did this trip` 
                  : `${visitedByFriends[0]}${visitedByFriends.length > 1 ? ` +${visitedByFriends.length - 1}` : ''} did this trip`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}