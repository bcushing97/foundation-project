import { useState } from 'react';
import { MapPin, Sparkles, Users, Calendar, DollarSign, ChevronDown, ChevronUp, X, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { worldDestinations } from '../data/destinations';

interface MobileLocationSearchSheetProps {
  onSearch: (location: string, filters: {
    selectedFilters: string[];
    numberOfPeople: string;
    tripDays: string;
    budgetType: 'estimate' | 'actual';
    minBudget: string;
    maxBudget: string;
    budgetScope: 'person' | 'total';
    priceRating: number | null;
  }) => void;
  onClose: () => void;
}

const experienceTypes = [
  'Beach & Coast',
  'Mountains & Valleys',
  'Urban & City',
  'Remote & Off-Grid',
  'Romantic Getaway',
  'Party & Nightlife',
  'Wildlife & Nature',
  'Cultural Immersion',
  'Wellness & Retreat',
  'Family Friendly',
  'Luxury & High-End',
  'Budget & Backpacker'
];

export function MobileLocationSearchSheet({ onSearch, onClose }: MobileLocationSearchSheetProps) {
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [tripDays, setTripDays] = useState('');
  const [tripLengthType, setTripLengthType] = useState<'duration' | 'dates'>('duration');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetType, setBudgetType] = useState<'estimate' | 'actual'>('estimate');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [budgetScope, setBudgetScope] = useState<'person' | 'total'>('total');
  const [priceRating, setPriceRating] = useState<number | null>(null);

  // Expanded sections
  const [experienceExpanded, setExperienceExpanded] = useState(false);
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [tripLengthExpanded, setTripLengthExpanded] = useState(false);
  const [budgetExpanded, setBudgetExpanded] = useState(false);

  // Get filtered suggestions based on input
  const getFilteredSuggestions = () => {
    if (!location.trim()) return [];
    
    const query = location.toLowerCase();
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

  const filteredSuggestions = getFilteredSuggestions();

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const selectSuggestion = (text: string) => {
    setLocation(text);
    setShowSuggestions(false);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearch = () => {
    onSearch(location, {
      selectedFilters,
      numberOfPeople,
      tripDays,
      budgetType,
      minBudget,
      maxBudget,
      budgetScope,
      priceRating,
    });
    onClose();
  };

  const hasLocation = location.trim() !== '';

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <div className="p-4 space-y-4">
          {/* Location Input */}
          <div className="space-y-2 relative">
            <Label htmlFor="location">Where do you want to go?</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <Input
                id="location"
                type="text"
                placeholder="City, country, or region..."
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="pl-10"
                autoFocus
              />
              {location && (
                <button
                  onClick={() => {
                    setLocation('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto scrollbar-hide">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 flex items-start gap-2 border-b border-gray-100 last:border-b-0"
                    onClick={() => selectSuggestion(suggestion.text)}
                  >
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{suggestion.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Optional Filters Header */}
          <div className="pt-2">
            <p className="text-sm text-gray-600">Optional filters to refine your search</p>
          </div>

          {/* Experience Types Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setExperienceExpanded(!experienceExpanded)}
              className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold">Experience Types</h2>
                  {selectedFilters.length > 0 && (
                    <p className="text-xs text-gray-600">{selectedFilters.length} selected</p>
                  )}
                </div>
              </div>
              {experienceExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {experienceExpanded && (
              <div className="p-4 pt-2 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {experienceTypes.map((filter) => (
                    <Badge
                      key={filter}
                      variant={selectedFilters.includes(filter) ? "default" : "outline"}
                      className={`px-4 py-2 cursor-pointer transition-all ${
                        selectedFilters.includes(filter)
                          ? 'bg-slate-900 hover:bg-slate-800'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Number of People Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setPeopleExpanded(!peopleExpanded)}
              className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold">Number of People</h2>
                  {numberOfPeople && (
                    <p className="text-xs text-gray-600">{numberOfPeople} {numberOfPeople === '1' ? 'person' : 'people'}</p>
                  )}
                </div>
              </div>
              {peopleExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {peopleExpanded && (
              <div className="p-4 pt-2 space-y-3">
                <div className="space-y-2">
                  <Label>Number of travelers</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = parseInt(numberOfPeople) || 1;
                        if (current > 1) setNumberOfPeople(String(current - 1));
                      }}
                      disabled={!numberOfPeople || parseInt(numberOfPeople) <= 1}
                      className="h-12 w-12 rounded-full"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-3xl font-semibold text-gray-900">
                        {numberOfPeople || '0'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {numberOfPeople === '1' ? 'person' : 'people'}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = parseInt(numberOfPeople) || 0;
                        setNumberOfPeople(String(current + 1));
                      }}
                      className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Trip Length Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setTripLengthExpanded(!tripLengthExpanded)}
              className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold">Trip Length</h2>
                  {tripLengthType === 'duration' && tripDays && (
                    <p className="text-xs text-gray-600">{tripDays} {tripDays === '1' ? 'day' : 'days'}</p>
                  )}
                  {tripLengthType === 'dates' && startDate && endDate && (
                    <p className="text-xs text-gray-600">{startDate} - {endDate}</p>
                  )}
                </div>
              </div>
              {tripLengthExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {tripLengthExpanded && (
              <div className="p-4 pt-2 space-y-4">
                {/* Trip Length Type Toggle */}
                <div className="space-y-2">
                  <Label>Trip length type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={tripLengthType === 'duration' ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setTripLengthType('duration');
                        setStartDate('');
                        setEndDate('');
                      }}
                      className={`flex-1 ${tripLengthType === 'duration' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    >
                      Duration
                    </Button>
                    <Button
                      variant={tripLengthType === 'dates' ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setTripLengthType('dates');
                        setTripDays('');
                      }}
                      className={`flex-1 ${tripLengthType === 'dates' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    >
                      Exact Dates
                    </Button>
                  </div>
                </div>

                {tripLengthType === 'duration' ? (
                  // Trip Duration Stepper
                  <div className="space-y-2">
                    <Label>Number of days</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = parseInt(tripDays) || 1;
                          if (current > 1) setTripDays(String(current - 1));
                        }}
                        disabled={!tripDays || parseInt(tripDays) <= 1}
                        className="h-12 w-12 rounded-full"
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-semibold text-gray-900">
                          {tripDays || '0'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tripDays === '1' ? 'day' : 'days'}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = parseInt(tripDays) || 0;
                          setTripDays(String(current + 1));
                        }}
                        className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Exact Dates Pickers
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Budget Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setBudgetExpanded(!budgetExpanded)}
              className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold">Budget</h2>
                  {(minBudget || maxBudget || priceRating !== null) && (
                    <p className="text-xs text-gray-600">
                      {priceRating !== null ? `${'$'.repeat(priceRating)}` : `${minBudget ? '$' + minBudget : ''}${maxBudget ? ' - $' + maxBudget : ''}`}
                    </p>
                  )}
                </div>
              </div>
              {budgetExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {budgetExpanded && (
              <div className="p-4 pt-2 space-y-4">
                {/* Budget Type Toggle */}
                <div className="space-y-2">
                  <Label>Budget type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={budgetType === 'estimate' ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setBudgetType('estimate');
                        setMinBudget('');
                        setMaxBudget('');
                      }}
                      className={`flex-1 ${budgetType === 'estimate' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    >
                      Price Range
                    </Button>
                    <Button
                      variant={budgetType === 'actual' ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setBudgetType('actual');
                        setPriceRating(null);
                      }}
                      className={`flex-1 ${budgetType === 'actual' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    >
                      Exact Budget
                    </Button>
                  </div>
                </div>

                {budgetType === 'estimate' ? (
                  // Price Rating ($ to $$$$)
                  <div className="space-y-2">
                    <Label>Select price range</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((rating) => (
                        <Button
                          key={rating}
                          variant={priceRating === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPriceRating(priceRating === rating ? null : rating)}
                          className={`flex-1 ${priceRating === rating ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                        >
                          {'$'.repeat(rating)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Exact Budget Range
                  <>
                    <div className="space-y-2">
                      <Label>Budget scope</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={budgetScope === 'person' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBudgetScope('person')}
                          className={`flex-1 ${budgetScope === 'person' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                        >
                          Per Person
                        </Button>
                        <Button
                          variant={budgetScope === 'total' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBudgetScope('total')}
                          className={`flex-1 ${budgetScope === 'total' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                        >
                          Total Trip
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="minBudget">Min Budget</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="minBudget"
                            type="number"
                            placeholder="0"
                            value={minBudget}
                            onChange={(e) => setMinBudget(e.target.value)}
                            className="pl-7"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxBudget">Max Budget</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="maxBudget"
                            type="number"
                            placeholder="10000"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            className="pl-7"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Search Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <Button
          onClick={handleSearch}
          className="w-full h-12 bg-slate-900 hover:bg-slate-800"
          size="lg"
          disabled={!hasLocation}
        >
          <MapPin className="w-5 h-5 mr-2" />
          Search Destinations
        </Button>
        {!hasLocation && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Enter a location to search
          </p>
        )}
      </div>
    </div>
  );
}