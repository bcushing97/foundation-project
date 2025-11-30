# Data Architecture - Single Source of Truth

This directory contains all the centralized data for the travel application. Each file serves as the **single source of truth** for its respective data type.

## Core Principle
**Never duplicate data.** Always import from these files and reference by ID when needed.

## Data Files

### 1. `activities.ts`
**Purpose:** Complete database of all activities across all destinations worldwide.

**Usage:**
- Contains ALL activities that appear anywhere in the app
- Each activity has a unique `id` field
- Activities are referenced by their ID in trips, search results, etc.
- Import using: `import { activitiesDatabase, getActivityById } from '../data/activities'`

**When to add an activity:**
- Any time you create a new activity for any feature
- Activities shown in trip itineraries
- Activities shown in search results
- Activities shown in destination details

**Fields:**
- `id`: Unique identifier (e.g., 'serengeti-game-drive')
- `name`: Activity name
- `description`: Full description
- `category`: Type of activity
- `duration`: How long it takes
- `priceLevel`: 1-4 ($-$$$$)
- `estimatedCost`: Price in USD
- `location`: Where it takes place
- And many more...

---

### 2. `savedTrips.ts`
**Purpose:** Complete database of all user-created and public trips.

**Usage:**
- Contains ALL trips that appear anywhere in the app
- Trips from all users (user-created, friend trips, public trips)
- Each trip has a unique `id` field
- Import using: `import { savedTrips, type SavedTrip } from '../data/savedTrips'`

**When to add a trip:**
- User creates a new trip
- Showcasing example trips in the UI
- Friend trips that appear in profiles
- Public trips in search results

**Key Relationships:**
- `destinations`: Array of destination objects
  - Each destination has `activityIds` that reference activities in `activities.ts`
  - Each destination has `accommodations` array with accommodation details

**Fields:**
- `id`: Unique identifier
- `title`: Trip name
- `creator`: User who created the trip
- `destinations`: Array of destination objects with activityIds
- `duration`: Total trip length
- `budget`: Total cost
- And many more...

---

### 3. `destinations.ts`
**Purpose:** Master list of all searchable locations worldwide.

**Usage:**
- Provides autocomplete options for destination searches
- Contains countries, cities, regions, landmarks
- Import using: `import { worldDestinations } from '../data/destinations'`

**When to use:**
- Destination search autocomplete
- Location pickers
- Geographic filtering

---

## Data Integrity Rules

### ✅ DO:
1. **Add new activities to activities.ts** - This is the ONLY place activities should be defined
2. **Add new trips to savedTrips.ts** - This is the ONLY place trips should be defined
3. **Reference activities by ID** - Use activityIds in trips to link to activities
4. **Import and reuse** - Import data from these files, never copy/paste

### ❌ DON'T:
1. **Create duplicate activity definitions** - If an activity exists, reference it by ID
2. **Create inline activity objects** - Always add to activities.ts first
3. **Copy trip data** - Always reference trips from savedTrips.ts
4. **Hardcode activity or trip details** - Use the centralized data

## Example: Adding a New Trip

```typescript
// ❌ WRONG - Creating inline activity
const myTrip = {
  id: 'trip-123',
  destinations: [{
    name: 'Paris',
    activities: [{
      name: 'Eiffel Tower Visit',
      duration: '2 hours',
      // ... more fields
    }]
  }]
}

// ✅ CORRECT - Reference activity by ID
// 1. First, add activity to activities.ts:
export const activitiesDatabase: Record<string, Activity> = {
  'eiffel-tower-visit': {
    id: 'eiffel-tower-visit',
    name: 'Eiffel Tower Visit',
    duration: '2 hours',
    // ... complete activity definition
  },
  // ... other activities
}

// 2. Then, reference it in savedTrips.ts:
export const savedTrips: SavedTrip[] = [
  {
    id: 'trip-123',
    title: 'Paris Adventure',
    destinations: [{
      name: 'Paris',
      days: 3,
      activityIds: ['eiffel-tower-visit'] // Reference by ID!
    }]
  }
]
```

## Example: Displaying Activities in a Component

```typescript
import { getActivityById } from '../data/activities';
import type { SavedTrip } from '../data/savedTrips';

function TripView({ trip }: { trip: SavedTrip }) {
  return (
    <div>
      {trip.destinations.map(dest => (
        <div key={dest.name}>
          <h3>{dest.name}</h3>
          {dest.activityIds?.map(activityId => {
            const activity = getActivityById(activityId);
            if (!activity) return null;
            
            return (
              <div key={activity.id}>
                <h4>{activity.name}</h4>
                <p>{activity.description}</p>
                <p>Duration: {activity.duration}</p>
                <p>Price: ${activity.estimatedCost}</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

## Benefits of This Architecture

1. **Consistency** - Activities always have the same data everywhere
2. **Maintainability** - Update an activity once, it updates everywhere
3. **Reusability** - Activities can be shared across multiple trips
4. **Scalability** - Easy to add new activities and trips
5. **Data Integrity** - No conflicting or duplicate information
6. **Type Safety** - TypeScript ensures proper data structure

## Future Enhancements

When adding new features, follow these patterns:
- **Accommodations Database**: If accommodations need to be reused, create `accommodations.ts`
- **User Profiles**: Create `users.ts` for user data
- **Reviews/Ratings**: Create `reviews.ts` linked to activities/trips by ID
