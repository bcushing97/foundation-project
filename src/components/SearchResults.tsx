import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Calendar, DollarSign, ChevronDown, User, UserCircle, Settings, HelpCircle, LogOut, Sparkles, Bell, Briefcase, SlidersHorizontal, X, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { SignUpDialog } from './SignUpDialog';
import { LoginDialog } from './LoginDialog';
import { PlaceSettingIcon } from './PlaceSettingIcon';
import { DestinationDetails } from './DestinationDetails';
import { AppHeader } from './AppHeader';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { savedTrips, type SavedTrip } from '../data/savedTrips';
import { TripResultCard } from './TripResultCard';

interface SearchResultsProps {
  searchType: 'location' | 'experience' | 'trip';
  searchQuery?: string;
  experienceFilters?: string[];
  experienceKeywords?: string;
  numberOfPeople?: string;
  tripDays?: string;
  tripLengthType?: 'duration' | 'dates';
  startDate?: string;
  endDate?: string;
  budgetType?: 'estimate' | 'actual';
  minBudget?: string;
  maxBudget?: string;
  budgetScope?: 'person' | 'total';
  priceRating?: number[];
  onBack: () => void;
  onSearchLocation?: (location: string) => void;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    savedActivityIds?: string[];
  };
  following?: string[];
  onLogout?: () => void;
  onViewProfile?: () => void;
  onMockLogin?: () => void;
  onGoToMyTrips?: () => void;
  onGoToNotifications?: () => void;
  onGoToSettings?: () => void;
  onGoToHelp?: () => void;
  onViewTripDetails?: (tripId: string) => void;
  onCreateTrip?: (destination: { id: string; name: string; country: string }) => void;
  onAddToTrip?: (destination: { id: string; name: string; country: string }) => void;
  notificationCount?: number;
  isLoggedIn?: boolean;
  draftTrips?: Array<{
    id: string;
    name: string;
    destinations: Array<{
      id: string;
      name: string;
      country: string;
    }>;
    createdAt: Date;
  }>;
  savedDestinationIds?: string[];
  onToggleSaveDestination?: (destinationId: string) => void;
  onToggleSaveActivity?: (activityId: string) => void;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image: string;
  attributes: string[];
  priceLevel: number; // 1-5 for $-$$$$$
  visitedBy: string[]; // Names of people who visited
}

const allExperienceTypes = [
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

// Activities organized by category
const activitiesByCategory = {
  'Water Activities': ['Snorkeling', 'Scuba Diving', 'Surfing', 'Kayaking'],
  'Adventure': ['Hiking', 'Zip-lining', 'Rock Climbing', 'ATV Tours'],
  'Cultural': ['Museum Visits', 'Historical Sites', 'Local Markets', 'Cooking Classes'],
  'Food & Wellness': ['Wine Tasting', 'Food Tours', 'Spa & Wellness']
};

// Flatten all activities for filtering
const allActivities = Object.values(activitiesByCategory).flat();

// Array of diverse images to use for destinations
const destinationImages = [
  'https://images.unsplash.com/photo-1660315250109-075f6b142ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzYyNzg2MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjI4MDMwODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1595273647789-54432cefc8e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHVyYmFufGVufDF8fHx8MTc2Mjc1MDU0MXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1614935981447-893ce3858657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzdW5zZXR8ZW58MXx8fHwxNzYyNzIyMDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1659431245880-4e9ad1225f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXNoJTIwcmFpbmZvcmVzdHxlbnwxfHx8fDE3NjI4MjE4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1722076726490-e6345a1f4a63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjI3NjM4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1724708561020-b9a43a3d01b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwdG93biUyMGhhcmJvcnxlbnwxfHx8fDE3NjI4MjE4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1759522964115-12ddcbc740ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5c2lkZSUyMHZpbGxhZ2V8ZW58MXx8fHwxNzYyODAxNzExfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1605592344285-eb223e1b964b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc2MjgwMDc1NXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1616172539435-39cb19fd53eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbmQlMjBvY2VhbnxlbnwxfHx8fDE3NjI4MjE4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1704384225586-af794de8d9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93eSUyMHBlYWtzJTIwd2ludGVyfGVufDF8fHx8MTc2MjgyMTg1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1694099164133-b7fe3dc09722?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMG1hcmtldHxlbnwxfHx8fDE3NjI4MjE4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1569930784237-e6d6e31babd0?w=800',
  'https://images.unsplash.com/photo-1621277224630-81d9af65ede4?w=800',
  'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
  'https://images.unsplash.com/photo-1518659526054-e98c2ce0da0f?w=800',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
  'https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=800',
  'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800',
];

// Helper function to get a consistent image for a destination based on its id
const getDestinationImage = (id: string): string => {
  const index = parseInt(id) % destinationImages.length;
  return destinationImages[index];
};

// Mock destination data with attributes
const destinations: Destination[] = [
  {
    id: '1',
    name: 'Manuel Antonio',
    country: 'Costa Rica',
    region: 'Central America',
    description: 'Beautiful beaches, rainforest, and wildlife',
    image: getDestinationImage('1'),
    attributes: ['Beach & Coast', 'Wildlife & Nature', 'Wellness & Retreat', 'Family Friendly'],
    priceLevel: 3,
    visitedBy: ['Bryce', 'Cayman', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Noah', 'Ava', 'Liam', 'Sophia', 'Mason', 'Isabella', 'Logan', 'Mia']
  },
  {
    id: '2',
    name: 'Tamarindo',
    country: 'Costa Rica',
    region: 'Central America',
    description: 'Surfing paradise with vibrant nightlife',
    image: getDestinationImage('2'),
    attributes: ['Beach & Coast', 'Party & Nightlife', 'Budget & Backpacker'],
    priceLevel: 2,
    visitedBy: ['Cayman', 'Alex', 'Jordan', 'Taylor', 'Riley', 'Morgan', 'Casey', 'Blake']
  },
  {
    id: '3',
    name: 'Arenal',
    country: 'Costa Rica',
    region: 'Central America',
    description: 'Volcano views and hot springs',
    image: getDestinationImage('3'),
    attributes: ['Mountains & Valleys', 'Wildlife & Nature', 'Wellness & Retreat', 'Family Friendly', 'Romantic Getaway'],
    priceLevel: 3,
    visitedBy: ['Bryce', 'Emma', 'James', 'Sophia', 'Noah']
  },
  {
    id: '4',
    name: 'Monteverde',
    country: 'Costa Rica',
    region: 'Central America',
    description: 'Cloud forest and canopy tours',
    image: getDestinationImage('4'),
    attributes: ['Mountains & Valleys', 'Wildlife & Nature', 'Family Friendly', 'Remote & Off-Grid'],
    priceLevel: 3,
    visitedBy: ['Sarah', 'Michael', 'Olivia']
  },
  {
    id: '5',
    name: 'Mexico City',
    country: 'Mexico',
    region: 'Central America',
    description: 'Rich history, culture, and cuisine',
    image: getDestinationImage('5'),
    attributes: ['Urban & City', 'Cultural Immersion', 'Party & Nightlife', 'Budget & Backpacker'],
    priceLevel: 2,
    visitedBy: ['Alex', 'Jordan', 'Taylor']
  },
  {
    id: '6',
    name: 'Tulum',
    country: 'Mexico',
    region: 'Central America',
    description: 'Ancient ruins meet pristine beaches',
    image: getDestinationImage('6'),
    attributes: ['Beach & Coast', 'Cultural Immersion', 'Wellness & Retreat', 'Luxury & High-End', 'Romantic Getaway'],
    priceLevel: 4,
    visitedBy: ['Bryce', 'Cayman', 'Emma', 'Ava', 'Liam', 'Isabella']
  },
  {
    id: '7',
    name: 'Playa del Carmen',
    country: 'Mexico',
    region: 'Central America',
    description: 'Beach resort town with great diving',
    image: getDestinationImage('7'),
    attributes: ['Beach & Coast', 'Party & Nightlife', 'Family Friendly', 'Luxury & High-End'],
    priceLevel: 3,
    visitedBy: ['Riley', 'Morgan', 'Casey', 'Blake', 'Quinn']
  },
  {
    id: '8',
    name: 'Antigua',
    country: 'Guatemala',
    region: 'Central America',
    description: 'Colonial architecture and volcano hikes',
    image: getDestinationImage('8'),
    attributes: ['Urban & City', 'Cultural Immersion', 'Mountains & Valleys', 'Budget & Backpacker'],
    priceLevel: 1,
    visitedBy: ['James', 'Sophia']
  },
  {
    id: '9',
    name: 'Roatán',
    country: 'Honduras',
    region: 'Central America',
    description: 'Caribbean island with world-class diving',
    image: getDestinationImage('9'),
    attributes: ['Beach & Coast', 'Wildlife & Nature', 'Wellness & Retreat', 'Remote & Off-Grid'],
    priceLevel: 2,
    visitedBy: ['Cayman', 'Noah', 'Mason', 'Logan']
  },
  {
    id: '10',
    name: 'Panama City',
    country: 'Panama',
    region: 'Central America',
    description: 'Modern metropolis with historic charm',
    image: getDestinationImage('10'),
    attributes: ['Urban & City', 'Cultural Immersion', 'Party & Nightlife', 'Luxury & High-End'],
    priceLevel: 3,
    visitedBy: ['Alex', 'Taylor']
  },
  {
    id: '11',
    name: 'Bocas del Toro',
    country: 'Panama',
    region: 'Central America',
    description: 'Caribbean archipelago paradise',
    image: getDestinationImage('11'),
    attributes: ['Beach & Coast', 'Wildlife & Nature', 'Budget & Backpacker', 'Party & Nightlife'],
    priceLevel: 2,
    visitedBy: ['Bryce', 'Sarah', 'Michael', 'Olivia', 'Emma']
  },
  {
    id: '12',
    name: 'San Juan del Sur',
    country: 'Nicaragua',
    region: 'Central America',
    description: 'Surfing and beach town vibes',
    image: getDestinationImage('12'),
    attributes: ['Beach & Coast', 'Budget & Backpacker', 'Party & Nightlife'],
    priceLevel: 1,
    visitedBy: ['Jordan', 'Riley', 'Casey']
  }
];

// Comprehensive location suggestions list
const locationSuggestions = [
  'Costa Rica',
  'Mexico',
  'Guatemala',
  'Panama',
  'Nicaragua',
  'Honduras',
  'Manuel Antonio, Costa Rica',
  'Tamarindo, Costa Rica',
  'Arenal, Costa Rica',
  'Monteverde, Costa Rica',
  'Mexico City, Mexico',
  'Tulum, Mexico',
  'Playa del Carmen, Mexico',
  'Cancun, Mexico',
  'Puerto Vallarta, Mexico',
  'Oaxaca, Mexico',
  'San Miguel de Allende, Mexico',
  'Cabo San Lucas, Mexico',
  'Antigua, Guatemala',
  'Lake Atitlan, Guatemala',
  'Panama City, Panama',
  'Bocas del Toro, Panama',
  'San Juan del Sur, Nicaragua',
  'Granada, Nicaragua',
  'Roatán, Honduras',
  'Belize',
  'Belize City, Belize',
  'San Pedro, Belize',
  'Caye Caulker, Belize',
  'Central America',
  'Caribbean',
  'Latin America'
];

export function SearchResults({ searchType, searchQuery, experienceFilters, experienceKeywords, numberOfPeople, tripDays, budgetType, minBudget, maxBudget, budgetScope, priceRating, onBack, onSearchLocation, user, following, onLogout, onViewProfile, onMockLogin, onGoToMyTrips, onGoToNotifications, onGoToSettings, onGoToHelp, onViewTripDetails, onCreateTrip, onAddToTrip, notificationCount, isLoggedIn, draftTrips, savedDestinationIds = [], onToggleSaveDestination, onToggleSaveActivity }: SearchResultsProps) {
  // Applied filters (used for actual filtering)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(experienceFilters || []);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>(priceRating || []);
  const [appliedNumberOfPeople, setAppliedNumberOfPeople] = useState(numberOfPeople || '');
  const [appliedTripDays, setAppliedTripDays] = useState(tripDays || '');
  const [appliedBudgetType, setAppliedBudgetType] = useState<'estimate' | 'actual'>(budgetType || 'estimate');
  const [appliedMinBudget, setAppliedMinBudget] = useState(minBudget || '');
  const [appliedMaxBudget, setAppliedMaxBudget] = useState(maxBudget || '');
  const [appliedBudgetScope, setAppliedBudgetScope] = useState<'person' | 'total'>(budgetScope || 'total');
  
  // Staged filters (modified by UI, applied on button click)
  const [stagedFilters, setStagedFilters] = useState<string[]>(experienceFilters || []);
  const [stagedPriceRanges, setStagedPriceRanges] = useState<number[]>(priceRating || []);
  const [stagedNumberOfPeople, setStagedNumberOfPeople] = useState(numberOfPeople || '');
  const [stagedTripDays, setStagedTripDays] = useState(tripDays || '');
  const [stagedBudgetType, setStagedBudgetType] = useState<'estimate' | 'actual'>(budgetType || 'estimate');
  const [stagedMinBudget, setStagedMinBudget] = useState(minBudget || '');
  const [stagedMaxBudget, setStagedMaxBudget] = useState(maxBudget || '');
  const [stagedBudgetScope, setStagedBudgetScope] = useState<'person' | 'total'>(budgetScope || 'total');
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Only set searchExecuted to true if filters were actually provided
  const initialHasFilters = (experienceFilters && experienceFilters.length > 0) || (priceRating && priceRating.length > 0);
  const [searchExecuted, setSearchExecuted] = useState(initialHasFilters);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [editingLocation, setEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(searchQuery || '');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [stagedActivities, setStagedActivities] = useState<string[]>([]);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get filtered location suggestions
  const getLocationSuggestions = () => {
    if (!tempLocation || tempLocation.length === 0) {
      // Don't show suggestions when empty
      return [];
    }
    const filtered = locationSuggestions.filter(loc =>
      loc.toLowerCase().includes(tempLocation.toLowerCase())
    );
    // Always return at least 4 suggestions, pad with top suggestions if needed
    if (filtered.length < 4) {
      const additionalSuggestions = locationSuggestions
        .filter(loc => !filtered.includes(loc))
        .slice(0, 4 - filtered.length);
      return [...filtered, ...additionalSuggestions];
    }
    return filtered.slice(0, 6);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    if (onSearchLocation) {
      onSearchLocation(suggestion);
    }
    setEditingLocation(false);
    setTempLocation(suggestion);
  };

  const toggleFilter = (filter: string) => {
    setStagedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleActivity = (activity: string) => {
    setStagedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const togglePriceRange = (price: number) => {
    setStagedPriceRanges(prev =>
      prev.includes(price)
        ? prev.filter(p => p !== price)
        : [...prev, price]
    );
  };
  
  const applyFilters = () => {
    setSelectedFilters(stagedFilters);
    setSelectedPriceRanges(stagedPriceRanges);
    setAppliedNumberOfPeople(stagedNumberOfPeople);
    setAppliedTripDays(stagedTripDays);
    setAppliedBudgetType(stagedBudgetType);
    setAppliedMinBudget(stagedMinBudget);
    setAppliedMaxBudget(stagedMaxBudget);
    setAppliedBudgetScope(stagedBudgetScope);
    setSearchExecuted(true);
    setFiltersOpen(false);
  };
  
  const clearAllFilters = () => {
    setStagedFilters([]);
    setStagedPriceRanges([]);
    setStagedNumberOfPeople('');
    setStagedTripDays('');
    setStagedBudgetType('estimate');
    setStagedMinBudget('');
    setStagedMaxBudget('');
    setStagedBudgetScope('total');
    setSelectedFilters([]);
    setSelectedPriceRanges([]);
    setAppliedNumberOfPeople('');
    setAppliedTripDays('');
    setAppliedBudgetType('estimate');
    setAppliedMinBudget('');
    setAppliedMaxBudget('');
    setAppliedBudgetScope('total');
    setSearchExecuted(false);
  };

  // Calculate match percentage for each destination
  const calculateMatch = (destination: Destination): number => {
    if (selectedFilters.length === 0 && selectedPriceRanges.length === 0) {
      return 100; // No filters = all match equally
    }

    let matchCount = 0;
    let totalCriteria = 0;

    // Check experience filters
    if (selectedFilters.length > 0) {
      totalCriteria += selectedFilters.length;
      const matchingFilters = selectedFilters.filter(filter => 
        destination.attributes.includes(filter)
      );
      matchCount += matchingFilters.length;
    }

    // Check price range
    if (selectedPriceRanges.length > 0) {
      totalCriteria += 1;
      if (selectedPriceRanges.includes(destination.priceLevel)) {
        matchCount += 1;
      }
    }

    return totalCriteria > 0 ? Math.round((matchCount / totalCriteria) * 100) : 100;
  };

  // Filter destinations based on search query and calculate matches
  const filteredDestinations = destinations
    .filter(dest => {
      // For location search
      if (searchType === 'location') {
        // If searchQuery is empty or undefined, show all (for popular destinations)
        if (!searchQuery) {
          return true;
        }
        const searchLower = searchQuery.toLowerCase();
        return (
          dest.name.toLowerCase().includes(searchLower) ||
          dest.country.toLowerCase().includes(searchLower) ||
          dest.region.toLowerCase().includes(searchLower)
        );
      }
      
      // For experience search with keywords
      if (searchType === 'experience' && experienceKeywords && experienceKeywords.trim()) {
        const keywordsLower = experienceKeywords.toLowerCase();
        const keywords = keywordsLower.split(/[\s,]+/).filter(k => k.length > 0);
        
        return keywords.some(keyword => 
          dest.name.toLowerCase().includes(keyword) ||
          dest.country.toLowerCase().includes(keyword) ||
          dest.region.toLowerCase().includes(keyword) ||
          dest.description.toLowerCase().includes(keyword) ||
          dest.attributes.some(attr => attr.toLowerCase().includes(keyword))
        );
      }
      
      // For experience search without keywords, show all
      return true;
    })
    .map(dest => ({
      ...dest,
      matchPercentage: calculateMatch(dest)
    }));

  // Only sort by match percentage if search has been executed
  // For popular destinations (empty query), sort by number of visitors
  const displayedDestinations = searchExecuted 
    ? !searchQuery 
      ? [...filteredDestinations].sort((a, b) => b.visitedBy.length - a.visitedBy.length) // Sort by popularity
      : [...filteredDestinations].sort((a, b) => b.matchPercentage - a.matchPercentage) // Sort by match
    : filteredDestinations;

  const hasActiveFilters = selectedFilters.length > 0 || selectedPriceRanges.length > 0;

  // Calculate match percentage for trips
  const calculateTripMatch = (trip: SavedTrip): number => {
    let matchCount = 0;
    let totalCriteria = 0;

    // Check keywords match
    if (experienceKeywords && experienceKeywords.trim()) {
      const keywordsLower = experienceKeywords.toLowerCase();
      const keywords = keywordsLower.split(/[\s,]+/).filter(k => k.length > 0);
      
      totalCriteria += keywords.length;
      
      keywords.forEach(keyword => {
        const matches = (
          trip.title.toLowerCase().includes(keyword) ||
          trip.description.toLowerCase().includes(keyword) ||
          trip.destinations.some(dest => dest.name.toLowerCase().includes(keyword)) ||
          trip.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          trip.highlights.some(h => h.toLowerCase().includes(keyword))
        );
        if (matches) matchCount++;
      });
    }

    // Check price range
    if (selectedPriceRanges.length > 0) {
      totalCriteria += 1;
      if (selectedPriceRanges.includes(trip.priceLevel)) {
        matchCount += 1;
      }
    }

    // Check trip duration
    if (appliedTripDays && appliedTripDays.trim()) {
      totalCriteria += 1;
      const requestedDays = parseInt(appliedTripDays);
      if (!isNaN(requestedDays)) {
        // Match if trip is within ±2 days of requested duration
        if (Math.abs(trip.duration - requestedDays) <= 2) {
          matchCount += 1;
        }
      }
    }

    // Check budget
    if (appliedMinBudget || appliedMaxBudget) {
      totalCriteria += 1;
      const min = appliedMinBudget ? parseFloat(appliedMinBudget) : 0;
      const max = appliedMaxBudget ? parseFloat(appliedMaxBudget) : Infinity;
      
      if (trip.budget >= min && trip.budget <= max) {
        matchCount += 1;
      }
    }

    return totalCriteria > 0 ? Math.round((matchCount / totalCriteria) * 100) : 100;
  };

  // Filter and process trips
  const filteredTrips = savedTrips
    .map(trip => ({
      ...trip,
      matchPercentage: calculateTripMatch(trip),
      visitedByFriends: user && following 
        ? trip.visitedByFriends?.filter(friend => following.includes(friend)) || []
        : []
    }))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Helper function to format visitor names
  const getVisitorText = (visitedBy: string[]): string | null => {
    // Only show friend badges if user is logged in
    if (!user || !following || following.length === 0 || visitedBy.length === 0) return null;
    
    const friendsWhoVisited = visitedBy.filter(name => following.includes(name));
    if (friendsWhoVisited.length === 0) return null;

    if (friendsWhoVisited.length === 1) {
      return `${friendsWhoVisited[0]} visited`;
    } else if (friendsWhoVisited.length === 2) {
      return `${friendsWhoVisited[0]} & ${friendsWhoVisited[1]} visited`;
    } else {
      const others = friendsWhoVisited.length - 2;
      return `${friendsWhoVisited[0]}, ${friendsWhoVisited[1]} & ${others} other${others > 1 ? 's' : ''} visited`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dialogs */}
      <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={onMockLogin} />

      {/* Destination Details Modal */}
      {selectedDestination && (
        <DestinationDetails
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          following={following}
          selectedFilters={selectedFilters}
          onViewTripDetails={(tripId) => {
            setSelectedDestination(null);
            if (onViewTripDetails) {
              onViewTripDetails(tripId);
            }
          }}
          onCreateTrip={onCreateTrip}
          onAddToTrip={onAddToTrip}
          draftTrips={draftTrips}
          isLoggedIn={isLoggedIn}
          onLoginRequired={() => setLoginOpen(true)}
          isSaved={savedDestinationIds.includes(selectedDestination.id)}
          onToggleSave={onToggleSaveDestination}
          savedActivityIds={user?.savedActivityIds || []}
          onToggleSaveActivity={onToggleSaveActivity}
        />
      )}

      {/* Test Login Button */}
      {!user && onMockLogin && (
        <Button 
          onClick={onMockLogin}
          className="fixed top-20 left-6 z-20"
          variant="outline"
        >
          Test Login
        </Button>
      )}

      {/* Header - Desktop only */}
      <div className="hidden md:block">
        <AppHeader
          user={user || null}
          isLoggedIn={!!user}
          onGoHome={onBack}
          onViewProfile={onViewProfile || (() => {})}
          onGoToMyTrips={onGoToMyTrips}
          onGoToNotifications={onGoToNotifications}
          onGoToSettings={onGoToSettings}
          onGoToHelp={onGoToHelp}
          onSignOut={onLogout || (() => {})}
          onOpenLogin={() => setLoginOpen(true)}
          onOpenSignUp={() => setSignUpOpen(true)}
          notificationCount={notificationCount || 0}
        />
      </div>

      {/* Mobile Location Bubble - Only show for location search */}
      {searchType === 'location' && (
        <div className="md:hidden pt-4 px-4 pb-2 flex justify-center relative">
          {!editingLocation ? (
            <button
              onClick={() => {
                setTempLocation(''); // Clear the input when opening
                setEditingLocation(true);
              }}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200 max-w-[90vw]"
            >
              <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm truncate">
                {searchQuery ? `Showing destinations in ${searchQuery}` : 'Showing popular destinations'}
              </span>
            </button>
          ) : (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 w-full max-w-md z-50">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <Input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  placeholder="Enter location..."
                  className="flex-1 h-9"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    // Update search and close
                    if (onSearchLocation) {
                      onSearchLocation(tempLocation);
                    }
                    setEditingLocation(false);
                  }}
                  className="flex-1"
                >
                  Search
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTempLocation(searchQuery || '');
                    setEditingLocation(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            {getLocationSuggestions().length > 0 && (
              <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto z-50 overflow-hidden">
                <ul className="max-h-60 overflow-y-auto scrollbar-hide">
                  {getLocationSuggestions().map(suggestion => (
                    <li 
                      key={suggestion} 
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors" 
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Greeting and Filter Prompt */}
        <div className="mb-6">
          {user && (
            <p className="text-xl mb-2">
              Hey {user.firstName}! Ready to explore?
            </p>
          )}
          <p className="text-gray-600">
            {hasActiveFilters 
              ? `Showing ${filteredDestinations.length} destinations ranked by match`
              : 'Add filters below to find destinations that match your preferences'
            }
          </p>
        </div>

        {/* Filters Section */}
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <Button
            onClick={() => setFiltersOpen(true)}
            variant="outline"
            className="w-full h-12 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge variant="default" className="h-6 min-w-[1.5rem] flex items-center justify-center px-2">
                  {selectedFilters.length + selectedPriceRanges.length}
                </Badge>
              )}
            </div>
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop Filter Collapsible - Keep existing for desktop */}
        <div className="hidden md:block">
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="mb-8">
            <Card className="bg-white">
              <CollapsibleTrigger className="w-full">
                <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl mb-1">Refine Your Search</h2>
                      <p className="text-sm text-gray-600">
                        {hasActiveFilters 
                          ? `${selectedFilters.length} experience${selectedFilters.length !== 1 ? 's' : ''} ${selectedPriceRanges.length > 0 ? `• ${selectedPriceRanges.length} price range${selectedPriceRanges.length !== 1 ? 's' : ''}` : ''}`
                          : 'Add filters to find your perfect destination'
                        }
                      </p>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-6">
                  <Separator />
                  
                  {/* Experience Filters */}
                  <div>
                    <Label className="text-base mb-3 block">What experiences are you looking for?</Label>
                    <div className="flex flex-wrap gap-2">
                      {(showAllExperiences ? allExperienceTypes : allExperienceTypes.slice(0, 6)).map((filter) => (
                        <Badge
                          key={filter}
                          variant={stagedFilters.includes(filter) ? "default" : "outline"}
                          className="cursor-pointer px-4 py-2 text-sm hover:shadow-md transition-all"
                          onClick={() => toggleFilter(filter)}
                        >
                          {filter}
                        </Badge>
                      ))}
                    </div>
                    {!showAllExperiences ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllExperiences(true)}
                        className="mt-3 text-sm"
                      >
                        Show More
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllExperiences(false)}
                        className="mt-3 text-sm"
                      >
                        Show Less
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Activities Filters */}
                  <div>
                    <Label className="text-base mb-3 block">What activities interest you?</Label>
                    <div className="space-y-4">
                      {Object.entries(activitiesByCategory)
                        .slice(0, showAllActivities ? undefined : 2)
                        .map(([category, activities]) => (
                          <div key={category}>
                            <p className="text-sm text-gray-600 mb-2">{category}</p>
                            <div className="flex flex-wrap gap-2">
                              {activities.map((activity) => (
                                <Badge
                                  key={activity}
                                  variant={stagedActivities.includes(activity) ? "default" : "outline"}
                                  className="cursor-pointer px-4 py-2 text-sm hover:shadow-md transition-all"
                                  onClick={() => toggleActivity(activity)}
                                >
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    {!showAllActivities ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllActivities(true)}
                        className="mt-3 text-sm"
                      >
                        Show More
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllActivities(false)}
                        className="mt-3 text-sm"
                      >
                        Show Less
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Number of People and Length of Trip */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numberOfPeople" className="text-base mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Number of People
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const current = parseInt(stagedNumberOfPeople) || 1;
                            if (current > 1) setStagedNumberOfPeople(String(current - 1));
                          }}
                          disabled={!stagedNumberOfPeople || parseInt(stagedNumberOfPeople) <= 1}
                          className="h-12 w-12 rounded-full"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-3xl font-semibold text-gray-900">
                            {stagedNumberOfPeople || '0'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {stagedNumberOfPeople === '1' ? 'person' : 'people'}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const current = parseInt(stagedNumberOfPeople) || 0;
                            setStagedNumberOfPeople(String(current + 1));
                          }}
                          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tripDays" className="text-base mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Length of Trip
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const current = parseInt(stagedTripDays) || 1;
                            if (current > 1) setStagedTripDays(String(current - 1));
                          }}
                          disabled={!stagedTripDays || parseInt(stagedTripDays) <= 1}
                          className="h-12 w-12 rounded-full"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-3xl font-semibold text-gray-900">
                            {stagedTripDays || '0'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {stagedTripDays === '1' ? 'day' : 'days'}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const current = parseInt(stagedTripDays) || 0;
                            setStagedTripDays(String(current + 1));
                          }}
                          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Budget */}
                  <div>
                    <Label className="text-base mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Budget
                    </Label>
                    
                    {/* Toggle between estimate and actual */}
                    <div className="flex gap-2 mb-4">
                      <Button
                        type="button"
                        variant={stagedBudgetType === 'estimate' ? 'default' : 'outline'}
                        onClick={() => setStagedBudgetType('estimate')}
                        className="flex-1"
                      >
                        Price Range
                      </Button>
                      <Button
                        type="button"
                        variant={stagedBudgetType === 'actual' ? 'default' : 'outline'}
                        onClick={() => setStagedBudgetType('actual')}
                        className="flex-1"
                      >
                        Exact Budget
                      </Button>
                    </div>

                    {stagedBudgetType === 'actual' ? (
                      <div className="grid grid-cols-3 gap-3 items-end">
                        <div>
                          <Label htmlFor="minBudget" className="text-sm text-gray-600 mb-2 block">
                            Min
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="minBudget"
                              type="number"
                              min="0"
                              placeholder="0"
                              value={stagedMinBudget}
                              onChange={(e) => setStagedMinBudget(e.target.value)}
                              className="h-12 pl-9"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="maxBudget" className="text-sm text-gray-600 mb-2 block">
                            Max
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="maxBudget"
                              type="number"
                              min="0"
                              placeholder="0"
                              value={stagedMaxBudget}
                              onChange={(e) => setStagedMaxBudget(e.target.value)}
                              className="h-12 pl-9"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge
                            variant={stagedBudgetScope === 'person' ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                            onClick={() => setStagedBudgetScope('person')}
                          >
                            Per person
                          </Badge>
                          <Badge
                            variant={stagedBudgetScope === 'total' ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                            onClick={() => setStagedBudgetScope('total')}
                          >
                            Total
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label className="text-sm text-gray-600 mb-3 block">
                          Select your price range
                        </Label>
                        <div className="flex gap-2 justify-center">
                          {[1, 2, 3, 4, 5].map((price) => (
                            <Button
                              key={price}
                              type="button"
                              size="sm"
                              variant={stagedPriceRanges.includes(price) ? 'default' : 'outline'}
                              onClick={() => togglePriceRange(price)}
                              className="flex-1 h-12 text-sm"
                            >
                              {'$'.repeat(price)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {(stagedFilters.length > 0 || stagedPriceRanges.length > 0) && (
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                      <Button 
                        onClick={applyFilters}
                      >
                        Apply Filters & Search
                      </Button>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col md:hidden rounded-t-3xl">
            <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription className="sr-only">
                    Refine your search with experiences, activities, budget and more
                  </SheetDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltersOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
              {/* Experience Filters */}
              <div>
                <Label className="text-base mb-3 block">What experiences are you looking for?</Label>
                <div className="flex flex-wrap gap-2">
                  {(showAllExperiences ? allExperienceTypes : allExperienceTypes.slice(0, 6)).map((filter) => (
                    <Badge
                      key={filter}
                      variant={stagedFilters.includes(filter) ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 text-sm hover:shadow-md transition-all"
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
                {!showAllExperiences ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllExperiences(true)}
                    className="mt-3 text-sm"
                  >
                    Show More
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllExperiences(false)}
                    className="mt-3 text-sm"
                  >
                    Show Less
                  </Button>
                )}
              </div>

              <Separator />

              {/* Activities Filters */}
              <div>
                <Label className="text-base mb-3 block">What activities interest you?</Label>
                <div className="space-y-4">
                  {Object.entries(activitiesByCategory)
                    .slice(0, showAllActivities ? undefined : 2)
                    .map(([category, activities]) => (
                      <div key={category}>
                        <p className="text-sm text-gray-600 mb-2">{category}</p>
                        <div className="flex flex-wrap gap-2">
                          {activities.map((activity) => (
                            <Badge
                              key={activity}
                              variant={stagedActivities.includes(activity) ? "default" : "outline"}
                              className="cursor-pointer px-4 py-2 text-sm hover:shadow-md transition-all"
                              onClick={() => toggleActivity(activity)}
                            >
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
                {!showAllActivities ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllActivities(true)}
                    className="mt-3 text-sm"
                  >
                    Show More
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllActivities(false)}
                    className="mt-3 text-sm"
                  >
                    Show Less
                  </Button>
                )}
              </div>

              <Separator />

              {/* Number of People and Length of Trip */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="numberOfPeopleMobile" className="text-base mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Number of People
                  </Label>
                  <Input
                    id="numberOfPeopleMobile"
                    type="number"
                    min="1"
                    placeholder="How many?"
                    value={stagedNumberOfPeople}
                    onChange={(e) => setStagedNumberOfPeople(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="tripDaysMobile" className="text-base mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Length of Trip
                  </Label>
                  <Input
                    id="tripDaysMobile"
                    type="number"
                    min="1"
                    placeholder="Days"
                    value={stagedTripDays}
                    onChange={(e) => setStagedTripDays(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <Separator />

              {/* Budget */}
              <div>
                <Label className="text-base mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Budget
                </Label>
                
                {/* Toggle between estimate and actual */}
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={stagedBudgetType === 'estimate' ? 'default' : 'outline'}
                    onClick={() => setStagedBudgetType('estimate')}
                    className="flex-1"
                  >
                    Price Range
                  </Button>
                  <Button
                    type="button"
                    variant={stagedBudgetType === 'actual' ? 'default' : 'outline'}
                    onClick={() => setStagedBudgetType('actual')}
                    className="flex-1"
                  >
                    Exact Budget
                  </Button>
                </div>

                {stagedBudgetType === 'actual' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="minBudgetMobile" className="text-sm text-gray-600 mb-2 block">
                          Min
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="minBudgetMobile"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={stagedMinBudget}
                            onChange={(e) => setStagedMinBudget(e.target.value)}
                            className="h-12 pl-9"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="maxBudgetMobile" className="text-sm text-gray-600 mb-2 block">
                          Max
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="maxBudgetMobile"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={stagedMaxBudget}
                            onChange={(e) => setStagedMaxBudget(e.target.value)}
                            className="h-12 pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge
                        variant={stagedBudgetScope === 'person' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                        onClick={() => setStagedBudgetScope('person')}
                      >
                        Per person
                      </Badge>
                      <Badge
                        variant={stagedBudgetScope === 'total' ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                        onClick={() => setStagedBudgetScope('total')}
                      >
                        Total
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label className="text-sm text-gray-600 mb-3 block">
                      Select your price range
                    </Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((price) => (
                        <Button
                          key={price}
                          type="button"
                          size="sm"
                          variant={stagedPriceRanges.includes(price) ? 'default' : 'outline'}
                          onClick={() => togglePriceRange(price)}
                          className="flex-1 h-12 text-sm"
                        >
                          {'$'.repeat(price)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add padding at bottom to ensure content doesn't get hidden behind sticky footer */}
              <div className="h-24" />
            </div>

            {/* Sticky Footer with Apply Button */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 space-y-3">
              {(stagedFilters.length > 0 || stagedPriceRanges.length > 0) && (
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
              <Button 
                onClick={applyFilters}
                className="w-full h-12"
              >
                Apply Filters & Search
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Results Grid */}
        {searchType === 'trip' ? (
          // Trip search results
          filteredTrips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <TripResultCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => onViewTripDetails(trip.id)}
                  visitedByFriends={trip.visitedByFriends}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-2">No trips found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )
        ) : !searchExecuted ? (
          // Initial state or filters selected but not executed - show all results unranked
          filteredDestinations.length > 0 ? (
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((destination) => (
                  <Card 
                    key={destination.id} 
                    className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {getVisitorText(destination.visitedBy) && (
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                          <p className="text-xs text-gray-700">
                            {getVisitorText(destination.visitedBy)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl mb-1">{destination.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{destination.country}</p>
                      <p className="text-sm text-gray-700 mb-4">{destination.description}</p>
                      
                      {/* Attributes */}
                      <div className="flex flex-wrap gap-2">
                        {destination.attributes.slice(0, 3).map((attr) => (
                          <Badge 
                            key={attr} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {attr}
                          </Badge>
                        ))}
                        {destination.attributes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{destination.attributes.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-2">No destinations found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )
        ) : searchExecuted && displayedDestinations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDestinations.map((destination) => (
              <Card 
                key={destination.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => setSelectedDestination(destination)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {hasActiveFilters && (
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
                      <span className={`text-sm ${destination.matchPercentage >= 70 ? 'text-emerald-700' : destination.matchPercentage >= 40 ? 'text-amber-700' : 'text-slate-600'}`}>
                        {destination.matchPercentage}% match
                      </span>
                    </div>
                  )}
                  {getVisitorText(destination.visitedBy) && (
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                      <p className="text-xs text-gray-700">
                        {getVisitorText(destination.visitedBy)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{destination.country}</p>
                  <p className="text-sm text-gray-700 mb-4">{destination.description}</p>
                  
                  {/* Matching attributes */}
                  <div className="flex flex-wrap gap-2">
                    {destination.attributes.slice(0, 3).map((attr) => (
                      <Badge 
                        key={attr} 
                        variant="secondary" 
                        className={`text-xs ${selectedFilters.includes(attr) ? 'bg-blue-100 text-blue-700' : ''}`}
                      >
                        {attr}
                      </Badge>
                    ))}
                    {destination.attributes.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{destination.attributes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-2">No destinations found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}