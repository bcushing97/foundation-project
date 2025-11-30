import { useState } from 'react';
import { X, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDestination?: {
    id: string;
    name: string;
    country: string;
  };
  onCreateTrip: (tripName: string, destination: { id: string; name: string; country: string }) => void;
}

export function CreateTripDialog({ open, onOpenChange, initialDestination, onCreateTrip }: CreateTripDialogProps) {
  const [tripName, setTripName] = useState('');
  
  const handleCreate = () => {
    if (tripName.trim() && initialDestination) {
      onCreateTrip(tripName.trim(), initialDestination);
      setTripName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Trip</DialogTitle>
          <DialogDescription>
            Add a new trip to your travel planner.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Initial Destination */}
          {initialDestination && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Starting with</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">{initialDestination.name}</p>
                  <p className="text-sm text-slate-600">{initialDestination.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Trip Name */}
          <div className="space-y-2">
            <Label htmlFor="tripName">Trip Name</Label>
            <Input
              id="tripName"
              placeholder="e.g., Costa Rica Adventure, Summer Euro Trip..."
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="h-12"
            />
            <p className="text-sm text-slate-500">
              Give your trip a memorable name. You can add more destinations and activities later.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!tripName.trim()}
              className="flex-1"
            >
              Create Trip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}