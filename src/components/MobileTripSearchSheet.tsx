import { useState } from 'react';
import { Users, Calendar, DollarSign, ChevronDown, ChevronUp, Minus, Plus, Search, Compass } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface MobileTripSearchSheetProps {
  onSearch: (filters: {
    tripKeywords: string;
    selectedFilters: string[];
    numberOfPeople: string;
    tripDays: string;
    tripLengthType: 'duration' | 'dates';
    startDate: string;
    endDate: string;
    budgetType: 'estimate' | 'actual';
    minBudget: string;
    maxBudget: string;
    budgetScope: 'person' | 'total';
    priceRating: number | null;
  }) => void;
  onClose: () => void;
}

export function MobileTripSearchSheet({ onSearch, onClose }: MobileTripSearchSheetProps) {
  const [tripKeywords, setTripKeywords] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [tripDays, setTripDays] = useState('');
  const [tripLengthType, setTripLengthType] = useState<'duration' | 'dates'>('duration');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetType, setBudgetType] = useState<'estimate' | 'actual'>('estimate');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [budgetScope, setBudgetScope] = useState<'person' | 'total'>('person');
  const [priceRating, setPriceRating] = useState<number | null>(null);

  // Expanded sections
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [tripLengthExpanded, setTripLengthExpanded] = useState(false);
  const [budgetExpanded, setBudgetExpanded] = useState(false);

  const handleSearch = () => {
    onSearch({
      tripKeywords,
      selectedFilters: [], // No experience filters for trip search
      numberOfPeople,
      tripDays,
      tripLengthType,
      startDate,
      endDate,
      budgetType,
      minBudget,
      maxBudget,
      budgetScope,
      priceRating,
    });
    onClose();
  };

  const hasAnyFilters = tripKeywords || numberOfPeople || tripDays || startDate || endDate || minBudget || maxBudget || priceRating !== null;

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-4">
          {/* Keyword Search Section */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold">Search Trips</h2>
                  <p className="text-xs text-gray-600">Find specific experiences</p>
                </div>
              </div>
              <Input
                type="text"
                placeholder="Safari, Mt. Everest, F1 Race..."
                value={tripKeywords}
                onChange={(e) => setTripKeywords(e.target.value)}
                className="w-full"
              />
            </div>
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
          className="w-full h-12 bg-amber-600 hover:bg-amber-700"
          size="lg"
          disabled={!hasAnyFilters}
        >
          <Compass className="w-5 h-5 mr-2" />
          Search Trips
          {tripKeywords && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
              •
            </span>
          )}
        </Button>
        {!hasAnyFilters && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Enter keywords or select filters to search
          </p>
        )}
      </div>
    </div>
  );
}
