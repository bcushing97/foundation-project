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
                <p className="text-xs text-gray-600">{renderPriceLevel(activity.priceLevel || 1)} per person</p>
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
              {activity.difficulty && (
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {activity.difficulty}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl mb-3">About This Activity</h2>
              <p className="text-gray-700 leading-relaxed">{activity.description}</p>
            </div>

            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {activity.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5">
                        {tag}
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
                <p className="text-gray-700">{renderPriceLevel(activity.priceLevel || 1)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.priceLevel === 1 && 'Budget-friendly option'}
                  {activity.priceLevel === 2 && 'Moderately priced'}
                  {activity.priceLevel === 3 && 'Premium experience'}
                  {activity.priceLevel === 4 && 'Luxury activity'}
                </p>
              </Card>

              {activity.bestTimeOfDay && (
                <Card className="p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-slate-900" />
                    <h3 className="font-semibold">Best Time</h3>
                  </div>
                  <p className="text-gray-700">{activity.bestTimeOfDay}</p>
                </Card>
              )}
            </div>


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
