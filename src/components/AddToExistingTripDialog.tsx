import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export interface DraftTrip {
  id: string;
  name: string;
  destinations: Array<{
    id: string;
    name: string;
    country: string;
    savedActivities?: Array<{
      id: string;
      name: string;
      type: string;
      image: string;
      rating?: number;
      priceLevel?: number;
      estimatedCost?: number; // Actual cost in dollars
    }>;
    savedRestaurants?: Array<{
      id: string;
      name: string;
      cuisine: string;
      image: string;
      rating?: number;
      priceLevel?: number;
      estimatedCost?: number; // Actual cost in dollars
    }>;
    savedHotels?: Array<{
      id: string;
      name: string;
      image: string;
      rating?: number;
      priceLevel?: number;
      estimatedCost?: number; // Actual cost in dollars per night
      nights?: number; // Number of nights
    }>;
  }>;
  createdAt: Date;
  totalBudget?: number; // Total budget for the trip
  flights?: Array<{
    id: string;
    from: string;
    to: string;
    cost: number;
  }>;
}

interface AddToExistingTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftTrips: DraftTrip[];
  destination: {
    id: string;
    name: string;
    country: string;
  };
  onAddToTrip: (tripId: string) => void;
  onCreateNewTrip: () => void;
}

export function AddToExistingTripDialog({ 
  open, 
  onOpenChange, 
  draftTrips, 
  destination,
  onAddToTrip,
  onCreateNewTrip
}: AddToExistingTripDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add to Trip</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Add this destination to an existing trip or create a new one.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Adding</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-600" />
              <div>
                <p className="font-medium text-slate-900">{destination.name}</p>
                <p className="text-sm text-slate-600">{destination.country}</p>
              </div>
            </div>
          </div>

          {draftTrips.length > 0 ? (
            <>
              <div>
                <p className="text-sm text-slate-600 mb-3">Select a trip to add this destination to:</p>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {draftTrips.map((trip) => {
                      const alreadyAdded = trip.destinations.some(d => d.id === destination.id);
                      
                      return (
                        <button
                          key={trip.id}
                          onClick={() => !alreadyAdded && onAddToTrip(trip.id)}
                          disabled={alreadyAdded}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            alreadyAdded 
                              ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' 
                              : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-900 mb-1">{trip.name}</h3>
                              <div className="flex flex-wrap gap-1">
                                {trip.destinations.slice(0, 3).map((dest, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {dest.name}
                                  </Badge>
                                ))}
                                {trip.destinations.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{trip.destinations.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {alreadyAdded && (
                              <Badge variant="outline" className="text-xs">
                                Already added
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-600 mb-4">You don't have any trips in progress yet.</p>
            </div>
          )}

          <Button
            onClick={() => {
              onOpenChange(false);
              onCreateNewTrip();
            }}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}