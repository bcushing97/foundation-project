import { useState } from 'react';
import { ChevronLeft, Sparkles, Users, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface MobileExperienceSearchPageProps {
  onBack: () => void;
  onSearch: (filters: {
    selectedFilters: string[];
    numberOfPeople: string;
    tripDays: string;
    budgetType: 'estimate' | 'actual';
    minBudget: string;
    maxBudget: string;
    budgetScope: 'person' | 'total';
    priceRating: number | null;
  }) => void;
  initialFilters?: string[];
  initialNumberOfPeople?: string;
  initialTripDays?: string;
  initialBudgetType?: 'estimate' | 'actual';
  initialMinBudget?: string;
  initialMaxBudget?: string;
  initialBudgetScope?: 'person' | 'total';
  initialPriceRating?: number | null;
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

export function MobileExperienceSearchPage({
  onBack,
  onSearch,
  initialFilters = [],
  initialNumberOfPeople = '',
  initialTripDays = '',
  initialBudgetType = 'estimate',
  initialMinBudget = '',
  initialMaxBudget = '',
  initialBudgetScope = 'total',
  initialPriceRating = null,
}: MobileExperienceSearchPageProps) {
  // Filter states
  const [selectedFilters, setSelectedFilters] = useState<string[]>(initialFilters);
  const [numberOfPeople, setNumberOfPeople] = useState(initialNumberOfPeople);
  const [tripDays, setTripDays] = useState(initialTripDays);
  const [budgetType, setBudgetType] = useState<'estimate' | 'actual'>(initialBudgetType);
  const [minBudget, setMinBudget] = useState(initialMinBudget);
  const [maxBudget, setMaxBudget] = useState(initialMaxBudget);
  const [budgetScope, setBudgetScope] = useState<'person' | 'total'>(initialBudgetScope);
  const [priceRating, setPriceRating] = useState<number | null>(initialPriceRating);

  // Expanded sections
  const [experienceExpanded, setExperienceExpanded] = useState(true);
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [tripLengthExpanded, setTripLengthExpanded] = useState(false);
  const [budgetExpanded, setBudgetExpanded] = useState(false);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearch = () => {
    onSearch({
      selectedFilters,
      numberOfPeople,
      tripDays,
      budgetType,
      minBudget,
      maxBudget,
      budgetScope,
      priceRating,
    });
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
    setNumberOfPeople('');
    setTripDays('');
    setBudgetType('estimate');
    setMinBudget('');
    setMaxBudget('');
    setBudgetScope('total');
    setPriceRating(null);
  };

  const hasAnyFilters = selectedFilters.length > 0 || numberOfPeople || tripDays || minBudget || maxBudget || priceRating !== null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Search by Experience</h1>
            <p className="text-xs text-gray-600">
              {selectedFilters.length > 0 ? `${selectedFilters.length} filter${selectedFilters.length !== 1 ? 's' : ''} selected` : 'Select your preferences'}
            </p>
          </div>
        </div>
        {hasAnyFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-gray-600">
            Clear All
          </Button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
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
                <p className="text-sm text-gray-600">What kind of experiences are you looking for?</p>
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
                  <Label htmlFor="people">Number of travelers</Label>
                  <Input
                    id="people"
                    type="number"
                    placeholder="e.g., 2"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    min="1"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3', '4', '5+'].map((num) => (
                    <Button
                      key={num}
                      variant={numberOfPeople === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNumberOfPeople(num)}
                      className={numberOfPeople === num ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    >
                      {num}
                    </Button>
                  ))}
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
                  {tripDays && (
                    <p className="text-xs text-gray-600">{tripDays} {tripDays === '1' ? 'day' : 'days'}</p>
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
              <div className="p-4 pt-2 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="days">Number of days</Label>
                  <Input
                    id="days"
                    type="number"
                    placeholder="e.g., 7"
                    value={tripDays}
                    onChange={(e) => setTripDays(e.target.value)}
                    min="1"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['3', '5', '7', '10', '14'].map((days) => (
                    <Button
                      key={days}
                      variant={tripDays === days ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTripDays(days)}
                      className={tripDays === days ? 'bg-purple-600 hover:bg-purple-700' : ''}
                    >
                      {days} days
                    </Button>
                  ))}
                </div>
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
                    <p className="text-xs text-gray-600">
                      $ = Budget • $$ = Moderate • $$$ = Upscale • $$$$ = Luxury
                    </p>
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
          disabled={!hasAnyFilters}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Search Destinations
          {selectedFilters.length > 0 && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {selectedFilters.length}
            </span>
          )}
        </Button>
        {!hasAnyFilters && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Select at least one filter to search
          </p>
        )}
      </div>
    </div>
  );
}