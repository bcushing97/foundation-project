import { Home, Compass, Bookmark, User, Users, Map } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface MobileBottomNavProps {
  activeTab: 'home' | 'social' | 'trips' | 'saved' | 'profile';
  onTabChange: (tab: 'home' | 'social' | 'trips' | 'saved' | 'profile') => void;
  notificationCount?: number;
  user?: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
  } | null;
}

export function MobileBottomNav({ activeTab, onTabChange, notificationCount = 0, user }: MobileBottomNavProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'social' as const, label: 'Social', icon: Users },
    { id: 'trips' as const, label: 'Trips', icon: Map },
    { id: 'saved' as const, label: 'Saved', icon: Bookmark },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg transition-colors relative ${
                isActive 
                  ? 'text-slate-900' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.id === 'profile' && user ? (
                <Avatar className="w-6 h-6 mb-1">
                  <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="bg-gray-500 text-white">
                    {user.firstName[0]}
                  </AvatarFallback>
                </Avatar>
              ) : tab.id === 'trips' ? (
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-slate-900 fill-white' : ''}`} />
              ) : (
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-slate-900' : ''}`} />
              )}
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {tab.label}
              </span>
              
              {/* Notification badge for profile */}
              {tab.id === 'profile' && notificationCount > 0 && (
                <div className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}