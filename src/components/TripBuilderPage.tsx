import { useState } from 'react';
import { ArrowLeft, Plus, DollarSign, Users, Plane, Hotel, Camera, X, Search, MapPin, Calendar, UserPlus, Mail, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { worldDestinations } from '../data/destinations';
import type { DraftTrip } from './AddToExistingTripDialog';

interface TripBuilderPageProps {
  onBack: () => void;
  onSaveTrip: (trip: DraftTrip) => void;
  onSearchFlights?: () => void;
  onSearchAccommodation?: () => void;
  onSearchActivities?: () => void;
}

interface TripDestination {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface FlightItem {
  id: string;
  from: string;
  to: string;
  date: string;
  airline?: string;
  price: number;
}

interface AccommodationItem {
  id: string;
  name: string;
  checkIn: string;
  checkOut: string;
  location: string;
  price: number;
}

interface ActivityItem {
  id: string;
  name: string;
  date: string;
  location: string;
  price: number;
}

interface InvitedFriend {
  id: string;
  email: string;
  name?: string;
}

interface SuggestedFriend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mutualFriends?: number;
}

// Mock suggested friends - in real app this would come from API
const mockSuggestedFriends: SuggestedFriend[] = [
  {
    id: 'friend1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    mutualFriends: 12
  },
  {
    id: 'friend2',
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    mutualFriends: 8
  },
  {
    id: 'friend3',
    name: 'Emma Thompson',
    email: 'emma.t@email.com',
    mutualFriends: 15
  },
  {
    id: 'friend4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    mutualFriends: 5
  },
  {
    id: 'friend5',
    name: 'Jessica Martinez',
    email: 'jessica.m@email.com',
    mutualFriends: 10
  }
];

// Major airport codes by city
const airportCodes: Record<string, string> = {
  'New York': 'JFK',
  'Los Angeles': 'LAX',
  'Chicago': 'ORD',
  'San Francisco': 'SFO',
  'Miami': 'MIA',
  'Seattle': 'SEA',
  'Boston': 'BOS',
  'Washington': 'DCA',
  'Atlanta': 'ATL',
  'Dallas': 'DFW',
  'Houston': 'IAH',
  'Phoenix': 'PHX',
  'Philadelphia': 'PHL',
  'London': 'LHR',
  'Paris': 'CDG',
  'Tokyo': 'NRT',
  'Dubai': 'DXB',
  'Singapore': 'SIN',
  'Hong Kong': 'HKG',
  'Sydney': 'SYD',
  'Toronto': 'YYZ',
  'Mexico City': 'MEX',
  'Rome': 'FCO',
  'Barcelona': 'BCN',
  'Amsterdam': 'AMS',
  'Frankfurt': 'FRA',
  'Munich': 'MUC',
  'Istanbul': 'IST',
  'Bangkok': 'BKK',
  'Seoul': 'ICN',
  'Shanghai': 'PVG',
  'Beijing': 'PEK',
  'Delhi': 'DEL',
  'Mumbai': 'BOM',
};

function getAirportCode(cityName: string): string {
  // Try exact match first
  if (airportCodes[cityName]) {
    return airportCodes[cityName];
  }
  
  // Try partial match
  for (const [city, code] of Object.entries(airportCodes)) {
    if (cityName.includes(city) || city.includes(cityName)) {
      return code;
    }
  }
  
  // Return first 3 letters as fallback
  return cityName.substring(0, 3).toUpperCase();
}

export function TripBuilderPage({ 
  onBack, 
  onSaveTrip,
  onSearchFlights,
  onSearchAccommodation,
  onSearchActivities
}: TripBuilderPageProps) {
  const [tripName, setTripName] = useState('');
  const [budget, setBudget] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState<TripDestination[]>([]);
  const [destinationInput, setDestinationInput] = useState('');
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
  
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Invited friends
  const [invitedFriends, setInvitedFriends] = useState<InvitedFriend[]>([]);
  const [friendEmailInput, setFriendEmailInput] = useState('');

  // Collapse state for sections
  const [expandedSections, setExpandedSections] = useState({
    tripDetails: true,
    destinations: true,
    flights: true,
    accommodation: true,
    activities: true,
    inviteFriends: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Source airport (user's home airport - in real app this would come from user profile)
  const [sourceAirport] = useState('JFK'); // New York JFK as default

  // Get filtered suggestions based on input with prioritized matching
  const getFilteredSuggestions = () => {
    if (!destinationInput.trim() || !worldDestinations) return [];
    
    const query = destinationInput.toLowerCase();
    const suggestions: Array<{ 
      text: string, 
      priority: number // 0 = exact match, 1 = starts with, 2 = contains
    }> = [];
    
    // Helper function to calculate match priority
    const getMatchPriority = (text: string, query: string): number => {
      const lowerText = text.toLowerCase();
      if (lowerText === query) return 0; // Exact match
      if (lowerText.startsWith(query)) return 1; // Starts with
      if (lowerText.includes(query)) return 2; // Contains
      return 3; // No match
    };
    
    // Search through all world destinations
    worldDestinations.forEach(destination => {
      const priority = getMatchPriority(destination, query);
      if (priority < 3) {
        suggestions.push({
          text: destination,
          priority: priority
        });
      }
    });
    
    // Sort by priority (exact matches first, then starts with, then contains)
    suggestions.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return 0;
    });
    
    return suggestions.slice(0, 4); // Show maximum 4 closest matches
  };

  const filteredDestinations = getFilteredSuggestions();

  const handleSelectDestination = (destination: string) => {
    const newDestination: TripDestination = {
      id: Date.now().toString(),
      name: destination,
      startDate: '',
      endDate: ''
    };
    setDestinations([...destinations, newDestination]);
    setDestinationInput('');
    setShowDestinationSuggestions(false);
  };

  const handleRemoveDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleUpdateDestinationDates = (id: string, field: 'startDate' | 'endDate', value: string) => {
    setDestinations(destinations.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const handleAddFriend = () => {
    const email = friendEmailInput.trim();
    if (!email) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check if already invited
    if (invitedFriends.some(f => f.email === email)) {
      alert('This friend has already been invited');
      return;
    }

    const newFriend: InvitedFriend = {
      id: Date.now().toString(),
      email: email,
      name: email.split('@')[0] // Use part before @ as name placeholder
    };

    setInvitedFriends([...invitedFriends, newFriend]);
    setFriendEmailInput('');
  };

  const handleRemoveFriend = (id: string) => {
    setInvitedFriends(invitedFriends.filter(f => f.id !== id));
  };

  const handleAddSuggestedFriend = (friend: SuggestedFriend) => {
    const newFriend: InvitedFriend = {
      id: friend.id,
      email: friend.email,
      name: friend.name
    };
    setInvitedFriends([...invitedFriends, newFriend]);
  };

  // Filter out already invited friends from suggestions
  const availableSuggestedFriends = mockSuggestedFriends.filter(
    suggested => !invitedFriends.some(invited => invited.id === suggested.id)
  );

  const handleSaveTrip = () => {
    if (!tripName.trim()) {
      alert('Please enter a trip name');
      return;
    }

    const trip: DraftTrip = {
      id: Date.now().toString(),
      name: tripName,
      destinations: destinations.map(dest => ({
        id: dest.id,
        name: dest.name,
        country: '', // Will be populated later
        savedActivities: activities
          .filter(act => act.location === dest.name)
          .map(act => ({
            id: act.id,
            name: act.name,
            location: act.location,
            type: 'activity',
            rating: 4.5,
            image: '',
            price: act.price,
            duration: '2 hours'
          })),
        savedRestaurants: [],
        savedHotels: accommodations
          .filter(acc => acc.location === dest.name)
          .map(acc => ({
            id: acc.id,
            name: acc.name,
            location: acc.location,
            type: 'hotel',
            rating: 4.5,
            image: '',
            price: acc.price,
            amenities: []
          }))
      })),
      totalBudget: budget ? parseFloat(budget) : 0,
      createdAt: new Date(),
      flights: flights.map(f => ({
        id: f.id,
        from: f.from,
        to: f.to,
        cost: f.price
      }))
    };

    onSaveTrip(trip);
  };

  const calculateTotalSpent = () => {
    const flightTotal = flights.reduce((sum, f) => sum + f.price, 0);
    const accommodationTotal = accommodations.reduce((sum, a) => sum + a.price, 0);
    const activityTotal = activities.reduce((sum, a) => sum + a.price, 0);
    return flightTotal + accommodationTotal + activityTotal;
  };

  const totalSpent = calculateTotalSpent();
  const budgetRemaining = budget ? parseFloat(budget) - totalSpent : 0;

  // Get recommended airports for destinations
  const recommendedFlights = destinations.map(dest => ({
    to: getAirportCode(dest.name),
    destination: dest.name
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
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
            <h1 className="text-2xl flex-1">Plan Your Trip</h1>
            <Button onClick={handleSaveTrip}>
              Save Trip
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 1. Trip Basic Details */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Trip Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('tripDetails')}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          {expandedSections.tripDetails && (
            <div className="space-y-4">
              {/* Trip Name - Required */}
              <div>
                <Label htmlFor="tripName">
                  Trip Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tripName"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Summer Europe Adventure"
                  className="mt-2"
                />
              </div>

              {/* Start Date and End Date side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Budget and Travelers side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Budget
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="0"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfTravelers">
                    <Users className="w-4 h-4 inline mr-2" />
                    Travelers
                  </Label>
                  <Input
                    id="numberOfTravelers"
                    type="number"
                    min="1"
                    value={numberOfTravelers}
                    onChange={(e) => setNumberOfTravelers(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Budget Tracker - Always visible when budget is set */}
              {budget && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">${parseFloat(budget).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium">${totalSpent.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-medium">Remaining:</span>
                    <span className={`font-medium ${budgetRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${budgetRemaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 2. Destinations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('destinations')}>
            <div className="flex items-center gap-2">
              <h2 className="text-xl">Destinations</h2>
              <Badge variant="secondary">{destinations.length}</Badge>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${expandedSections.destinations ? '' : '-rotate-90'}`} 
            />
          </div>
          
          {expandedSections.destinations && (
            <div className="space-y-3">
              {/* Add Destination Input with Autocomplete */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={destinationInput}
                      onChange={(e) => {
                        setDestinationInput(e.target.value);
                        setShowDestinationSuggestions(true);
                      }}
                      onFocus={() => setShowDestinationSuggestions(true)}
                      placeholder="Type a destination..."
                      className="flex-1"
                    />
                    
                    {/* Suggestions dropdown */}
                    {showDestinationSuggestions && filteredDestinations.length > 0 && destinationInput && (
                      <div className="absolute z-50 w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredDestinations.map((destination) => (
                          <div
                            key={destination.text}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center gap-2"
                            onClick={() => handleSelectDestination(destination.text)}
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {destination.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Destinations List with Dates */}
              {destinations.length > 0 && (
                <div className="space-y-3 mt-4">
                  {destinations.map((dest) => (
                    <div key={dest.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{dest.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDestination(dest.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Date inputs for this destination */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`start-${dest.id}`} className="text-sm text-gray-600">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Arrival
                          </Label>
                          <Input
                            id={`start-${dest.id}`}
                            type="date"
                            value={dest.startDate}
                            onChange={(e) => handleUpdateDestinationDates(dest.id, 'startDate', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`end-${dest.id}`} className="text-sm text-gray-600">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Departure
                          </Label>
                          <Input
                            id={`end-${dest.id}`}
                            type="date"
                            value={dest.endDate}
                            onChange={(e) => handleUpdateDestinationDates(dest.id, 'endDate', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 3. Flights Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('flights')}>
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              <h2 className="text-xl">Flights</h2>
              <Badge variant="secondary">{flights.length}</Badge>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${expandedSections.flights ? '' : '-rotate-90'}`} 
            />
          </div>

          {expandedSections.flights && (
            <>
              {/* Source Airport Display */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Your home airport</div>
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{sourceAirport}</span>
                </div>
              </div>

              {/* Recommended Destinations */}
              {recommendedFlights.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-3">Recommended flights for your destinations:</div>
                  <div className="space-y-2">
                    {recommendedFlights.map((flight, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Plane className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            <span className="font-medium">{sourceAirport}</span> → <span className="font-medium">{flight.to}</span>
                          </span>
                          <span className="text-xs text-gray-500">({flight.destination})</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Find Flights
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {flights.length > 0 && (
                <div className="space-y-3">
                  {flights.map((flight) => (
                    <div key={flight.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{flight.from} → {flight.to}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFlights(flights.filter(f => f.id !== flight.id))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Date: {flight.date}</p>
                        {flight.airline && <p>Airline: {flight.airline}</p>}
                        <p className="font-medium text-gray-900">Price: ${flight.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {flights.length === 0 && recommendedFlights.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Plane className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No flights added yet</p>
                  <p className="text-sm mt-1">Add destinations above to see flight recommendations</p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* 4. Accommodation Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('accommodation')}>
            <div className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              <h2 className="text-xl">Accommodation</h2>
              <Badge variant="secondary">{accommodations.length}</Badge>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${expandedSections.accommodation ? '' : '-rotate-90'}`} 
            />
          </div>

          {expandedSections.accommodation && (
            <>
              <Button 
                variant="outline" 
                className="w-full mb-4"
                onClick={onSearchAccommodation}
              >
                <Search className="w-4 h-4 mr-2" />
                Search Accommodation on Website
              </Button>

              {accommodations.length > 0 && (
                <div className="space-y-3">
                  {accommodations.map((accommodation) => (
                    <div key={accommodation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Hotel className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{accommodation.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAccommodations(accommodations.filter(a => a.id !== accommodation.id))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Location: {accommodation.location}</p>
                        <p>Check-in: {accommodation.checkIn}</p>
                        <p>Check-out: {accommodation.checkOut}</p>
                        <p className="font-medium text-gray-900">Price: ${accommodation.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accommodations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Hotel className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No accommodation added yet</p>
                  <p className="text-sm mt-1">Search and add hotels from the website</p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* 5. Activities Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('activities')}>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <h2 className="text-xl">Activities & Experiences</h2>
              <Badge variant="secondary">{activities.length}</Badge>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${expandedSections.activities ? '' : '-rotate-90'}`} 
            />
          </div>

          {expandedSections.activities && (
            <>
              <Button 
                variant="outline" 
                className="w-full mb-4"
                onClick={onSearchActivities}
              >
                <Search className="w-4 h-4 mr-2" />
                Search Activities on Website
              </Button>

              {activities.length > 0 && (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{activity.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActivities(activities.filter(a => a.id !== activity.id))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Location: {activity.location}</p>
                        <p>Date: {activity.date}</p>
                        <p className="font-medium text-gray-900">Price: ${activity.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No activities added yet</p>
                  <p className="text-sm mt-1">Search and add activities from the website</p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* 6. Invite Friends Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('inviteFriends')}>
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <h2 className="text-xl">Invite Friends</h2>
              <Badge variant="secondary">{invitedFriends.length}</Badge>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${expandedSections.inviteFriends ? '' : '-rotate-90'}`} 
            />
          </div>

          {expandedSections.inviteFriends && (
            <div className="space-y-4">
              {/* Add Friend Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={friendEmailInput}
                    onChange={(e) => setFriendEmailInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddFriend();
                      }
                    }}
                    placeholder="Enter friend's email address"
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddFriend} size="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>

              {/* Invited Friends List */}
              {invitedFriends.length > 0 && (
                <div className="space-y-2 mt-4">
                  <div className="text-sm text-gray-600 mb-2">Invited friends:</div>
                  {invitedFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{friend.name}</p>
                          <p className="text-xs text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {invitedFriends.length === 0 && (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <UserPlus className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No friends invited yet</p>
                  <p className="text-xs mt-1">Invite friends to collaborate on this trip</p>
                </div>
              )}

              {/* Suggested Friends */}
              {availableSuggestedFriends.length > 0 && (
                <div className="space-y-2 mt-4">
                  <div className="text-sm text-gray-600 mb-2">Suggested friends:</div>
                  {availableSuggestedFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{friend.name}</p>
                          <p className="text-xs text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSuggestedFriend(friend)}
                      >
                        Invite
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}