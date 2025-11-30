import { User, UserCircle, Settings, HelpCircle, LogOut, Bell, Compass, Map } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface AppHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  } | null;
  isLoggedIn: boolean;
  onGoHome: () => void;
  onViewProfile: () => void;
  onGoToNotifications?: () => void;
  onGoToSettings?: () => void;
  onGoToHelp?: () => void;
  onSignOut: () => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  transparent?: boolean;
  centerLogo?: boolean;
  notificationCount?: number;
  onGoToTrips?: () => void;
  onGoToMyTrips?: () => void;
}

export function AppHeader({
  user,
  isLoggedIn,
  onGoHome,
  onViewProfile,
  onGoToNotifications,
  onGoToSettings,
  onGoToHelp,
  onSignOut,
  onOpenLogin,
  onOpenSignUp,
  transparent = false,
  centerLogo = false,
  notificationCount = 0,
  onGoToTrips,
  onGoToMyTrips
}: AppHeaderProps) {
  const getInitials = (user: { firstName: string; lastName: string }) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={`${transparent ? 'absolute' : 'sticky'} top-0 left-0 right-0 z-50 ${transparent ? '' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {centerLogo ? (
          // Centered layout for home page
          <div className="flex items-center justify-center relative">
            {/* App Title / Logo - Centered */}
            <button
              onClick={onGoHome}
              className={`text-4xl tracking-wide hover:opacity-70 transition-opacity ${
                transparent ? 'text-white' : 'text-gray-900'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}
            >
              travl
            </button>

            {/* Right side buttons - Absolute positioned to right */}
            <div className="absolute right-0 flex items-center gap-3">
              {/* Discover Trips Button - Always visible, no login required */}
              <Button
                variant="ghost"
                onClick={onGoToTrips}
                className={`flex items-center gap-2 backdrop-blur-sm px-4 h-12 ${
                  transparent ? 'bg-white/80 hover:bg-white text-gray-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span>Discover Trips</span>
              </Button>

              {/* Profile Icon - Hidden on mobile */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`hidden md:flex w-12 h-12 rounded-full shadow-md p-0 overflow-hidden backdrop-blur-sm ${
                      transparent ? 'bg-white/80 hover:bg-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {isLoggedIn && user ? (
                      user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 text-sm">
                          {getInitials(user)}
                        </div>
                      )
                    ) : (
                      <User className="w-6 h-6 text-gray-700" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  {isLoggedIn && user ? (
                    <div className="space-y-4">
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-sm">
                              {getInitials(user)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={onViewProfile}
                        >
                          <UserCircle className="w-4 h-4" />
                          View Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={onGoToMyTrips}
                        >
                          <Map className="w-4 h-4" />
                          My Trips
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={onGoToNotifications}
                        >
                          <Bell className="w-4 h-4" />
                          Notifications
                          {notificationCount > 0 && (
                            <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                              {notificationCount}
                            </span>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={onGoToSettings}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={onGoToHelp}
                        >
                          <HelpCircle className="w-4 h-4" />
                          Help
                        </Button>
                        <Separator className="my-2" />
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={onSignOut}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Welcome! Please sign in to continue</p>
                      <div className="space-y-2">
                        <Button className="w-full" onClick={onOpenLogin}>
                          Log In
                        </Button>
                        <Button variant="outline" className="w-full" onClick={onOpenSignUp}>
                          Sign Up
                        </Button>
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          // Left-aligned layout for other pages
          <div className="flex items-center justify-between">
            {/* App Title / Logo */}
            <button
              onClick={onGoHome}
              className={`text-3xl tracking-wide hover:opacity-70 transition-opacity ${
                transparent ? 'text-white' : 'text-gray-900'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}
            >
              travl
            </button>

            {/* Profile Icon - Hidden on mobile */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hidden md:flex w-12 h-12 rounded-full shadow-md p-0 overflow-hidden backdrop-blur-sm ${
                    transparent ? 'bg-white/80 hover:bg-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {isLoggedIn && user ? (
                    user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 text-sm">
                        {getInitials(user)}
                      </div>
                    )
                  ) : (
                    <User className="w-6 h-6 text-gray-700" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                {isLoggedIn && user ? (
                  <div className="space-y-4">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700 text-sm">
                            {getInitials(user)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={onViewProfile}
                      >
                        <UserCircle className="w-4 h-4" />
                        View Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={onGoToMyTrips}
                      >
                        <Map className="w-4 h-4" />
                        My Trips
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={onGoToNotifications}
                      >
                        <Bell className="w-4 h-4" />
                        Notifications
                        {notificationCount > 0 && (
                          <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            {notificationCount}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={onGoToSettings}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={onGoToHelp}
                      >
                        <HelpCircle className="w-4 h-4" />
                        Help
                      </Button>
                      <Separator className="my-2" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={onSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Welcome! Please sign in to continue</p>
                    <div className="space-y-2">
                      <Button className="w-full" onClick={onOpenLogin}>
                        Log In
                      </Button>
                      <Button variant="outline" className="w-full" onClick={onOpenSignUp}>
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}