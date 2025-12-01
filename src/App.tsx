import { useState } from 'react';
import { Search, MapPin, Sparkles, Calendar, Users, DollarSign, User as UserIcon, Users as UsersIcon, Flag, X } from 'lucide-react';
import { BackgroundSlideshow } from './components/BackgroundSlideshow';
import { SearchResults } from './components/SearchResults';
import { AppHeader } from './components/AppHeader';
import { ProfilePage } from './components/ProfilePage';
import { FriendProfilePage } from './components/FriendProfilePage';
import { NotificationsPage } from './components/NotificationsPage';
import { TripsPage } from './components/TripsPage';
import { TripDetailsPage } from './components/TripDetailsPage';
import { TripEditorPage } from './components/TripEditorPage';
import { TripBuilderPage } from './components/TripBuilderPage';
import { CreateTripDialog } from './components/CreateTripDialog';
import { AddToExistingTripDialog, type DraftTrip } from './components/AddToExistingTripDialog';
import { LoginDialog } from './components/LoginDialog';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileHomePage } from './components/MobileHomePage';
import { MobileLoginPage } from './components/MobileLoginPage';
import { MobileSignUpPage } from './components/MobileSignUpPage';
import { SavedPage } from './components/SavedPage';
import { DestinationDetails } from './components/DestinationDetails';
import { ActivityDetails } from './components/ActivityDetails';
import { destinationsDatabase } from './data/destinations';
import { getActivityById } from './data/activities';
import { SocialPage } from './components/SocialPage';
import { MyTripsPage } from './components/MyTripsPage';
import { SignUpDialog } from './components/SignUpDialog';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { worldDestinations } from './data/destinations';
import { savedTrips, type SavedTrip } from './data/savedTrips';
import type { User } from './data/users';

function PlaceSettingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a7 7 0 1 0 10 10" />
    </svg>
  );
}

interface TripInvitation {
  id: string;
  tripId: string;
  tripName: string;
  fromUser: {
    firstName: string;
    lastName: string;
  };
  invitedAt: Date;
  status: 'pending' | 'accepted' | 'declined';
  tripDetails?: {
    stops: string[];
    startDate?: Date;
  };
}

type SearchMode = 'location' | 'experience' | 'trip' | null;
type PageView = 'home' | 'search' | 'profile' | 'settings' | 'help' | 'trips' | 'notifications' | 'tripDetails' | 'tripEditor' | 'tripBuilder';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  savedDestinationIds?: string[];
  savedActivityIds?: string[];
}

const experienceFilters = [
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

export default function App() {
  const [searchMode, setSearchMode] = useState<SearchMode>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [tripKeywords, setTripKeywords] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [tripDays, setTripDays] = useState('');
  const [tripLengthType, setTripLengthType] = useState<'duration' | 'dates'>('duration');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetType, setBudgetType] = useState<'estimate' | 'actual'>('estimate');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [budgetScope, setBudgetScope] = useState<'person' | 'total'>('total');
  const [priceRating, setPriceRating] = useState<number[]>([]); // Changed from [2] to [] - start with no budget preset
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [user, setUser] = useState<User | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'location' | 'experience' | 'trip'>('location');
  const [viewingFriend, setViewingFriend] = useState<string | null>(null);
  const [tripInvitations, setTripInvitations] = useState<TripInvitation[]>([]);
  const [viewingTripId, setViewingTripId] = useState<string | null>(null);
  const [draftTrips, setDraftTrips] = useState<DraftTrip[]>([]);
  const [selectedDestinationForTrip, setSelectedDestinationForTrip] = useState<{ id: string; name: string; country: string } | null>(null);
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [addToTripOpen, setAddToTripOpen] = useState(false);
  const [profileInitialSection, setProfileInitialSection] = useState<'about' | 'trips' | 'friends' | 'settings' | 'help'>('about');
  const [mobileTab, setMobileTab] = useState<'home' | 'social' | 'trips' | 'saved' | 'profile'>('home');
  const [mobileAuthView, setMobileAuthView] = useState<'login' | 'signup' | null>(null);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [newTripName, setNewTripName] = useState('');
  const [selectedDestinationFromTrip, setSelectedDestinationFromTrip] = useState<any>(null);
  const [selectedActivityFromTrip, setSelectedActivityFromTrip] = useState<any>(null);
  const [viewingSavedTripId, setViewingSavedTripId] = useState<string | null>(null);

  // Mock user for testing - in real app this would come from login
  const mockLogin = () => {
    setUser({
      id: 'user-john-doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      // profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' // Uncomment to test with profile picture
    });
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const getInitials = (user: User) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const handleCreateTrip = (tripName: string, destination: { id: string; name: string; country: string }) => {
    const newTrip: DraftTrip = {
      id: `draft-${Date.now()}`,
      name: tripName,
      destinations: [{
        ...destination,
        // Add some sample saved items for demonstration
        savedActivities: [
          {
            id: 'act-1',
            name: 'Snorkeling Tour',
            type: 'Water Sports',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
            rating: 4.8,
            priceLevel: 2,
            estimatedCost: 75
          },
          {
            id: 'act-2',
            name: 'Beach Yoga Class',
            type: 'Wellness',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
            rating: 4.9,
            priceLevel: 1,
            estimatedCost: 35
          }
        ],
        savedRestaurants: [
          {
            id: 'rest-1',
            name: 'Ocean View Cafe',
            cuisine: 'Seafood',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
            rating: 4.7,
            priceLevel: 3,
            estimatedCost: 120
          }
        ],
        savedHotels: [
          {
            id: 'hotel-1',
            name: 'Beachfront Resort',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            rating: 4.6,
            priceLevel: 4,
            estimatedCost: 250,
            nights: 3
          }
        ]
      }],
      createdAt: new Date(),
      totalBudget: 5000,
      flights: [
        {
          id: 'flight-1',
          from: 'New York',
          to: destination.name,
          cost: 450
        }
      ]
    };
    setDraftTrips(prev => [...prev, newTrip]);
    setCreateTripOpen(false);
    setSelectedDestinationForTrip(null);
    
    // Redirect to trip editor page
    setEditingTripId(newTrip.id);
    setCurrentPage('tripEditor');
  };

  const handleAddDestinationToTrip = (tripId: string) => {
    if (!selectedDestinationForTrip) return;
    
    setDraftTrips(prev => prev.map(trip => {
      if (trip.id === tripId && !trip.destinations.some(d => d.id === selectedDestinationForTrip.id)) {
        return {
          ...trip,
          destinations: [...trip.destinations, selectedDestinationForTrip]
        };
      }
      return trip;
    }));
    setAddToTripOpen(false);
    setSelectedDestinationForTrip(null);
  };

  const handleOpenAddToTrip = (destination: { id: string; name: string; country: string }) => {
    setSelectedDestinationForTrip(destination);
    setAddToTripOpen(true);
  };

  const handleOpenCreateTripFromProfile = () => {
    setSelectedDestinationForTrip(null);
    setCreateTripOpen(true);
  };

  const handleOpenCreateTrip = (destination: { id: string; name: string; country: string }) => {
    setSelectedDestinationForTrip(destination);
    setCreateTripOpen(true);
  };

  const handleToggleSaveDestination = (destinationId: string) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      
      const savedDestinationIds = prev.savedDestinationIds || [];
      const isSaved = savedDestinationIds.includes(destinationId);
      
      return {
        ...prev,
        savedDestinationIds: isSaved
          ? savedDestinationIds.filter(id => id !== destinationId)
          : [...savedDestinationIds, destinationId]
      };
    });
  };

  // Handle saving/unsaving activities
  const handleToggleSaveActivity = (activityId: string) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      
      const savedActivityIds = prev.savedActivityIds || [];
      const isSaved = savedActivityIds.includes(activityId);
      
      return {
        ...prev,
        savedActivityIds: isSaved
          ? savedActivityIds.filter(id => id !== activityId)
          : [...savedActivityIds, activityId]
      };
    });
  };

  // Handle viewing destination from trip details
  const handleViewDestinationFromTrip = (destinationId: string) => {
    const destination = destinationsDatabase[destinationId];
    if (destination) {
      // Convert to the format expected by DestinationDetails
      setSelectedDestinationFromTrip({
        id: destination.id,
        name: destination.name,
        country: destination.country,
        region: destination.region || 'Unknown',
        description: destination.description || '',
        image: destination.image,
        attributes: destination.tags || [],
        priceLevel: destination.averageCost ? Math.min(4, Math.ceil(destination.averageCost / 50)) : 2,
        visitedBy: []
      });
    }
  };

  // Handle viewing activity from trip details
  const handleViewActivityFromTrip = (activityId: string) => {
    const activity = getActivityById(activityId);
    if (activity) {
      // Show activity in dedicated ActivityDetails component
      setSelectedActivityFromTrip(activity);
    }
  };

  // Handle viewing accommodation from trip details
  const handleViewAccommodationFromTrip = (destinationName: string, accommodationName: string) => {
    // For now, we can search for a destination that matches
    const destination = Object.values(destinationsDatabase).find(d => 
      d.name.toLowerCase().includes(destinationName.toLowerCase())
    );
    if (destination) {
      // Convert to the format expected by DestinationDetails
      setSelectedDestinationFromTrip({
        id: destination.id,
        name: destination.name,
        country: destination.country,
        region: destination.region || 'Unknown',
        description: destination.description || '',
        image: destination.image,
        attributes: destination.tags || [],
        priceLevel: destination.averageCost ? Math.min(4, Math.ceil(destination.averageCost / 50)) : 2,
        visitedBy: []
      });
    }
  };

  const filteredDestinations = locationSearch
    ? worldDestinations.filter(dest =>
        dest.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : [];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const togglePriceRating = (rating: number) => {
    setPriceRating(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const selectDestination = (destination: string) => {
    setLocationSearch(destination);
    setShowSuggestions(false);
  };

  const resetSearch = () => {
    setSearchMode(null);
    setLocationSearch('');
    setShowSuggestions(false);
    setSelectedFilters([]);
    setNumberOfPeople('');
    setTripDays('');
    setBudgetType('estimate');
    setMinBudget('');
    setMaxBudget('');
    setBudgetScope('total');
    setPriceRating([]); // Reset price rating to empty
  };

  const handleSearch = () => {
    setSearchQuery(locationSearch);
    setSearchType('location');
    setShowSearchResults(true);
    // Clear experience filters for location search, but keep budget preferences
    setSelectedFilters([]);
    setNumberOfPeople('');
    setTripDays('');
    // Keep budget type, min/max budget, budget scope, and price rating
  };

  const handleExperienceSearch = () => {
    setSearchQuery(''); // Clear location search query for experience search
    setSearchType('experience');
    setShowSearchResults(true);
  };

  const handleTripSearch = () => {
    setSearchQuery(''); // Clear location search query for trip search
    setSearchType('trip');
    setShowSearchResults(true);
  };

  const handlePopularDestinations = () => {
    setSearchQuery(''); // Empty query to indicate popular destinations
    setSearchType('location');
    setShowSearchResults(true);
    // Reset filters for popular destinations
    setSelectedFilters([]);
    setPriceRating([]);
    setNumberOfPeople('');
    setTripDays('');
  };

  const handleBackToHome = () => {
    setShowSearchResults(false);
    setCurrentPage('home');
    resetSearch();
  };

  const handleViewProfile = () => {
    setCurrentPage('profile');
    setViewingFriend(null); // Clear friend profile if viewing one
    setProfileInitialSection('about');
  };

  const handleGoToMyTrips = () => {
    setCurrentPage('profile');
    setViewingFriend(null);
    setProfileInitialSection('trips');
  };

  const handleGoToSettings = () => {
    setCurrentPage('profile');
    setViewingFriend(null);
    setProfileInitialSection('settings');
  };

  const handleGoToHelp = () => {
    setCurrentPage('profile');
    setViewingFriend(null);
    setProfileInitialSection('help');
  };

  const handleBackFromProfile = () => {
    if (showSearchResults) {
      // If we came from search results, go back to search
      setCurrentPage('home');
    } else {
      // Otherwise go to home
      setCurrentPage('home');
    }
  };

  const handleViewFriendProfile = (friendName: string) => {
    setViewingFriend(friendName);
  };

  const handleBackFromFriendProfile = () => {
    setViewingFriend(null);
  };

  const handleGoHome = () => {
    setCurrentPage('home');
    setShowSearchResults(false);
    setViewingFriend(null);
    resetSearch();
  };

  const handleAcceptInvitation = (invitationId: string) => {
    setTripInvitations(prev => 
      prev.map(inv => inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv)
    );
  };

  const handleDeclineInvitation = (invitationId: string) => {
    setTripInvitations(prev => 
      prev.map(inv => inv.id === invitationId ? { ...inv, status: 'declined' as const } : inv)
    );
  };

  const handleMarkAsRead = (invitationId: string) => {
    // In a real app, this would update the read status in the backend
    console.log('Marking notification as read:', invitationId);
  };

  const handleCreateInvitation = (
    tripId: string,
    tripName: string,
    stops: string[],
    invitedUsers: string[],
    startDate?: Date
  ) => {
    if (!user) return;

    // Create invitations for each invited user
    const newInvitations: TripInvitation[] = invitedUsers.map(userName => ({
      id: `${Date.now()}-${userName}`,
      tripId,
      tripName,
      fromUser: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      invitedAt: new Date(),
      status: 'pending' as const,
      tripDetails: {
        stops,
        startDate,
      },
    }));

    setTripInvitations(prev => [...prev, ...newInvitations]);
  };

  const handleMobileTabChange = (tab: 'home' | 'social' | 'trips' | 'saved' | 'profile') => {
    // Close auth view when switching tabs
    setMobileAuthView(null);
    
    // Always close search results when switching tabs
    setShowSearchResults(false);
    
    // Always allow tab change - show login prompts within the tabs themselves
    setMobileTab(tab);
    
    // Handle navigation based on tab
    if (tab === 'home') {
      handleGoHome();
    } else if (tab === 'profile') {
      setProfileInitialSection('about');
      setCurrentPage('home'); // Reset to home page view but stay on profile tab
    } else {
      // For social, discover, saved tabs, reset to home page view
      setCurrentPage('home');
      resetSearch();
    }
  };

  const handleMobileLogin = () => {
    mockLogin();
    setMobileAuthView(null);
  };

  const handleMobileSignUp = () => {
    mockLogin(); // In real app, this would handle signup
    setMobileAuthView(null);
  };

  // If viewing a saved trip details page
  if (viewingSavedTripId) {
    const trip = savedTrips.find(t => t.id === viewingSavedTripId);
    if (!trip) {
      // Trip not found, go back
      setViewingSavedTripId(null);
      return null;
    }

    return (
      <>
        <TripDetailsPage
          trip={trip}
          onBack={() => {
            setViewingSavedTripId(null);
          }}
          onSaveTrip={() => {
            // Handle saving trip
            console.log('Save trip:', trip.id);
          }}
          onShareTrip={() => {
            // Handle sharing trip
            console.log('Share trip:', trip.id);
          }}
          isLoggedIn={isLoggedIn}
          user={user}
          onViewDestination={handleViewDestinationFromTrip}
          onViewActivity={handleViewActivityFromTrip}
          onViewAccommodation={handleViewAccommodationFromTrip}
        />

        {/* Destination Details from Trip */}
        {selectedDestinationFromTrip && (
          <DestinationDetails
            destination={selectedDestinationFromTrip}
            onClose={() => setSelectedDestinationFromTrip(null)}
            following={user?.following || []}
            isLoggedIn={isLoggedIn}
            onLoginRequired={() => setMobileAuthView('login')}
            isSaved={user?.savedDestinationIds?.includes(selectedDestinationFromTrip.id)}
            onToggleSave={handleToggleSaveDestination}
            savedActivityIds={user?.savedActivityIds}
            onToggleSaveActivity={handleToggleSaveActivity}
            onCreateTrip={handleOpenCreateTrip}
            onAddToTrip={handleOpenAddToTrip}
            draftTrips={draftTrips}
          />
        )}

        {/* Activity Details from Trip */}
        {selectedActivityFromTrip && (
          <ActivityDetails
            activity={selectedActivityFromTrip}
            onClose={() => setSelectedActivityFromTrip(null)}
            isLoggedIn={isLoggedIn}
            onLoginRequired={() => setMobileAuthView('login')}
            isSaved={user?.savedActivityIds?.includes(selectedActivityFromTrip.id)}
            onToggleSave={(id) => handleToggleSaveActivity(id)}
          />
        )}
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileBottomNav
            activeTab={mobileTab}
            onTabChange={handleMobileTabChange}
            notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
            user={user}
          />
        </div>
      </>
    );
  }

  // If viewing a friend's profile
  if (viewingFriend) {
    return (
      <>
        {/* Dialogs */}
        <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={mockLogin} />

        {/* Test Login Button */}
        {!isLoggedIn && (
          <Button 
            onClick={mockLogin}
            className="fixed top-24 left-6 z-[60] bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900"
            variant="outline"
          >
            Test Login
          </Button>
        )}

        <AppHeader
          user={user}
          isLoggedIn={isLoggedIn}
          onGoHome={handleGoHome}
          onViewProfile={handleViewProfile}
          onGoToMyTrips={handleGoToMyTrips}
          onGoToNotifications={() => setCurrentPage('notifications')}
          onGoToSettings={handleGoToSettings}
          onGoToHelp={handleGoToHelp}
          onSignOut={handleSignOut}
          onOpenLogin={() => setLoginOpen(true)}
          onOpenSignUp={() => setSignUpOpen(true)}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
        />
        <FriendProfilePage
          friend={{
            id: viewingFriend.toLowerCase().replace(' ', '-'),
            name: viewingFriend,
            email: `${viewingFriend.toLowerCase().replace(' ', '.')}@example.com`,
          }}
          onViewTripDetails={(tripId) => {
            setCurrentPage('trips');
            setViewingTripId(tripId);
          }}
        />
      </>
    );
  }

  // If showing trips page
  if (currentPage === 'trips') {
    // If viewing a specific trip, show trip details from savedTrips
    if (viewingTripId) {
      const trip = savedTrips.find(t => t.id === viewingTripId);
      if (!trip) {
        // Trip not found, go back
        setViewingTripId(null);
        return null;
      }

      return (
        <>
          <TripDetailsPage
            trip={trip}
            onBack={() => setViewingTripId(null)}
            isLoggedIn={isLoggedIn}
            user={user}
            onSaveTrip={() => {
              console.log('Save trip:', trip.id);
            }}
            onShareTrip={() => {
              console.log('Share trip:', trip.id);
            }}
            onViewDestination={handleViewDestinationFromTrip}
            onViewActivity={handleViewActivityFromTrip}
            onViewAccommodation={handleViewAccommodationFromTrip}
          />

          {/* Destination Details from Trip */}
          {selectedDestinationFromTrip && (
            <DestinationDetails
              destination={selectedDestinationFromTrip}
              onClose={() => setSelectedDestinationFromTrip(null)}
              following={user?.following || []}
              isLoggedIn={isLoggedIn}
              onLoginRequired={() => setMobileAuthView('login')}
              isSaved={user?.savedDestinationIds?.includes(selectedDestinationFromTrip.id)}
              onToggleSave={handleToggleSaveDestination}
              savedActivityIds={user?.savedActivityIds}
              onToggleSaveActivity={handleToggleSaveActivity}
              onCreateTrip={handleOpenCreateTrip}
              onAddToTrip={handleOpenAddToTrip}
              draftTrips={draftTrips}
            />
          )}

          {/* Activity Details from Trip */}
          {selectedActivityFromTrip && (
            <ActivityDetails
              activity={selectedActivityFromTrip}
              onClose={() => setSelectedActivityFromTrip(null)}
              isLoggedIn={isLoggedIn}
              onLoginRequired={() => setMobileAuthView('login')}
              isSaved={user?.savedActivityIds?.includes(selectedActivityFromTrip.id)}
              onToggleSave={(id) => handleToggleSaveActivity(id)}
            />
          )}
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden">
            <MobileBottomNav
              activeTab={mobileTab}
              onTabChange={handleMobileTabChange}
              notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
              user={user}
            />
          </div>
        </>
      );
    }

    // Otherwise show trips list page
    return (
      <>
        <TripsPage
          onViewTripDetails={(id) => setViewingTripId(id)}
          user={user || undefined}
          onViewProfile={handleViewProfile}
          onMockLogin={mockLogin}
          onGoHome={handleGoHome}
          onGoToMyTrips={handleGoToMyTrips}
          onGoToNotifications={() => setCurrentPage('notifications')}
          onGoToSettings={handleGoToSettings}
          onGoToHelp={handleGoToHelp}
          onSignOut={handleSignOut}
          onOpenLogin={() => setLoginOpen(true)}
          onOpenSignUp={() => setSignUpOpen(true)}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
        />
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileBottomNav
            activeTab={mobileTab}
            onTabChange={handleMobileTabChange}
            notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
            user={user}
          />
        </div>

        <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={mockLogin} />
      </>
    );
  }

  // If showing notifications page
  if (currentPage === 'notifications') {
    return (
      <>
        {/* Dialogs */}
        <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={mockLogin} />

        {/* Test Login Button */}
        {!isLoggedIn && (
          <Button 
            onClick={mockLogin}
            className="fixed top-24 left-6 z-[60] bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900"
            variant="outline"
          >
            Test Login
          </Button>
        )}

        <AppHeader
          user={user}
          isLoggedIn={isLoggedIn}
          onGoHome={handleGoHome}
          onViewProfile={handleViewProfile}
          onGoToMyTrips={handleGoToMyTrips}
          onGoToNotifications={() => setCurrentPage('notifications')}
          onGoToSettings={handleGoToSettings}
          onGoToHelp={handleGoToHelp}
          onSignOut={handleSignOut}
          onOpenLogin={() => setLoginOpen(true)}
          onOpenSignUp={() => setSignUpOpen(true)}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
        />
        <NotificationsPage 
          invitations={tripInvitations}
          onAcceptInvitation={handleAcceptInvitation}
          onDeclineInvitation={handleDeclineInvitation}
          onMarkAsRead={handleMarkAsRead}
        />
      </>
    );
  }

  // If showing profile page
  if (currentPage === 'profile' && user) {
    return (
      <>
        <div className="hidden md:block">
          <AppHeader
            user={user}
            isLoggedIn={isLoggedIn}
            onGoHome={handleGoHome}
            onViewProfile={handleViewProfile}
            onGoToMyTrips={handleGoToMyTrips}
            onGoToNotifications={() => setCurrentPage('notifications')}
            onGoToSettings={handleGoToSettings}
            onGoToHelp={handleGoToHelp}
            onSignOut={handleSignOut}
            onOpenLogin={() => setLoginOpen(true)}
            onOpenSignUp={() => setSignUpOpen(true)}
            notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
          />
        </div>
        <ProfilePage 
          user={user} 
          onViewFriendProfile={handleViewFriendProfile}
          onCreateInvitation={handleCreateInvitation}
          onViewTripDetails={(tripId) => {
            setCurrentPage('trips');
            setViewingTripId(tripId);
          }}
          initialSection={profileInitialSection}
          draftTrips={draftTrips}
          onCreateNewTrip={handleOpenCreateTripFromProfile}
          onEditTrip={(tripId) => {
            setEditingTripId(tripId);
            setCurrentPage('tripEditor');
          }}
        />
        
        {/* Dialogs for trip creation */}
        <CreateTripDialog 
          open={createTripOpen} 
          onOpenChange={setCreateTripOpen}
          initialDestination={selectedDestinationForTrip || undefined}
          onCreateTrip={handleCreateTrip}
        />
        <AddToExistingTripDialog 
          open={addToTripOpen} 
          onOpenChange={setAddToTripOpen}
          draftTrips={draftTrips}
          destination={selectedDestinationForTrip || { id: '', name: '', country: '' }}
          onAddToTrip={handleAddDestinationToTrip}
          onCreateNewTrip={() => {
            setAddToTripOpen(false);
            setCreateTripOpen(true);
          }}
        />
      </>
    );
  }

  // If showing trip editor page
  if (currentPage === 'tripEditor' && editingTripId) {
    const tripToEdit = draftTrips.find(t => t.id === editingTripId);
    if (!tripToEdit) {
      // Trip not found, go back to trips tab
      setCurrentPage('home');
      setMobileTab('trips');
      setEditingTripId(null);
      return null;
    }

    return (
      <>
        <TripEditorPage
          trip={tripToEdit}
          onBack={() => {
            setCurrentPage('home');
            setMobileTab('trips');
            setEditingTripId(null);
          }}
          onUpdateTrip={(updatedTrip) => {
            setDraftTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
          }}
          onAddDestination={() => {
            // Open search results to add destination
            setShowSearchResults(true);
            setSearchType('location');
          }}
        />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeTab={mobileTab}
          onTabChange={handleMobileTabChange}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
          user={user}
        />
      </>
    );
  }

  // If showing trip builder page
  if (currentPage === 'tripBuilder') {
    return (
      <>
        <TripBuilderPage
          onBack={() => {
            setCurrentPage('home');
            setMobileTab('trips');
          }}
          onSaveTrip={(trip) => {
            setDraftTrips(prev => [...prev, trip]);
            setCurrentPage('home');
            setMobileTab('trips');
          }}
          onSearchFlights={() => {
            // Open search to find flights
            setShowSearchResults(true);
            setSearchType('location');
          }}
          onSearchAccommodation={() => {
            // Open search to find accommodation
            setShowSearchResults(true);
            setSearchType('location');
          }}
          onSearchActivities={() => {
            // Open search to find activities
            setShowSearchResults(true);
            setSearchType('location');
          }}
        />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeTab={mobileTab}
          onTabChange={handleMobileTabChange}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
          user={user}
        />
      </>
    );
  }

  // If showing search results, render that view
  if (showSearchResults && currentPage === 'home') {
    return (
      <>
        <SearchResults 
          searchType={searchType}
          searchQuery={searchQuery}
          experienceFilters={selectedFilters}
          experienceKeywords={tripKeywords}
          numberOfPeople={numberOfPeople}
          tripDays={tripDays}
          tripLengthType={tripLengthType}
          startDate={startDate}
          endDate={endDate}
          budgetType={budgetType}
          minBudget={minBudget}
          maxBudget={maxBudget}
          budgetScope={budgetScope}
          priceRating={priceRating}
          onBack={handleBackToHome}
          onSearchLocation={(location) => {
            setSearchQuery(location);
            setLocationSearch(location);
          }}
          user={user || undefined}
          following={user ? ['Bryce', 'Cayman', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia'] : undefined}
          onLogout={handleSignOut}
          onViewProfile={handleViewProfile}
          onMockLogin={mockLogin}
          onGoToMyTrips={handleGoToMyTrips}
          onGoToNotifications={() => setCurrentPage('notifications')}
          onGoToSettings={handleGoToSettings}
          onGoToHelp={handleGoToHelp}
          onViewTripDetails={(tripId) => {
            setCurrentPage('trips');
            setViewingTripId(tripId);
          }}
          onCreateTrip={handleOpenCreateTrip}
          onAddToTrip={handleOpenAddToTrip}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
          isLoggedIn={isLoggedIn}
          draftTrips={draftTrips}
          savedDestinationIds={user?.savedDestinationIds || []}
          onToggleSaveDestination={handleToggleSaveDestination}
          onToggleSaveActivity={handleToggleSaveActivity}
        />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeTab={mobileTab}
          onTabChange={handleMobileTabChange}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
          user={user}
        />
        
        {/* Sign Up Dialog */}
        <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />

        {/* Login Dialog */}
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={mockLogin} />
        
        {/* Trip Creation Dialogs */}
        <CreateTripDialog 
          open={createTripOpen} 
          onOpenChange={setCreateTripOpen}
          initialDestination={selectedDestinationForTrip || undefined}
          onCreateTrip={handleCreateTrip}
        />
        <AddToExistingTripDialog 
          open={addToTripOpen} 
          onOpenChange={setAddToTripOpen}
          draftTrips={draftTrips}
          destination={selectedDestinationForTrip || { id: '', name: '', country: '' }}
          onAddToTrip={handleAddDestinationToTrip}
          onCreateNewTrip={() => {
            setAddToTripOpen(false);
            setCreateTripOpen(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Desktop Experience - Hidden on mobile */}
      <div className="hidden md:block">
        {/* Background Image */}
        <BackgroundSlideshow />

        {/* App Header - Centered logo on home page */}
        <AppHeader
          user={user}
          isLoggedIn={isLoggedIn}
          onGoHome={handleGoHome}
          onViewProfile={handleViewProfile}
          onGoToMyTrips={handleGoToMyTrips}
          onGoToTrips={() => setCurrentPage('trips')}
          onGoToNotifications={() => setCurrentPage('notifications')}
          onGoToSettings={handleGoToSettings}
          onGoToHelp={handleGoToHelp}
          onSignOut={handleSignOut}
          onOpenLogin={() => setLoginOpen(true)}
          onOpenSignUp={() => setSignUpOpen(true)}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
          transparent={true}
          centerLogo={true}
        />

        {/* Dialogs */}
        <SignUpDialog open={signUpOpen} onOpenChange={setSignUpOpen} />
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={mockLogin} />
        <CreateTripDialog 
          open={createTripOpen} 
          onOpenChange={setCreateTripOpen}
          initialDestination={selectedDestinationForTrip || undefined}
          onCreateTrip={handleCreateTrip}
        />
        <AddToExistingTripDialog 
          open={addToTripOpen} 
          onOpenChange={setAddToTripOpen}
          draftTrips={draftTrips}
          destination={selectedDestinationForTrip || { id: '', name: '', country: '' }}
          onAddToTrip={handleAddDestinationToTrip}
          onCreateNewTrip={() => {
            setAddToTripOpen(false);
            setCreateTripOpen(true);
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
          {/* Test Button - Remove in production */}
          {!isLoggedIn && (
            <Button 
              onClick={mockLogin}
              className="fixed top-24 left-6 z-[60] bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900"
              variant="outline"
            >
              Test Login
            </Button>
          )}

          <div className="text-center mb-12">
            <h1 className="text-white mb-4">Discover Your Next Adventure</h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Find your perfect destination by location or create your dream experience
            </p>
          </div>

          {/* Search Options */}
          <div className="w-full max-w-4xl space-y-6">
            {!searchMode ? (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Search by Location */}
                  <Card 
                    className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-white/85 backdrop-blur"
                    onClick={() => setSearchMode('location')}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl">Search by Location</h2>
                      <p className="text-gray-600">
                        Find destinations by city, state, country, or region
                      </p>
                    </div>
                  </Card>

                  {/* Search by Experience */}
                  <Card 
                    className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-white/85 backdrop-blur"
                    onClick={() => setSearchMode('experience')}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <PlaceSettingIcon className="w-8 h-8 text-amber-600" />
                      </div>
                      <h2 className="text-2xl">Search by Experience</h2>
                      <p className="text-gray-600">
                        Discover places that match your travel preferences
                      </p>
                    </div>
                  </Card>

                  {/* Search other Trips */}
                  <Card 
                    className="p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-white/85 backdrop-blur"
                    onClick={() => setSearchMode('trip')}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl">Search other Trips</h2>
                      <p className="text-gray-600">
                        Find and explore user-created itineraries
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Popular Destinations Button */}
                <div className="text-center">
                  <p className="text-white/90 mb-3">Not sure where to go?</p>
                  <Button 
                    onClick={handlePopularDestinations}
                    variant="outline"
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
                  >
                    Explore Popular Destinations
                  </Button>
                </div>
              </>
            ) : (
              <Card className="p-8 bg-white/85 backdrop-blur">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="flex items-center gap-2">
                    {searchMode === 'location' ? (
                      <>
                        <MapPin className="w-6 h-6 text-blue-600" />
                        Search by Location
                      </>
                    ) : searchMode === 'experience' ? (
                      <>
                        <PlaceSettingIcon className="w-6 h-6 text-amber-600" />
                        Search by Experience
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 text-green-600" />
                        Search other Trips
                      </>
                    )}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={resetSearch}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {searchMode === 'location' ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Where are we going?"
                        className="pl-10 h-14 text-lg"
                        value={locationSearch}
                        onChange={(e) => {
                          setLocationSearch(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        autoFocus
                      />
                      
                      {/* Suggestions dropdown */}
                      {showSuggestions && filteredDestinations.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredDestinations.map((destination) => (
                            <div
                              key={destination}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                              onClick={() => selectDestination(destination)}
                            >
                              {destination}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button className="w-full h-12" size="lg" onClick={handleSearch}>
                      Search Destinations
                    </Button>
                  </div>
                ) : searchMode === 'experience' ? (
                  <div className="space-y-6">
                    {/* Experience Filters */}
                    <div>
                      <Label className="text-base mb-3 block">What experiences are you looking for?</Label>
                      <div className="flex flex-wrap gap-2">
                        {experienceFilters.map((filter) => (
                          <Badge
                            key={filter}
                            variant={selectedFilters.includes(filter) ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 text-sm hover:shadow-md transition-all"
                            onClick={() => toggleFilter(filter)}
                          >
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Number of People */}
                    <div>
                      <Label htmlFor="numberOfPeople" className="text-base mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Number of People
                      </Label>
                      <Input
                        id="numberOfPeople"
                        type="number"
                        min="1"
                        placeholder="How many people are traveling?"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <Separator />

                    {/* Length of Trip */}
                    <div>
                      <Label htmlFor="tripDays" className="text-base mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Length of Trip
                      </Label>
                      <Input
                        id="tripDays"
                        type="number"
                        min="1"
                        placeholder="Number of days"
                        value={tripDays}
                        onChange={(e) => setTripDays(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <Separator />

                    {/* Price Point */}
                    <div>
                      <Label className="text-base mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Budget
                      </Label>
                      
                      {/* Toggle between estimate and actual */}
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          variant={budgetType === 'estimate' ? 'default' : 'outline'}
                          onClick={() => setBudgetType('estimate')}
                          className="flex-1"
                        >
                          Price Range
                        </Button>
                        <Button
                          type="button"
                          variant={budgetType === 'actual' ? 'default' : 'outline'}
                          onClick={() => setBudgetType('actual')}
                          className="flex-1"
                        >
                          Exact Budget
                        </Button>
                      </div>

                      {budgetType === 'actual' ? (
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
                                value={minBudget}
                                onChange={(e) => setMinBudget(e.target.value)}
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
                                value={maxBudget}
                                onChange={(e) => setMaxBudget(e.target.value)}
                                className="h-12 pl-9"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Badge
                              variant={budgetScope === 'person' ? 'default' : 'outline'}
                              className="cursor-pointer px-3 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                              onClick={() => setBudgetScope('person')}
                            >
                              Per person
                            </Badge>
                            <Badge
                              variant={budgetScope === 'total' ? 'default' : 'outline'}
                              className="cursor-pointer px-3 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                              onClick={() => setBudgetScope('total')}
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
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                type="button"
                                variant={priceRating.includes(rating) ? 'default' : 'outline'}
                                onClick={() => togglePriceRating(rating)}
                                className="h-14 px-6 text-xl"
                              >
                                {'$'.repeat(rating)}
                              </Button>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Budget</span>
                            <span>Luxury</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full h-12" 
                      size="lg"
                      disabled={selectedFilters.length === 0}
                      onClick={handleExperienceSearch}
                    >
                      See Destinations
                    </Button>
                  </div>
                ) : searchMode === 'trip' ? (
                  <div className="space-y-6">
                    {/* Trip Keywords Search */}
                    <div>
                      <Label className="text-base mb-3 block">Search for specific trips</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Safari, Mt. Everest, F1 Race..."
                          className="pl-10 h-14 text-lg"
                          value={tripKeywords}
                          onChange={(e) => setTripKeywords(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Number of People */}
                    <div>
                      <Label htmlFor="tripNumberOfPeople" className="text-base mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Number of People
                      </Label>
                      <Input
                        id="tripNumberOfPeople"
                        type="number"
                        min="1"
                        placeholder="How many people are traveling?"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <Separator />

                    {/* Length of Trip */}
                    <div>
                      <Label className="text-base mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Length of Trip
                      </Label>
                      
                      {/* Toggle between duration and dates */}
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          variant={tripLengthType === 'duration' ? 'default' : 'outline'}
                          onClick={() => setTripLengthType('duration')}
                          className="flex-1"
                        >
                          Duration
                        </Button>
                        <Button
                          type="button"
                          variant={tripLengthType === 'dates' ? 'default' : 'outline'}
                          onClick={() => setTripLengthType('dates')}
                          className="flex-1"
                        >
                          Specific Dates
                        </Button>
                      </div>

                      {tripLengthType === 'duration' ? (
                        <Input
                          type="number"
                          min="1"
                          placeholder="Number of days"
                          value={tripDays}
                          onChange={(e) => setTripDays(e.target.value)}
                          className="h-12"
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="startDate" className="text-sm text-gray-600 mb-2 block">
                              Start Date
                            </Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate" className="text-sm text-gray-600 mb-2 block">
                              End Date
                            </Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="h-12"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Price Point */}
                    <div>
                      <Label className="text-base mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Budget
                      </Label>
                      
                      {/* Toggle between estimate and actual */}
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          variant={budgetType === 'estimate' ? 'default' : 'outline'}
                          onClick={() => setBudgetType('estimate')}
                          className="flex-1"
                        >
                          Price Range
                        </Button>
                        <Button
                          type="button"
                          variant={budgetType === 'actual' ? 'default' : 'outline'}
                          onClick={() => setBudgetType('actual')}
                          className="flex-1"
                        >
                          Exact Budget
                        </Button>
                      </div>

                      {budgetType === 'actual' ? (
                        <div className="grid grid-cols-3 gap-3 items-end">
                          <div>
                            <Label htmlFor="tripMinBudget" className="text-sm text-gray-600 mb-2 block">
                              Min
                            </Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id="tripMinBudget"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={minBudget}
                                onChange={(e) => setMinBudget(e.target.value)}
                                className="h-12 pl-9"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="tripMaxBudget" className="text-sm text-gray-600 mb-2 block">
                              Max
                            </Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id="tripMaxBudget"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={maxBudget}
                                onChange={(e) => setMaxBudget(e.target.value)}
                                className="h-12 pl-9"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Badge
                              variant={budgetScope === 'person' ? 'default' : 'outline'}
                              className="cursor-pointer px-3 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                              onClick={() => setBudgetScope('person')}
                            >
                              Per person
                            </Badge>
                            <Badge
                              variant={budgetScope === 'total' ? 'default' : 'outline'}
                              className="cursor-pointer px-3 py-3 text-sm hover:shadow-md transition-all flex-1 justify-center"
                              onClick={() => setBudgetScope('total')}
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
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                type="button"
                                variant={priceRating.includes(rating) ? 'default' : 'outline'}
                                onClick={() => togglePriceRating(rating)}
                                className="h-14 px-6 text-xl"
                              >
                                {'$'.repeat(rating)}
                              </Button>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Budget</span>
                            <span>Luxury</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full h-12" 
                      size="lg"
                      onClick={handleTripSearch}
                    >
                      Search Trips
                    </Button>
                  </div>
                ) : null}
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Experience - Only visible on mobile */}
      <div className="md:hidden">
        {/* Test Login Button - Remove in production */}
        {!user && !mobileAuthView && (
          <Button 
            onClick={mockLogin}
            className="fixed top-4 right-4 z-[60] bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 shadow-lg"
            variant="outline"
            size="sm"
          >
            Test Login
          </Button>
        )}

        {/* Show mobile auth pages if active */}
        {mobileAuthView === 'login' && (
          <MobileLoginPage
            onClose={() => setMobileAuthView(null)}
            onLogin={handleMobileLogin}
            onSwitchToSignUp={() => setMobileAuthView('signup')}
          />
        )}

        {mobileAuthView === 'signup' && (
          <MobileSignUpPage
            onClose={() => setMobileAuthView(null)}
            onSignUp={handleMobileSignUp}
            onSwitchToLogin={() => setMobileAuthView('login')}
          />
        )}

        {/* Mobile Tab Content - Only show if not in auth view */}
        {!mobileAuthView && mobileTab === 'home' && (
          <MobileHomePage
            onLocationSearch={(location, filters) => {
              setLocationSearch(location);
              setSearchQuery(location);
              setSearchType('location');
              setSelectedFilters(filters.selectedFilters);
              setNumberOfPeople(filters.numberOfPeople);
              setTripDays(filters.tripDays);
              setBudgetType(filters.budgetType);
              setMinBudget(filters.minBudget);
              setMaxBudget(filters.maxBudget);
              setBudgetScope(filters.budgetScope);
              setPriceRating(filters.priceRating !== null ? [filters.priceRating] : []);
              setShowSearchResults(true);
            }}
            onExperienceSearch={(filters) => {
              setSelectedFilters(filters.selectedFilters);
              setNumberOfPeople(filters.numberOfPeople);
              setTripDays(filters.tripDays);
              setBudgetType(filters.budgetType);
              setMinBudget(filters.minBudget);
              setMaxBudget(filters.maxBudget);
              setBudgetScope(filters.budgetScope);
              setPriceRating(filters.priceRating !== null ? [filters.priceRating] : []);
              setSearchType('experience');
              setShowSearchResults(true);
            }}
            onTripSearch={(filters) => {
              setTripKeywords(filters.tripKeywords);
              setSelectedFilters(filters.selectedFilters);
              setNumberOfPeople(filters.numberOfPeople);
              setTripDays(filters.tripDays);
              setTripLengthType(filters.tripLengthType);
              setStartDate(filters.startDate);
              setEndDate(filters.endDate);
              setBudgetType(filters.budgetType);
              setMinBudget(filters.minBudget);
              setMaxBudget(filters.maxBudget);
              setBudgetScope(filters.budgetScope);
              setPriceRating(filters.priceRating !== null ? [filters.priceRating] : []);
              setSearchType('trip'); // Set search type to 'trip'
              setShowSearchResults(true);
            }}
          />
        )}
        
        {!mobileAuthView && mobileTab === 'social' && user && (
          <SocialPage
            currentUser={user}
            onViewUserProfile={(userId) => {
              // Handle viewing user profile
              console.log('View user profile:', userId);
            }}
            onViewTrip={(tripId) => {
              setCurrentPage('trips');
              setViewingTripId(tripId);
            }}
          />
        )}

        {!mobileAuthView && mobileTab === 'social' && !user && (
          <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl mb-3">Log in to see travl</h2>
              <p className="text-gray-600 mb-6">Sign in to discover trips from friends and travelers around the world</p>
              <div className="space-y-3">
                <Button onClick={() => setMobileAuthView('login')} className="w-full" size="lg">
                  Log In
                </Button>
                <Button onClick={() => setMobileAuthView('signup')} variant="outline" className="w-full" size="lg">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!mobileAuthView && mobileTab === 'trips' && (
          <MyTripsPage
            user={user}
            draftTrips={draftTrips}
            onCreateNewTrip={() => {
              setCurrentPage('tripBuilder');
            }}
            onEditTrip={(tripId) => {
              setEditingTripId(tripId);
              setCurrentPage('tripEditor');
            }}
          />
        )}
        
        {!mobileAuthView && mobileTab === 'saved' && user && (
          <SavedPage 
            userId={user.id}
            onViewDestination={(destinationId) => {
              // Handle viewing destination from saved page
              const destination = destinationsDatabase[destinationId];
              if (destination) {
                setSelectedDestinationFromTrip({
                  id: destination.id,
                  name: destination.name,
                  country: destination.country,
                  region: destination.region || 'Unknown',
                  description: destination.description || '',
                  image: destination.image,
                  attributes: destination.tags || [],
                  priceLevel: destination.averageCost ? Math.min(4, Math.ceil(destination.averageCost / 50)) : 2,
                  visitedBy: []
                });
              }
            }}
            onViewActivity={(activityId) => {
              // Handle viewing activity from saved page
              const activity = getActivityById(activityId);
              if (activity) {
                setSelectedActivityFromTrip(activity);
              }
            }}
            onViewTrip={(tripId) => {
              setViewingSavedTripId(tripId);
            }}
          />
        )}

        {/* Destination Details from Saved Page */}
        {mobileTab === 'saved' && selectedDestinationFromTrip && (
          <DestinationDetails
            destination={selectedDestinationFromTrip}
            onClose={() => setSelectedDestinationFromTrip(null)}
            following={user?.following || []}
            isLoggedIn={isLoggedIn}
            onLoginRequired={() => setMobileAuthView('login')}
            isSaved={user?.savedDestinationIds?.includes(selectedDestinationFromTrip.id)}
            onToggleSave={handleToggleSaveDestination}
            savedActivityIds={user?.savedActivityIds}
            onToggleSaveActivity={handleToggleSaveActivity}
            onCreateTrip={handleOpenCreateTrip}
            onAddToTrip={handleOpenAddToTrip}
            draftTrips={draftTrips}
          />
        )}

        {/* Activity Details from Saved Page */}
        {mobileTab === 'saved' && selectedActivityFromTrip && (
          <ActivityDetails
            activity={selectedActivityFromTrip}
            onClose={() => setSelectedActivityFromTrip(null)}
            isLoggedIn={isLoggedIn}
            onLoginRequired={() => setMobileAuthView('login')}
            isSaved={user?.savedActivityIds?.includes(selectedActivityFromTrip.id)}
            onToggleSave={(id) => handleToggleSaveActivity(id)}
          />
        )}

        {!mobileAuthView && mobileTab === 'saved' && !user && (
          <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
              <Flag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl mb-3">Log in to view saved items</h2>
              <p className="text-gray-600 mb-6">Sign in to access your saved locations, activities, and trips</p>
              <div className="space-y-3">
                <Button onClick={() => setMobileAuthView('login')} className="w-full" size="lg">
                  Log In
                </Button>
                <Button onClick={() => setMobileAuthView('signup')} variant="outline" className="w-full" size="lg">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!mobileAuthView && mobileTab === 'profile' && user && (
          <div className="pb-20 scrollbar-hide">
            <ProfilePage 
              user={user} 
              onViewFriendProfile={handleViewFriendProfile}
              onCreateInvitation={handleCreateInvitation}
              onViewTripDetails={(tripId) => {
                setCurrentPage('trips');
                setViewingTripId(tripId);
              }}
              initialSection={profileInitialSection}
              draftTrips={draftTrips}
              onCreateNewTrip={handleOpenCreateTripFromProfile}
              onEditTrip={(tripId) => {
                setEditingTripId(tripId);
                setCurrentPage('tripEditor');
              }}
            />
          </div>
        )}

        {!mobileAuthView && mobileTab === 'profile' && !user && (
          <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl mb-3">Log in to view your profile</h2>
              <p className="text-gray-600 mb-6">Create an account or log in to access your trips, saved places, and more</p>
              <div className="space-y-3">
                <Button onClick={() => setMobileAuthView('login')} className="w-full" size="lg">
                  Log In
                </Button>
                <Button onClick={() => setMobileAuthView('signup')} variant="outline" className="w-full" size="lg">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation - Always visible */}
        <MobileBottomNav
          activeTab={mobileTab}
          onTabChange={handleMobileTabChange}
          notificationCount={tripInvitations.filter(inv => inv.status === 'pending').length}
          user={user}
        />
      </div>
    </div>
  );
}