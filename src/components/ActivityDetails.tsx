import { X, Clock, TrendingUp, DollarSign, Users, Calendar, CheckCircle, MapPin, Bookmark, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import type { Activity } from '../data/activities';

interface ActivityDetailsProps {
  activity: Activity;
  onClose: () => void;
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
  isSaved?: boolean;
  onToggleSave?: (activityId: string) => void;
}

export function ActivityDetails({
  activity,
  onClose,
  isLoggedIn = false,
  onLoginRequired,
  isSaved = false,
  onToggleSave
}: ActivityDetailsProps) {
  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }
    
    if (onToggleSave) {
      onToggleSave(activity.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 overflow-y-auto" onClick={onClose}>
      <div 
        className="min-h-screen py-4 px-4 flex items-start justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl my-8 overflow-hidden">
          {/* Header with Hero Image */}
          <div className="relative h-80 bg-gray-900">
            <img 
              src={activity.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
            
            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Price Badge */}
            {activity.estimatedCost && (
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <p className="text-2xl font-semibold text-slate-900">${activity.estimatedCost}</p>
                <p className="text-xs text-gray-600">{renderPriceLevel(activity.priceLevel)} per person</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title and Save Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl mb-2">{activity.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.location || 'Location'}</span>
                </div>
              </div>
              <Button
                onClick={handleSaveClick}
                variant={isSaved ? "default" : "outline"}
                className="gap-2 flex-shrink-0"
              >
                <Flag className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>

            {/* Quick Info Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Clock className="w-4 h-4" />
                {activity.duration}
              </Badge>
              <Badge variant="outline" className="px-3 py-1.5">
                {activity.category}
              </Badge>
              {activity.difficultyLevel && (
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {activity.difficultyLevel}
                </Badge>
              )}
              {activity.groupSize && (
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Users className="w-4 h-4" />
                  {activity.groupSize}
                </Badge>
              )}
              {activity.bookingRequired && (
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                  <Calendar className="w-4 h-4" />
                  Booking Required
                </Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl mb-3">About This Activity</h2>
              <p className="text-gray-700 leading-relaxed">{activity.description}</p>
            </div>

            {/* What's Included */}
            {activity.included && activity.included.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    {activity.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Best For */}
            {activity.bestFor && activity.bestFor.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl mb-3">Best For</h2>
                  <div className="flex flex-wrap gap-2">
                    {activity.bestFor.map((audience, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5">
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional Details */}
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-slate-900" />
                  <h3 className="font-semibold">Price Level</h3>
                </div>
                <p className="text-gray-700">{renderPriceLevel(activity.priceLevel)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.priceLevel === 1 && 'Budget-friendly option'}
                  {activity.priceLevel === 2 && 'Moderately priced'}
                  {activity.priceLevel === 3 && 'Premium experience'}
                  {activity.priceLevel === 4 && 'Luxury activity'}
                </p>
              </Card>

              {activity.region && (
                <Card className="p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-slate-900" />
                    <h3 className="font-semibold">Region</h3>
                  </div>
                  <p className="text-gray-700">{activity.region}</p>
                </Card>
              )}
            </div>

            {/* Important Information */}
            {activity.bookingRequired && (
              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Advance Booking Required</h3>
                    <p className="text-sm text-amber-800">
                      This activity requires advance booking. We recommend reserving your spot at least 3-7 days before your desired date.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" size="lg">
                Book This Activity
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                View on Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
