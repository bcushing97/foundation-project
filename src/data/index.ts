/**
 * Data Layer - Centralized Export
 * 
 * This file provides a single entry point for all data imports.
 * It enforces the Single Source of Truth principle across the application.
 */

// ===== USERS =====
// Single source of truth for ALL users in the application
export { 
  usersDatabase,
  getUserById,
  getUsersByIds,
  getUserByEmail,
  getUsersByLocation,
  getUsersByInterest,
  getTopTravelersBy,
  getAllUsers,
  getCurrentUser,
  type User
} from './users';

// ===== ACTIVITIES =====
// Single source of truth for ALL activities in the application
export { 
  activitiesDatabase,
  getActivityById,
  getActivitiesByIds,
  getActivitiesByCategory,
  getActivitiesByLocation,
  type Activity
} from './activities';

// ===== ACCOMMODATIONS =====
// Single source of truth for ALL accommodations in the application
export { 
  accommodationsDatabase,
  getAccommodationById,
  getAccommodationsByIds,
  getAccommodationsByDestination,
  getAccommodationsByType,
  getAccommodationsByPriceRange,
  getTopRatedAccommodations,
  getAllAccommodations,
  type Accommodation
} from './accommodations';

// ===== TRIPS =====
// Single source of truth for ALL trips in the application
export { 
  savedTrips,
  type SavedTrip,
  type TripDestination,
  type TripAccommodation
} from './savedTrips';

// ===== DESTINATIONS =====
// Master list of searchable destinations worldwide
export { 
  destinationsDatabase,
  getDestinationById,
  getDestinationsByIds,
  getDestinationsByCountry,
  getDestinationsByTag,
  getPopularDestinations,
  getAllDestinations,
  type Destination
} from './destinations';

/**
 * USAGE GUIDELINES:
 * 
 * 1. Users:
 *    - Import users from this file
 *    - Never create inline user objects
 *    - Always add new users to users.ts
 *    - Reference users by ID in trips, activities, etc.
 * 
 *    Example:
 *    ```typescript
 *    import { getUserById } from '../data';
 *    const user = getUserById('user-sarah');
 *    ```
 * 
 * 2. Activities:
 *    - Import activities from this file
 *    - Never create inline activity objects
 *    - Always add new activities to activities.ts
 *    - Reference activities by ID in trips
 * 
 *    Example:
 *    ```typescript
 *    import { getActivityById } from '../data';
 *    const activity = getActivityById('serengeti-game-drive');
 *    ```
 * 
 * 3. Accommodations:
 *    - Import accommodations from this file
 *    - Never create inline accommodation objects
 *    - Always add new accommodations to accommodations.ts
 *    - Reference accommodations by ID in trips
 * 
 *    Example:
 *    ```typescript
 *    import { getAccommodationById } from '../data';
 *    const accommodation = getAccommodationById('hotel-1');
 *    ```
 * 
 * 4. Trips:
 *    - Import trips from this file
 *    - Never duplicate trip data
 *    - Always add new trips to savedTrips.ts
 *    - Use creatorId to reference users
 *    - Use activityIds to reference activities
 *    - Use accommodationIds to reference accommodations
 * 
 *    Example:
 *    ```typescript
 *    import { savedTrips, getUserById } from '../data';
 *    const trip = savedTrips.find(t => t.id === 'trip-1');
 *    const creator = getUserById(trip.creatorId);
 *    ```
 * 
 * 5. Destinations:
 *    - Use for autocomplete and search
 *    - Import worldDestinations for location lists
 * 
 *    Example:
 *    ```typescript
 *    import { worldDestinations } from '../data';
 *    ```
 */