import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Plus, X, MapPin, Calendar as CalendarIcon, Upload, Trash2, UserPlus } from 'lucide-react';
import { worldDestinations } from '../data/destinations';
import { format } from 'date-fns@4.1.0';

interface Activity {
  id: string;
  name: string;
  rating: number;
}

interface TripStop {
  id: string;
  location: string;
  arrivalDate: Date | undefined;
  departureDate: Date | undefined;
  activities: Activity[];
  photos: string[];
  newActivityName: string;
  newActivityRating: number;
  showLocationSuggestions: boolean;
  showArrivalCalendar: boolean;
  showDepartureCalendar: boolean;
}

interface AddTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tripName: string, stops: TripStop[], invitedUsers?: string[]) => void;
  currentUser?: {
    firstName: string;
    lastName: string;
  };
  following?: string[];
}

export function AddTripDialog({ open, onOpenChange, onSave, currentUser, following }: AddTripDialogProps) {
  const [tripName, setTripName] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [tripStops, setTripStops] = useState<TripStop[]>([
    {
      id: '1',
      location: '',
      arrivalDate: undefined,
      departureDate: undefined,
      activities: [],
      photos: [],
      newActivityName: '',
      newActivityRating: 0,
      showLocationSuggestions: false,
      showArrivalCalendar: false,
      showDepartureCalendar: false,
    }
  ]);

  const addTripStop = () => {
    // Get the last stop's departure date to use as the next stop's arrival date
    const lastStop = tripStops[tripStops.length - 1];
    const suggestedDate = lastStop.departureDate;

    const newStop: TripStop = {
      id: Date.now().toString(),
      location: '',
      arrivalDate: suggestedDate, // Pre-fill with previous stop's departure
      departureDate: undefined,
      activities: [],
      photos: [],
      newActivityName: '',
      newActivityRating: 0,
      showLocationSuggestions: false,
      showArrivalCalendar: false,
      showDepartureCalendar: false,
    };
    setTripStops([...tripStops, newStop]);
  };

  const removeTripStop = (stopId: string) => {
    if (tripStops.length > 1) {
      setTripStops(tripStops.filter(stop => stop.id !== stopId));
    }
  };

  const updateStop = (stopId: string, updates: Partial<TripStop>) => {
    setTripStops(tripStops.map(stop => 
      stop.id === stopId ? { ...stop, ...updates } : stop
    ));
  };

  const getFilteredDestinations = (location: string) => {
    if (!location) return [];
    return worldDestinations
      .filter(dest => dest.toLowerCase().includes(location.toLowerCase()))
      .slice(0, 8);
  };

  const addActivity = (stopId: string) => {
    const stop = tripStops.find(s => s.id === stopId);
    if (!stop || !stop.newActivityName.trim() || stop.newActivityRating === 0) return;

    const newActivity: Activity = {
      id: Date.now().toString(),
      name: stop.newActivityName.trim(),
      rating: stop.newActivityRating,
    };

    updateStop(stopId, {
      activities: [...stop.activities, newActivity],
      newActivityName: '',
      newActivityRating: 0,
    });
  };

  const removeActivity = (stopId: string, activityId: string) => {
    const stop = tripStops.find(s => s.id === stopId);
    if (!stop) return;

    updateStop(stopId, {
      activities: stop.activities.filter(a => a.id !== activityId),
    });
  };

  const handleSave = () => {
    // Validate that at least the first stop has a location
    if (!tripStops[0].location.trim()) {
      alert('Please enter at least one location');
      return;
    }

    onSave(tripName, tripStops, invitedUsers);
    // Reset form
    setTripName('');
    setInvitedUsers([]);
    setTripStops([{
      id: '1',
      location: '',
      arrivalDate: undefined,
      departureDate: undefined,
      activities: [],
      photos: [],
      newActivityName: '',
      newActivityRating: 0,
      showLocationSuggestions: false,
      showArrivalCalendar: false,
      showDepartureCalendar: false,
    }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Add Previous Trip</DialogTitle>
          <DialogDescription>
            Add details about your previous trip to help others validate your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Trip Name */}
          <div>
            <Label>Trip Name *</Label>
            <Input
              placeholder="Name your trip"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
          </div>

          {tripStops.map((stop, stopIndex) => (
            <Card key={stop.id} className="p-6 relative">
              {tripStops.length > 1 && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTripStop(stop.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {/* Header */}
                {tripStops.length > 1 && (
                  <div className="flex items-center gap-2 pb-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Stop {stopIndex + 1}</h3>
                  </div>
                )}

                {/* Location */}
                <div>
                  <Label>Location *</Label>
                  <div className="relative mt-2">
                    <Input
                      placeholder="Where did you go?"
                      value={stop.location}
                      onChange={(e) => {
                        updateStop(stop.id, { 
                          location: e.target.value,
                          showLocationSuggestions: true 
                        });
                      }}
                      onFocus={() => updateStop(stop.id, { showLocationSuggestions: true })}
                    />
                    
                    {/* Location suggestions */}
                    {stop.showLocationSuggestions && stop.location && (
                      <div className="absolute z-50 w-full mt-2 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto scrollbar-hide">
                        {getFilteredDestinations(stop.location).map((dest) => (
                          <div
                            key={dest}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              updateStop(stop.id, { 
                                location: dest,
                                showLocationSuggestions: false 
                              });
                            }}
                          >
                            {dest}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Arrival Date *</Label>
                    <Popover 
                      open={stop.showArrivalCalendar}
                      onOpenChange={(open) => updateStop(stop.id, { showArrivalCalendar: open })}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left mt-2"
                          onClick={() => updateStop(stop.id, { showArrivalCalendar: true })}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {stop.arrivalDate ? format(stop.arrivalDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={stop.arrivalDate}
                          onSelect={(date) => {
                            updateStop(stop.id, { 
                              arrivalDate: date,
                              departureDate: date, // Auto-set departure to same date
                              showArrivalCalendar: false,
                              showDepartureCalendar: true // Auto-open departure calendar
                            });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Departure Date *</Label>
                    <Popover
                      open={stop.showDepartureCalendar}
                      onOpenChange={(open) => updateStop(stop.id, { showDepartureCalendar: open })}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left mt-2"
                          onClick={() => updateStop(stop.id, { showDepartureCalendar: true })}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {stop.departureDate ? format(stop.departureDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={stop.departureDate}
                          onSelect={(date) => {
                            updateStop(stop.id, { 
                              departureDate: date,
                              showDepartureCalendar: false
                            });
                          }}
                          defaultMonth={stop.arrivalDate || undefined}
                          initialFocus
                          disabled={(date) => stop.arrivalDate ? date < stop.arrivalDate : false}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <Label>Activities (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Add restaurants, hikes, excursions, hotels, dive shops, viewpoints, etc.
                  </p>

                  {/* Existing activities */}
                  {stop.activities.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {stop.activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{activity.name}</p>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= activity.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(stop.id, activity.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new activity */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <Input
                      placeholder="Activity name (e.g., Sunset Beach Restaurant)"
                      value={stop.newActivityName}
                      onChange={(e) => updateStop(stop.id, { newActivityName: e.target.value })}
                    />
                    
                    <div>
                      <Label className="text-sm mb-2 block">Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateStop(stop.id, { newActivityRating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                star <= stop.newActivityRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addActivity(stop.id)}
                      disabled={!stop.newActivityName.trim() || stop.newActivityRating === 0}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Button>
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <Label>Upload Photos (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Share photos from your trip to help others validate your experience
                  </p>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Add next stop button */}
          <Button
            type="button"
            variant="outline"
            onClick={addTripStop}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Next Stop
          </Button>

          {/* Invite Friends Section */}
          {following && following.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Invite Friends to Join</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Select friends you'd like to invite to join this trip
              </p>
              <div className="space-y-2">
                {following.map((friend) => (
                  <div
                    key={friend}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      invitedUsers.includes(friend)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setInvitedUsers(prev =>
                        prev.includes(friend)
                          ? prev.filter(u => u !== friend)
                          : [...prev, friend]
                      );
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                        {friend[0]}
                      </div>
                      <span className="flex-1">{friend}</span>
                      {invitedUsers.includes(friend) && (
                        <Badge variant="default" className="bg-blue-600">
                          Invited
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {invitedUsers.length > 0 && (
                <p className="text-sm text-gray-600 mt-4">
                  {invitedUsers.length} friend{invitedUsers.length !== 1 ? 's' : ''} will be notified
                </p>
              )}
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
