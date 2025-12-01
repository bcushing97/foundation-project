import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Heart, Settings, UserPlus, Star, MessageCircle, Pencil } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import { CountriesBadge } from './CountriesBadge';
import { AddTripDialog } from './AddTripDialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';

interface ProfilePageProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  onViewFriendProfile?: (friendName: string) => void;
  onCreateInvitation?: (tripId: string, tripName: string, stops: string[], invitedUsers: string[], startDate?: Date) => void;
  onViewTripDetails?: (tripId: string) => void;
  initialSection?: ProfileSection;
  draftTrips?: DraftTrip[];
  onCreateNewTrip?: () => void;
  onEditTrip?: (tripId: string) => void;
}

type ProfileSection = 'about' | 'friends' | 'settings' | 'help' | 'trips';

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
}

interface SavedTrip {
  id: string;
  name: string;
  stops: TripStop[];
  createdAt: Date;
}

interface DraftTrip {
  id: string;
  name: string;
  destinations: { id: string; name: string; country: string }[];
  createdAt: Date;
}

export function ProfilePage({ user, onViewFriendProfile, onCreateInvitation, onViewTripDetails, initialSection = 'about', draftTrips = [], onCreateNewTrip, onEditTrip }: ProfilePageProps) {
  const [activeSection, setActiveSection] = useState<ProfileSection>(initialSection);
  const [addTripOpen, setAddTripOpen] = useState(false);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  // Update active section when initialSection prop changes
  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const handleSaveTrip = (tripName: string, stops: TripStop[], invitedUsers?: string[]) => {
    const newTrip: SavedTrip = {
      id: Date.now().toString(),
      name: tripName || 'Untitled Trip',
      stops: stops,
      createdAt: new Date(),
    };
    setSavedTrips([...savedTrips, newTrip]);

    // Create invitations if users were invited
    if (invitedUsers && invitedUsers.length > 0 && onCreateInvitation) {
      const stopLocations = stops.map(stop => stop.location).filter(Boolean);
      const firstArrivalDate = stops[0]?.arrivalDate;
      
      onCreateInvitation(
        newTrip.id,
        newTrip.name,
        stopLocations,
        invitedUsers,
        firstArrivalDate
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto scrollbar-hide">
      {/* Add Trip Dialog */}
      <AddTripDialog 
        open={addTripOpen} 
        onOpenChange={setAddTripOpen}
        onSave={handleSaveTrip}
        currentUser={user}
        following={['Bryce', 'Cayman', 'Sarah', 'Michael', 'Emma']}
      />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <UserPlus className="h-16 w-16 text-white" />
                </div>
              )}
            </div>

            {/* User Name */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
            
            {/* Countries Badge */}
            <div className="ml-auto">
              <CountriesBadge trips={savedTrips} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide border-b">
            <button
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeSection === 'about'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveSection('about')}
            >
              About
            </button>
            <button
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeSection === 'friends'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveSection('friends')}
            >
              Friends & Followers
            </button>
            <button
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeSection === 'settings'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveSection('settings')}
            >
              Settings
            </button>
            <button
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeSection === 'help'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveSection('help')}
            >
              Help
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scrollbar-hide">
        {activeSection === 'about' && <AboutMeSection user={user} />}
        {activeSection === 'friends' && <FriendsSection onViewFriendProfile={onViewFriendProfile} />}
        {activeSection === 'settings' && <SettingsSection />}
        {activeSection === 'help' && <HelpSection />}
      </div>
    </div>
  );
}

function AboutMeSection({ user }: { user: ProfilePageProps['user'] }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>First Name</Label>
            <Input value={user.firstName} disabled className="mt-2" />
          </div>
          
          <div>
            <Label>Last Name</Label>
            <Input value={user.lastName} disabled className="mt-2" />
          </div>
          
          <div className="md:col-span-2">
            <Label>Email Address</Label>
            <Input value={user.email} disabled className="mt-2" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Additional Details</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Languages</Label>
            <Input 
              placeholder="e.g., English, Spanish, French" 
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">Enter languages you speak, separated by commas</p>
          </div>
          
          <div>
            <Label>Passport Country</Label>
            <Input 
              placeholder="e.g., United States" 
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Security</h2>
        
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label>Password</Label>
            <Input 
              type="password"
              value="**********" 
              disabled 
              className="mt-2"
            />
          </div>
          <Button variant="outline">
            Change Password
          </Button>
        </div>
      </Card>
    </div>
  );
}

function FriendsSection({ onViewFriendProfile }: { onViewFriendProfile?: (friendName: string) => void }) {
  // People you are following
  const [followingList, setFollowingList] = useState<Array<{ name: string; email: string; unfollowed?: boolean }>>([
    { name: 'Bryce', email: 'bryce@example.com' },
    { name: 'Cayman', email: 'cayman@example.com' },
    { name: 'Sarah', email: 'sarah@example.com' },
    { name: 'Michael', email: 'michael@example.com' },
    { name: 'Emma', email: 'emma@example.com' }
  ]);
  
  // People who follow you (some you follow back, some you don't)
  const [followersList, setFollowersList] = useState([
    { name: 'Bryce', email: 'bryce@example.com', isFollowing: true },
    { name: 'Cayman', email: 'cayman@example.com', isFollowing: true },
    { name: 'Sarah', email: 'sarah@example.com', isFollowing: true },
    { name: 'James', email: 'james@example.com', isFollowing: false },
    { name: 'Olivia', email: 'olivia@example.com', isFollowing: false },
    { name: 'Michael', email: 'michael@example.com', isFollowing: true },
    { name: 'Alex', email: 'alex@example.com', isFollowing: false },
    { name: 'Emma', email: 'emma@example.com', isFollowing: true }
  ]);

  const [unfollowDialogOpen, setUnfollowDialogOpen] = useState(false);
  const [personToUnfollow, setPersonToUnfollow] = useState<{ name: string; email: string } | null>(null);

  const handleFollowBack = (followerName: string, followerEmail: string) => {
    // Add to following list
    if (!followingList.find(f => f.name === followerName)) {
      setFollowingList([...followingList, { name: followerName, email: followerEmail }]);
    }
    
    // Update followers list
    setFollowersList(followersList.map(f => 
      f.name === followerName ? { ...f, isFollowing: true } : f
    ));
  };

  const handleUnfollowClick = (person: { name: string; email: string }) => {
    setPersonToUnfollow(person);
    setUnfollowDialogOpen(true);
  };

  const handleConfirmUnfollow = () => {
    if (personToUnfollow) {
      // Don't remove from following list immediately - will persist until page refresh
      // Just update the UI to show "Follow" button instead of "Following"
      
      // Update followers list - mark as not following
      setFollowersList(followersList.map(f => 
        f.name === personToUnfollow.name ? { ...f, isFollowing: false } : f
      ));
      
      // Mark in following list as unfollowed (but don't remove)
      setFollowingList(followingList.map(f => 
        f.name === personToUnfollow.name ? { ...f, unfollowed: true } : f
      ));
    }
    setUnfollowDialogOpen(false);
    setPersonToUnfollow(null);
  };

  const handleFollow = (followerName: string, followerEmail: string) => {
    // Add back to following list
    if (!followingList.find(f => f.name === followerName)) {
      setFollowingList([...followingList, { name: followerName, email: followerEmail }]);
    }
    
    // Update followers list
    setFollowersList(followersList.map(f => 
      f.name === followerName ? { ...f, isFollowing: true } : f
    ));
  };

  const handleRefollow = (personName: string) => {
    // Remove unfollowed flag
    setFollowingList(followingList.map(f => 
      f.name === personName ? { ...f, unfollowed: false } : f
    ));
    
    // Update followers list if this person is also a follower
    setFollowersList(followersList.map(f => 
      f.name === personName ? { ...f, isFollowing: true } : f
    ));
  };
  
  return (
    <div className="space-y-8">
      {/* Unfollow Confirmation Dialog */}
      <Dialog open={unfollowDialogOpen} onOpenChange={setUnfollowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfollow {personToUnfollow?.name}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to unfollow {personToUnfollow?.name}? They will be removed from your following list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnfollowDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmUnfollow}>
              Unfollow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Following Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Following</h2>
            <p className="text-sm text-gray-500 mt-1">
              People you follow
            </p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {followingList.length}
          </Badge>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {followingList.map((person) => (
            <div 
              key={person.name} 
              className="flex items-center justify-between gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-all"
            >
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => onViewFriendProfile?.(person.name)}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-lg">{person.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{person.name}</p>
                  <p className="text-xs text-gray-500 truncate">{person.email}</p>
                </div>
              </div>
              {person.unfollowed ? (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefollow(person.name);
                  }}
                  className="flex-shrink-0"
                >
                  Follow
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnfollowClick(person);
                  }}
                  className="flex-shrink-0"
                >
                  Following
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Followers Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Followers</h2>
            <p className="text-sm text-gray-500 mt-1">
              People who follow you
            </p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {followersList.length}
          </Badge>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {followersList.map((follower) => (
            <div 
              key={follower.name} 
              className="flex items-center justify-between gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-all"
            >
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => onViewFriendProfile?.(follower.name)}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-lg">{follower.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{follower.name}</p>
                  <p className="text-xs text-gray-500 truncate">{follower.email}</p>
                </div>
              </div>
              {follower.isFollowing ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnfollowClick({ name: follower.name, email: follower.email });
                  }}
                  className="flex-shrink-0"
                >
                  Following
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleFollow(follower.name, follower.email)}
                  className="flex-shrink-0"
                >
                  Follow Back
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SettingsSection() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Email notifications for new trips</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Friend activity updates</span>
            </label>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </div>
      </div>
    </Card>
  );
}

function HelpSection() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Help & Support</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Contact Support</h3>
          <p className="text-sm text-gray-500">If you have any questions or need assistance, please contact our support team.</p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-2">FAQs</h3>
          <p className="text-sm text-gray-500">Find answers to common questions in our frequently asked questions section.</p>
          <Button variant="outline" size="sm">
            View FAQs
          </Button>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-2">User Guide</h3>
          <p className="text-sm text-gray-500">Learn how to use our platform with our comprehensive user guide.</p>
          <Button variant="outline" size="sm">
            Download User Guide
          </Button>
        </div>
      </div>
    </Card>
  );
}