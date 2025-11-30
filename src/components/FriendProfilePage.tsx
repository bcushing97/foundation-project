import { useState } from 'react';
import { User, MapPin, Calendar, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import { CountriesBadge } from './CountriesBadge';
import { Button } from './ui/button';

interface FriendProfilePageProps {
  friend: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    languages?: string[];
    passportCountry?: string;
  };
  onViewTripDetails?: (tripId: string) => void;
}

type ProfileSection = 'about' | 'trips' | 'friends';

// Mock data for friend profiles
const friendProfileData: Record<string, {
  bio: string;
  languages: string[];
  passportCountry: string;
  trips: Array<{
    id: string;
    name: string;
    stops: Array<{
      id: string;
      location: string;
      arrivalDate: Date;
      departureDate: Date;
      activities: Array<{
        id: string;
        name: string;
        rating: number;
      }>;
    }>;
  }>;
  friends: string[];
}> = {
  'Bryce': {
    bio: 'Adventure seeker and nature lover',
    languages: ['English', 'Spanish'],
    passportCountry: 'United States',
    trips: [
      {
        id: '1',
        name: 'Costa Rica Adventure',
        stops: [
          {
            id: '1',
            location: 'Manuel Antonio, Costa Rica',
            arrivalDate: new Date('2024-01-15'),
            departureDate: new Date('2024-01-20'),
            activities: [
              { id: '1', name: 'Zip-lining', rating: 5 },
              { id: '2', name: 'Beach relaxation', rating: 4 },
              { id: '3', name: 'Wildlife spotting', rating: 5 }
            ]
          }
        ]
      }
    ],
    friends: ['Cayman', 'Sarah', 'Michael', 'John']
  },
  'Cayman': {
    bio: 'Beach enthusiast and surf lover',
    languages: ['English'],
    passportCountry: 'Canada',
    trips: [
      {
        id: '1',
        name: 'Mexican Coast',
        stops: [
          {
            id: '1',
            location: 'Tulum, Mexico',
            arrivalDate: new Date('2023-12-10'),
            departureDate: new Date('2023-12-18'),
            activities: [
              { id: '1', name: 'Cenote swimming', rating: 5 },
              { id: '2', name: 'Mayan ruins tour', rating: 4 },
              { id: '3', name: 'Beach yoga', rating: 5 }
            ]
          }
        ]
      }
    ],
    friends: ['Bryce', 'Emma', 'James', 'John']
  },
  'Sarah': {
    bio: 'Culture explorer and foodie',
    languages: ['English', 'French', 'Italian'],
    passportCountry: 'United Kingdom',
    trips: [
      {
        id: '1',
        name: 'European Summer',
        stops: [
          {
            id: '1',
            location: 'Paris, France',
            arrivalDate: new Date('2024-06-01'),
            departureDate: new Date('2024-06-07'),
            activities: [
              { id: '1', name: 'Museum tours', rating: 5 },
              { id: '2', name: 'Food tasting', rating: 5 },
              { id: '3', name: 'Seine river cruise', rating: 4 }
            ]
          },
          {
            id: '2',
            location: 'Rome, Italy',
            arrivalDate: new Date('2024-06-08'),
            departureDate: new Date('2024-06-14'),
            activities: [
              { id: '1', name: 'Colosseum visit', rating: 5 },
              { id: '2', name: 'Pasta making class', rating: 5 },
              { id: '3', name: 'Vatican tour', rating: 4 }
            ]
          }
        ]
      }
    ],
    friends: ['Bryce', 'Michael', 'Olivia', 'John']
  },
  'Michael': {
    bio: 'Mountain climber and outdoor enthusiast',
    languages: ['English', 'German'],
    passportCountry: 'United States',
    trips: [],
    friends: ['Bryce', 'Sarah', 'Emma', 'John']
  },
  'Emma': {
    bio: 'Luxury travel and wellness advocate',
    languages: ['English', 'Spanish', 'Portuguese'],
    passportCountry: 'Australia',
    trips: [],
    friends: ['Cayman', 'James', 'Michael', 'John']
  },
  'James': {
    bio: 'Photography enthusiast and explorer',
    languages: ['English'],
    passportCountry: 'United States',
    trips: [],
    friends: ['Cayman', 'Emma', 'Olivia', 'John']
  },
  'Olivia': {
    bio: 'Budget traveler and backpacker',
    languages: ['English', 'Mandarin'],
    passportCountry: 'New Zealand',
    trips: [],
    friends: ['Sarah', 'James', 'John']
  }
};

export function FriendProfilePage({ friend, onViewTripDetails }: FriendProfilePageProps) {
  const [activeSection, setActiveSection] = useState<ProfileSection>('about');
  
  const profileData = friendProfileData[friend.name] || {
    bio: 'Travel enthusiast',
    languages: ['English'],
    passportCountry: 'Unknown',
    trips: [],
    friends: []
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {friend.profilePicture ? (
                <img
                  src={friend.profilePicture}
                  alt={friend.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-4xl">{friend.name[0]}</span>
                </div>
              )}
            </div>

            {/* User Name */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {friend.name}
              </h1>
              <p className="text-gray-500 mt-1">{friend.email}</p>
              {profileData.bio && (
                <p className="text-gray-600 mt-2 italic">\"{profileData.bio}\"</p>
              )}
            </div>
            
            {/* Countries Badge */}
            <div className="ml-auto">
              <CountriesBadge trips={profileData.trips} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveSection('about')}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeSection === 'about'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveSection('trips')}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeSection === 'trips'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Trips
            </button>
            <button
              onClick={() => setActiveSection('friends')}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeSection === 'friends'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Friends
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'about' && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">About {friend.name}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Languages</h3>
                <p className="text-gray-900">{profileData.languages.join(', ')}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Passport Country</h3>
                <p className="text-gray-900">{profileData.passportCountry}</p>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'trips' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Past Trips</h2>

            {profileData.trips.length > 0 ? (
              <div className="space-y-6">
                {profileData.trips.map((trip) => (
                  <Card key={trip.id} className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{trip.name}</h3>
                    
                    <div className="space-y-4">
                      {trip.stops.map((stop, index) => (
                        <div key={stop.id}>
                          {index > 0 && <Separator className="my-4" />}
                          
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-5 w-5 text-blue-600" />
                                  <h3 className="text-xl font-semibold">{stop.location}</h3>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm">
                                    {format(stop.arrivalDate, 'MMM d, yyyy')} - {format(stop.departureDate, 'MMM d, yyyy')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Activities */}
                            {stop.activities.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-3">Activities</h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  {stop.activities.map((activity) => (
                                    <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                                      <p className="font-medium text-sm">{activity.name}</p>
                                      <div className="flex gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`h-3 w-3 ${
                                              star <= activity.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* View Details Button */}
                    {onViewTripDetails && (
                      <div className="mt-6 pt-6 border-t">
                        <Button 
                          onClick={() => onViewTripDetails(trip.id)}
                          className="w-full"
                        >
                          View Full Trip Details
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-500">{friend.name} hasn't recorded any trips yet.</p>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'friends' && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Friends ({profileData.friends.length})</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileData.friends.map((friendName) => (
                <div key={friendName} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-medium">{friendName[0]}</span>
                  </div>
                  <span className="font-medium">{friendName}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}